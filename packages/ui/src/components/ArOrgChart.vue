<script setup lang="ts">
/**
 * ArOrgChart 1.1 — 組織図（部署・店舗の階層の図）。会社情報の「部署/店舗階層構造」。
 * 札を押すと select。子のある札の下の丸い印で開け閉め。地をドラッグで動かし、ホイールで拡大縮小、右下で −・＋・「全体を表示」。
 * キーボード：札は Tab で移って Enter。図にフォーカスして ←→↑↓ で動かし、+ − で大きさ、0 で全体を表示。
 */
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArZoomControl from "./ArZoomControl.vue";
import ArOrgChartBranch from "../internal/ArOrgChartBranch.vue";
import type { ArOrgChartLabels, ArOrgChartProps, ArOrgNode } from "./ArOrgChart.contract";

const props = withDefaults(defineProps<ArOrgChartProps>(), {
  expanded: undefined,
  zoom: undefined,
  minZoom: 0.3,
  maxZoom: 2,
  zoomStep: 0.1,
  wheelMode: "zoom",
  selected: null,
  height: "560px",
  hint: true,
  label: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{ select: [node: ArOrgNode]; "update:expanded": [keys: string[]]; "update:zoom": [zoom: number] }>();

const L = computed<ArOrgChartLabels>(() => ({
  count: "{n}人",
  hint: props.wheelMode === "pan" ? "ドラッグ・スクロールで移動、Ctrl / ⌘ + ホイールで拡大縮小" : "ドラッグで動かす・ホイールで拡大縮小",
  zoomIn: "拡大",
  zoomOut: "縮小",
  zoomGroup: "拡大・縮小",
  fit: "全体を表示",
  open: "{label}の下を開く",
  close: "{label}の下を閉じる",
  node: "{label}（{code}）を開く",
  ...props.labels,
}));

/* 開け閉め */
const allKeys = (ns: readonly ArOrgNode[]): string[] => ns.flatMap((n) => (n.children?.length ? [n.key, ...allKeys(n.children)] : []));
const innerOpen = ref<string[]>(allKeys(props.nodes));
watch(() => allKeys(props.nodes), (keys, previous) => {
  const known = new Set(previous);
  const current = new Set(innerOpen.value);
  innerOpen.value = keys.filter((key) => current.has(key) || !known.has(key));
});
const openKeys = computed(() => new Set(props.expanded ?? innerOpen.value));
const isOpen = (k: string) => openKeys.value.has(k);
function toggle(n: ArOrgNode) {
  const s = new Set(openKeys.value);
  if (s.has(n.key)) s.delete(n.key);
  else s.add(n.key);
  innerOpen.value = [...s];
  emit("update:expanded", innerOpen.value);
}
const countText = (n: ArOrgNode) => n.countLabel ?? L.value.count.replace("{n}", String(n.count ?? 0));
const toggleLabel = (n: ArOrgNode, open: boolean) => (open ? L.value.close : L.value.open).replace("{label}", n.label);
const nodeLabel = (n: ArOrgNode) => (n.code ? L.value.node.replace("{code}", n.code) : L.value.node.replace("（{code}）", "")).replace("{label}", n.label);

/* 大きさと位置 */
const innerZoom = ref(1);
const z = computed(() => props.zoom ?? innerZoom.value);
const round = (v: number) => Math.round(v * 100) / 100;
function setZoom(v: number) {
  const nv = round(Math.min(props.maxZoom, Math.max(props.minZoom, v)));
  innerZoom.value = nv;
  emit("update:zoom", nv);
  return nv;
}
const pan = ref({ x: 0, y: 0 });
const viewport = ref<HTMLElement | null>(null);
const canvas = ref<HTMLElement | null>(null);
let autoFit = true;
/** Keep the diagram point under the pointer stationary when zooming. */
function zoomAt(value: number, clientX?: number, clientY?: number) {
  autoFit = false;
  const rect = viewport.value?.getBoundingClientRect();
  const before = z.value;
  const after = setZoom(value);
  if (!rect || before <= 0) return;
  const x = (clientX ?? rect.left + rect.width / 2) - rect.left - rect.width / 2;
  const y = (clientY ?? rect.top + rect.height / 2) - rect.top - (canvas.value?.offsetTop ?? 40);
  const ratio = after / before;
  pan.value = { x: x - (x - pan.value.x) * ratio, y: y - (y - pan.value.y) * ratio };
}
/** 全体を表示：図が入る大きさ（100% を超えない）にして真ん中に戻す。 */
function fit() {
  autoFit = true;
  pan.value = { x: 0, y: 0 };
  const vp = viewport.value;
  const cv = canvas.value;
  if (!vp || !cv) return setZoom(1);
  const w = cv.offsetWidth;
  const h = cv.offsetHeight;
  if (!w || !h) return setZoom(1);
  const k = Math.min(1, (vp.clientWidth - 48) / w, (vp.clientHeight - 100) / h);
  setZoom(Math.floor(k * 20) / 20);
}
let observer: ResizeObserver | undefined;
onMounted(() => {
  if (props.zoom !== undefined) autoFit = false;
  if (autoFit) void nextTick(fit);
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(() => { if (autoFit) fit(); });
    if (viewport.value) observer.observe(viewport.value);
    if (canvas.value) observer.observe(canvas.value);
  }
});
onBeforeUnmount(() => observer?.disconnect());
watch(() => props.nodes, () => { if (autoFit) void nextTick(fit); });

type Point = { x: number; y: number };
const pointers = new Map<number, Point>();
let origin: Point | undefined;
let moved = false;
const dragging = ref(false);
function capture(id: number) {
  viewport.value?.setPointerCapture?.(id);
}
function onDown(e: PointerEvent) {
  if (e.button !== 0 || pointers.size >= 2) return;
  if (pointers.size === 0) {
    moved = false;
    origin = { x: e.clientX, y: e.clientY };
  }
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    moved = true;
    dragging.value = true;
    for (const id of pointers.keys()) capture(id);
  }
}
function midpoint(a: Point, b: Point): Point { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
function distance(a: Point, b: Point): number { return Math.hypot(a.x - b.x, a.y - b.y); }
function onMove(e: PointerEvent) {
  const previous = pointers.get(e.pointerId);
  if (!previous) return;
  const before = [...pointers.values()];
  const point = { x: e.clientX, y: e.clientY };
  pointers.set(e.pointerId, point);
  const after = [...pointers.values()];
  if (before[0] && before[1] && after[0] && after[1]) {
    const oldCenter = midpoint(before[0], before[1]);
    const newCenter = midpoint(after[0], after[1]);
    const oldDistance = distance(before[0], before[1]);
    if (oldDistance > 0) zoomAt(z.value * distance(after[0], after[1]) / oldDistance, oldCenter.x, oldCenter.y);
    pan.value = { x: pan.value.x + newCenter.x - oldCenter.x, y: pan.value.y + newCenter.y - oldCenter.y };
  } else {
    const start = moved ? previous : (origin ?? previous);
    const dx = point.x - start.x;
    const dy = point.y - start.y;
    if (!moved && Math.hypot(dx, dy) <= 3) return;
    pan.value = { x: pan.value.x + dx, y: pan.value.y + dy };
  }
  autoFit = false;
  moved = true;
  dragging.value = true;
  capture(e.pointerId);
}
function onUp(e: PointerEvent) {
  pointers.delete(e.pointerId);
  if (pointers.size === 0) dragging.value = false;
}
function onClick(e: MouseEvent) {
  // Pointer drags must not open a branch; keyboard activation remains available.
  if (moved && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); }
}
function onWheel(e: WheelEvent) {
  e.preventDefault();
  autoFit = false;
  if (props.wheelMode === "pan" && !e.ctrlKey && !e.metaKey) {
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? (viewport.value?.clientHeight ?? 100) : 1;
    pan.value = { x: pan.value.x - e.deltaX * unit, y: pan.value.y - e.deltaY * unit };
  } else if (e.deltaY !== 0) {
    zoomAt(z.value + (e.deltaY < 0 ? props.zoomStep : -props.zoomStep), e.clientX, e.clientY);
  }
}
function onKey(e: KeyboardEvent) {
  if (e.target !== viewport.value) return;
  const step = 40;
  const m: Record<string, () => void> = {
    ArrowLeft: () => (pan.value = { ...pan.value, x: pan.value.x + step }),
    ArrowRight: () => (pan.value = { ...pan.value, x: pan.value.x - step }),
    ArrowUp: () => (pan.value = { ...pan.value, y: pan.value.y + step }),
    ArrowDown: () => (pan.value = { ...pan.value, y: pan.value.y - step }),
    "+": () => zoomAt(z.value + props.zoomStep),
    "=": () => zoomAt(z.value + props.zoomStep),
    "-": () => zoomAt(z.value - props.zoomStep),
    "0": fit,
  };
  const f = m[e.key];
  if (!f) return;
  e.preventDefault();
  autoFit = false;
  f();
}
const canvasStyle = computed(() => ({
  transform: `translate(calc(-50% + ${pan.value.x}px), ${pan.value.y}px) scale(${z.value})`,
}));
defineExpose({ fit });
</script>

<template>
  <div data-ar="org-chart" data-part="root" :style="{ height }">
    <div
      ref="viewport"
      data-part="viewport"
      tabindex="0"
      role="tree"
      :aria-label="label"
      :data-state="dragging ? 'dragging' : undefined"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @lostpointercapture="onUp"
      @click.capture="onClick"
      @wheel="onWheel"
      @keydown="onKey"
    >
      <div ref="canvas" data-part="canvas" :style="canvasStyle">
        <ArOrgChartBranch
          v-for="n in nodes"
          :key="n.key"
          :node="n"
          :level="0"
          :is-open="isOpen"
          :selected="selected"
          :count-text="countText"
          :toggle-label="toggleLabel"
          :node-label="nodeLabel"
          @select="(x) => emit('select', x)"
          @toggle="toggle"
        />
      </div>
    </div>
    <div v-if="hint" data-part="hint" aria-hidden="true"><ArIcon line name="hand" />{{ L.hint }}</div>
    <div data-part="controls" role="group" :aria-label="L.zoomGroup">
      <ArZoomControl
        data-part="zoom"
        variant="plain"
        :value="`${Math.round(z * 100)}%`"
        :out-disabled="z <= minZoom"
        :in-disabled="z >= maxZoom"
        :label="L.zoomGroup"
        :out-label="L.zoomOut"
        :in-label="L.zoomIn"
        @out="zoomAt(z - zoomStep)"
        @in="zoomAt(z + zoomStep)"
      />
      <button type="button" data-part="fit" @click="fit"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>{{ L.fit }}</button>
    </div>
  </div>
</template>
