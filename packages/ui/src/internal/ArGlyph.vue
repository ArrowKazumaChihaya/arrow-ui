<script setup lang="ts">
/**
 * ArIcon と同じ形の線のアイコン（ライブラリの中だけで使う）。
 * icons.ts にまだない絵（フォルダ・拡大・画像・作り直す…）をここで持ち、icons.ts に入ったらそちらを使う。
 * 正解：デザインシステムの見本 HTML の <symbol>。
 */
import { computed } from "vue";
import { icons } from "../icons";

const extra: Record<string, string> = {
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
  zoom: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path><path d="M11 8v6M8 11h6"></path>',
  "zoom-out": '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path><path d="M8 11h6"></path>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><path d="m21 16-5-5-9 9"></path>',
  reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path>',
};
export type ArGlyphName = keyof typeof icons | "folder" | "zoom" | "zoom-out" | "image" | "reload";

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
