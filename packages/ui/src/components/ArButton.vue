<script setup lang="ts">
import { computed, useSlots } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArButtonProps } from "./ArButton.contract";

const props = withDefaults(defineProps<ArButtonProps>(), {
  tone: "secondary",
  size: "md",
  icon: undefined,
  label: undefined,
  loading: false,
  disabled: false,
  block: false,
  type: "button",
});
const emit = defineEmits<{ click: [event: MouseEvent] }>();
const slots = useSlots();
const iconOnly = computed(() => !slots.default && !!props.icon);
const state = computed(() => [props.loading && "loading", props.disabled && "disabled"].filter(Boolean).join(" "));

// アイコンだけのボタンには名前が要る
if (props.icon && !props.label && !slots.default) console.warn("[ArButton] アイコンだけのボタンには label が必要です");

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit("click", e);
}
</script>

<template>
  <button
    data-ar="button"
    data-part="root"
    :data-tone="tone"
    :data-size="size"
    :data-state="state || undefined"
    :data-block="block || undefined"
    :data-icon-only="iconOnly || undefined"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :aria-label="iconOnly ? label : undefined"
    :title="iconOnly ? label : undefined"
    @click="onClick"
  >
    <span v-if="loading" data-part="spinner" aria-hidden="true" />
    <ArIcon v-else-if="icon" :name="icon" data-part="icon" size="sm" />
    <span v-if="$slots.default" data-part="label"><slot /></span>
  </button>
</template>
