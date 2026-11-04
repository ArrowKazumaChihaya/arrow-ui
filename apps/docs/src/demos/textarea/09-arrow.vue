<!-- 今の ARROW の使い方 | 今の ARROW の Textarea と同じ値（幅300px・3行・行の高さ20px）。 -->
<script setup lang="ts">
import { ArTextarea } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref("");
const b = ref("1行目のテキスト\n2行目のテキスト");
</script>

<template>
<div class="g">
  <div><small>empty</small><ArTextarea v-model="a" :rows="3" placeholder="備考" label="備考" style="width: 300px" /></div>
  <div><small>value</small><ArTextarea v-model="b" :rows="3" label="備考" style="width: 300px" /></div>
  <div><small>disabled</small><ArTextarea model-value="" :rows="3" placeholder="無効" disabled label="使えない" style="width: 300px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
