<!-- 行のドラッグ並べ替え（sortableRows） | 勤務種別やシフトパターンのように、並び順そのものを決める表。つまみ ⠿ をつかんで上下へ動かすか、つまみにフォーカスして Alt+↑↓。並べた行は v-model:rows で受け取り、reorder（key・from・to）で保存する。つまみの置き場所はデザインが決める（remix は左の専用の列、classic は今の ARROW と同じ1列目の頭）。 -->
<script setup lang="ts">
import { ArButton, ArTable, type ArTableColumn, type ArTableReorder } from "@arrow/ui";
import { ref } from "vue";
type Row = { id: number; name: string; time: string; rest: string };
const rows = ref<Row[]>([
  { id: 1, name: "早番", time: "09:00〜18:00", rest: "12:00〜13:00" },
  { id: 2, name: "遅番", time: "13:00〜22:00", rest: "17:00〜18:00" },
  { id: 3, name: "夜勤", time: "22:00〜07:00", rest: "なし" },
  { id: 4, name: "短時間", time: "10:00〜14:00", rest: "なし" },
]);
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "名称", width: 160, emphasis: "strong" },
  { key: "time", title: "時間", width: 160 },
  { key: "rest", title: "休憩" },
];
const last = ref<ArTableReorder | null>(null);
</script>

<template>
  <ArTable v-model:rows="rows" sortable-rows :columns="columns" row-key="id" caption="勤務種別" @reorder="last = $event">
    <template #before-rows><ArButton tone="dashed" icon="plus">勤務種別を追加</ArButton></template>
    <template #actions="{ row }">
      <ArButton tone="edit" icon="pen" :label="`${row.name}を編集`" />
      <ArButton tone="danger" icon="trash" :label="`${row.name}を削除`" />
    </template>
  </ArTable>
  <p style="margin: 10px 0 0; font-size: 12px; color: #888">
    並び：{{ rows.map((r) => r.name).join("・") }}<span v-if="last">（{{ last.from + 1 }} 番目を {{ last.to + 1 }} 番目へ）</span>
  </p>
</template>
