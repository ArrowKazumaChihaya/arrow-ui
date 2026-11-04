<!-- 大きさ（xs・sm・md・lg） | xs＝表の行の中（17×26）。sm＝設定の行（30×30）。md＝ポップアップ（38×36・シフトのキャンバスの .wd）。lg＝スマホ・大きく押しやすく（42×42）。sm・md・lg はほかの入力と同じ高さ。 -->
<script setup lang="ts">
import { ArWeekdayPicker, ArSelect, type ArWeekday } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const sizes = ["xs", "sm", "md", "lg"] as const;
const days = ref<ArWeekday[]>([1, 2, 3, 4, 5]);
const s = ref<string | number | null>("week");
const sel = { xs: undefined, sm: "sm", md: "md", lg: "lg" } as const;
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <ArWeekdayPicker v-model="days" :size="z" :label="`繰り返す曜日（${z}）`" />
      <ArSelect v-if="sel[z]" v-model="s" :size="sel[z]" :options="[{ value: 'week', label: '毎週' }, { value: 'other', label: '隔週' }]" label="繰り返し" style="width: 120px" />
    </div>
  </template>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 40px 1fr; gap: 14px 12px; align-items: center; }
.r { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
