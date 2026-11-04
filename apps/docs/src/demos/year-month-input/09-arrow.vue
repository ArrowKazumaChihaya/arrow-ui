<!-- 今の ARROW の使い方 | 今の ARROW の Yearmonth と同じ値（月が空の形も）。 -->
<script setup lang="ts">
import { ArYearMonthInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<string | null>("2026-11");
const b = ref<string | null>(null);
</script>

<template>
<div class="g">
  <div><small>value</small><ArYearMonthInput v-model="a" :min-year="1930" :max-year="2026" label="年月" /></div>
  <div><small>empty</small><ArYearMonthInput v-model="b" :min-year="1930" :max-year="2026" label="年月" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
