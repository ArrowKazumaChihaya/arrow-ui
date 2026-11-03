<script setup lang="ts">
/**
 * ArOrgChart 1.0 — 組織図（部署・店舗の階層の図）。会社情報の「部署/店舗階層構造」。
 * 札を押すと select。子のある札の下の丸い印で開け閉め。地をドラッグで動かし、ホイールで拡大縮小、右下で −・＋・「全体を表示」。
 * キーボード：札は Tab で移って Enter。図にフォーカスして ←→↑↓ で動かし、+ − で大きさ、0 で全体を表示。
 */
import { computed, nextTick, onMounted, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArOrgChartBranch from "../internal/ArOrgChartBranch.vue";
import type { ArOrgChartLabels, ArOrgChartProps, ArOrgNode } from "./ArOrgChart.contract";

const props = withDefaults(defineProps<ArOrgChartProps>(), {
  expanded: undefined,
  zoom: undefined,
  minZoom: 0.3,
  maxZoom: 2,
  zoomStep: 0.1,
  selected: null,
  height: "560px",
  hint: true,
  label: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{ select: [node: ArOrgNode]; "update:expanded": [keys: string[]]; "update:zoom": [zoom: number] }>();

const L = computed<ArOrgChartLabels>(() => ({
  count: "{n}人",
  hint: "ドラッグで動かす・ホイールで拡大縮小",
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
}
const pan = ref({ x: 0, y: 0 });
const viewport = ref<HTMLElement | null>(null);
const canvas = ref<HTMLElement | null>(null);
/** 全体を表示：図が入る大きさ（100% を超えない）にして真ん中に戻す。 */
function fit() {
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
onMounted(() => {
  if (props.zoom === undefined) void nextTick(fit);
});

let drag: { x: number; y: number; id: number } | null = null;
const dragging = ref(false);
function onDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest("button") || e.button !== 0) return;
  drag = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y, id: e.pointerId };
  dragging.value = true;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onMove(e: PointerEvent) {
  if (!drag || drag.id !== e.pointerId) return;
  pan.value = { x: e.clientX - drag.x, y: e.clientY - drag.y };
}
function onUp() {
  drag = null;
  dragging.value = false;
}
function onWheel(e: WheelEvent) {
  e.preventDefault();
  setZoom(z.value + (e.deltaY < 0 ? props.zoomStep : -props.zoomStep));
}
function onKey(e: KeyboardEvent) {
  if (e.target !== viewport.value) return;
  const step = 40;
  const m: Record<string, () => void> = {
    ArrowLeft: () => (pan.value = { ...pan.value, x: pan.value.x + step }),
    ArrowRight: () => (pan.value = { ...pan.value, x: pan.value.x - step }),
    ArrowUp: () => (pan.value = { ...pan.value, y: pan.value.y + step }),
    ArrowDown: () => (pan.value = { ...pan.value, y: pan.value.y - step }),
    "+": () => setZoom(z.value + props.zoomStep),
    "=": () => setZoom(z.value + props.zoomStep),
    "-": () => setZoom(z.value - props.zoomStep),
    "0": fit,
  };
  const f = m[e.key];
  if (!f) return;
  e.preventDefault();
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
      <button type="button" data-part="zoom-out" :aria-label="L.zoomOut" :title="L.zoomOut" :disabled="z <= minZoom" @click="setZoom(z - zoomStep)"><ArIcon line name="minus" /></button>
      <span data-part="zoom-value" aria-live="polite">{{ Math.round(z * 100) }}%</span>
      <button type="button" data-part="zoom-in" :aria-label="L.zoomIn" :title="L.zoomIn" :disabled="z >= maxZoom" @click="setZoom(z + zoomStep)"><ArIcon line name="plus" /></button>
      <button type="button" data-part="fit" @click="fit"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>{{ L.fit }}</button>
    </div>
  </div>
</template>
