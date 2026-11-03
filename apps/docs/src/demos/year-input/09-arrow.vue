<!-- 今の ARROW の使い方 | 今の ARROW の Year と同じ値（和暦は era）。 -->
<script setup lang="ts">
import { ArYearInput } from "@arrow/ui";
import { ref } from "vue";
const a = ref<number | null>(2026);
const b = ref<number | null>(2026);
</script>

<template>
<div class="g">
  <div><small>value</small><ArYearInput v-model="a" :min-year="1930" :max-year="2026" label="年" /></div>
  <div><small>isNendo</small><ArYearInput v-model="b" era :min-year="1930" :max-year="2026" label="年度" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
