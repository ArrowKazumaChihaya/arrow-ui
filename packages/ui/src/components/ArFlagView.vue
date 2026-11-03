<script setup lang="ts">
/** ArFlagView 1.0 — ビットの合計の数を、立っている項目の名前の並びで見せる（今の FlagView）。0 なら「なし」。 */
import { computed } from "vue";
import type { ArFlagViewProps } from "./ArFlagView.contract";

const props = withDefaults(defineProps<ArFlagViewProps>(), { empty: "なし" });
const on = computed(() => props.options.filter((o) => ((props.value ?? 0) & o.value) !== 0));
</script>

<template>
  <span data-ar="flag-view" data-part="root">
    <span v-if="!on.length" data-part="empty">{{ empty }}</span>
    <template v-else><span v-for="o in on" :key="o.value" data-part="item">{{ o.label }}</span></template>
  </span>
</template>
