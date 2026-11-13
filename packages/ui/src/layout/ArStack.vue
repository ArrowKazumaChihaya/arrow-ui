<script setup lang="ts">
/** ArStack 1.1 — 縦に並べる。間は余白トークンの段階だけ。measure を付けると、読みやすい幅（sm 480 / md 720 / lg 960）までに収める。製品のレイアウト層で使う。 */
import type { ArAlign, ArSpace } from "./types";
withDefaults(defineProps<{ gap?: ArSpace; align?: ArAlign; as?: string; measure?: "sm" | "md" | "lg" }>(), {
  gap: 0,
  align: "stretch",
  as: "div",
  measure: undefined,
});
</script>

<template>
  <component :is="as" data-ar="stack" :data-gap="gap" :data-align="align" :data-measure="measure"><slot /></component>
</template>
