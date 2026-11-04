<script setup lang="ts">
/**
 * ArDateTimeInput 1.0 — 日時の入力。日付（年のプルダウン＋月日）と、時と分のプルダウンを並べる。
 * 値は "YYYY-MM-DD HH:mm:ss"（秒は 00）。日付か時刻のどちらかが空なら null。
 */
import { ref, watch } from "vue";
import ArDateInput from "./ArDateInput.vue";
import ArTimeInput from "./ArTimeInput.vue";
import type { ArDateTimeInputProps } from "./ArDateTimeInput.contract";
import type { ArTimeValue } from "./ArTimeInput.contract";

const props = withDefaults(defineProps<ArDateTimeInputProps>(), {
  minYear: undefined,
  maxYear: undefined,
  era: false,
  minuteStep: 5,
  showWeekday: false,
  invalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ hour: "時", minute: "分" }),
});
const emit = defineEmits<{ "update:modelValue": [value: string | null] }>();

const date = ref<string | null>(null);
const time = ref<ArTimeValue>({ time: null, day: "same" });
function read(v: string | null) {
  const m = v ? /^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/.exec(v) : null;
  if (m) {
    date.value = m[1]!;
    time.value = { time: `${m[2]}:${m[3]}`, day: "same" };
  }
}
read(props.modelValue);
watch(() => props.modelValue, read);

function send() {
  const v = date.value && time.value.time ? `${date.value} ${time.value.time}:00` : null;
  if (v !== props.modelValue) emit("update:modelValue", v);
}
function onDate(v: string | null) {
  date.value = v;
  send();
}
function onTime(v: ArTimeValue) {
  time.value = v;
  send();
}
</script>

<template>
  <span data-ar="date-time-input" data-part="root" role="group" :aria-label="label">
    <ArDateInput
      :id="id"
      :model-value="date"
      :min-year="minYear"
      :initial-year="initialYear"
      :years="years"
      :invalid-date="invalidDate"
      :year-order="yearOrder"
      :allow-empty-year="allowEmptyYear"
      :pad="pad"
      :update-on-input="updateOnInput"
      :max-year="maxYear"
      :era="era"
      :show-weekday="showWeekday"
      :invalid="invalid"
      :disabled="disabled"
      :label="label"
      @update:model-value="onDate"
    />
    <ArTimeInput
      :model-value="time"
      select
      :minute-step="minuteStep"
      :invalid="invalid"
      :disabled="disabled"
      :label="label"
      :labels="{ same: '当日', prev: '前日', toggleHint: '', hour: labels.hour, minute: labels.minute }"
      @update:model-value="onTime"
    >
      <template #hour-unit>{{ labels.hour }}</template>
      <template #minute-unit>{{ labels.minute }}</template>
    </ArTimeInput>
  </span>
</template>
