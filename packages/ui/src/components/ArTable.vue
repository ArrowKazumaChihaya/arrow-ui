<script setup lang="ts" generic="Row extends object">
/**
 * ArTable 1.0 — 表。
 * 見出しの固定・左の列の固定・選択・展開・合計の行を部品として持つ（どの デザイン でも同じに動く）。
 * 並べ替えの印を押すと update:sort を出すだけで、データの並べ替えは製品が行う。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArRowKey, ArTableColumn, ArTableProps, ArTableSort } from "./ArTable.contract";

const props = withDefaults(defineProps<ArTableProps<Row>>(), {
  selectable: false,
  selected: () => [],
  sort: null,
  expandable: false,
  expanded: () => [],
  footer: null,
  stickyHeader: true,
  density: "regular",
  emptyText: "データがありません",
  labels: () => ({ selectAll: "すべて選ぶ", selectRow: "この行を選ぶ", expand: "開く", collapse: "閉じる" }),
});
const emit = defineEmits<{
  "update:selected": [keys: ArRowKey[]];
  "update:sort": [sort: ArTableSort | null];
  "update:expanded": [keys: ArRowKey[]];
  "row-click": [row: Row, index: number];
}>();

const SELECT_W = 40;
const keyOf = (row: Row): ArRowKey =>
  typeof props.rowKey === "function" ? props.rowKey(row) : (row[props.rowKey] as ArRowKey);
const valueOf = (row: Row, col: ArTableColumn<Row>) =>
  col.value ? col.value(row) : (row as Record<string, unknown>)[col.key];

/** 左に固定する列の位置（px）。 */
const stickyLeft = computed(() => {
  const out: Record<string, number> = {};
  let x = (props.selectable ? SELECT_W : 0) + (props.expandable ? SELECT_W : 0);
  for (const c of props.columns) {
    if (!c.sticky) break;
    out[c.key] = x;
    x += c.width ?? 0;
  }
  return out;
});
const lastSticky = computed(() => Object.keys(stickyLeft.value).at(-1));

const selectedSet = computed(() => new Set(props.selected));
const allKeys = computed(() => props.rows.map(keyOf));
const allState = computed(() => {
  const n = allKeys.value.filter((k) => selectedSet.value.has(k)).length;
  return n === 0 ? "none" : n === allKeys.value.length ? "all" : "some";
});

function toggleAll() {
  emit("update:selected", allState.value === "all" ? [] : [...allKeys.value]);
}
function toggleRow(row: Row) {
  const k = keyOf(row);
  emit("update:selected", selectedSet.value.has(k) ? props.selected.filter((x) => x !== k) : [...props.selected, k]);
}
function toggleExpand(row: Row) {
  const k = keyOf(row);
  emit("update:expanded", props.expanded.includes(k) ? props.expanded.filter((x) => x !== k) : [...props.expanded, k]);
}
function cycleSort(col: ArTableColumn<Row>) {
  const cur = props.sort?.key === col.key ? props.sort.order : null;
  emit("update:sort", cur === null ? { key: col.key, order: "asc" } : cur === "asc" ? { key: col.key, order: "desc" } : null);
}
function ariaSort(col: ArTableColumn<Row>) {
  if (!col.sortable) return undefined;
  if (props.sort?.key !== col.key) return "none";
  return props.sort.order === "asc" ? "ascending" : "descending";
}
const colspan = computed(() => props.columns.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0));
const cellStyle = (col: ArTableColumn<Row>) =>
  col.key in stickyLeft.value ? { left: `${stickyLeft.value[col.key]}px` } : undefined;
const lead = (i: number) => ({ left: `${i * SELECT_W}px` });
</script>

<template>
  <div data-ar="table" data-part="root" :data-density="density" :data-sticky-header="stickyHeader || undefined">
    <div data-part="viewport" role="region" :aria-label="caption" tabindex="0">
      <table data-part="table">
        <caption data-ar-visually-hidden>{{ caption }}</caption>
        <colgroup>
          <col v-if="selectable" data-part="lead-col" />
          <col v-if="expandable" data-part="lead-col" />
          <col v-for="c in columns" :key="c.key" :style="c.width ? { width: `${c.width}px` } : undefined" />
        </colgroup>
        <thead data-part="head">
          <tr>
            <th v-if="selectable" data-part="header-cell" data-lead data-sticky="start" :style="lead(0)" scope="col">
              <input
                data-part="select"
                type="checkbox"
                :checked="allState === 'all'"
                :indeterminate="allState === 'some'"
                :aria-label="labels.selectAll"
                @change="toggleAll"
              />
            </th>
            <th
              v-if="expandable"
              data-part="header-cell"
              data-lead
              data-sticky="start"
              :style="lead(selectable ? 1 : 0)"
              scope="col"
            />
            <th
              v-for="c in columns"
              :key="c.key"
              data-part="header-cell"
              scope="col"
              :data-align="c.align ?? 'start'"
              :data-sticky="c.key in stickyLeft ? 'start' : undefined"
              :data-sticky-edge="c.key === lastSticky || undefined"
              :style="cellStyle(c)"
              :aria-sort="ariaSort(c)"
            >
              <slot :name="`head-${c.key}`" :column="c">
                <button v-if="c.sortable" type="button" data-part="sort" :data-order="sort?.key === c.key ? sort.order : undefined" @click="cycleSort(c)">
                  {{ c.title }}<ArIcon name="sort" size="sm" />
                </button>
                <template v-else>{{ c.title }}</template>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody data-part="body">
          <tr v-if="!rows.length">
            <td data-part="empty" :colspan="colspan"><slot name="empty">{{ emptyText }}</slot></td>
          </tr>
          <template v-for="(row, i) in rows" :key="keyOf(row)">
            <tr
              data-part="row"
              :data-state="selectedSet.has(keyOf(row)) ? 'selected' : undefined"
              @click="emit('row-click', row, i)"
            >
              <td v-if="selectable" data-part="cell" data-lead data-sticky="start" :style="lead(0)" @click.stop>
                <input
                  data-part="select"
                  type="checkbox"
                  :checked="selectedSet.has(keyOf(row))"
                  :aria-label="labels.selectRow"
                  @change="toggleRow(row)"
                />
              </td>
              <td v-if="expandable" data-part="cell" data-lead data-sticky="start" :style="lead(selectable ? 1 : 0)" @click.stop>
                <button
                  type="button"
                  data-part="expand-toggle"
                  :aria-expanded="expanded.includes(keyOf(row))"
                  :aria-label="expanded.includes(keyOf(row)) ? labels.collapse : labels.expand"
                  @click="toggleExpand(row)"
                >
                  <ArIcon :name="expanded.includes(keyOf(row)) ? 'cd' : 'cr'" size="sm" />
                </button>
              </td>
              <td
                v-for="c in columns"
                :key="c.key"
                data-part="cell"
                :data-align="c.align ?? 'start'"
                :data-sticky="c.key in stickyLeft ? 'start' : undefined"
                :data-sticky-edge="c.key === lastSticky || undefined"
                :style="cellStyle(c)"
              >
                <slot :name="`cell-${c.key}`" :row="row" :value="valueOf(row, c)" :index="i">{{ valueOf(row, c) }}</slot>
              </td>
            </tr>
            <tr v-if="expandable && expanded.includes(keyOf(row))" data-part="expanded-row">
              <td :colspan="colspan"><slot name="expanded" :row="row" /></td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="footer" data-part="foot">
          <tr>
            <td v-if="selectable" data-part="cell" data-lead data-sticky="start" :style="lead(0)" />
            <td v-if="expandable" data-part="cell" data-lead data-sticky="start" :style="lead(selectable ? 1 : 0)" />
            <td
              v-for="c in columns"
              :key="c.key"
              data-part="cell"
              :data-align="c.align ?? 'start'"
              :data-sticky="c.key in stickyLeft ? 'start' : undefined"
              :data-sticky-edge="c.key === lastSticky || undefined"
              :style="cellStyle(c)"
            >
              <slot :name="`foot-${c.key}`" :value="footer[c.key]">{{ footer[c.key] ?? "" }}</slot>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
