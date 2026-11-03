<script setup lang="ts">
/** ArRadioGroup 1.0 — 選択肢から1つ選ぶ（並べて見せる）。7つ以上なら ArSelect を使う。 */
import { useId } from "../provider/context";
import type { ArRadioValue, ArRadioGroupProps } from "./ArRadioGroup.contract";

withDefaults(defineProps<ArRadioGroupProps>(), { direction: "horizontal", disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: ArRadioValue] }>();
const name = useId("ar-radio");
</script>

<template>
  <div data-ar="radio-group" data-part="root" role="radiogroup" :aria-label="label" :data-direction="direction">
    <label
      v-for="o in options"
      :key="String(o.value)"
      data-part="item"
      :data-state="[o.value === modelValue && 'checked', (disabled || o.disabled) && 'disabled'].filter(Boolean).join(' ') || undefined"
    >
      <span data-part="control">
        <input
          data-part="input"
          type="radio"
          :name="name"
          :checked="o.value === modelValue"
          :disabled="disabled || o.disabled"
          @change="emit('update:modelValue', o.value)"
        />
        <span data-part="mark" aria-hidden="true" />
      </span>
      <span data-part="label">{{ o.label }}</span>
    </label>
  </div>
</template>
