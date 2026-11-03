<!-- 並べ替え・合計・数字の列 | 並べ替えの状態は v-model:sort で受け取り、並べ替え自体は製品が行う（サーバーで並べることもあるため）。numeric の列は右寄せ・等幅。合計の行は footer。 -->
<script setup lang="ts">
import { ArTable, type ArTableColumn, type ArTableSort } from "@arrow/ui";
import { computed, ref } from "vue";
type Row = { id: number; name: string; store: string; start: string; end: string; minutes: number; cost: number };
const rows: Row[] = [
  { id: 1, name: "佐藤 美咲", store: "渋谷店", start: "09:00", end: "18:00", minutes: 480, cost: 9600 },
  { id: 2, name: "田中 健", store: "新宿店", start: "13:00", end: "22:00", minutes: 480, cost: 10400 },
  { id: 3, name: "山本 葵", store: "渋谷店", start: "17:00", end: "22:00", minutes: 300, cost: 6000 },
];
const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 160, sortable: true },
  { key: "store", title: "所属", width: 140 },
  { key: "start", title: "開始", width: 110, numeric: true, align: "start", sortable: true },
  { key: "end", title: "終了", width: 110, numeric: true, align: "start" },
  { key: "minutes", title: "時間", numeric: true, width: 90, value: (r) => hm(r.minutes) },
  { key: "cost", title: "人件費", numeric: true, width: 120, value: (r) => yen(r.cost), sortable: true },
];
const sort = ref<ArTableSort | null>({ key: "name", order: "asc" });
const sorted = computed(() => {
  const s = sort.value;
  if (!s) return rows;
  const k = s.key as keyof Row;
  return [...rows].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (s.order === "asc" ? 1 : -1));
});
const footer = { name: `合計 ${rows.length}名`, minutes: hm(rows.reduce((s, r) => s + r.minutes, 0)), cost: yen(rows.reduce((s, r) => s + r.cost, 0)) };
</script>

<template>
<ArTable :columns="columns" :rows="sorted" row-key="id" caption="人件費" :footer="footer" v-model:sort="sort" />
</template>
