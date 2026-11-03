<script setup lang="ts">
/**
 * ArLink 1.0 — 文中のリンク（テーマ色の文字・下線）。押せないときは行き先を外す。
 */
import ArIcon from "./ArIcon.vue";
import type { ArLinkProps } from "./ArLink.contract";

const props = withDefaults(defineProps<ArLinkProps>(), {
  href: undefined,
  target: undefined,
  disabled: false,
  type: undefined,
  icon: undefined,
  underline: true,
});
const emit = defineEmits<{ click: [event: MouseEvent] }>();
function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  emit("click", e);
}
</script>

<template>
  <a
    data-ar="link"
    data-part="root"
    :data-type="type"
    :data-underline="underline ? undefined : 'hover'"
    :data-state="disabled ? 'disabled' : undefined"
    :href="disabled ? undefined : href"
    :target="disabled ? undefined : target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :role="disabled || !href ? 'link' : undefined"
    :tabindex="!disabled && !href ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    @click="onClick"
    @keydown.enter="!href && !disabled && emit('click', $event as unknown as MouseEvent)"
  >
    <ArIcon v-if="icon" :name="icon" data-part="icon" size="sm" />
    <span data-part="label"><slot /></span>
  </a>
</template>
