<script setup lang="ts">
/**
 * ArYearMonthInput 1.0 — 年月の入力。年はプルダウン、月は数字の欄（全角でも入る）。
 * 1〜12 以外は受け付けない（打った文字を戻す）。2桁、または 2〜9 を打つと確定する。
 */
import { computed, ref, watch } from "vue";
import ArYearSelect from "../internal/ArYearSelect.vue";
import { digitsOf, eraLabel, pad2, yearList } from "../internal/yearParts";
import type { ArYearMonthInputProps } from "./ArYearMonthInput.contract";

const props = withDefaults(defineProps<ArYearMonthInputProps>(), {
  minYear: 1930,
  maxYear: () => new Date().getFullYear(),
  era: false,
  invalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ year: "年", month: "月" }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null] }>();

const year = ref<number | null>(null);
const month = ref("");
function sync(v: string | null) {
  const m = v ? /^(\d{4})-(\d{1,2})$/.exec(v) : null;
  if (m) {
    year.value = Number(m[1]);
    if (digitsOf(month.value, 2) !== Number(m[2])) month.value = String(Number(m[2]));
  } else {
    // 値が空になっても、打ちかけの月はそのまま残す
    year.value ??= Math.min(new Date().getFullYear(), props.maxYear);
  }
}
sync(props.modelValue);
watch(() => props.modelValue, sync);
const years = computed(() => yearList(props.minYear, props.maxYear, year.value));

function commit() {
  const m = digitsOf(month.value, 2);
  const next = year.value && m && m >= 1 && m <= 12 ? `${year.value}-${pad2(m)}` : null;
  if (next !== props.modelValue) emit("update:modelValue", next);
}
function onYear(y: number | null) {
  year.value = y;
  commit();
}
function onMonth(e: Event) {
  const el = e.target as HTMLInputElement;
  const s = el.value.normalize("NFKC");
  const n = digitsOf(s, 2);
  if (s !== "" && (n === null || n > 12)) {
    el.value = month.value;
    return;
  }
  month.value = s;
  commit();
}
</script>

<template>
  <span
    data-ar="year-month-input"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-era="era || undefined"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <ArYearSelect
      :id="id"
      :model-value="year"
      :years="years"
      :label-of="era ? eraLabel : undefined"
      :invalid="invalid"
      :disabled="disabled"
      :label="`${label ?? ''}${labels.year}`"
      @update:model-value="onYear"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.year }}</span>
    <input
      data-part="month"
      :value="month"
      inputmode="numeric"
      maxlength="2"
      autocomplete="off"
      :disabled="disabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-label="`${label ?? ''}${labels.month}`"
      @input="onMonth"
    />
    <span data-part="unit" aria-hidden="true">{{ labels.month }}</span>
  </span>
</template>
