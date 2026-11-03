<script setup lang="ts">
/**
 * ArDateInput 1.0 — 日付の入力。年はプルダウン（ブラウザの select は使わない）、月と日は数字（全角も読む）。
 * 曜日は自動で出す（日は赤、土は青）。31日のまま2月にすると末日に寄せる。
 * 年：↓・Enter・Space で開き、↑↓で動かし Enter で決める。数字を打つとその年へ飛ぶ（ArYearInput と同じプルダウン）。
 * 月・日：数字を打って Enter かフォーカスが外れたら確定。↑↓で1ずつ動く。
 */
import { computed, ref, watch } from "vue";
import ArYearSelect from "../internal/ArYearSelect.vue";
import { clampDate, daysInMonth, splitDate, toNumber, weekdayOf } from "./date";
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
  const cur = Number(parts.value.y) || thisYear;
  const from = Math.min(props.minYear ?? thisYear - 5, cur);
  const to = Math.max(props.maxYear ?? thisYear + 5, cur);
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
});

const weekday = computed(() => {
  const c = splitDate(props.modelValue);
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

function step(which: "m" | "d", e: KeyboardEvent) {
  if (e.key === "Enter") return commit();
  if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
  e.preventDefault();
  const dir = e.key === "ArrowUp" ? 1 : -1;
  const y = toNumber(parts.value.y) ?? thisYear;
  const m = toNumber(parts.value.m);
  const d = toNumber(parts.value.d);
  if (which === "m") {
    const next = m ? ((m - 1 + dir + 12) % 12) + 1 : 1;
    parts.value.m = String(next);
  } else {
    const max = daysInMonth(y, m ?? 1);
    parts.value.d = String(d ? ((d - 1 + dir + max) % max) + 1 : 1);
  }
  if (parts.value.m && parts.value.d) commit();
}

function setYear(y: number | null) {
  if (y === null) return;
  parts.value.y = String(y);
  commit();
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
    <ArYearSelect
      :id="id"
      :model-value="Number(parts.y) || null"
      :years="years"
      :invalid="invalid"
      :disabled="disabled"
      :label="`${label ?? ''}${labels.year}`"
      @update:model-value="setYear"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.year }}</span>
    <input
      v-model="parts.m"
      data-part="month"
      inputmode="numeric"
      autocomplete="off"
      maxlength="2"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.month}`"
      :aria-invalid="invalid || undefined"
      @blur="commit"
      @keydown="step('m', $event)"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.month }}</span>
    <input
      v-model="parts.d"
      data-part="day"
      inputmode="numeric"
      autocomplete="off"
      maxlength="2"
      :disabled="disabled"
      :aria-label="`${label ?? ''}${labels.day}`"
      :aria-invalid="invalid || undefined"
      @blur="commit"
      @keydown="step('d', $event)"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.day }}</span>
    <span v-if="showWeekday" data-part="weekday" :data-kind="weekday?.kind">{{ weekday ? `（${weekday.text}）` : "" }}</span>
  </span>
</template>
