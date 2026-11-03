<script setup lang="ts">
/**
 * ArMonthDayInput 1.0 — 月日の入力（年なし）。月と日は数字の欄（全角でも入る）。
 * 範囲外は受け付けない。月が決まる（2桁・2〜9）と日の欄へ進み、日の欄が空で Backspace を押すと月へ戻る。
 */
import { ref, watch } from "vue";
import { digitsOf, lastDay, pad2 } from "../internal/yearParts";
import type { ArMonthDayInputProps } from "./ArMonthDayInput.contract";

const props = withDefaults(defineProps<ArMonthDayInputProps>(), {
  invalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ month: "月", day: "日" }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null] }>();

const month = ref("");
const day = ref("");
const dayEl = ref<HTMLInputElement | null>(null);
const monthEl = ref<HTMLInputElement | null>(null);
function sync(v: string | null) {
  const m = v ? /^(\d{1,2})-(\d{1,2})$/.exec(v) : null;
  if (!m) return;
  if (digitsOf(month.value, 2) !== Number(m[1])) month.value = m[1]!;
  if (digitsOf(day.value, 2) !== Number(m[2])) day.value = m[2]!;
}
sync(props.modelValue);
watch(() => props.modelValue, sync);

function commit() {
  const m = digitsOf(month.value, 2);
  const d = digitsOf(day.value, 2);
  const ok = m && d && m >= 1 && m <= 12 && d >= 1;
  const next = ok ? `${pad2(m)}-${pad2(Math.min(d, lastDay(m)))}` : null;
  if (next !== props.modelValue) emit("update:modelValue", next);
}
function onInput(which: "month" | "day", e: Event) {
  const el = e.target as HTMLInputElement;
  const s = el.value.normalize("NFKC");
  const n = digitsOf(s, 2);
  const max = which === "month" ? 12 : 31;
  const cur = which === "month" ? month : day;
  if (s !== "" && (n === null || n > max)) {
    el.value = cur.value;
    return;
  }
  cur.value = s;
  commit();
  if (which === "month" && n !== null && (s.length >= 2 || n > 1)) {
    dayEl.value?.focus();
    dayEl.value?.select();
  }
}
function onDayKey(e: KeyboardEvent) {
  if (e.key === "Backspace" && day.value === "") {
    e.preventDefault();
    monthEl.value?.focus();
  }
}
</script>

<template>
  <span
    data-ar="month-day-input"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <input
      :id="id"
      ref="monthEl"
      data-part="month"
      :value="month"
      inputmode="numeric"
      maxlength="2"
      autocomplete="off"
      :disabled="disabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-label="`${label ?? ''}${labels.month}`"
      @input="onInput('month', $event)"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.month }}</span>
    <input
      ref="dayEl"
      data-part="day"
      :value="day"
      inputmode="numeric"
      maxlength="2"
      autocomplete="off"
      :disabled="disabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-label="`${label ?? ''}${labels.day}`"
      @input="onInput('day', $event)"
      @keydown="onDayKey"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.day }}</span>
  </span>
</template>
