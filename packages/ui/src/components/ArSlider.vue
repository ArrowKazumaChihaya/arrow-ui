<script setup lang="ts">
/**
 * ArSlider 1.0 — 数の範囲の中から選ぶ（チャートの表示時間・ドラッグの間隔など）。つまみは白にテーマ色の輪。
 * range なら2つのつまみ。キーボード：←→↑↓で step、PageUp/PageDown で10倍、Home/End で端。
 */
import { computed, ref } from "vue";
import type { ArSliderProps } from "./ArSlider.contract";

const props = withDefaults(defineProps<ArSliderProps>(), {
  range: false,
  min: 0,
  max: 100,
  step: 1,
  marks: () => [],
  tooltip: "auto",
  format: (v: number) => String(v),
  disabled: false,
});
const emit = defineEmits<{ "update:modelValue": [value: number | [number, number]]; change: [value: number | [number, number]] }>();

const rail = ref<HTMLElement | null>(null);
const dragging = ref<number | null>(null);
const values = computed<number[]>(() => (Array.isArray(props.modelValue) ? [...props.modelValue] : [props.modelValue as number]));
const pct = (v: number) => ((v - props.min) / (props.max - props.min || 1)) * 100;
const trackStyle = computed(() => {
  const [a, b] = props.range ? [values.value[0]!, values.value[1]!] : [props.min, values.value[0]!];
  return { left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%` };
});
const lo = computed(() => (props.range ? values.value[0]! : props.min));
const hi = computed(() => values.value[values.value.length - 1]!);

function snap(v: number): number {
  const c = Math.min(props.max, Math.max(props.min, v));
  if (props.step === null) {
    if (!props.marks.length) return c;
    return props.marks.reduce((best, m) => (Math.abs(m.value - c) < Math.abs(best - c) ? m.value : best), props.marks[0]!.value);
  }
  const n = Math.round((c - props.min) / props.step) * props.step + props.min;
  return Number(n.toFixed(6));
}
function out(vals: number[]): number | [number, number] {
  return props.range ? [vals[0]!, vals[1]!] : vals[0]!;
}
function setAt(i: number, v: number, final = false) {
  const vals = [...values.value];
  vals[i] = snap(v);
  if (props.range && vals[0]! > vals[1]!) {
    if (i === 0) vals[0] = vals[1]!;
    else vals[1] = vals[0]!;
  }
  if (vals.some((x, k) => x !== values.value[k])) emit("update:modelValue", out(vals));
  if (final) emit("change", out(vals));
}
function fromPointer(e: PointerEvent): number {
  const r = rail.value!.getBoundingClientRect();
  const t = Math.min(1, Math.max(0, (e.clientX - r.left) / (r.width || 1)));
  return props.min + t * (props.max - props.min);
}
function onDown(e: PointerEvent) {
  if (props.disabled || e.button !== 0) return;
  e.preventDefault();
  const v = fromPointer(e);
  const i = props.range ? (Math.abs(v - values.value[0]!) <= Math.abs(v - values.value[1]!) ? 0 : 1) : 0;
  dragging.value = i;
  setAt(i, v);
  (rail.value?.querySelectorAll<HTMLElement>('[data-part="handle"]')[i])?.focus();
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onMove(e: PointerEvent) {
  if (dragging.value !== null) setAt(dragging.value, fromPointer(e));
}
function onUp(e: PointerEvent) {
  if (dragging.value === null) return;
  setAt(dragging.value, fromPointer(e), true);
  dragging.value = null;
}
function onKey(i: number, e: KeyboardEvent) {
  if (props.disabled) return;
  const s = props.step ?? 0;
  const v = values.value[i]!;
  const markStep = (dir: number) => {
    const list = props.marks.map((m) => m.value).sort((a, b) => a - b);
    return (dir > 0 ? list.find((m) => m > v) : [...list].reverse().find((m) => m < v)) ?? v;
  };
  const by = (dir: number, mult = 1) => (props.step === null ? markStep(dir) : v + dir * s * mult);
  const map: Record<string, () => number> = {
    ArrowRight: () => by(1),
    ArrowUp: () => by(1),
    ArrowLeft: () => by(-1),
    ArrowDown: () => by(-1),
    PageUp: () => by(1, 10),
    PageDown: () => by(-1, 10),
    Home: () => (props.range && i === 1 ? values.value[0]! : props.min),
    End: () => (props.range && i === 0 ? values.value[1]! : props.max),
  };
  if (!map[e.key]) return;
  e.preventDefault();
  setAt(i, map[e.key]!(), true);
}
</script>

<template>
  <div
    data-ar="slider"
    data-part="root"
    :data-range="range || undefined"
    :data-tooltip="tooltip"
    :data-marks="marks.some((m) => m.label) || undefined"
    :data-state="[disabled && 'disabled', dragging !== null && 'dragging'].filter(Boolean).join(' ') || undefined"
  >
    <div ref="rail" data-part="rail" @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
      <span data-part="line" />
      <span data-part="track" :style="trackStyle" />
      <template v-for="m in marks" :key="m.value">
        <span data-part="dot" :data-state="m.value >= lo && m.value <= hi ? 'on' : undefined" :style="{ left: `${pct(m.value)}%` }" />
        <span v-if="m.label" data-part="mark" :style="{ left: `${pct(m.value)}%` }">{{ m.label }}</span>
      </template>
      <span
        v-for="(v, i) in values"
        :key="i"
        data-part="handle"
        role="slider"
        :tabindex="disabled ? undefined : 0"
        :style="{ left: `${pct(v)}%` }"
        :data-state="dragging === i ? 'dragging' : undefined"
        :aria-label="range ? `${label}の${i === 0 ? '始まり' : '終わり'}` : label"
        :aria-valuemin="range && i === 1 ? values[0] : min"
        :aria-valuemax="range && i === 0 ? values[1] : max"
        :aria-valuenow="v"
        :aria-valuetext="format(v)"
        :aria-disabled="disabled || undefined"
        @keydown="onKey(i, $event)"
      >
        <span v-if="tooltip !== 'never'" data-part="tooltip" aria-hidden="true">{{ format(v) }}</span>
      </span>
    </div>
  </div>
</template>
