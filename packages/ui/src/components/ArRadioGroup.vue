<script setup lang="ts">
/**
 * ArRadioGroup 1.0 — 選択肢から1つ選ぶ（並べて見せる）。7つ以上なら ArSelect を使う。
 * type="button" はボタン型（Segmented と同じ形）。どちらも中身は本物のラジオなので、←→↑↓で選べる。
 * 1.1：#label（{ option, checked }）で名前の所に任意の部品、#extra（{ option, checked }）で選択肢の下に表や入力を置ける
 * （extra はラジオの外に置くので、中の入力を押してもラジオは切り替わらない）。
 */
import { useId } from "../provider/context";
import type { ArRadioValue, ArRadioGroupProps } from "./ArRadioGroup.contract";

withDefaults(defineProps<ArRadioGroupProps>(), { type: "radio", direction: "horizontal", block: false, disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: ArRadioValue] }>();
const name = useId("ar-radio");
</script>

<template>
  <div
    data-ar="radio-group"
    data-part="root"
    role="radiogroup"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    :data-type="type"
    :data-direction="type === 'button' ? 'horizontal' : direction"
    :data-block="block || undefined"
  >
    <template v-for="o in options" :key="String(o.value)">
    <label
      data-part="item"
      :data-state="[o.value === modelValue && 'checked', (disabled || o.disabled) && 'disabled'].filter(Boolean).join(' ') || undefined"
    >
      <span data-part="control">
        <input
          data-part="input"
          type="radio"
          :name="name"
          :value="String(o.value)"
          :checked="o.value === modelValue"
          :disabled="disabled || o.disabled"
          @change="emit('update:modelValue', o.value)"
        />
        <span v-if="type === 'radio'" data-part="mark" aria-hidden="true" />
      </span>
      <span data-part="label"><slot name="label" :option="o" :checked="o.value === modelValue">{{ o.label }}</slot></span>
    </label>
    <div v-if="type === 'radio' && $slots.extra" data-part="extra" :data-state="o.value === modelValue ? 'checked' : undefined">
      <slot name="extra" :option="o" :checked="o.value === modelValue" />
    </div>
    </template>
  </div>
</template>
