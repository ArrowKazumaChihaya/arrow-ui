<script setup lang="ts">
/** ArSwitch 1.0 — すぐ効く切り替え（公開中／非公開など）。押したら保存まで行うときは loading を出す。 */
import type { ArSwitchProps } from "./ArSwitch.contract";
const props = withDefaults(defineProps<ArSwitchProps>(), {
  onText: undefined,
  offText: undefined,
  size: "md",
  disabled: false,
  loading: false,
});
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
function toggle() {
  if (!props.disabled && !props.loading) emit("update:modelValue", !props.modelValue);
}
</script>

<template>
  <button
    type="button"
    role="switch"
    data-ar="switch"
    data-part="root"
    :data-size="size"
    :data-state="[modelValue ? 'on' : 'off', disabled && 'disabled', loading && 'loading'].filter(Boolean).join(' ')"
    :aria-checked="modelValue"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :disabled="disabled"
    @click="toggle"
  >
    <span data-part="track" aria-hidden="true">
      <span v-if="onText || offText" data-part="text">{{ modelValue ? onText : offText }}</span>
      <span data-part="thumb" />
    </span>
  </button>
</template>
