<script setup lang="ts">
/**
 * ArStepper 1.1 — − ＋ で挟む数の入力（人数など1ずつ変える小さな数）。
 * joined は枠の中に − 数 ＋（.stp）、split は小さな四角いボタンで数を挟む。最小・最大で端のボタンは押せない。
 * 真ん中は spinbutton（↑↓で増減、Home・End で最小・最大）。押し続けると繰り返す。
 */
import { computed, ref, useAttrs, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import { clampNumber, createRepeater, decimalsOf, parseNumber } from "../internal/number";
import type { ArStepperProps } from "./ArStepper.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArStepperProps>(), {
  min: 0,
  max: undefined,
  step: 1,
  unit: undefined,
  variant: "joined",
  size: "md",
  editable: true,
  disabled: false,
  invalid: false,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{ "update:modelValue": [value: number]; change: [value: number] }>();

const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return rest;
});
const invalid = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);
const draft = ref(String(props.modelValue));
watch(
  () => props.modelValue,
  (v) => (draft.value = String(v)),
);
const atMin = computed(() => props.modelValue <= props.min);
const atMax = computed(() => props.max !== undefined && props.modelValue >= props.max);
const digits = computed(() => decimalsOf(props.step));

function set(v: number) {
  const next = clampNumber(v, props.min, props.max, digits.value);
  draft.value = String(next);
  if (next !== props.modelValue) {
    emit("update:modelValue", next);
    emit("change", next);
  }
}
const bump = (dir: 1 | -1) => !props.disabled && set(props.modelValue + props.step * dir);
function commit() {
  const n = parseNumber(draft.value);
  if (n === null) draft.value = String(props.modelValue);
  else set(n);
}
function onKey(e: KeyboardEvent) {
  if (props.disabled) return;
  const map: Record<string, () => void> = {
    ArrowUp: () => bump(1),
    ArrowDown: () => bump(-1),
    Home: () => set(props.min),
    End: () => props.max !== undefined && set(props.max),
    Enter: commit,
  };
  const fn = map[e.key];
  if (fn) {
    e.preventDefault();
    fn();
  }
}
const repeat = createRepeater();
function press(dir: 1 | -1, e: PointerEvent) {
  if (props.disabled || e.button !== 0) return;
  e.preventDefault();
  repeat.start(() => bump(dir));
}
function onClickKey(dir: 1 | -1, e: MouseEvent) {
  // キーボード（Enter・Space）で押したとき（pointer では pointerdown で済んでいる）
  if (e.detail === 0) bump(dir);
}
</script>

<template>
  <span
    v-bind="rootAttrs"
    data-ar="stepper"
    data-part="root"
    :data-variant="variant"
    :data-size="size"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <button
      type="button"
      data-part="decrement"
      :aria-label="`${step}減らす`"
      :disabled="disabled || atMin"
      @pointerdown="press(-1, $event)"
      @pointerup="repeat.stop"
      @pointerleave="repeat.stop"
      @pointercancel="repeat.stop"
      @click="onClickKey(-1, $event)"
    >
      <ArIcon line name="minus" size="sm" />
    </button>
    <input
      :id="id"
      v-bind="inputAttrs"
      v-model="draft"
      data-part="value"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      role="spinbutton"
      :readonly="!editable"
      :disabled="disabled"
      :aria-label="id ? undefined : label"
      :aria-valuenow="modelValue"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuetext="unit ? `${modelValue}${unit}` : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :size="Math.max(1, draft.length)"
      @blur="commit"
      @keydown="onKey"
    />
    <small v-if="unit && variant === 'joined'" data-part="unit" aria-hidden="true">{{ unit }}</small>
    <button
      type="button"
      data-part="increment"
      :aria-label="`${step}増やす`"
      :disabled="disabled || atMax"
      @pointerdown="press(1, $event)"
      @pointerup="repeat.stop"
      @pointerleave="repeat.stop"
      @pointercancel="repeat.stop"
      @click="onClickKey(1, $event)"
    >
      <ArIcon line name="plus" size="sm" />
    </button>
    <small v-if="unit && variant === 'split'" data-part="unit" aria-hidden="true">{{ unit }}</small>
  </span>
</template>
