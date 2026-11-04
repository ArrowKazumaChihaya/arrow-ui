<!-- スマホの日の詳細 | variant="mobile"（RxSpDay のシートの中）。名前の列が細く（頭文字なし）、時間の場所は横にすべらせる。操作の行は折り返す。指ではバーを押してドラッグ、空いた行は横にすべらせるだけ（追加は Enter・マウス）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArShiftChart, type ArShiftChartRow, type ArShiftChartChange } from "@s_and_a/arrow-ui";
const H = (h: number) => h * 60;
const rows = ref<ArShiftChartRow[]>([
  { key: 101, name: "千速 一真", seed: 0, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] },
  { key: 102, name: "末永 修也", seed: 1, color: "#4C5FC4", shifts: [{ start: H(9), end: H(18) }], breaks: [{ start: H(12), end: H(13) }] },
  { key: 103, name: "新里 匠", seed: 2, shifts: [{ start: H(9), end: H(21) }], breaks: [{ start: H(12), end: H(17) }] },
  { key: 104, name: "中口 万由香", seed: 3, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] },
  { key: 105, name: "松田 照恵", seed: 4, available: [{ start: H(10), end: H(13) }] },
]);
const needs = [{ start: H(9), end: H(22), count: 2 }, { start: H(12), end: H(13), count: 4 }, { start: H(18), end: H(20), count: 4 }];
const range = ref<[number, number]>([H(8), H(23)]);
function onChange(p: ArShiftChartChange) {
  rows.value = rows.value.map((r) => (r.key === p.row.key ? { ...r, shifts: p.shifts, breaks: p.breaks } : r));
}
</script>

<template>
<div style="width: 342px; padding: 0; border: 1px dashed #d0d7de; border-radius: 12px; overflow: hidden">
  <ArShiftChart v-model:range="range" variant="mobile" :rows="rows" :needs="needs" label="10月21日のチャート" @change="onChange" />
</div>
</template>
