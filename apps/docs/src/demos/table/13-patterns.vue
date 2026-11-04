<!-- シフトパターンの一覧（ダイアログの表：並べ替え・行の編集・1つのセルに複数の時間の組） | 今の SortableTable の置き換え。sortable-rows でつまみをドラッグ（Alt+↑↓）すると reorder と v-model:rows。editing に行の key を入れるとその行だけ入力になり（名前は editor="text"、シフト・勤怠・休憩は editor="time-range"：最後の組を埋めると下に空の組、× で消す）、右端の［取り消し］［確定］（Esc・Ctrl+Enter）で cancel・commit。「パターン追加」は #before-rows のボタンで先頭に空の行を足して editing に入れる。 -->
<script setup lang="ts">
import { ArButton, ArColorPicker, ArTable, type ArRowKey, type ArTableColumn, type ArTableEditValue, type ArTableRowEdit, type ArTableTimeRange } from "@arrow/ui";
import { computed, ref } from "vue";

type Pattern = { id: number | "new"; name: string; color: string; shift: ArTableTimeRange[]; punch: ArTableTimeRange[]; rest: ArTableTimeRange[] };
const r = (start: string, end: string): ArTableTimeRange => ({ start, end });
const patterns = ref<Pattern[]>([
  { id: 1, name: "通常勤務1", color: "#2F6BDA", shift: [r("10:00", "19:00")], punch: [r("10:00", "19:00")], rest: [r("12:00", "13:00")] },
  { id: 2, name: "通常勤務2", color: "#E06A3E", shift: [r("09:00", "18:00")], punch: [r("09:00", "18:00")], rest: [r("12:00", "13:00")] },
  { id: 3, name: "早番", color: "#2E9A6B", shift: [r("07:00", "13:00")], punch: [r("07:00", "13:00")], rest: [] },
  { id: 4, name: "中抜け", color: "#8E6BC4", shift: [r("09:00", "13:00"), r("17:00", "21:00")], punch: [r("09:00", "13:00"), r("17:00", "21:00")], rest: [] },
  { id: 5, name: "夜勤", color: "#6E6866", shift: [r("22:00", "31:00")], punch: [r("22:00", "31:00")], rest: [r("26:00", "27:00")] },
]);
const adding = ref(false);
const editing = ref<ArRowKey[]>([]);
const edits = ref<Record<string, ArTableEditValue>>({});
const colors = ref<Record<string, string>>({});
const blankRow: Pattern = { id: "new", name: "", color: "#2F6BDA", shift: [], punch: [], rest: [] };
const rows = computed(() => (adding.value ? [blankRow, ...patterns.value] : patterns.value));

const columns: ArTableColumn<Pattern>[] = [
  { key: "name", title: "パターン名", width: 260, editor: "text", placeholder: "パターン名" },
  { key: "shift", title: "シフト", editor: "time-range", overnight: true },
  { key: "punch", title: "勤怠（打刻）", editor: "time-range", overnight: true },
  { key: "rest", title: "休憩", editor: "time-range", overnight: true },
];
function startAdd() {
  adding.value = true;
  editing.value = ["new"];
}
function onCommit(e: ArTableRowEdit<Pattern>) {
  const v = e.values as { name?: string; shift?: ArTableTimeRange[]; punch?: ArTableTimeRange[]; rest?: ArTableTimeRange[] };
  const next = { ...e.row, name: String(v.name ?? e.row.name), shift: v.shift ?? e.row.shift, punch: v.punch ?? e.row.punch, rest: v.rest ?? e.row.rest, color: colors.value[String(e.key)] ?? e.row.color };
  if (e.key === "new") patterns.value = [{ ...next, id: Math.max(...patterns.value.map((p) => Number(p.id))) + 1 }, ...patterns.value];
  else patterns.value = patterns.value.map((p) => (p.id === e.key ? next : p));
  done(e.key);
}
function done(key: ArRowKey) {
  const prefix = `${key}:`;
  edits.value = Object.fromEntries(Object.entries(edits.value).filter(([k]) => !k.startsWith(prefix)));
  editing.value = editing.value.filter((k) => k !== key);
  if (key === "new") adding.value = false;
}
const order = ref("");
</script>

<template>
  <div style="max-width: 860px">
    <ArTable
      v-model:edits="edits"
      :editing="editing"
      :columns="columns"
      :rows="rows"
      row-key="id"
      caption="シフトパターン"
      sortable-rows
      blank="なし"
      @update:rows="(list) => (patterns = list.filter((p) => p.id !== 'new'))"
      @commit="onCommit"
      @cancel="(e) => done(e.key)"
      @reorder="(m) => (order = `${m.from + 1} 番目を ${m.to + 1} 番目へ（製品は ids の順で保存）`)"
    >
      <template #before-rows><ArButton tone="dashed" block icon="plus" :disabled="adding || editing.length > 0" @click="startAdd">パターンを追加</ArButton></template>
      <template #cell-name="{ row, Default }">
        <span v-if="!editing.includes(row.id)" style="display: inline-flex; align-items: center; gap: 10px; font-weight: 700"
          ><i :style="{ width: '6px', height: '22px', borderRadius: '3px', background: row.color }" />{{ row.name }}</span
        >
        <span v-else style="display: inline-flex; align-items: center; gap: 8px">
          <ArColorPicker :model-value="colors[String(row.id)] ?? row.color" label="パターンの色" @update:model-value="(c) => (colors[String(row.id)] = c)" />
          <component :is="Default" />
        </span>
      </template>
      <template #actions="{ row }">
        <ArButton tone="muted" size="sm" icon="pen" :label="`${row.name}を変更`" :disabled="editing.length > 0" @click="editing = [row.id]" />
        <ArButton tone="muted" size="sm" icon="trash" :label="`${row.name}を削除`" :disabled="editing.length > 0" @click="patterns = patterns.filter((p) => p !== row)" />
      </template>
    </ArTable>
    <p style="margin: 10px 0 0; font-size: 12px">{{ order || "つまみをドラッグで並べ替えできます" }}</p>
  </div>
</template>
