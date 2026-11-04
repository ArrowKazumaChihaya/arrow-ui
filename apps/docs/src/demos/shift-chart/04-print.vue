<!-- 印刷用 | variant="print"。操作の行・つまみ・案内を出さず、白地・影なしの細い線にする。表の形なので、長いときは見出しの行がページごとに出て、人の行の途中では改ページしない（色はそのまま刷る）。製品は「印刷」（print イベント）でこの形を開いて window.print() する。 -->
<script setup lang="ts">
import { ArShiftChart, type ArShiftChartRow } from "@s_and_a/arrow-ui";
const H = (h: number) => h * 60;
const rows: ArShiftChartRow[] = [
  { key: 1, name: "千速 一真", seed: 0, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] },
  { key: 2, name: "末永 修也", seed: 1, color: "#4C5FC4", shifts: [{ start: H(9), end: H(18) }], breaks: [{ start: H(12), end: H(13) }] },
  { key: 3, name: "新里 匠", seed: 2, shifts: [{ start: H(9), end: H(12) }, { start: H(17), end: H(21) }] },
  { key: 4, name: "中口 万由香", seed: 3, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] },
];
const needs = [{ start: H(9), end: H(22), count: 2 }, { start: H(12), end: H(13), count: 4 }, { start: H(18), end: H(20), count: 4 }];
</script>

<template>
<div style="max-width: 760px; background: #fff; padding: 24px; box-shadow: 0 2px 10px rgba(31,41,51,.15)">
  <ArShiftChart variant="print" :rows="rows" :needs="needs" :range="[H(8), H(23)]" title="10月21日(水) のシフトチャート" subtitle="ARROW事業部" />
</div>
</template>
