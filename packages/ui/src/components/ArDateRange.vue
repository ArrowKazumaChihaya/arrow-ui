<script setup lang="ts">
/**
 * ArDateRange 1.0 — 期間の入力。2つの ArDateInput を「〜」でつなぎ、右に日数（30日間）を出す。
 * 終わりの日が始まりの日より前なら両方を赤くし、下に直し方を言葉で出す。1か月・半月などのボタンとは親がつなぐ。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import ArDateInput from "./ArDateInput.vue";
import { dayNumber, inclusiveDays } from "./date";
import type { ArDateRangeProps, ArDateRangeValue } from "./ArDateRange.contract";

const props = withDefaults(defineProps<ArDateRangeProps>(), {
  minYear: undefined,
  maxYear: undefined,
  showDays: true,
  invalid: false,
  validate: true,
  disabled: false,
  label: undefined,
  labels: () => ({
    start: "始まりの日",
    end: "終わりの日",
    separator: "〜",
    days: (n: number) => `${n}日間`,
    reversed: "終わりの日は、始まりの日と同じか後にしてください",
  }),
});
const emit = defineEmits<{ "update:modelValue": [value: ArDateRangeValue] }>();

const reversed = computed(
  () => props.validate && !!props.modelValue.start && !!props.modelValue.end && dayNumber(props.modelValue.end) < dayNumber(props.modelValue.start),
);
const days = computed(() => inclusiveDays(props.modelValue.start, props.modelValue.end));
const bad = computed(() => props.invalid || reversed.value);
const set = (key: "start" | "end", v: string | null) => emit("update:modelValue", { ...props.modelValue, [key]: v });
</script>

<template>
  <div
    data-ar="date-range"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-state="[bad && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <div data-part="row">
      <ArDateInput
        data-part="start"
        :model-value="modelValue.start"
        :min-year="minYear"
        :max-year="maxYear"
        :invalid="bad"
        :disabled="disabled"
        :label="`${label ?? ''}${labels.start}`"
        @update:model-value="(v) => set('start', v)"
      />
      <span data-part="separator" aria-hidden="true">{{ labels.separator }}</span>
      <ArDateInput
        data-part="end"
        :model-value="modelValue.end"
        :min-year="minYear"
        :max-year="maxYear"
        :invalid="bad"
        :disabled="disabled"
        :label="`${label ?? ''}${labels.end}`"
        @update:model-value="(v) => set('end', v)"
      />
      <span v-if="showDays && days" data-part="days" aria-live="polite">{{ labels.days(days) }}</span>
    </div>
    <div v-if="reversed" data-part="error" role="alert"><ArIcon name="alert" size="sm" />{{ labels.reversed }}</div>
  </div>
</template>
