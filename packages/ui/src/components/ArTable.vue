<script setup lang="ts" generic="Row extends object">
/**
 * ArTable 1.0 — 表。
 * box（外枠の中の一覧）と board（シフト画面の「勤務メンバー」「勤務可能な人」）の2つの形。
 * 見出しの固定・左の列の固定・選ぶ・開く・合計の行・名前の列（頭文字の丸）・行の右端の操作を部品として持つ。
 * 並べ替えの印を押すと update:sort を出すだけで、データの並べ替えは製品が行う。
 * ページ送りは #below に ArPagination を置く。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import ArAvatar from "./ArAvatar.vue";
import ArEmpty from "./ArEmpty.vue";
import ArIcon from "./ArIcon.vue";
import { useDesignForm } from "../provider/context";
import type { ArRowKey, ArTableAvatar, ArTableColumn, ArTableFooterValue, ArTableLabels, ArTableProps, ArTableSort } from "./ArTable.contract";

const props = withDefaults(defineProps<ArTableProps<Row>>(), {
  variant: "box",
  selectable: false,
  selected: () => [],
  sort: null,
  expandable: false,
  expanded: () => [],
  footer: null,
  stickyHeader: true,
  density: "regular",
  emptyText: "データがありません",
  emptyIcon: undefined,
  blank: "—",
  rowOff: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{
  "update:selected": [keys: ArRowKey[]];
  "update:sort": [sort: ArTableSort | null];
  "update:expanded": [keys: ArRowKey[]];
  "row-click": [row: Row, index: number];
}>();
const slots = useSlots();

/** 形（ArDesign.forms.ArTable.selectHead）：label は見出しのチェックの左に「全選択」の文字を出す。 */
const selectHead = useDesignForm<"check" | "label">("ArTable", "selectHead", "check");
const L = computed<ArTableLabels>(() => ({
  selectAll: "すべて選ぶ",
  selectRow: "この行を選ぶ",
  expand: "開く",
  collapse: "閉じる",
  actions: "操作",
  ...props.labels,
}));

const keyOf = (row: Row): ArRowKey =>
  typeof props.rowKey === "function" ? props.rowKey(row) : (row[props.rowKey] as ArRowKey);
const valueOf = (row: Row, col: ArTableColumn<Row>) =>
  col.value ? col.value(row) : (row as Record<string, unknown>)[col.key];
const isBlank = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
const alignOf = (col: ArTableColumn<Row>) => col.align ?? (col.numeric ? "end" : "start");
/** 名前の列の丸：文字は値の1文字目、色は seed（省くと行の順番）で人ごとに。名前は隣に書くので丸は読み上げない。 */
const avatarOf = (row: Row, col: ArTableColumn<Row>, i: number): ArTableAvatar => {
  const a: ArTableAvatar = typeof col.avatar === "function" ? col.avatar(row) : {};
  const text = a.text ?? (Array.from(String(valueOf(row, col) ?? "").trim())[0] ?? "");
  return { text, tone: a.tone, seed: a.tone ? undefined : (a.seed ?? i) };
};
const subOf = (row: Row, col: ArTableColumn<Row>) => {
  const v = col.sub?.(row);
  return v === undefined || v === "" ? null : typeof v === "string" ? { text: v, color: undefined } : v;
};
/** 合計の行のセル（span でつないだ列は飛ばす）。 */
const footCells = computed(() => {
  const out: { col: ArTableColumn<Row>; span: number; raw: ArTableFooterValue | undefined; label?: string; value: string | number }[] = [];
  const cols = props.columns;
  for (let i = 0; i < cols.length; i++) {
    const col = cols[i]!;
    const raw = props.footer?.[col.key];
    const obj = raw !== null && typeof raw === "object" ? raw : null;
    const span = Math.max(1, Math.min(obj?.span ?? 1, cols.length - i));
    const value: string | number = obj ? obj.value : typeof raw === "string" || typeof raw === "number" ? raw : "";
    out.push({ col, span, raw, label: obj?.label, value });
    i += span - 1;
  }
  return out;
});
const hasActions = computed(() => !!slots.actions);

/* ---- 左に固定する列：見出しのセルの位置を測って left にする ---- */
const tableEl = ref<HTMLTableElement | null>(null);
const lefts = ref<Record<string, number>>({});
const stickyKeys = computed(() => {
  const out: string[] = [];
  for (const c of props.columns) {
    if (!c.sticky) break;
    out.push(c.key);
  }
  return out;
});
const anySticky = computed(() => stickyKeys.value.length > 0);
const lastSticky = computed(() => stickyKeys.value.at(-1));
function measure() {
  const t = tableEl.value;
  if (!t || !anySticky.value) return;
  // 左の列の幅を足していく（スクロール中でも固定の位置に左右されない）
  const out: Record<string, number> = {};
  let x = 0;
  for (const th of Array.from(t.querySelectorAll<HTMLElement>("thead > tr > th"))) {
    const k = th.dataset.stickyKey;
    if (!k) break;
    out[k] = Math.round(x * 100) / 100;
    x += th.getBoundingClientRect().width;
  }
  const same = Object.keys(out).length === Object.keys(lefts.value).length && Object.entries(out).every(([k, v]) => lefts.value[k] === v);
  if (!same) lefts.value = out;
}
let ro: ResizeObserver | null = null;
/** 列の幅は文字や見た目の CSS が読み込まれたあとにも変わるので、見出しのセルの大きさを見張って測り直す。 */
function observe() {
  ro?.disconnect();
  const t = tableEl.value;
  if (!t || typeof ResizeObserver === "undefined") return;
  ro = new ResizeObserver(() => measure());
  ro.observe(t);
  t.querySelectorAll<HTMLElement>("thead th").forEach((th) => ro!.observe(th));
}
onMounted(() => {
  measure();
  observe();
});
onBeforeUnmount(() => ro?.disconnect());
watch(
  () => [props.columns, props.selectable, props.expandable, !!slots.actions],
  () => nextTick(() => (measure(), observe())),
);
const stick = (key: string) => (anySticky.value ? { left: `${lefts.value[key] ?? 0}px` } : undefined);
const colSticky = (c: ArTableColumn<Row>) => stickyKeys.value.includes(c.key);

/* ---- 選ぶ・開く・並べ替え ---- */
const selectedSet = computed(() => new Set(props.selected));
const allKeys = computed(() => props.rows.map(keyOf));
const allState = computed(() => {
  const n = allKeys.value.filter((k) => selectedSet.value.has(k)).length;
  return n === 0 ? "none" : n === allKeys.value.length ? "all" : "some";
});
const headCheck = ref<HTMLInputElement | null>(null);
watch(allState, (s) => headCheck.value && (headCheck.value.indeterminate = s === "some"), { flush: "post" });
onMounted(() => headCheck.value && (headCheck.value.indeterminate = allState.value === "some"));

function toggleAll() {
  emit("update:selected", allState.value === "all" ? [] : [...allKeys.value]);
}
function toggleRow(row: Row) {
  const k = keyOf(row);
  emit("update:selected", selectedSet.value.has(k) ? props.selected.filter((x) => x !== k) : [...props.selected, k]);
}
const isOpen = (row: Row) => props.expanded.includes(keyOf(row));
function toggleExpand(row: Row) {
  const k = keyOf(row);
  emit("update:expanded", isOpen(row) ? props.expanded.filter((x) => x !== k) : [...props.expanded, k]);
}
function cycleSort(col: ArTableColumn<Row>) {
  const cur = props.sort?.key === col.key ? props.sort.order : null;
  emit("update:sort", cur === null ? { key: col.key, order: "asc" } : cur === "asc" ? { key: col.key, order: "desc" } : null);
}
const orderOf = (col: ArTableColumn<Row>) => (props.sort?.key === col.key ? props.sort.order : undefined);
function ariaSort(col: ArTableColumn<Row>) {
  if (!col.sortable) return undefined;
  const o = orderOf(col);
  return o === "asc" ? "ascending" : o === "desc" ? "descending" : "none";
}
const rowState = (row: Row) =>
  [selectedSet.value.has(keyOf(row)) && "selected", isOpen(row) && "expanded", props.rowOff?.(row) && "off"].filter(Boolean).join(" ") ||
  undefined;
const colspan = computed(
  () => props.columns.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0) + (hasActions.value ? 1 : 0),
);
</script>

<template>
  <div data-ar="table" data-part="root" :data-variant="variant" :data-density="density" :data-sticky-header="stickyHeader || undefined">
    <div data-part="viewport" role="region" :aria-label="caption" tabindex="0">
      <table ref="tableEl" data-part="table">
        <caption data-ar-visually-hidden>{{ caption }}</caption>
        <colgroup>
          <col v-if="selectable" data-col="select" />
          <col v-if="expandable" data-col="expand" />
          <col v-for="c in columns" :key="c.key" :style="c.width ? { width: `${c.width}px` } : undefined" />
          <col v-if="hasActions" data-col="actions" />
        </colgroup>
        <thead data-part="head">
          <tr>
            <th
              v-if="selectable"
              data-part="header-cell"
              data-col="select"
              :data-sticky="anySticky ? 'start' : undefined"
              :data-sticky-key="anySticky ? '__select' : undefined"
              :style="stick('__select')"
              scope="col"
            >
              <span v-if="selectHead === 'label'" data-part="select-text" aria-hidden="true">{{ L.selectAllText ?? "全選択" }}</span>
              <span data-part="check" :data-state="allState === 'all' ? 'checked' : allState === 'some' ? 'indeterminate' : undefined">
                <input
                  ref="headCheck"
                  data-part="select"
                  type="checkbox"
                  :checked="allState === 'all'"
                  :disabled="!rows.length"
                  :aria-label="L.selectAll"
                  @change="toggleAll"
                />
                <span data-part="check-box" aria-hidden="true">
                  <ArIcon v-if="allState === 'some'" name="minus" size="sm" />
                  <ArIcon v-else-if="allState === 'all'" name="check" size="sm" />
                </span>
              </span>
            </th>
            <th
              v-if="expandable"
              data-part="header-cell"
              data-col="expand"
              :data-sticky="anySticky ? 'start' : undefined"
              :data-sticky-key="anySticky ? '__expand' : undefined"
              :style="stick('__expand')"
              scope="col"
            />
            <th
              v-for="c in columns"
              :key="c.key"
              data-part="header-cell"
              scope="col"
              :data-align="alignOf(c)"
              :data-sticky="colSticky(c) ? 'start' : undefined"
              :data-sticky-key="colSticky(c) ? c.key : undefined"
              :data-sticky-edge="c.key === lastSticky || undefined"
              :style="colSticky(c) ? stick(c.key) : undefined"
              :aria-sort="ariaSort(c)"
              :data-person="c.avatar ? (c.sub ? 'with-sub' : 'single') : undefined"
            >
              <slot :name="`head-${c.key}`" :column="c">
                <button v-if="c.sortable" type="button" data-part="sort" :data-order="orderOf(c)" @click="cycleSort(c)">
                  <span>{{ c.title }}</span>
                  <svg data-part="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path data-dir="asc" data-shape="chevron" d="m8 9 4-4 4 4" />
                    <path data-dir="desc" data-shape="chevron" d="m8 15 4 4 4-4" />
                    <path data-dir="asc" data-shape="caret" d="M12 2.5 20 11H4Z" />
                    <path data-dir="desc" data-shape="caret" d="M12 21.5 4 13h16Z" />
                  </svg>
                </button>
                <template v-else>{{ c.title }}</template>
              </slot>
            </th>
            <th v-if="hasActions" data-part="header-cell" data-col="actions" data-align="end" scope="col">
              <span data-ar-visually-hidden>{{ L.actions }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="$slots['before-rows']" data-part="before-rows">
          <tr>
            <td :colspan="colspan"><slot name="before-rows" /></td>
          </tr>
        </tbody>
        <tbody data-part="body">
          <tr v-if="!rows.length">
            <td data-part="empty" :colspan="colspan">
              <slot name="empty"><ArEmpty :text="emptyText" :icon="emptyIcon" /></slot>
            </td>
          </tr>
          <template v-for="(row, i) in rows" :key="keyOf(row)">
            <tr data-part="row" :data-state="rowState(row)" @click="emit('row-click', row, i)">
              <td
                v-if="selectable"
                data-part="cell"
                data-col="select"
                :data-sticky="anySticky ? 'start' : undefined"
                :style="stick('__select')"
                @click.stop
              >
                <span data-part="check" :data-state="selectedSet.has(keyOf(row)) ? 'checked' : undefined">
                  <input
                    data-part="select"
                    type="checkbox"
                    :checked="selectedSet.has(keyOf(row))"
                    :aria-label="L.selectRow"
                    @change="toggleRow(row)"
                  />
                  <span data-part="check-box" aria-hidden="true">
                    <ArIcon v-if="selectedSet.has(keyOf(row))" name="check" size="sm" />
                  </span>
                </span>
              </td>
              <td
                v-if="expandable"
                data-part="cell"
                data-col="expand"
                :data-sticky="anySticky ? 'start' : undefined"
                :style="stick('__expand')"
                @click.stop
              >
                <button
                  type="button"
                  data-part="expand-toggle"
                  :aria-expanded="isOpen(row)"
                  :aria-label="isOpen(row) ? L.collapse : L.expand"
                  @click="toggleExpand(row)"
                >
                  <ArIcon name="cr" size="sm" />
                </button>
              </td>
              <td
                v-for="c in columns"
                :key="c.key"
                data-part="cell"
                :data-align="alignOf(c)"
                :data-numeric="c.numeric || undefined"
                :data-emphasis="c.emphasis"
                :data-blank="isBlank(valueOf(row, c)) || undefined"
                :data-sticky="colSticky(c) ? 'start' : undefined"
                :data-sticky-edge="c.key === lastSticky || undefined"
                :style="colSticky(c) ? stick(c.key) : undefined"
              >
                <slot :name="`cell-${c.key}`" :row="row" :value="valueOf(row, c)" :index="i">
                  <span v-if="c.avatar" data-part="person" :data-single="!c.sub || undefined">
                    <ArAvatar v-bind="avatarOf(row, c, i)" :size="variant === 'board' ? 'md' : 'sm'" />
                    <span data-part="name">
                      <b>{{ valueOf(row, c) }}</b>
                      <small v-if="subOf(row, c)" data-part="sub">
                        <i v-if="subOf(row, c)!.color" data-part="sub-mark" :style="{ background: subOf(row, c)!.color }" aria-hidden="true" />{{ subOf(row, c)!.text }}
                      </small>
                    </span>
                  </span>
                  <span v-else-if="Array.isArray(valueOf(row, c)) && !isBlank(valueOf(row, c))" data-part="lines">
                    <span v-for="(v, j) in valueOf(row, c) as unknown[]" :key="j">{{ v }}</span>
                  </span>
                  <template v-else>{{ isBlank(valueOf(row, c)) ? blank : valueOf(row, c) }}</template>
                </slot>
              </td>
              <td v-if="hasActions" data-part="cell" data-col="actions" data-align="end" @click.stop>
                <span data-part="actions"><slot name="actions" :row="row" :index="i" /></span>
              </td>
            </tr>
            <tr v-if="expandable && isOpen(row)" data-part="expanded-row">
              <td v-if="selectable" data-col="select" />
              <td :colspan="colspan - (selectable ? 1 : 0)"><slot name="expanded" :row="row" /></td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="footer" data-part="foot">
          <tr>
            <td v-if="selectable" data-part="cell" data-col="select" :data-sticky="anySticky ? 'start' : undefined" :style="stick('__select')" />
            <td v-if="expandable" data-part="cell" data-col="expand" :data-sticky="anySticky ? 'start' : undefined" :style="stick('__expand')" />
            <td
              v-for="f in footCells"
              :key="f.col.key"
              data-part="cell"
              :colspan="f.span > 1 ? f.span : undefined"
              :data-align="alignOf(f.col)"
              :data-numeric="f.col.numeric || undefined"
              :data-sticky="colSticky(f.col) ? 'start' : undefined"
              :data-sticky-edge="f.col.key === lastSticky || undefined"
              :style="colSticky(f.col) ? stick(f.col.key) : undefined"
            >
              <slot :name="`foot-${f.col.key}`" :value="f.raw">
                <template v-if="f.label !== undefined">
                  <small data-part="foot-label">{{ f.label }}</small>
                  <b data-part="foot-value">{{ f.value }}</b>
                </template>
                <template v-else>{{ f.value }}</template>
              </slot>
            </td>
            <td v-if="hasActions" data-part="cell" data-col="actions" />
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-if="$slots.below" data-part="below"><slot name="below" /></div>
  </div>
</template>
