<script setup lang="ts">
/**
 * ArFlagGroup 1.1 — ビットの合計の数をチェックの並びで入れる（今の Flag）。
 * 各項目は ArCheckbox（1.1：size・variant をそのまま渡す。見た目は ArCheckbox と1つ）。入れると合計にそのビットを足し、外すと引く（ほかのビットはそのまま残す）。
 */
import { computed } from "vue";
import ArCheckbox from "./ArCheckbox.vue";
import type { ArFlagGroupProps } from "./ArFlagGroup.contract";

const props = withDefaults(defineProps<ArFlagGroupProps>(), { allowed: undefined, vertical: false, disabled: false, size: "md", variant: "plain", label: undefined });
const emit = defineEmits<{ "update:modelValue": [value: number] }>();
const shown = computed(() => (props.allowed === undefined ? props.options : props.options.filter((o) => (o.value & props.allowed!) !== 0)));
const has = (bit: number) => ((props.modelValue ?? 0) & bit) !== 0;
function set(bit: number, on: boolean) {
  const cur = props.modelValue ?? 0;
  emit("update:modelValue", on ? cur | bit : cur & ~bit);
}
</script>

<template>
  <div data-ar="flag-group" data-part="root" role="group" :aria-label="label" :data-direction="vertical ? 'vertical' : 'horizontal'" :data-size="size" :data-variant="variant">
    <ArCheckbox
      v-for="o in shown"
      :key="o.value"
      :model-value="has(o.value)"
      :size="size"
      :variant="variant"
      :description="o.description"
      :disabled="disabled || o.disabled"
      @update:model-value="set(o.value, $event)"
    >{{ o.label }}</ArCheckbox>
  </div>
</template>
