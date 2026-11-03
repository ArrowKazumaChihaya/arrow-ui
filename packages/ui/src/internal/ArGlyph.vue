<script setup lang="ts">
/**
 * ArIcon と同じ形の線のアイコン（ライブラリの中だけで使う）。
 * icons.ts にまだない絵（縮小 zoom-out）をここで持ち、icons.ts に同じ名前が入ったらそちらを使う。
 */
import { computed } from "vue";
import { icons, type ArIconName } from "../icons";

const extra: Record<string, string> = {
  "zoom-out": '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path><path d="M8 11h6"></path>',
};
export type ArGlyphName = ArIconName | "zoom-out";

const props = withDefaults(defineProps<{ name: ArGlyphName; size?: "sm" | "md" | "lg" }>(), { size: "md" });
const body = computed(() => (icons as Record<string, string>)[props.name] ?? extra[props.name] ?? "");
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
    aria-hidden="true"
    focusable="false"
    v-html="body"
  />
</template>
