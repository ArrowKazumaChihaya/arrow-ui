<script setup lang="ts">
/**
 * ArTextInput 1.0 — 1行の文字の入力。
 * update:modelValue は打つたびに、change は確定したとき（Enter・フォーカスが外れた）に出す。
 */
import ArIcon from "./ArIcon.vue";
import type { ArTextInputProps } from "./ArTextInput.contract";

const props = withDefaults(defineProps<ArTextInputProps>(), {
  type: "text",
  placeholder: undefined,
  size: "md",
  invalid: false,
  disabled: false,
  readonly: false,
  icon: undefined,
  suffix: undefined,
  maxlength: undefined,
  label: undefined,
  id: undefined,
  inputmode: undefined,
  autocomplete: "off",
});
const emit = defineEmits<{ "update:modelValue": [value: string]; change: [value: string] }>();
function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
function onCommit() {
  emit("change", props.modelValue);
}
</script>

<template>
  <span
    data-ar="text-input"
    data-part="root"
    :data-size="size"
    :data-state="[invalid && 'invalid', disabled && 'disabled', readonly && 'readonly'].filter(Boolean).join(' ') || undefined"
  >
    <ArIcon v-if="icon" :name="icon" data-part="icon" size="sm" />
    <input
      :id="id"
      data-part="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :aria-label="id ? undefined : label"
      :aria-invalid="invalid ? 'true' : undefined"
      @input="onInput"
      @blur="onCommit"
      @keydown.enter="onCommit"
    />
    <span v-if="suffix" data-part="suffix">{{ suffix }}</span>
  </span>
</template>
