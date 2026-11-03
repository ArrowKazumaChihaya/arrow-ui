<script setup lang="ts">
/** ArChip 1.0 — 行の中に添える小さな札（高さ20・11px の太字）。押せない。状態の札は ArTag を使う。 */
import type { ArChipProps } from "./ArChip.contract";

withDefaults(defineProps<ArChipProps>(), { tone: "accent" });
</script>

<template>
  <span data-ar="chip" data-part="root" :data-tone="tone"><slot /></span>
</template>
