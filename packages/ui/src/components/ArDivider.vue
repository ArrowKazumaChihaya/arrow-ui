<script setup lang="ts">
/**
 * ArDivider 1.0 — 区切り線。横（文字つきも可）と縦。
 */
import type { ArDividerProps } from "./ArDivider.contract";

withDefaults(defineProps<ArDividerProps>(), {
  orientation: "horizontal",
  align: "center",
  dashed: false,
  plain: false,
});
</script>

<template>
  <span
    v-if="orientation === 'vertical'"
    data-ar="divider"
    data-part="root"
    data-orientation="vertical"
    role="separator"
    aria-orientation="vertical"
    :data-dashed="dashed || undefined"
  />
  <div
    v-else
    data-ar="divider"
    data-part="root"
    data-orientation="horizontal"
    role="separator"
    :data-align="$slots.default ? align : undefined"
    :data-dashed="dashed || undefined"
    :data-plain="plain || undefined"
    :data-with-text="$slots.default ? '' : undefined"
  >
    <span v-if="$slots.default" data-part="text"><slot /></span>
  </div>
</template>
