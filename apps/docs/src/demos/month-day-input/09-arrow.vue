<!-- 今の ARROW の使い方 | 今の ARROW の MonthDay と同じ値。 -->
<script setup lang="ts">
import { ArMonthDayInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<string | null>("11-03");
const b = ref<string | null>(null);
</script>

<template>
<div class="g">
  <div><small>value</small><ArMonthDayInput v-model="a" label="月日" /></div>
  <div><small>empty</small><ArMonthDayInput v-model="b" label="月日" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
