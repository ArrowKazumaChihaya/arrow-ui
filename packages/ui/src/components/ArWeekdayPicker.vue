<script setup lang="ts">
/**
 * ArWeekdayPicker 1.0 — 曜日をいくつでも選ぶ（繰り返し・一括登録の決まり）。
 * 選んだ曜日はテーマ色の塗り、選んでいない日・祝は赤、土は青の文字。各ボタンは押すたびに切り替わる（aria-pressed）。
 */
import { computed } from "vue";
import type { ArWeekday, ArWeekdayPickerProps } from "./ArWeekdayPicker.contract";

const props = withDefaults(defineProps<ArWeekdayPickerProps>(), {
  holiday: true,
  startOnMonday: false,
  size: "md",
  disabled: false,
  labels: () => ["日", "月", "火", "水", "木", "金", "土", "祝"],
});
const emit = defineEmits<{ "update:modelValue": [value: ArWeekday[]] }>();

const order = computed<ArWeekday[]>(() => {
  const days: ArWeekday[] = props.startOnMonday ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  return props.holiday ? [...days, "holiday"] : days;
});
const name = (d: ArWeekday) => props.labels[d === "holiday" ? 7 : d] ?? "";
const kind = (d: ArWeekday) => (d === 0 || d === "holiday" ? "sun" : d === 6 ? "sat" : undefined);
const on = (d: ArWeekday) => props.modelValue.includes(d);
function toggle(d: ArWeekday) {
  const set = new Set(props.modelValue);
  if (set.has(d)) set.delete(d);
  else set.add(d);
  const all: ArWeekday[] = [0, 1, 2, 3, 4, 5, 6, "holiday"];
  emit("update:modelValue", all.filter((x) => set.has(x)));
}
</script>

<template>
  <div data-ar="weekday-picker" data-part="root" role="group" :aria-label="label" :data-size="size">
    <button
      v-for="d in order"
      :key="String(d)"
      type="button"
      data-part="day"
      :data-kind="kind(d)"
      :data-state="on(d) ? 'on' : undefined"
      :aria-pressed="on(d)"
      :disabled="disabled"
      @click="toggle(d)"
    >
      {{ name(d) }}
    </button>
  </div>
</template>
