<script setup lang="ts">
/**
 * ArIcon 1.0 — ARROW の線のアイコン。
 * label を渡すと読み上げられる画像、渡さなければ飾り（aria-hidden）。
 */
import { computed } from "vue";
import { icons, type ArIconName } from "../icons";

const props = withDefaults(defineProps<{ name: ArIconName; size?: "sm" | "md" | "lg"; label?: string }>(), {
  size: "md",
  label: undefined,
});
const body = computed(() => icons[props.name]);
</script>

<template>
  <svg
    data-ar="icon"
    :data-size="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="body"
  />
</template>
