<!-- シフト詳細の勤務メンバー（行の中の追加・2段の見出し・休憩の段） | 名前の列は cell-name のスロットで「追加の行」だけ選ぶ入力に差し替え、ほかの行は引数の Default で既定の表示（頭文字の丸・名前・色の四角つきの sub）のまま。シフト／勤怠（打刻）／休憩は columnGroups の2段の見出し。休憩を分けて持つ会社は、休始・休終の列を lines（段に分ける列）にして、1行に2つ以上の休憩を段で並べる（ほかの列は段をまたぐ）。追加・編集の行は editor="time" で表の中に時刻の入力。並べ替えは v-model:sort（状態は製品が持つので、画面を移っても製品の store に置けば保てる）。 -->
<script setup lang="ts">
import { ArButton, ArSelect, ArTable, type ArTableColumn, type ArTableColumnGroup, type ArTableEditValue, type ArTableSort } from "@arrow/ui";
import { computed, ref } from "vue";

type Row = { id: number | "new"; name: string; pattern?: string; color?: string; start: string | null; end: string | null; in: string | null; out: string | null; bs: (string | null)[]; be: (string | null)[] };
const people = [
  { value: 11, label: "千速 一真" },
  { value: 12, label: "末永 修也" },
  { value: 13, label: "新里 匠" },
  { value: 14, label: "中口 万由香" },
  { value: 15, label: "小林 早紀" },
];
const base: Row[] = [
  { id: 1, name: "末永 修也", pattern: "通常勤務1", color: "#4C5FC4", start: "09:00", end: "18:00", in: "08:56", out: "18:04", bs: ["12:00"], be: ["13:00"] },
  { id: 2, name: "新里 匠", pattern: "通常勤務2", color: "#D2483F", start: "10:00", end: "22:00", in: "09:58", out: null, bs: ["13:00", "17:30"], be: ["13:45", "18:00"] },
  { id: 3, name: "中口 万由香", pattern: "早番", color: "#2E9E6B", start: "07:00", end: "13:00", in: "06:55", out: "13:02", bs: [], be: [] },
];
const adding = ref(true);
const newPerson = ref<number | null>(null);
const sort = ref<ArTableSort | null>({ key: "start", order: "asc" });
const edits = ref<Record<string, ArTableEditValue>>({});
const editing = (r: Row) => r.id === "new";

const sorted = computed(() => {
  const s = sort.value;
  const list = [...base];
  if (s) list.sort((a, b) => String(a[s.key as keyof Row] ?? "").localeCompare(String(b[s.key as keyof Row] ?? "")) * (s.order === "asc" ? 1 : -1));
  return list;
});
const empty: Row = { id: "new", name: "", start: null, end: null, in: null, out: null, bs: [null], be: [null] };
const rows = computed(() => (adding.value ? [empty, ...sorted.value] : sorted.value));

const groups: ArTableColumnGroup[] = [
  { key: "shift", title: "シフト" },
  { key: "punch", title: "勤怠（打刻）" },
  { key: "break", title: "休憩" },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "名前", width: 170, sortable: true, sticky: true, avatar: (r) => ({ seed: Number(r.id) || 0 }), sub: (r) => (r.pattern ? { text: r.pattern, color: r.color } : undefined) },
  { key: "start", title: "開始", group: "shift", width: 96, emphasis: "strong", sortable: true, edit: editing, editor: "time" },
  { key: "end", title: "終了", group: "shift", width: 96, emphasis: "strong", sortable: true, edit: editing, editor: "time", overnight: true },
  { key: "in", title: "出勤", group: "punch", width: 132, sortable: true, edit: editing, editor: "time", dayShift: true },
  { key: "out", title: "退勤", group: "punch", width: 132, sortable: true, edit: editing, editor: "time", dayShift: true },
  { key: "bs", title: "休始", group: "break", width: 132, emphasis: "muted", lines: true, edit: editing, editor: "time", dayShift: true },
  { key: "be", title: "休終", group: "break", width: 132, emphasis: "muted", lines: true, edit: editing, editor: "time", dayShift: true },
];
const footer = { name: { label: "出勤", value: "3名" }, start: { label: "シフト合計", value: "27時間00分", span: 2 }, in: { label: "打刻合計", value: "25時間17分", span: 2 } };
</script>

<template>
  <div style="max-width: 1040px; background: #fff; padding: 16px; border-radius: 18px">
    <ArTable v-model:sort="sort" v-model:edits="edits" :columns="columns" :column-groups="groups" :rows="rows" row-key="id" caption="勤務メンバー" variant="board" :footer="footer">
      <template v-if="!adding" #before-rows><ArButton tone="dashed" block icon="plus" @click="adding = true">シフト追加</ArButton></template>
      <template #cell-name="{ row, Default }">
        <ArSelect v-if="row.id === 'new'" v-model="newPerson" :options="people" size="sm" block placeholder="社員を選ぶ" label="追加する社員" searchable />
        <component :is="Default" v-else />
      </template>
      <template #actions="{ row }">
        <template v-if="row.id === 'new'">
          <ArButton tone="muted" size="sm" icon="x" label="追加をやめる" @click="adding = false" />
          <ArButton tone="primary" size="sm" icon="check" label="追加する" @click="adding = false" />
        </template>
        <template v-else>
          <ArButton tone="muted" size="sm" icon="pen" :label="`${row.name}を変更`" />
          <ArButton tone="muted" size="sm" icon="trash" :label="`${row.name}を削除`" />
        </template>
      </template>
    </ArTable>
  </div>
</template>
