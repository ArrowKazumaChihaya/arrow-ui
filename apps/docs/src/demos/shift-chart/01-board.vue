<!-- シフト詳細のチャート | 勤務メンバーの「チャート」表示（シフトのキャンバスの RxChart）。バーはパターンの色・休憩は白い斜線。バーをドラッグで移動、両端で伸び縮み、休憩も動く（ドラッグの間隔できざむ）。シフトのない行をドラッグすると追加、緑の点線の提出を押すと確認してからシフトに。下に1時間ごとの人数（上：シフト　下：募集）と不足。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArModal, ArShiftChart, ArViewOptions, type ArShiftChartRow, type ArShiftChartChange, type ArShiftChartSpan, type ArViewOptionGroup } from "@s_and_a/arrow-ui";
const H = (h: number, m = 0) => h * 60 + m;
// 製品の形：Shift（shift_shift・shift_plan_break）と Able（able_time）を行に直したもの。data に元のデータを持たせ、イベントでそのまま返す。
const rows = ref<ArShiftChartRow[]>([
  { key: 101, name: "千速 一真", seed: 0, color: "#D2483F", pattern: "通常勤務2", shifts: [{ id: 9001, start: H(13), end: H(22) }], breaks: [{ id: 7001, start: H(17), end: H(18) }] },
  { key: 102, name: "末永 修也", seed: 1, color: "#4C5FC4", pattern: "通常勤務1", shifts: [{ id: 9002, start: H(9), end: H(18) }], breaks: [{ id: 7002, start: H(12), end: H(13) }] },
  { key: 103, name: "新里 匠", seed: 2, shifts: [{ id: 9003, start: H(9), end: H(21) }], breaks: [{ id: 7003, start: H(12), end: H(17) }] },
  { key: 104, name: "中口 万由香", seed: 3, color: "#D2483F", pattern: "通常勤務2", shifts: [{ id: 9004, start: H(13), end: H(22) }], breaks: [{ id: 7004, start: H(17), end: H(18) }] },
  { key: 105, name: "松田 照恵", seed: 4, available: [{ start: H(10), end: H(13) }, { start: H(17), end: H(22) }], availableNote: "昼と夜に分けて入れます" },
]);
const needs = [
  { start: H(9), end: H(11, 30), count: 2 },
  { start: H(11, 30), end: H(13, 30), count: 4 },
  { start: H(13, 30), end: H(18), count: 2 },
  { start: H(18), end: H(20), count: 4 },
  { start: H(20), end: H(22), count: 2 },
];
const range = ref<[number, number]>([H(8), H(23)]);
const step = ref(15);
const log = ref("");
const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

// 製品はここで更新のリクエスト（shift_shift と shift_plan_break）を送る。見本は手元のデータを直すだけ。
function onChange(p: ArShiftChartChange) {
  rows.value = rows.value.map((r) => (r.key === p.row.key ? { ...r, shifts: p.shifts, breaks: p.breaks } : r));
  log.value = `change：${p.row.name}さんを ${p.shifts.map((s) => `${fmt(s.start)}〜${fmt(s.end)}`).join(" / ")}${p.breaks.length ? `（休憩 ${fmt(p.breaks[0]!.start)}〜${fmt(p.breaks[0]!.end)}）` : ""} にしました`;
}
function onAdd(p: { row: ArShiftChartRow; span: ArShiftChartSpan }) {
  rows.value = rows.value.map((r) => (r.key === p.row.key ? { ...r, shifts: [p.span], available: undefined } : r));
  log.value = `add：${p.row.name}さんに ${fmt(p.span.start)}〜${fmt(p.span.end)} を追加しました`;
}
const ask = ref<{ row: ArShiftChartRow; span: ArShiftChartSpan } | null>(null);
function take() {
  if (ask.value) onAdd(ask.value);
  ask.value = null;
}
const shown = ref(["avail", "other"]);
const groups: ArViewOptionGroup[] = [
  { options: [
    { key: "punch", label: "勤怠（打刻）", description: "シフトのバーの下に黒い線で", sample: { text: "━━", color: "#1F2933" } },
    { key: "avail", label: "提出", description: "希望シフトを緑の点線の枠で。押すとシフトに", sample: { text: "提出", background: "#EEF8F2", color: "#1E7A4C", ring: "inset 0 0 0 1.5px #46A574" } },
    { key: "other", label: "ほかの店舗・部署のシフト", description: "同じ人がよそで入っている時間", sample: { text: "渋谷店", background: "#FFFFFF", color: "#4A5562", ring: "inset 0 0 0 1px #9AA6B2" } },
    { key: "off", label: "シフトのない人", description: "全員の行を出して、ドラッグで新しく入れる", sample: { text: "シフトなし", background: "#F7F9FB", color: "#7B8794" } },
  ] },
];
</script>

<template>
<div style="max-width: 775px">
  <ArShiftChart
    v-model:range="range"
    v-model:step="step"
    :rows="shown.includes('avail') ? rows : rows.map((r) => ({ ...r, available: undefined }))"
    :needs="needs"
    label="10月21日の勤務メンバーのチャート"
    @change="onChange"
    @add="onAdd"
    @take="ask = { row: $event.row, span: $event.span }"
    @print="log = 'print：印刷用のシフトチャートを開きます'"
  >
    <template #actions><ArButton tone="dashed" icon="plus" block>シフト追加</ArButton></template>
    <template #options><ArViewOptions v-model="shown" :groups="groups" label="表示内容" title="チャートに出すもの" placement="top-start" /></template>
  </ArShiftChart>
  <p style="margin: 12px 0 0; font-size: 12px; min-height: 18px">{{ log }}</p>
  <ArModal :open="!!ask" title="提出をシフトにしますか？" ok-text="シフトにする" @close="ask = null" @ok="take">
    {{ ask?.row.name }}さん {{ ask ? `${fmt(ask.span.start)}〜${fmt(ask.span.end)}` : "" }}
  </ArModal>
</div>
</template>
