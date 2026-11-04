<!-- 横につなぐセル・行ぜんぶの案内（今の UiTableCell の colspan） | 列の colSpan(row, index) が数を返すと右の列をその数だけまたぎ、またがれた列は出さない（勤怠の時間帯の列をまとめるセル）。止めた列（名前）と止めない列をまたぐセルは止めない。fullRow の行は #full-row で1行いっぱいの案内（チェック・操作の列もまたぐ）。段（lines）・rowSpan・入力の行（editing）と一緒に使える。 -->
<script setup lang="ts">
import { ArButton, ArTable, type ArRowKey, type ArTableColumn } from "@arrow/ui";
import { ref } from "vue";

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
type Row = { id: string; name: string; dept?: string; note?: string; blocks?: { from: number; to: number; label: string }[]; memo?: string[]; info?: string };
const rows: Row[] = [
  { id: "info", name: "", info: "11月3日（祝）は店舗の休業日です。勤務のある人だけ表示しています。" },
  { id: "a", name: "末永 修也", dept: "ホール", blocks: [{ from: 10, to: 19, label: "勤務 10:00〜19:00" }], memo: ["12:00〜13:00 休憩"] },
  { id: "b", name: "新里 匠", dept: "ホール", blocks: [{ from: 9, to: 13, label: "勤務 9:00〜13:00" }, { from: 17, to: 19, label: "勤務 17:00〜" }], memo: ["中抜け", "17:00 から再開"] },
  { id: "c", name: "中口 万由香", dept: "キッチン", note: "有給（全日）", memo: [] },
];
/** 時間帯の列：その時刻から始まる帯があれば帯の長さだけつなぐ（今の Daily の :colspan="time.colspan"）。 */
const blockAt = (r: Row, h: number) => r.blocks?.find((b) => b.from === h);
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "名前", width: 120, sticky: true },
  { key: "dept", title: "部署", width: 80, rowSpan: (r, i) => (r.dept === "ホール" ? (i === 1 ? 2 : 0) : 1) },
  ...hours.map<ArTableColumn<Row>>((h) => ({
    key: `h${h}`,
    title: `${h}時`,
    width: 64,
    align: "center",
    // 有給の行は時間帯の列をぜんぶつなぐ。帯のある行は帯の長さだけつなぐ
    colSpan: (r) => (r.note ? (h === 9 ? hours.length : 1) : (blockAt(r, h) ? Math.min(blockAt(r, h)!.to, 19) - h : 1)),
    value: (r) => (r.note ? (h === 9 ? r.note : "") : (blockAt(r, h)?.label ?? "")),
  })),
  { key: "memo", title: "メモ", width: 140, lines: true, editor: "text" },
];
const editing = ref<ArRowKey[]>([]);
</script>

<template>
  <div style="max-width: 1040px">
    <ArTable :columns="columns" :rows="rows" row-key="id" caption="今日の勤務" :full-row="(r) => r.id === 'info'" :editing="editing" blank="" @commit="editing = []" @cancel="editing = []">
      <template #full-row="{ row }">{{ row.info }}</template>
      <template v-for="h in hours" :key="h" #[`cell-h${h}`]="{ row, value }">
        <span v-if="value" :style="{ display: 'block', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, background: row.note ? '#F2F3F5' : 'var(--ar-accent-subtle)', color: row.note ? '#66727F' : 'var(--ar-accent-ink)' }">{{ value }}</span>
      </template>
      <template #actions="{ row }"><ArButton tone="muted" size="sm" icon="pen" :label="`${row.name}のメモを変更`" :disabled="editing.length > 0" @click="editing = [row.id]" /></template>
    </ArTable>
  </div>
</template>
