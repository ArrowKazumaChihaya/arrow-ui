<!-- 大きさ（sm・md・lg） | 各項目は ArCheckbox なので、チェックと同じ段（sm＝設定の行、md＝ふつう、lg＝スマホ）。variant="card" で選ぶカードにもできる。 -->
<script setup lang="ts">
import { ArFlagGroup } from "@arrow/ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const days = ["日", "月", "火", "水", "木", "金", "土"].map((label, i) => ({ value: 2 ** i, label }));
const v = ref<number | null>(2 + 8 + 32);
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <ArFlagGroup v-model="v" :size="z" :options="days" :label="`勤務する曜日（${z}）`" />
  </template>
  <small>md card</small>
  <ArFlagGroup v-model="v" variant="card" :options="days.slice(1, 6)" label="勤務する曜日（カード）" />
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 60px 1fr; gap: 14px 12px; align-items: center; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
