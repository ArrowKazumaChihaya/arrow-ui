<!-- 一覧の表（box） | 外枠は角丸12の線。名前の列は頭文字の丸、時刻は太字・等幅、区分は灰色。行の右端にアイコンだけのボタン（aria-label 付き）。左のチェックで選び、見出しのチェックで表に出ている人をすべて選ぶ。 -->
<script setup lang="ts">
import { ArButton, ArTable, type ArTableColumn } from "@arrow/ui";
import { ref } from "vue";
type Row = { id: number; seed: number; name: string; start: string[]; end: string[]; kind: string };
const rows: Row[] = [
  { id: 1, seed: 1, name: "末永 修也", start: ["09:00"], end: ["18:00"], kind: "役員" },
  { id: 2, seed: 3, name: "中口 万由香", start: ["13:00"], end: ["22:00"], kind: "社員" },
  { id: 3, seed: 2, name: "新里 匠", start: ["09:00", "17:00"], end: ["12:00", "21:00"], kind: "社員" },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 270, avatar: (r) => ({ seed: r.seed }) },
  { key: "start", title: "開始", width: 88, emphasis: "strong", numeric: true, align: "start" },
  { key: "end", title: "終了", width: 88, emphasis: "strong", numeric: true, align: "start" },
  { key: "kind", title: "区分", width: 190, emphasis: "muted" },
];
const selected = ref<(string | number)[]>([1, 2]);
</script>

<template>
<div style="max-width: 760px">
  <ArTable :columns="columns" :rows="rows" row-key="id" caption="シフトの一覧" selectable v-model:selected="selected">
    <template #actions="{ row }">
      <ArButton tone="muted" size="sm" icon="pen" :label="`${row.name}を変更`" />
      <ArButton tone="danger-ghost" size="sm" icon="trash" :label="`${row.name}を削除`" />
    </template>
  </ArTable>
</div>
</template>
