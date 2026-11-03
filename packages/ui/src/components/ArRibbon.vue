<script setup lang="ts">
/** ArRibbon 1.0 — カードの右上のリボン（「おすすめ」）。中にカードを入れる。テーマ色の塗りに白文字。 */
import type { ArRibbonProps } from "./ArBadge.contract";

withDefaults(defineProps<ArRibbonProps>(), { tone: "accent", placement: "end" });
</script>

<template>
  <div data-ar="ribbon" data-part="root" :data-tone="tone" :data-placement="placement">
    <div data-part="content"><slot /></div>
    <span data-part="ribbon">{{ text }}<span data-part="corner" aria-hidden="true" /></span>
  </div>
</template>
