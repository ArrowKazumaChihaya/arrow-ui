<script setup lang="ts">
/**
 * ArCheckboxGroup 1.0 — 選択肢から いくつでも選ぶ（並べて見せる）。
 * checkAll で上に「すべて」を出す。一部だけ選んでいるときは indeterminate。押せない選択肢は「すべて」でも変えない。
 */
import { computed } from "vue";
import ArCheckbox from "./ArCheckbox.vue";
import type { ArCheckboxGroupProps, ArCheckboxValue } from "./ArCheckboxGroup.contract";

const props = withDefaults(defineProps<ArCheckboxGroupProps>(), { direction: "horizontal", checkAll: false, disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: ArCheckboxValue[]] }>();

const has = (v: ArCheckboxValue) => props.modelValue.includes(v);
const ordered = (set: Set<ArCheckboxValue>) => props.options.map((o) => o.value).filter((v) => set.has(v));

function toggle(v: ArCheckboxValue, on: boolean) {
  const set = new Set(props.modelValue);
  if (on) set.add(v);
  else set.delete(v);
  emit("update:modelValue", ordered(set));
}

const enabled = computed(() => props.options.filter((o) => !o.disabled));
const allOn = computed(() => enabled.value.length > 0 && enabled.value.every((o) => has(o.value)));
const someOn = computed(() => !allOn.value && props.options.some((o) => has(o.value)));
const allLabel = computed(() => (typeof props.checkAll === "string" ? props.checkAll : "すべて"));

function toggleAll(on: boolean) {
  const set = new Set(props.modelValue);
  for (const o of enabled.value) {
    if (on) set.add(o.value);
    else set.delete(o.value);
  }
  emit("update:modelValue", ordered(set));
}
</script>

<template>
  <div data-ar="checkbox-group" data-part="root" role="group" :aria-label="label" :data-direction="direction">
    <ArCheckbox
      v-if="checkAll"
      data-part="all"
      :model-value="allOn"
      :indeterminate="someOn"
      :disabled="disabled || enabled.length === 0"
      @update:model-value="toggleAll"
    >
      {{ allLabel }}
    </ArCheckbox>
    <div data-part="list">
      <ArCheckbox
        v-for="o in options"
        :key="String(o.value)"
        :model-value="has(o.value)"
        :disabled="disabled || o.disabled"
        @update:model-value="(on: boolean) => toggle(o.value, on)"
      >
        {{ o.label }}
      </ArCheckbox>
    </div>
  </div>
</template>
