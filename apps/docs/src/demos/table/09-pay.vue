<!-- 集計表：左に止める列・2段の見出し・押して開く内訳・表の中の金額の入力・前月との差（給与一覧） | 左の「コード」「氏名」は sticky で止め、端に影。「支給」「控除」の見出しを押すと内訳の列が開き、2段の見出しになる（column-groups・v-model:open-groups）。一括編集では金額を表の中で直し（edit・v-model:edits）、直した欄は黄色。差引支給額の下に前月との差（delta）。 -->
<script setup lang="ts">
import { ArButton, ArTable, ArTag, ArThemeScope, type ArTableColumn, type ArTableColumnGroup } from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";

type Row = { id: string; code: string; name: string; kind: string; store: string; base: number; over: number; holiday: number; night: number; paid: number; health: number; pension: number; tax: number; prev: number; lock: string };
const rows: Row[] = [
  { id: "0002", code: "0002", name: "千速 一真", kind: "役員", store: "ARROW事業部", base: 500000, over: 0, holiday: 0, night: 0, paid: 0, health: 24950, pension: 45750, tax: 68120, prev: 361180, lock: "勤怠ロック" },
  { id: "0003", code: "0003", name: "末永 修也", kind: "社員", store: "ARROW事業部", base: 260000, over: 21840, holiday: 0, night: 1950, paid: 0, health: 14970, pension: 27450, tax: 29344, prev: 222000, lock: "勤怠ロック" },
  { id: "0005", code: "0005", name: "新里 匠", kind: "社員", store: "ARROW事業部", base: 280000, over: 32450, holiday: 9600, night: 4200, paid: 0, health: 17465, pension: 32025, tax: 54653, prev: 236200, lock: "勤怠ロック" },
  { id: "0014", code: "0014", name: "中口 万由香", kind: "社員", store: "ARROW事業部", base: 253000, over: 18600, holiday: 0, night: 0, paid: 11500, health: 14970, pension: 27450, tax: 23267, prev: 230100, lock: "勤怠ロック" },
  { id: "0017", code: "0017", name: "松田 照恵", kind: "パート・アルバイト", store: "ARROW事業部", base: 118800, over: 0, holiday: 0, night: 2160, paid: 8640, health: 0, pension: 0, tax: 25092, prev: 109600, lock: "勤怠ロック" },
];
const yen = (n: number) => n.toLocaleString("ja-JP");
const A = ["base", "over", "holiday", "night", "paid"] as const;
const D = ["health", "pension", "tax"] as const;
const open = ref<string[]>([]);
const editing = ref(false);
const edits = ref<Record<string, string>>({ "0003:over": "24,960", "0017:paid": "10,800" });
const num = (r: Row, k: (typeof A)[number] | (typeof D)[number]) => {
  const e = edits.value[`${r.id}:${k}`];
  const n = e === undefined ? r[k] : Number(e.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const sumA = (r: Row) => A.reduce((s, k) => s + num(r, k), 0);
const sumD = (r: Row) => D.reduce((s, k) => s + num(r, k), 0);
const real = (r: Row) => sumA(r) - sumD(r);
const money = (k: (typeof A)[number] | (typeof D)[number], title: string, group: string): ArTableColumn<Row> => ({
  key: k, title, group, show: "open", numeric: true, width: editing.value ? 118 : 104,
  value: (r) => yen(r[k]), edit: () => editing.value, editLabel: (r) => `${r.name}さんの${title}`,
});
const groups: ArTableColumnGroup[] = [
  { key: "a", title: "支給", collapsible: true },
  { key: "d", title: "控除", collapsible: true },
];
const columns = computed<ArTableColumn<Row>[]>(() => [
  { key: "code", title: "コード", width: 74, sticky: true, sortable: true, emphasis: "muted" },
  { key: "name", title: "氏名", width: 172, sticky: true, sortable: true, avatar: (r) => ({ seed: r.id }) },
  { key: "kind", title: "区分", width: 120, emphasis: "muted" },
  { key: "store", title: "部署/店舗", width: 130, emphasis: "muted" },
  money("base", "基本給", "a"), money("over", "残業手当", "a"), money("holiday", "休日手当", "a"), money("night", "深夜手当", "a"), money("paid", "有給手当", "a"),
  { key: "sumA", title: "合計", group: "a", show: "open", total: true, numeric: true, width: 104, value: (r) => yen(sumA(r)) },
  { key: "a", title: "支給", group: "a", show: "closed", numeric: true, width: 104, emphasis: "strong", value: (r) => yen(sumA(r)) },
  money("health", "健康保険", "d"), money("pension", "厚生年金", "d"), money("tax", "所得税", "d"),
  { key: "sumD", title: "合計", group: "d", show: "open", total: true, numeric: true, width: 104, value: (r) => yen(sumD(r)) },
  { key: "d", title: "控除", group: "d", show: "closed", numeric: true, width: 104, emphasis: "strong", value: (r) => yen(sumD(r)) },
  {
    key: "real", title: "差引支給額", numeric: true, width: 120, emphasis: "strong", value: (r) => yen(real(r)),
    delta: (r) => { const d = real(r) - r.prev; return { text: `${d >= 0 ? "+" : ""}${yen(d)}（前月比）`, tone: Math.abs(d) / r.prev >= 0.1 ? "warn" : "muted" }; },
  },
  { key: "lock", title: "状態", width: 110 },
]);
const footer = computed(() => {
  const f: Record<string, string | { value: string; span: number }> = { code: { value: "ARROW事業部合計", span: 4 } };
  for (const k of [...A, ...D]) f[k] = yen(rows.reduce((s, r) => s + num(r, k), 0));
  f.sumA = f.a = yen(rows.reduce((s, r) => s + sumA(r), 0));
  f.sumD = f.d = yen(rows.reduce((s, r) => s + sumD(r), 0));
  f.real = yen(rows.reduce((s, r) => s + real(r), 0));
  f.lock = `${rows.length}名`;
  return f;
});
const changed = computed(() => Object.entries(edits.value).filter(([k, v]) => { const [id, c] = k.split(":"); const r = rows.find((x) => x.id === id); return r && v !== yen(r[c as (typeof A)[number]]); }).length);
</script>

<template>
<ArThemeScope palette="yellow">
  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px">
    <ArButton :tone="editing ? 'secondary' : 'subtle'" size="sm" icon="pen" @click="editing = !editing; open = editing ? ['a'] : []">{{ editing ? "編集をやめる" : "一括編集" }}</ArButton>
    <span v-if="editing" style="font-size: 12.5px">直した欄は黄色（{{ changed }}か所）</span>
  </div>
  <div style="width: 1100px; max-width: 100%">
    <ArTable v-model:open-groups="open" v-model:edits="edits" :columns="columns" :column-groups="groups" :rows="rows" row-key="id" caption="給与一覧" :footer="footer">
      <template #cell-lock="{ value }"><ArTag tone="warn" shape="pill" size="sm" icon="lock">{{ value }}</ArTag></template>
    </ArTable>
  </div>
</ArThemeScope>
</template>
