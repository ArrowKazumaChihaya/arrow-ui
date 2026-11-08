<script setup lang="ts">
/**
 * ArTag 1.0 — 状態や種類の札（「提出済」「パート」「不足1」「4名」）。色だけで伝えず、必ず言葉を入れる。
 * checkable で選べる札（CheckableTag）、dashed で「タグを追加」、closable で外せる札になる。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArTagProps } from "./ArTag.contract";

const props = withDefaults(defineProps<ArTagProps>(), {
  tone: "neutral",
  shape: "square",
  size: "md",
  icon: undefined,
  count: false,
  closable: false,
  closeLabel: "外す",
  dashed: false,
  checkable: false,
  checked: false,
  disabled: false,
});
const emit = defineEmits<{ close: [event: MouseEvent]; "update:checked": [checked: boolean]; click: [event: MouseEvent] }>();
const pressable = computed(() => props.checkable || props.dashed);
const state = computed(
  () => [props.checkable && props.checked && "checked", props.disabled && "disabled"].filter(Boolean).join(" ") || undefined,
);
function onClick(e: MouseEvent) {
  if (props.disabled) return;
  if (props.checkable) emit("update:checked", !props.checked);
  emit("click", e);
}
</script>

<template>
  <component
    :is="pressable ? 'button' : 'span'"
    data-ar="tag"
    data-part="root"
    :data-tone="tone"
    :data-shape="shape"
    :data-size="size"
    :data-count="count || undefined"
    :data-block="block || undefined"
    :style="minWidth === undefined ? undefined : { minWidth: `${minWidth}px`, justifyContent: 'center' }"
    :data-kind="checkable ? 'checkable' : dashed ? 'dashed' : undefined"
    :data-state="state"
    :type="pressable ? 'button' : undefined"
    :aria-pressed="checkable ? checked : undefined"
    :disabled="pressable ? disabled : undefined"
    @click="pressable ? onClick($event) : undefined"
  >
    <ArIcon v-if="icon" :name="icon" data-part="icon" size="sm" />
    <span data-part="label"><slot /></span>
    <button
      v-if="closable && !pressable"
      type="button"
      data-part="close"
      :aria-label="closeLabel"
      :disabled="disabled"
      @click.stop="emit('close', $event)"
    >
      <ArIcon line name="x" size="sm" />
    </button>
  </component>
</template>
