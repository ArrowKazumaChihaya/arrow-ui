<script setup lang="ts">
/**
 * ArSwitch 1.0 — すぐ効く切り替え（公開中／非公開など）。押したら保存まで行うときは loading を出す。
 * 文字ありのときは「入」と「切」の文字を同じ場所に重ねて置き、見えるのは片方だけ。幅は長い方に合わせて変わらない。
 */
import { computed } from "vue";
import type { ArSwitchProps } from "./ArSwitch.contract";
const props = withDefaults(defineProps<ArSwitchProps>(), {
  onText: undefined,
  offText: undefined,
  size: "md",
  disabled: false,
  loading: false,
  id: undefined,
});
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const hasText = computed(() => props.size !== "sm" && !!(props.onText || props.offText));
function toggle() {
  if (!props.disabled && !props.loading) emit("update:modelValue", !props.modelValue);
}
</script>

<template>
  <button
    :id="id"
    type="button"
    role="switch"
    data-ar="switch"
    data-part="root"
    :data-size="size"
    :data-text="hasText || undefined"
    :data-state="[modelValue ? 'on' : 'off', disabled && 'disabled', loading && 'loading'].filter(Boolean).join(' ')"
    :aria-checked="modelValue"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :aria-disabled="loading || undefined"
    :disabled="disabled"
    @click="toggle"
  >
    <span data-part="track" aria-hidden="true">
      <span v-if="hasText" data-part="text">
        <span data-part="on">{{ onText }}</span>
        <span data-part="off">{{ offText }}</span>
      </span>
      <span data-part="thumb"><span v-if="loading" data-part="spinner" /></span>
    </span>
  </button>
</template>
