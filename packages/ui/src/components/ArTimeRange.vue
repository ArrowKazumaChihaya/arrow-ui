<script setup lang="ts">
/**
 * ArTimeRange 1.2 — 時刻の範囲（09:00 〜 18:00）。2つの ArTimeInput を「〜」でつなぐ。
 * validate なら終わりが始まり以前のとき終わりを赤くし、下に直し方を言葉で出す。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import ArTimeInput from "./ArTimeInput.vue";
import { toMinutes } from "./time";
import type { ArTimeValue } from "./ArTimeInput.contract";
import type { ArTimeRangeProps, ArTimeRangeValue } from "./ArTimeRange.contract";

const props = withDefaults(defineProps<ArTimeRangeProps>(), {
  overnight: false,
  startOvernight: false,
  step: 5,
  size: "md",
  invalid: false,
  validate: true,
  disabled: false,
  startNote: undefined,
  endNote: undefined,
  label: undefined,
  labels: () => ({ start: "開始", end: "終了", separator: "〜", reversed: "終了は開始より後の時刻にしてください" }),
});
const emit = defineEmits<{
  "update:modelValue": [value: ArTimeRangeValue];
  "update:start": [value: string | null];
  "update:end": [value: string | null];
}>();

const reversed = computed(() => {
  const s = toMinutes(props.modelValue.start);
  const e = toMinutes(props.modelValue.end);
  return props.validate && s !== null && e !== null && e <= s;
});
function set(key: "start" | "end", v: ArTimeValue) {
  if (props.disabled || (key === "start" ? props.startNote : props.endNote)) return;
  emit("update:modelValue", { ...props.modelValue, [key]: v.time });
  if (key === "start") emit("update:start", v.time);
  else emit("update:end", v.time);
}
</script>

<template>
  <div
    data-ar="time-range"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-size="size"
    :data-state="[(invalid || reversed) && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <div data-part="row">
      <ArTimeInput
        data-part="start"
        :note="startNote"
        :model-value="{ time: modelValue.start, day: 'same' }"
        :size="size"
        :step="step"
        :overnight="startOvernight"
        :invalid="invalid"
        :disabled="disabled"
        :label="`${label ?? ''}${labels.start}`"
        @update:model-value="(v) => set('start', v)"
      />
      <span data-part="separator" aria-hidden="true">{{ labels.separator }}</span>
      <ArTimeInput
        data-part="end"
        :note="endNote"
        :model-value="{ time: modelValue.end, day: 'same' }"
        :size="size"
        :step="step"
        :overnight="overnight"
        :invalid="invalid || reversed"
        :disabled="disabled"
        :label="`${label ?? ''}${labels.end}`"
        @update:model-value="(v) => set('end', v)"
      />
    </div>
    <div v-if="reversed" data-part="error" role="alert"><ArIcon line name="alert" size="sm" />{{ labels.reversed }}</div>
  </div>
</template>
