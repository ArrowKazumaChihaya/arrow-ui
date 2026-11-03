<script setup lang="ts">
/** ArStack 1.0 — 縦に並べる。間は余白トークンの段階だけ。製品のレイアウト層で使う。 */
import type { ArAlign, ArSpace } from "./types";
withDefaults(defineProps<{ gap?: ArSpace; align?: ArAlign; as?: string }>(), {
  gap: 0,
  align: "stretch",
  as: "div",
});
</script>

<template>
  <component :is="as" data-ar="stack" :data-gap="gap" :data-align="align"><slot /></component>
</template>
