<!-- 読み取り専用（募集人数・他店舗のチャート） | 今の「募集人数・他店舗のチャートを表示」（Calendar/Chart/Daily.vue）の置き換え。readonly でドラッグ・つまみ・操作の行を出さない。右上の切り替えで、ほかの店舗のシフトも出す（v-model:others）。下に必要人数と不足。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArShiftChart, type ArShiftChartRow } from "@arrow/ui";
const H = (h: number, m = 0) => h * 60 + m;
// 製品の API（manager/shift/shift-chart/read）の shifts・all_shifts の times（is_valid の started_at・ended_at）を行に、needs を募集に直したもの。
const others = ref(true);
const rows: ArShiftChartRow[] = [
  { key: 1, name: "千速 一真", seed: 0, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }] },
  { key: 2, name: "末永 修也", seed: 1, color: "#4C5FC4", shifts: [{ start: H(9), end: H(18) }] },
  { key: 3, name: "新里 匠", seed: 2, shifts: [{ start: H(9), end: H(12) }, { start: H(17), end: H(21) }] },
  { key: 4, name: "中口 万由香", seed: 3, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }] },
  { key: 5, name: "松田 照恵", seed: 4, others: [{ label: "渋谷店", start: H(10), end: H(15) }] },
];
const needs = [
  { start: H(9), end: H(11, 30), count: 2 },
  { start: H(11, 30), end: H(13, 30), count: 4 },
  { start: H(13, 30), end: H(18), count: 2 },
  { start: H(18), end: H(20), count: 4 },
  { start: H(20), end: H(22), count: 2 },
];
</script>

<template>
<div style="max-width: 752px">
  <ArShiftChart v-model:others="others" :rows="rows" :needs="needs" :range="[H(9), H(23)]" readonly others-toggle :count-row="false" label="10月21日のシフトチャート" />
</div>
</template>
