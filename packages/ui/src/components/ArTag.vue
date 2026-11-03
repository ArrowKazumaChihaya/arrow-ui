<script setup lang="ts">
/** ArTag 1.0 — 状態や種類の札（「提出済」「パート」「不足1」）。色だけで伝えず、必ず言葉を入れる。 */
import ArIcon from "./ArIcon.vue";
import type { ArTagProps } from "./ArTag.contract";

withDefaults(defineProps<ArTagProps>(), { tone: "neutral", icon: undefined, size: "md" });
</script>

<template>
  <span data-ar="tag" data-part="root" :data-tone="tone" :data-size="size">
    <ArIcon v-if="icon" :name="icon" data-part="icon" size="sm" /><span data-part="label"><slot /></span>
  </span>
</template>
