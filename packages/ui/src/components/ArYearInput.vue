<script setup lang="ts">
/**
 * ArYearInput 1.0 — 年の入力。新しい年が上のプルダウン（端末の標準の選択は使わない）。
 * 和暦を添えられる。数字を打つとその年へ飛ぶ。
 */
import { computed } from "vue";
import ArYearSelect from "../internal/ArYearSelect.vue";
import { eraLabel, yearList } from "../internal/yearParts";
import type { ArYearInputProps } from "./ArYearInput.contract";

const props = withDefaults(defineProps<ArYearInputProps>(), {
  minYear: 1930,
  maxYear: () => new Date().getFullYear(),
  era: false,
  allowEmpty: false,
  showUnit: true,
  invalid: false,
  disabled: false,
  label: undefined,
  id: undefined,
  labels: () => ({ year: "年" }),
});
const emit = defineEmits<{ "update:modelValue": [value: number | null] }>();
const years = computed(() => yearList(props.minYear, props.maxYear, props.modelValue));
</script>

<template>
  <span
    data-ar="year-input"
    data-part="root"
    :data-era="era || undefined"
    :data-state="[invalid && 'invalid', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
  >
    <ArYearSelect
      :id="id"
      :model-value="modelValue"
      :years="years"
      :label-of="era ? eraLabel : undefined"
      :allow-empty="allowEmpty"
      :invalid="invalid"
      :disabled="disabled"
      :label="`${label ?? ''}${labels.year}`"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <span v-if="showUnit" data-part="unit" aria-hidden="true">{{ labels.year }}</span>
  </span>
</template>
