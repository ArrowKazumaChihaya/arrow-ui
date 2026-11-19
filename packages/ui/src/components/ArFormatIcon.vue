<script setup lang="ts">
/**
 * ArFormatIcon 1.0 — 書類の形式（PDF・CSV・Excel）のアイコン。紙の形に、形式の色の札と文字（PDF／CSV／XLS）。
 * 色は形式で決まる（PDF＝赤、CSV＝緑、Excel＝青）。ArCatalog の一覧の印と同じ形。
 */
import { computed } from "vue";
import type { ArFormatIconFormat, ArFormatIconProps } from "./ArFormatIcon.contract";

const props = withDefaults(defineProps<ArFormatIconProps>(), { size: 24, label: undefined });
const COLOR: Record<ArFormatIconFormat, string> = { PDF: "#C0322B", CSV: "#1E7A4C", Excel: "#2C6AA6" };
const TEXT: Record<ArFormatIconFormat, string> = { PDF: "PDF", CSV: "CSV", Excel: "XLS" };
const style = computed(() => ({ width: `${props.size}px`, height: `${props.size}px`, color: COLOR[props.format] }));
</script>

<template>
  <svg
    data-ar="format-icon"
    data-part="root"
    :data-format="format"
    viewBox="0 0 24 24"
    :style="style"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
    <rect x="1" y="11.5" width="17.5" height="8.5" rx="1.6" />
    <text x="9.75" y="18.1" text-anchor="middle" font-size="6.3" font-weight="700" font-family="sans-serif">{{ TEXT[format] }}</text>
  </svg>
</template>
