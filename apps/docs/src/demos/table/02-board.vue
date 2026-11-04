<!-- シフト画面の表（board） | variant="board"：外枠なし、見出しは角の丸い淡いテーマ色の帯、行は高さ50。名前の下に小さな説明（sub・色の四角つき）、空欄は「—」、合計は灰色の帯（footer に label と span）。#before-rows に「シフト追加」、#below に「表示内容」を置く。 -->
<script setup lang="ts">
import { ArButton, ArTable, type ArTableColumn, type ArTableSort } from "@s_and_a/arrow-ui";
import { ref } from "vue";
type Row = { id: number; name: string; pattern: string; color: string; start: string[]; end: string[]; in: string; out: string; bs: string; be: string };
const rows: Row[] = [
  { id: 0, name: "千速 一真", pattern: "通常勤務2", color: "#D2483F", start: ["13:00"], end: ["22:00"], in: "", out: "", bs: "17:00", be: "18:00" },
  { id: 1, name: "末永 修也", pattern: "通常勤務1", color: "#4C5FC4", start: ["09:00"], end: ["18:00"], in: "", out: "", bs: "12:00", be: "13:00" },
  { id: 2, name: "新里 匠", pattern: "パターンなし", color: "#A9AFB6", start: ["09:00", "17:00"], end: ["12:00", "21:00"], in: "", out: "", bs: "", be: "" },
  { id: 3, name: "中口 万由香", pattern: "通常勤務2", color: "#D2483F", start: ["13:00"], end: ["22:00"], in: "", out: "", bs: "17:00", be: "18:00" },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "名前", width: 140, avatar: (r) => ({ seed: r.id }), sub: (r) => ({ text: r.pattern, color: r.color }), sortable: true },
  { key: "start", title: "開始", width: 78, emphasis: "strong", numeric: true, align: "start", sortable: true },
  { key: "end", title: "終了", width: 78, emphasis: "strong", numeric: true, align: "start", sortable: true },
  { key: "in", title: "出勤", width: 102, sortable: true },
  { key: "out", title: "退勤", width: 102, sortable: true },
  { key: "bs", title: "休始", width: 102, emphasis: "muted", numeric: true, align: "start", sortable: true },
  { key: "be", title: "休終", width: 102, emphasis: "muted", numeric: true, align: "start", sortable: true },
];
const sort = ref<ArTableSort | null>(null);
const footer = { name: { label: "出勤", value: "4名" }, start: { label: "シフト合計", value: "31時間00分", span: 2 }, in: { label: "打刻合計", value: "—", span: 2 } };
</script>

<template>
<div style="max-width: 807px; background: #fff; padding: 16px; border-radius: 18px">
<ArTable :columns="columns" :rows="rows" row-key="id" caption="勤務メンバー" variant="board" v-model:sort="sort" :footer="footer">
  <template #before-rows><ArButton tone="dashed" block icon="plus">シフト追加</ArButton></template>
  <template #actions="{ row }">
    <ArButton tone="muted" size="sm" icon="pen" :label="`${row.name}を変更`" />
    <ArButton tone="muted" size="sm" icon="trash" :label="`${row.name}を削除`" />
  </template>
  <template #below><ArButton tone="secondary" size="sm" icon="filter" icon-end="cd">表示内容 6/7</ArButton></template>
</ArTable>
</div>
</template>
