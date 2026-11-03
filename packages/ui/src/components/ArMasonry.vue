<script setup lang="ts">
/**
 * ArMasonry 1.0 — 高さの違うカード（お知らせ・イベント）を列に詰めて並べる。見た目は持たない（中のカードが持つ）。
 * 並びは上から下、左の列から右の列（読み上げの順も同じ）。
 */
import { computed } from "vue";
import type { ArMasonryProps } from "./ArMasonry.contract";

const props = withDefaults(defineProps<ArMasonryProps>(), { columns: 4, minColumnWidth: undefined, gap: 3 });
const style = computed(() => ({
  columns: props.minColumnWidth ? `${props.minColumnWidth}px ${props.columns}` : String(props.columns),
}));
</script>

<template>
  <div data-ar="masonry" data-part="root" :data-gap="gap" :style="style"><slot /></div>
</template>
