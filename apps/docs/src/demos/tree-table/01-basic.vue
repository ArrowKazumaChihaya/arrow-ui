<!-- 店舗の一覧（動かせる木） | 1列目が木。開け閉め・字下げ・つなぎの線。draggable でつまみ ⠿ をつかみ、行の上（前）・まん中（子に）・下（後）へ動かす。キーボードはつまみで Alt+↑↓（前後）・Alt+→（すぐ上の行の子に）・Alt+←（親の外へ）。動かした後の木は v-model:rows、動かした1行は drop で受け取る。行では ↑↓→← で移り・開け閉めする。 -->
<script setup lang="ts">
import { ArButton, ArTreeTable, type ArTreeTableDrop } from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";
type Row = { id: number; name: string; code: string; staff: number; children?: Row[] };
const rows = ref<Row[]>([
  { id: 1, name: "本社", code: "HQ", staff: 12, children: [{ id: 11, name: "営業部", code: "S01", staff: 5 }, { id: 12, name: "総務部", code: "S02", staff: 4, children: [{ id: 121, name: "人事課", code: "S021", staff: 2 }] }] },
  { id: 2, name: "渋谷店", code: "SB", staff: 18 },
  { id: 3, name: "新宿店", code: "SJ", staff: 15 },
]);
const count = (list: Row[]): number => list.reduce((n, r) => n + 1 + count(r.children ?? []), 0);
const footer = computed(() => ({ name: "店舗数", code: count(rows.value) }));
const columns = [
  { key: "name", title: "店舗名" },
  { key: "code", title: "コード", width: 120 },
  { key: "staff", title: "人数", width: 90, numeric: true, value: (r: Row) => `${r.staff}名` },
];
const last = ref<ArTreeTableDrop | null>(null);
</script>

<template>
  <ArTreeTable v-model:rows="rows" draggable :columns="columns" row-key="id" caption="店舗" :footer="footer" @drop="last = $event">
    <template #before-rows><ArButton tone="dashed" icon="plus">店舗を追加</ArButton></template>
    <template #actions="{ row }">
      <ArButton tone="edit" icon="pen" :label="`${row.name}を編集`" />
      <ArButton tone="danger" icon="trash" :label="`${row.name}を削除`" />
    </template>
  </ArTreeTable>
  <p v-if="last" style="margin: 10px 0 0; font-size: 12px; color: #888">動かした：{{ last.key }} → {{ last.target }} の{{ { before: "前", after: "後", inside: "中" }[last.position] }}</p>
</template>
