<!-- 今の ARROW の使い方 | 今の ARROW の Dates と同じ並び（曜日なし）。ありえない日（2月31日など）を打つと、classic では「無効な日付」。era で和暦を添える。 -->
<script setup lang="ts">
import { ArDateInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref<string | null>(null);
const b = ref<string | null>("2026-11-03");
const c = ref<string | null>("2026-02-28");
const e = ref<string | null>("2026-11-03");
</script>

<template>
<div class="g">
  <div><small>empty</small><ArDateInput v-model="a" :min-year="1930" :max-year="2026" :show-weekday="false" label="日付" /></div>
  <div><small>value</small><ArDateInput v-model="b" :min-year="1930" :max-year="2026" :show-weekday="false" label="日付" /></div>
  <div class="bad"><small>invalid（日に 31 を打つ）</small><ArDateInput v-model="c" :min-year="1930" :max-year="2026" :show-weekday="false" label="日付" /></div>
  <div><small>disabled</small><ArDateInput model-value="2026-11-03" :show-weekday="false" disabled label="日付" /></div>
  <div><small>era（和暦）</small><ArDateInput v-model="e" :min-year="1930" :max-year="2026" era :show-weekday="false" label="日付" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
