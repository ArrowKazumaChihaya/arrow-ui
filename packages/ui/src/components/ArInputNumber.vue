<script setup lang="ts">
/**
 * ArInputNumber 1.0 — 数の入力（金額・時給など）。右に▲▼、数字は等幅。
 * 最小・最大・刻み。↑↓で増減（Shift で10倍）、PageUp・PageDown で10倍、Home・End で最小・最大。
 * 打っている間はそのまま、確定（Enter・フォーカスが外れた）で範囲に収めてカンマ付きで見せる。
 * 人数など1ずつ変える小さな数は ArStepper（− ＋）を使う。
 */
import { computed, ref, useAttrs, watch } from "vue";
import { clampNumber, createRepeater, decimalsOf, formatNumber, parseNumber } from "../internal/number";
import type { ArInputNumberProps } from "./ArInputNumber.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArInputNumberProps>(), {
  min: undefined,
  max: undefined,
  step: 1,
  precision: undefined,
  grouping: true,
  prefix: undefined,
  suffix: undefined,
  controls: true,
  placeholder: undefined,
  size: "md",
  invalid: false,
  disabled: false,
  readonly: false,
  block: false,
  label: undefined,
  id: undefined,
  name: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  /** 確定したとき（Enter・フォーカスが外れた・▲▼）。 */
  change: [value: number | null];
}>();

const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return rest;
});
const invalid = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);
const input = ref<HTMLInputElement | null>(null);
const focused = ref(false);
const draft = ref("");
const digits = computed(() => props.precision ?? decimalsOf(props.step));
const shown = computed(() => (focused.value ? draft.value : formatNumber(props.modelValue, props.grouping, props.precision)));
watch(
  () => props.modelValue,
  (v) => {
    if (!focused.value || parseNumber(draft.value) !== v) draft.value = v === null ? "" : String(v);
  },
  { immediate: true },
);
const atMin = computed(() => props.min !== undefined && props.modelValue !== null && props.modelValue <= props.min);
const atMax = computed(() => props.max !== undefined && props.modelValue !== null && props.modelValue >= props.max);
const locked = computed(() => props.disabled || props.readonly);

function set(v: number | null, commit: boolean) {
  const next = v === null ? null : clampNumber(v, props.min, props.max, digits.value);
  draft.value = next === null ? "" : String(next);
  if (next !== props.modelValue) emit("update:modelValue", next);
  if (commit) emit("change", next);
}
function bump(times: number) {
  if (locked.value) return;
  const base = props.modelValue ?? (props.min !== undefined && props.min > 0 ? props.min - props.step * Math.sign(times) : 0);
  set(base + props.step * times, true);
}
function onInput(e: Event) {
  draft.value = (e.target as HTMLInputElement).value;
  const n = parseNumber(draft.value);
  if (draft.value.trim() === "") emit("update:modelValue", null);
  else if (n !== null && n !== props.modelValue) emit("update:modelValue", n);
}
function commit() {
  const n = parseNumber(draft.value);
  set(n, true);
}
function onKey(e: KeyboardEvent) {
  if (locked.value) return;
  const big = e.shiftKey ? 10 : 1;
  const map: Record<string, () => void> = {
    ArrowUp: () => bump(big),
    ArrowDown: () => bump(-big),
    PageUp: () => bump(10),
    PageDown: () => bump(-10),
    Home: () => props.min !== undefined && set(props.min, true),
    End: () => props.max !== undefined && set(props.max, true),
    Enter: commit,
  };
  const fn = map[e.key];
  if (fn) {
    if (e.key !== "Enter") e.preventDefault();
    fn();
  }
}
const repeat = createRepeater();
function press(times: number, e: PointerEvent) {
  if (locked.value || e.button !== 0) return;
  e.preventDefault();
  input.value?.focus();
  repeat.start(() => bump(times));
}
defineExpose({ focus: () => input.value?.focus(), blur: () => input.value?.blur() });
</script>

<template>
  <span
    v-bind="rootAttrs"
    data-ar="input-number"
    data-part="root"
    :data-size="size"
    :data-block="block || undefined"
    :data-state="[invalid && 'invalid', disabled && 'disabled', readonly && 'readonly'].filter(Boolean).join(' ') || undefined"
  >
    <span v-if="prefix" data-part="prefix">{{ prefix }}</span>
    <input
      :id="id"
      ref="input"
      v-bind="inputAttrs"
      data-part="input"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      role="spinbutton"
      :name="name"
      :value="shown"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="id ? undefined : label"
      :aria-valuenow="modelValue ?? undefined"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuetext="modelValue === null ? undefined : `${prefix ?? ''}${formatNumber(modelValue, grouping, precision)}${suffix ?? ''}`"
      :aria-invalid="invalid ? 'true' : undefined"
      @focus="focused = true"
      @blur="focused = false; commit()"
      @input="onInput"
      @keydown="onKey"
    />
    <span v-if="suffix" data-part="suffix">{{ suffix }}</span>
    <span v-if="controls" data-part="steps">
      <button
        type="button"
        data-part="up"
        tabindex="-1"
        :aria-label="`${step}増やす`"
        :disabled="disabled || readonly || atMax"
        @pointerdown="press(1, $event)"
        @pointerup="repeat.stop"
        @pointerleave="repeat.stop"
        @pointercancel="repeat.stop"
      >
        <span aria-hidden="true">▲</span>
      </button>
      <button
        type="button"
        data-part="down"
        tabindex="-1"
        :aria-label="`${step}減らす`"
        :disabled="disabled || readonly || atMin"
        @pointerdown="press(-1, $event)"
        @pointerup="repeat.stop"
        @pointerleave="repeat.stop"
        @pointercancel="repeat.stop"
      >
        <span aria-hidden="true">▼</span>
      </button>
    </span>
  </span>
</template>
