<script setup lang="ts">
/**
 * ArRate 1.0 — 星の評価（面談の評価など）。星は黄（テーマ色ではなく決まった色）、空きは線の色。
 * キーボード：←→（↑↓）で 1（allowHalf なら 0.5）ずつ、Home で 0、End で最大。
 */
import { computed, ref } from "vue";
import type { ArRateProps } from "./ArRate.contract";

const props = withDefaults(defineProps<ArRateProps>(), { count: 5, allowHalf: false, allowClear: true, readonly: false, disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: number] }>();
const hover = ref<number | null>(null);
const shown = computed(() => hover.value ?? props.modelValue);
const unit = computed(() => (props.allowHalf ? 0.5 : 1));
const locked = computed(() => props.readonly || props.disabled);
const STAR = "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z";

function at(i: number, e: MouseEvent): number {
  if (!props.allowHalf) return i + 1;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return e.clientX - r.left < r.width / 2 ? i + 0.5 : i + 1;
}
function set(v: number) {
  if (locked.value) return;
  emit("update:modelValue", props.allowClear && v === props.modelValue ? 0 : v);
}
function fill(i: number) {
  const v = shown.value - i;
  return v >= 1 ? "on" : v >= 0.5 ? "half" : undefined;
}
function onKey(e: KeyboardEvent) {
  if (locked.value) return;
  const k = e.key;
  let v = props.modelValue;
  if (k === "ArrowRight" || k === "ArrowUp") v += unit.value;
  else if (k === "ArrowLeft" || k === "ArrowDown") v -= unit.value;
  else if (k === "Home") v = 0;
  else if (k === "End") v = props.count;
  else return;
  e.preventDefault();
  emit("update:modelValue", Math.min(props.count, Math.max(0, v)));
}
</script>

<template>
  <span
    data-ar="rate"
    data-part="root"
    role="slider"
    :tabindex="locked ? undefined : 0"
    :aria-label="label"
    :aria-valuemin="0"
    :aria-valuemax="count"
    :aria-valuenow="modelValue"
    :aria-valuetext="`${modelValue} / ${count}`"
    :aria-readonly="readonly || undefined"
    :aria-disabled="disabled || undefined"
    :data-state="[readonly && 'readonly', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
    @keydown="onKey"
    @mouseleave="hover = null"
  >
    <span
      v-for="(_, i) in count"
      :key="i"
      data-part="star"
      :data-state="fill(i)"
      @mousemove="!locked && (hover = at(i, $event))"
      @click="set(at(i, $event))"
    >
      <svg data-part="bg" viewBox="0 0 24 24" aria-hidden="true"><path :d="STAR" /></svg>
      <svg data-part="fg" viewBox="0 0 24 24" aria-hidden="true"><path :d="STAR" /></svg>
    </span>
  </span>
</template>
