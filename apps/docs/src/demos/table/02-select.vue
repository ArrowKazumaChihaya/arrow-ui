<!-- 選ぶ・開く・セルを差し替え | selectable と expandable。#cell-<key> で1列だけ見た目を変える。 -->
<script setup lang="ts">
import { ArTable, ArTag, type ArTableColumn, type ArTableSort } from "@arrow/ui";
import { computed, ref } from "vue";
type Row = { id: number; name: string; store: string; start: string; end: string; minutes: number; cost: number };
const rows: Row[] = [
  { id: 1, name: "佐藤 美咲", store: "渋谷店", start: "09:00", end: "18:00", minutes: 480, cost: 9600 },
  { id: 2, name: "田中 健", store: "新宿店", start: "13:00", end: "22:00", minutes: 480, cost: 10400 },
  { id: 3, name: "山本 葵", store: "渋谷店", start: "17:00", end: "22:00", minutes: 300, cost: 6000 },
  { id: 4, name: "鈴木 大地", store: "池袋店", start: "10:00", end: "15:00", minutes: 300, cost: 5500 },
];
const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 140, sticky: true, sortable: true },
  { key: "store", title: "所属", width: 110 },
  { key: "start", title: "開始", width: 90, sortable: true },
  { key: "end", title: "終了", width: 90 },
  { key: "minutes", title: "時間", align: "end", width: 90, value: (r) => hm(r.minutes) },
  { key: "cost", title: "人件費", align: "end", width: 110, value: (r) => yen(r.cost), sortable: true },
];
const selected = ref<(string | number)[]>([1]);
const expanded = ref<(string | number)[]>([]);
</script>

<template>
<ArTable :columns="columns" :rows="rows" row-key="id" caption="選べる表" selectable v-model:selected="selected" expandable v-model:expanded="expanded" density="compact">
  <template #cell-store="{ row }"><ArTag size="sm" tone="accent">{{ row.store }}</ArTag></template>
  <template #expanded="{ row }">{{ row.name }} さんの休憩：12:00〜13:00</template>
</ArTable>
</template>
