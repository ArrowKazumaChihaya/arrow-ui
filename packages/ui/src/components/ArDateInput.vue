<script setup lang="ts">
/**
 * ArDateInput 1.0 — 日付の入力。年はセレクト、月と日は数字。曜日は自動で出す（土は青、日は赤）。
 * 31日のまま2月にすると末日に寄せる。
 */
import { computed, ref, watch } from "vue";
import { clampDate, splitDate, toNumber, weekdayOf } from "./date";
import type { ArDateInputProps } from "./ArDateInput.contract";

const thisYear = new Date().getFullYear();
const props = withDefaults(defineProps<ArDateInputProps>(), {
  minYear: undefined,
  maxYear: undefined,
  showWeekday: true,
  invalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ year: "年", month: "月", day: "日", weekdays: ["日", "月", "火", "水", "木", "金", "土"] }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null] }>();

const parts = ref({ y: "", m: "", d: "" });
function syncFromValue(v: string | null) {
  const s = splitDate(v);
  parts.value = s ? { y: String(s.y), m: String(s.m), d: String(s.d) } : { y: parts.value.y || String(thisYear), m: "", d: "" };
}
syncFromValue(props.modelValue);
watch(() => props.modelValue, syncFromValue);

const years = computed(() => {
  const cur = splitDate(props.modelValue)?.y ?? thisYear;
  const from = Math.min(props.minYear ?? thisYear - 5, cur);
  const to = Math.max(props.maxYear ?? thisYear + 5, cur);
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
});

const current = computed(() => splitDate(props.modelValue));
const weekday = computed(() => {
  const c = current.value;
  if (!c) return null;
  const w = weekdayOf(c.y, c.m, c.d);
  return { text: props.labels.weekdays[w] ?? "", kind: w === 0 ? "sun" : w === 6 ? "sat" : "weekday" };
});

function commit() {
  const y = toNumber(parts.value.y);
  const m = toNumber(parts.value.m);
  const d = toNumber(parts.value.d);
  const next = y && m && d ? clampDate(y, m, d) : null;
  if (next !== props.modelValue) emit("update:modelValue", next);
  else syncFromValue(next);
}
</script>

<template>
  <span
    data-ar="date-input"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <select
      :id="id"
      v-model="parts.y"
      data-part="year"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.year}`"
      @change="commit"
    >
      <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
    </select>
    <span data-part="unit" aria-hidden="true">{{ labels.year }}</span>
    <input
      v-model="parts.m"
      data-part="month"
      inputmode="numeric"
      maxlength="2"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.month}`"
      @blur="commit"
      @keydown.enter="commit"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.month }}</span>
    <input
      v-model="parts.d"
      data-part="day"
      inputmode="numeric"
      maxlength="2"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.day}`"
      @blur="commit"
      @keydown.enter="commit"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.day }}</span>
    <span v-if="showWeekday && weekday" data-part="weekday" :data-kind="weekday.kind">({{ weekday.text }})</span>
  </span>
</template>
