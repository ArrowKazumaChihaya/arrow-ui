<!-- 今の ARROW の使い方 | 今の ARROW の FlagView と同じ（選んだ曜日を文字で並べる。0 は「なし」）。 -->
<script setup lang="ts">
import { ArFlagView } from "@arrow/ui";
const days = ["日", "月", "火", "水", "木", "金", "土"].map((label, i) => ({ value: 2 ** i, label }));
</script>

<template>
<div class="g">
  <div><small>value 21</small><ArFlagView :value="21" :options="days" /></div>
  <div><small>value 0（なし）</small><ArFlagView :value="0" :options="days" empty="なし" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
