<!-- 集計表：3段の金額・右に止める列・見出しの列から開く（年末調整） | 1人の行に「課税支給／社会保険料等／所得税」の3段（stack）。「＋ 合計」を押すと月ごとの列が開き、上に「給与」「賞与」の段（toggles）。右端の「反映」は sticky: "end" で止める。一括編集では3段の入力（高さ24・右寄せ）。 -->
<script setup lang="ts">
import { ArButton, ArTable, ArThemeScope, type ArTableColumn, type ArTableColumnGroup } from "@arrow/ui";
import { computed, ref } from "vue";

type Row = { id: string; code: string; name: string; kind: string; months: [number, number, number]; sums: [number, number, number]; state: string };
const rows: Row[] = [
  { id: "a", code: "0002", name: "千速 一真", kind: "役員", months: [430691, 62039, 16371], sums: [5640000, 812420, 214380], state: "反映" },
  { id: "b", code: "0005", name: "新里 匠", kind: "社員", months: [273870, 39148, 6466], sums: [3612390, 512653, 85972], state: "回答待ち" },
  { id: "c", code: "0008", name: "末永 修也", kind: "社員", months: [298735, 43297, 7342], sums: [3912000, 566980, 96140], state: "強制反映" },
];
const yen = (n: number) => n.toLocaleString("ja-JP");
const open = ref<string[]>([]);
const editing = ref(false);
const edits = ref<Record<string, string>>({ "b:sum:0": "3,612,390", "b:sum:2": "85,972" });
const MON = Array.from({ length: 6 }, (_, i) => `${i + 1}月`);
const groups: ArTableColumnGroup[] = [{ key: "pay", title: "給与" }, { key: "bonus", title: "賞与" }];
const columns = computed<ArTableColumn<Row>[]>(() => [
  { key: "code", title: "コード", width: 64, sticky: true, emphasis: "muted" },
  { key: "name", title: "氏名", width: 132, sticky: true, emphasis: "strong" },
  { key: "kind", title: "区分", width: 88, emphasis: "muted" },
  { key: "item", title: "項目", width: 100, stack: true, emphasis: "note", value: () => ["課税支給", "社会保険料等", "所得税"] },
  ...MON.map((m, i): ArTableColumn<Row> => ({ key: `m${i}`, title: m, group: "pay", show: "open", numeric: true, stack: true, width: 92, value: (r) => r.months.map(yen) })),
  ...["1回", "2回"].map((m, i): ArTableColumn<Row> => ({ key: `b${i}`, title: m, group: "bonus", show: "open", numeric: true, stack: true, width: 92, value: () => ["", "", ""] })),
  {
    key: "sum", title: "合計", toggles: ["pay", "bonus"], numeric: true, stack: true, width: 124, emphasis: "strong",
    value: (r) => r.sums.map(yen), edit: (r) => editing.value && r.state !== "反映済", editLabel: (r, j) => `${r.name} ${["課税支給", "社会保険料等", "所得税"][j ?? 0]}の合計`,
  },
  { key: "ins", title: "保険料等", numeric: true, width: 110, value: () => "86,400" },
  { key: "money", title: "年末調整額", numeric: true, width: 110, emphasis: "strong", value: (r) => (r.id === "a" ? "18,240" : "3,120") },
  { key: "state", title: "反映", sticky: "end", width: 120, align: "center" },
]);
</script>

<template>
<ArThemeScope palette="yellow">
  <div style="margin-bottom: 10px"><ArButton :tone="editing ? 'secondary' : 'subtle'" size="sm" icon="pen" @click="editing = !editing">{{ editing ? "変更をやめる" : "一括編集" }}</ArButton></div>
  <div style="width: 960px; max-width: 100%">
    <ArTable v-model:open-groups="open" v-model:edits="edits" :columns="columns" :column-groups="groups" :rows="rows" row-key="id" caption="年末調整" />
  </div>
</ArThemeScope>
</template>
