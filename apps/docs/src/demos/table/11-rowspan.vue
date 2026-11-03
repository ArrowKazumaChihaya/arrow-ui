<!-- 行をまたぐセル（報酬一覧・勤怠の集計） | 1人を2行（報酬／所得税）で見せ、コード・氏名・差引支給額・状態は rowSpan で2行をまたぐ（下の行は 0 を返して出さない）。 -->
<script setup lang="ts">
import { ArTable, ArThemeScope, type ArTableColumn } from "@arrow/ui";

type Row = { id: string; code: string; name: string; line: "報酬" | "所得税"; amount: string; real: string; state: string };
const people = [
  { code: "0041", name: "石田 蓮", m: 300000, t: 30630 },
  { code: "0042", name: "上野 結衣", m: 120000, t: 12252 },
  { code: "0043", name: "江口 大和", m: 85000, t: 8678 },
];
const yen = (n: number) => n.toLocaleString("ja-JP");
const rows: Row[] = people.flatMap((p) => [
  { id: `${p.code}-m`, code: p.code, name: p.name, line: "報酬" as const, amount: yen(p.m), real: yen(p.m - p.t), state: "給与ロック" },
  { id: `${p.code}-t`, code: p.code, name: p.name, line: "所得税" as const, amount: yen(p.t), real: "", state: "" },
]);
const two = (r: Row) => (r.line === "報酬" ? 2 : 0);
const columns: ArTableColumn<Row>[] = [
  { key: "code", title: "コード", width: 74, emphasis: "muted", rowSpan: two },
  { key: "name", title: "氏名", width: 160, rowSpan: two, avatar: (r) => ({ seed: r.code }) },
  { key: "line", title: "項目", width: 90, emphasis: "note" },
  { key: "amount", title: "金額", numeric: true, width: 120 },
  { key: "real", title: "差引支給額", numeric: true, width: 120, emphasis: "strong", rowSpan: two },
  { key: "state", title: "状態", width: 110, rowSpan: two },
];
</script>

<template>
<ArThemeScope palette="yellow">
  <div style="width: 700px; max-width: 100%">
    <ArTable :columns="columns" :rows="rows" row-key="id" caption="報酬一覧" />
  </div>
</ArThemeScope>
</template>
