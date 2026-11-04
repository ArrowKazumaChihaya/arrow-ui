<!-- いろいろな行と状態 | 1日に2つのシフト（9:00〜12:00 / 17:00〜21:00）、勤怠（打刻）の黒い線と勤務中、有給全日、ほかの店舗・部署（点線）、動かせない行（editable: false）、翌日にまたぐシフト（22:00〜29:00）。下はロック中の日（locked に理由）と、行のないとき。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArShiftChart, ArStack, type ArShiftChartRow, type ArShiftChartChange } from "@s_and_a/arrow-ui";
const H = (h: number, m = 0) => h * 60 + m;
const rows = ref<ArShiftChartRow[]>([
  { key: 1, name: "新里 匠", seed: 2, color: "#449B47", pattern: "早番", shifts: [{ start: H(9), end: H(12) }, { start: H(17), end: H(21) }], punches: [{ start: H(8, 55), end: H(12, 2) }, { start: H(16, 58), end: H(19, 30) }], punchOpen: true },
  { key: 2, name: "千速 一真", seed: 0, color: "#7146C3", pattern: "遅番", shifts: [{ start: H(22), end: H(29) }], breaks: [{ start: H(25), end: H(25, 45) }] },
  { key: 3, name: "末永 修也", seed: 1, leave: "有給全日" },
  { key: 4, name: "松田 照恵", seed: 4, others: [{ label: "新宿店 キッチン", start: H(18), end: H(22) }] },
  { key: 5, name: "青木 美咲", seed: 0, color: "#4C5FC4", editable: false, sub: "本社 経理部で登録", shifts: [{ start: H(10), end: H(19) }], breaks: [{ start: H(13), end: H(14) }] },
]);
function onChange(p: ArShiftChartChange) {
  rows.value = rows.value.map((r) => (r.key === p.row.key ? { ...r, shifts: p.shifts, breaks: p.breaks } : r));
}
const locked: ArShiftChartRow[] = [
  { key: 1, name: "千速 一真", seed: 0, color: "#D2483F", shifts: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] },
  { key: 2, name: "末永 修也", seed: 1, color: "#4C5FC4", shifts: [{ start: H(9), end: H(18) }], breaks: [{ start: H(12), end: H(13) }] },
];
</script>

<template>
<ArStack :gap="8" style="max-width: 775px">
  <ArShiftChart :rows="rows" :range="[H(6), H(30)]" :printable="false" @change="onChange" />
  <ArShiftChart :rows="locked" locked="10月31日まで勤怠ロック中のため動かせません" :printable="false" />
  <ArShiftChart :rows="[]" empty-text="この日のシフトはありません" />
</ArStack>
</template>
