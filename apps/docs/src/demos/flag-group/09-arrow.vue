<!-- 今の ARROW の使い方 | 今の ARROW の Flag と同じ（曜日をビットの数で持つ。1＝日、2＝月、4＝火…）。 -->
<script setup lang="ts">
import { ArFlagGroup } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const days = ["日", "月", "火", "水", "木", "金", "土"].map((label, i) => ({ value: 2 ** i, label }));
const a = ref<number | null>(5);
const b = ref<number | null>(3);
</script>

<template>
<div class="g">
  <div><small>horizontal</small><ArFlagGroup v-model="a" :options="days" label="曜日" /></div>
  <div><small>vertical</small><ArFlagGroup v-model="b" :options="days.slice(0, 3)" vertical label="曜日" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
