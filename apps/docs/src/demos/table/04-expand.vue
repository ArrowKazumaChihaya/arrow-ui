<!-- 開く行・左の固定・薄い行・詰めた表 | expandable で行の下に #expanded を開く。sticky の列は横にスクロールしても残る。rowOff で薄く出す（シフトなし・ロック中）。density="compact" は詰めた表。 -->
<script setup lang="ts">
import { ArTable, ArTag, type ArTableColumn } from "@s_and_a/arrow-ui";
import { ref } from "vue";
type Row = { id: number; name: string; store: string; start: string; end: string; minutes: string; off?: boolean };
const rows: Row[] = [
  { id: 1, name: "佐藤 美咲", store: "渋谷店", start: "09:00", end: "18:00", minutes: "8:00" },
  { id: 2, name: "田中 健", store: "新宿店", start: "13:00", end: "22:00", minutes: "8:00" },
  { id: 3, name: "山本 葵", store: "渋谷店", start: "", end: "", minutes: "", off: true },
  { id: 4, name: "鈴木 大地", store: "池袋店", start: "10:00", end: "15:00", minutes: "5:00" },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 150, sticky: true, avatar: true },
  { key: "store", title: "所属", width: 140 },
  { key: "start", title: "開始", width: 160, numeric: true, align: "start" },
  { key: "end", title: "終了", width: 160, numeric: true, align: "start" },
  { key: "minutes", title: "時間", width: 160, numeric: true },
];
const selected = ref<(string | number)[]>([2]);
const expanded = ref<(string | number)[]>([2]);
</script>

<template>
<div style="display: grid; gap: 20px; max-width: 640px">
  <ArTable :columns="columns" :rows="rows" row-key="id" caption="開く表" selectable v-model:selected="selected" expandable v-model:expanded="expanded" :row-off="(r) => !!r.off">
    <template #cell-store="{ row }"><ArTag size="sm" tone="accent">{{ row.store }}</ArTag></template>
    <template #expanded="{ row }">{{ row.name }} さん：休憩 12:00〜13:00、打刻 08:58〜18:03</template>
  </ArTable>
  <ArTable :columns="columns" :rows="rows" row-key="id" caption="詰めた表" density="compact" />
</div>
</template>
