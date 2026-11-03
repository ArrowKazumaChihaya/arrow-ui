<script setup lang="ts">
/**
 * ArGrid 1.0 — 格子に並べる。
 * columns：列の数（1〜12）。minItem：列の数を幅に任せ、1つの最小幅を sm / md / lg から選ぶ。
 */
import type { ArSpace } from "./types";
withDefaults(
  defineProps<{
    columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    minItem?: "sm" | "md" | "lg";
    gap?: ArSpace;
    as?: string;
  }>(),
  { columns: undefined, minItem: undefined, gap: 4, as: "div" },
);
</script>

<template>
  <component :is="as" data-ar="grid" :data-gap="gap" :data-cols="columns" :data-min="minItem"><slot /></component>
</template>
