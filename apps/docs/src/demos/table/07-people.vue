<!-- 名前だけの列・補足の文（勤務可能な人） | avatar を付けて sub を付けない列は、丸を 28px に・名前をさらに太く（board）。emphasis="note" は少し小さな補足の文（備考）。行の右端に ArButton size="xs"（「シフトに入れる」「登録済み」）とアイコンのボタン。 -->
<script setup lang="ts">
import { ArButton, ArTable, type ArTableColumn } from "@arrow/ui";
type Row = { id: number; name: string; tone: "purple" | "yellow"; start: string[]; end: string[]; note: string; added: boolean };
const rows: Row[] = [
  { id: 3, name: "中口 万由香", tone: "purple", start: ["10:00"], end: ["15:00"], note: "午後は通院のため早めに上がりたいです", added: true },
  { id: 4, name: "松田 照恵", tone: "yellow", start: ["10:00", "17:00"], end: ["13:00", "22:00"], note: "昼と夜に分けて入れます", added: false },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "名前", width: 192, avatar: (r) => ({ tone: r.tone }) },
  { key: "start", title: "開始", width: 60, emphasis: "strong", numeric: true, align: "start" },
  { key: "end", title: "終了", width: 60, emphasis: "strong", numeric: true, align: "start" },
  { key: "note", title: "備考", emphasis: "note" },
];
</script>

<template>
<div style="max-width: 775px; background: #fff; padding: 16px; border-radius: 18px">
<ArTable :columns="columns" :rows="rows" row-key="id" caption="勤務可能な人" variant="board">
  <template #actions="{ row }">
    <ArButton v-if="row.added" tone="subtle" size="xs" icon="plus" disabled>登録済み</ArButton>
    <ArButton v-else tone="subtle" size="xs" icon="plus">シフトに入れる</ArButton>
    <ArButton tone="muted" size="sm" icon="eyeoff" :label="`${row.name}を隠す`" />
  </template>
</ArTable>
</div>
</template>
