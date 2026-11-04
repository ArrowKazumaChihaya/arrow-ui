<!-- 今の ARROW の使い方 | 今の ARROW の Zip と同じ値（幅120px）。 -->
<script setup lang="ts">
import { ArZipInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<string | null>(null);
const b = ref<string | null>("150-0001");
</script>

<template>
<div class="g">
  <div><small>empty</small><ArZipInput v-model="a" label="郵便番号" placeholder="" style="width: 120px" /></div>
  <div><small>value</small><ArZipInput v-model="b" label="郵便番号" style="width: 120px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
