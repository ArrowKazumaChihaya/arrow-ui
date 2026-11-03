<script setup lang="ts">
/**
 * ArSplitter 1.0 — 分割パネル。つまみをドラッグして大きさを変え、ダブルクリックで元に戻す。
 * つまみは separator として読み上げ、←→（上下なら ↑↓）で動かし、Home / End で最小・最大、Enter で元に戻す。
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { ArSplitterProps } from "./ArSplitter.contract";

const props = withDefaults(defineProps<ArSplitterProps>(), {
  size: undefined,
  defaultSize: "50%",
  min: 0,
  max: undefined,
  endMin: 0,
  orientation: "horizontal",
  label: "大きさを変える",
  bordered: false,
  step: 10,
});
const emit = defineEmits<{ "update:size": [size: number]; resizeEnd: [size: number] }>();
const root = ref<HTMLElement | null>(null);
const inner = ref<number | null>(null);
const total = ref(0);
const dragging = ref(false);
const horizontal = computed(() => props.orientation === "horizontal");

function measure() {
  const r = root.value?.getBoundingClientRect();
  if (r) total.value = horizontal.value ? r.width : r.height;
}
function resolveDefault(): number {
  const d = props.defaultSize;
  if (typeof d === "number") return d;
  const m = /^([\d.]+)%$/.exec(d);
  return m ? (total.value * Number(m[1])) / 100 : Number.parseFloat(d) || total.value / 2;
}
const maxSize = computed(() => Math.max(props.min, props.max ?? (total.value ? total.value - props.endMin : Infinity)));
const clamp = (v: number) => Math.round(Math.min(maxSize.value, Math.max(props.min, v)));
const current = computed(() => props.size ?? inner.value ?? null);
function set(v: number) {
  const c = clamp(v);
  inner.value = c;
  emit("update:size", c);
}
const startStyle = computed(() => {
  const c = current.value;
  if (c === null) return { flex: `0 0 ${typeof props.defaultSize === "number" ? `${props.defaultSize}px` : props.defaultSize}` };
  return { flex: `0 0 ${c}px` };
});

let startPos = 0;
let startSize = 0;
function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return;
  measure();
  dragging.value = true;
  startPos = horizontal.value ? e.clientX : e.clientY;
  const pane = root.value?.querySelector<HTMLElement>('[data-part="pane"]');
  startSize = pane ? (horizontal.value ? pane.getBoundingClientRect().width : pane.getBoundingClientRect().height) : 0;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  e.preventDefault();
}
function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  set(startSize + (horizontal.value ? e.clientX : e.clientY) - startPos);
}
function onPointerUp() {
  if (!dragging.value) return;
  dragging.value = false;
  if (current.value !== null) emit("resizeEnd", current.value);
}
function reset() {
  measure();
  set(resolveDefault());
  emit("resizeEnd", clamp(resolveDefault()));
}
function onKeydown(e: KeyboardEvent) {
  measure();
  const now = current.value ?? resolveDefault();
  const d = props.step * (e.shiftKey ? 5 : 1);
  const back = horizontal.value ? "ArrowLeft" : "ArrowUp";
  const fwd = horizontal.value ? "ArrowRight" : "ArrowDown";
  if (e.key === back) set(now - d);
  else if (e.key === fwd) set(now + d);
  else if (e.key === "Home") set(props.min);
  else if (e.key === "End") set(maxSize.value);
  else if (e.key === "Enter") reset();
  else return;
  e.preventDefault();
}
let ro: ResizeObserver | null = null;
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && root.value) {
    ro = new ResizeObserver(measure);
    ro.observe(root.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <div
    ref="root"
    data-ar="splitter"
    data-part="root"
    :data-orientation="orientation"
    :data-bordered="bordered || undefined"
    :data-state="dragging ? 'dragging' : undefined"
  >
    <div data-part="pane" data-pane="start" :style="startStyle"><slot name="start" /></div>
    <div
      data-part="bar"
      role="separator"
      tabindex="0"
      :aria-label="label"
      :aria-orientation="horizontal ? 'vertical' : 'horizontal'"
      :aria-valuenow="current ?? undefined"
      :aria-valuemin="min"
      :aria-valuemax="Number.isFinite(maxSize) ? maxSize : undefined"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @dblclick="reset"
      @keydown="onKeydown"
    />
    <div data-part="pane" data-pane="end"><slot name="end" /></div>
  </div>
</template>
