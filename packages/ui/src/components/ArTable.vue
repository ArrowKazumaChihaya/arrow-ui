<script setup lang="ts" generic="Row extends object">
/**
 * ArTable 1.2 — 表。
 * box（外枠の中の一覧）と board（シフト画面の「勤務メンバー」「勤務可能な人」）の2つの形。
 * 見出しの固定・左の列の固定・選ぶ・開く・合計の行・名前の列（頭文字の丸）・行の右端の操作を部品として持つ。
 * 並べ替えの印を押すと update:sort を出すだけで、データの並べ替えは製品が行う。
 * ページ送りは #below に ArPagination を置く。
 * sortableRows で行をドラッグ（つまみ）か Alt+↑↓ で並べ替え、update:rows と reorder を出す。
 * 1.1：右に止める列・2段の見出し（押すとまとまりが開く）・行をまたぐセル・表の中の小さな金額の入力・3段の金額・数字の下の差の行。
 * 1.2：スロットの引数 Default（既定の表示）・段に分ける列（lines。段の高さを列をまたいで揃える）・入力の種類（文字・時刻・選ぶ）。
 */
import { computed, h, markRaw, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch, type FunctionalComponent } from "vue";
import ArTableCellBody from "../internal/ArTableCellBody.vue";
import ArEmpty from "./ArEmpty.vue";
import ArIcon from "./ArIcon.vue";
import { useDesignForm } from "../provider/context";
import type {
  ArRowKey,
  ArTableColumn,
  ArTableEditValue,
  ArTableColumnGroup,
  ArTableFooterValue,
  ArTableLabels,
  ArTableProps,
  ArTableReorder,
  ArTableSort,
} from "./ArTable.contract";

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
  sortableRows: false,
  columnGroups: () => [],
  openGroups: () => [],
  edits: () => ({}),
  invalidCells: () => [],
});
const emit = defineEmits<{
  "update:selected": [keys: ArRowKey[]];
  "update:sort": [sort: ArTableSort | null];
  "update:expanded": [keys: ArRowKey[]];
  "row-click": [row: Row, index: number];
  "update:rows": [rows: Row[]];
  reorder: [move: ArTableReorder];
  "update:openGroups": [keys: string[]];
  "update:edits": [edits: Record<string, ArTableEditValue>];
}>();
const slots = useSlots();

/* ---- 2段の見出し・開け閉めするまとまり ---- */
const openSet = computed(() => new Set(props.openGroups));
const groupMap = computed(() => new Map(props.columnGroups.map((g) => [g.key, g])));
const groupOf = (c: ArTableColumn<Row>): ArTableColumnGroup | undefined => (c.group ? groupMap.value.get(c.group) : undefined);
const isGroupOpen = (k?: string) => !!k && openSet.value.has(k);
/** いま出す列（まとまりの開け閉めで出る列が変わる）。 */
const cols = computed(() => props.columns.filter((c) => !c.show || (c.show === "open") === isGroupOpen(c.group)));
type HeadCell =
  | { kind: "col"; key: string; col: ArTableColumn<Row>; rowspan: number; collapsed?: ArTableColumnGroup }
  | { kind: "group"; key: string; group: ArTableColumnGroup; colspan: number };
const head = computed(() => {
  const list = cols.value;
  const banded = (c: ArTableColumn<Row>) => {
    const g = groupOf(c);
    return !!g && (!g.collapsible || isGroupOpen(g.key));
  };
  const two = list.some(banded);
  const top: HeadCell[] = [];
  const bottom: HeadCell[] = [];
  for (let i = 0; i < list.length; i++) {
    const c = list[i]!;
    const g = groupOf(c);
    if (g && banded(c)) {
      let n = 0;
      while (i + n < list.length && list[i + n]!.group === g.key) n++;
      top.push({ kind: "group", key: `g:${g.key}:${i}`, group: g, colspan: n });
      for (let j = 0; j < n; j++) bottom.push({ kind: "col", key: list[i + j]!.key, col: list[i + j]!, rowspan: 1 });
      i += n - 1;
    } else top.push({ kind: "col", key: c.key, col: c, rowspan: two ? 2 : 1, collapsed: g?.collapsible ? g : undefined });
  }
  return { two, top, bottom };
});
const headSpan = computed(() => (head.value.two ? 2 : undefined));
/** まとまりの最初の列（左に線）。 */
const groupStart = (c: ArTableColumn<Row>) => {
  const g = groupOf(c);
  if (!g || (g.collapsible && !isGroupOpen(g.key))) return false;
  const i = cols.value.indexOf(c);
  return i === 0 || cols.value[i - 1]!.group !== c.group;
};
function toggleGroups(keys: string | readonly string[]) {
  const ks = typeof keys === "string" ? [keys] : [...keys];
  const anyOpen = ks.some((k) => openSet.value.has(k));
  const next = new Set(props.openGroups);
  for (const k of ks) anyOpen ? next.delete(k) : next.add(k);
  emit("update:openGroups", [...next]);
}
const togglesOpen = (c: ArTableColumn<Row>) => (typeof c.toggles === "string" ? [c.toggles] : [...(c.toggles ?? [])]).some((k) => openSet.value.has(k));

/* ---- 表の中の入力・段に分けた列・既定の表示 ---- */
const canEdit = (row: Row, c: ArTableColumn<Row>) => (typeof c.edit === "function" ? c.edit(row) : !!c.edit);
const linesOf = (v: unknown): unknown[] => (Array.isArray(v) ? v : [v]);
/** 段に分ける列があるか（あれば1つの行を段の数の tr に分け、段のない列は段をまたぐ）。 */
const lineCols = computed(() => cols.value.filter((c) => c.lines));
const anyLines = computed(() => lineCols.value.length > 0);
/** 行の段の数＝段に分ける列の配列のいちばん長いもの。 */
const lineCount = (row: Row) => {
  let n = 1;
  for (const c of lineCols.value) {
    const v = valueOf(row, c);
    if (Array.isArray(v)) n = Math.max(n, v.length);
  }
  return n;
};
/** セルの値（段に分けた列ではその段の値）。 */
const cellValue = (row: Row, c: ArTableColumn<Row>, line?: number) => (line === undefined ? valueOf(row, c) : linesOf(valueOf(row, c))[line]);
const lineOf = (c: ArTableColumn<Row>, j: number) => (c.lines ? j : undefined);
function onEdit(k: string, v: ArTableEditValue) {
  emit("update:edits", { ...props.edits, [k]: v });
}
const bodyProps = (row: Row, c: ArTableColumn<Row>, i: number, line?: number) => ({
  row,
  col: c as ArTableColumn<object>,
  value: cellValue(row, c, line),
  rowKey: keyOf(row),
  index: i,
  line,
  variant: props.variant,
  edits: props.edits,
  invalidCells: props.invalidCells,
  blank: props.blank,
  onEdit,
});
/**
 * スロットの引数 Default：既定の表示を描く部品。行と列ごとに同じ部品を返す（描き直しのたびに作り直さない）。
 * 中では今の列・行の順番を読み直すので、並べ替えや列の出し入れのあとも正しく描く。
 */
const defaults = new WeakMap<object, Map<string, FunctionalComponent>>();
function defaultOf(row: Row, c: ArTableColumn<Row>, line?: number): FunctionalComponent {
  let m = defaults.get(row);
  if (!m) defaults.set(row, (m = new Map()));
  const k = `${c.key}:${line ?? ""}`;
  let comp = m.get(k);
  if (!comp) {
    const fc: FunctionalComponent = (_p, ctx) => {
      const col = cols.value.find((x) => x.key === c.key) ?? c;
      return h(ArTableCellBody, { ...bodyProps(row, col, Math.max(0, props.rows.indexOf(row)), line), ...ctx.attrs });
    };
    fc.inheritAttrs = false;
    fc.displayName = "ArTableCellDefault";
    comp = markRaw(fc);
    m.set(k, comp);
  }
  return comp;
}
const spanOf = (row: Row, c: ArTableColumn<Row>, i: number) => (c.rowSpan ? c.rowSpan(row, i) : 1);
/** td の rowspan：段のない列は行の段の数ぶん（rowSpan でまたぐときは、またぐ行の段の数の合計）。 */
const rowspanOf = (row: Row, c: ArTableColumn<Row>, i: number) => {
  if (c.lines) return 1;
  const base = spanOf(row, c, i);
  if (!anyLines.value) return base;
  let n = 0;
  for (let k = i; k < Math.min(props.rows.length, i + Math.max(1, base)); k++) n += lineCount(props.rows[k]!);
  return n;
};
const hoverKey = ref<ArRowKey | null>(null);

/** 形（ArDesign.forms.ArTable.selectHead）：label は見出しのチェックの左に「全選択」の文字を出す。 */
const selectHead = useDesignForm<"check" | "label">("ArTable", "selectHead", "check");
/** 形（ArDesign.forms.ArTable.dragHandle）：column は並べ替えのつまみを左の専用の列に、cell は1列目のセルの頭に置く。 */
const handleForm = useDesignForm<"column" | "cell">("ArTable", "dragHandle", "column");
const handleColumn = computed(() => props.sortableRows && handleForm.value === "column");
/** 形（ArDesign.forms.ArTable.groupToggle）：chevron は開け閉めのボタンに ∨／›、menu は今の ARROW の Th の isToggle と同じ menu の絵。 */
const groupToggle = useDesignForm<"chevron" | "menu">("ArTable", "groupToggle", "chevron");
const L = computed<ArTableLabels>(() => ({
  selectAll: "すべて選ぶ",
  selectRow: "この行を選ぶ",
  expand: "開く",
  collapse: "閉じる",
  actions: "操作",
  dragHandle: "並べ替え（ドラッグ、または Alt+↑↓）",
  moved: "{n} 番目に移しました",
  ...props.labels,
}));

const keyOf = (row: Row): ArRowKey =>
  typeof props.rowKey === "function" ? props.rowKey(row) : (row[props.rowKey] as ArRowKey);
const valueOf = (row: Row, col: ArTableColumn<Row>) =>
  col.value ? col.value(row) : (row as Record<string, unknown>)[col.key];
const isBlank = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
const alignOf = (col: ArTableColumn<Row>) => col.align ?? (col.numeric ? "end" : "start");
/** 合計の行のセル（span でつないだ列は飛ばす）。 */
const footCells = computed(() => {
  const out: { col: ArTableColumn<Row>; span: number; raw: ArTableFooterValue | undefined; label?: string; value: string | number }[] = [];
  const list = cols.value;
  for (let i = 0; i < list.length; i++) {
    const col = list[i]!;
    const raw = props.footer?.[col.key];
    const obj = raw !== null && typeof raw === "object" ? raw : null;
    const span = Math.max(1, Math.min(obj?.span ?? 1, list.length - i));
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
const isStart = (c: ArTableColumn<Row>) => c.sticky === true || c.sticky === "start";
const stickyKeys = computed(() => {
  const out: string[] = [];
  for (const c of cols.value) {
    if (!isStart(c)) break;
    out.push(c.key);
  }
  return out;
});
const endKeys = computed(() => {
  const out: string[] = [];
  for (const c of [...cols.value].reverse()) {
    if (c.sticky !== "end") break;
    out.unshift(c.key);
  }
  return out;
});
const anySticky = computed(() => stickyKeys.value.length > 0);
const anyEnd = computed(() => endKeys.value.length > 0);
const lastSticky = computed(() => stickyKeys.value.at(-1));
const firstEnd = computed(() => endKeys.value[0]);
const rights = ref<Record<string, number>>({});
function measure() {
  const t = tableEl.value;
  if (t && head.value.two) {
    // 2段の見出しの下の段を、上の段の高さだけ下に貼りつける
    const top = t.querySelector<HTMLElement>("thead > tr")?.getBoundingClientRect().height ?? 0;
    rootEl.value?.style.setProperty("--ar-table-head-top", `${Math.round(top * 100) / 100}px`);
  }
  if (!t || (!anySticky.value && !anyEnd.value)) return;
  // 止める列の見出しの幅を端から足していく（スクロール中でも固定の位置に左右されない）
  const widthOf = (k: string) => t.querySelector<HTMLElement>(`thead th[data-sticky-key="${k}"]`)?.getBoundingClientRect().width ?? 0;
  const out: Record<string, number> = {};
  let x = 0;
  if (anySticky.value)
    for (const k of [...(props.selectable ? ["__select"] : []), ...(props.expandable ? ["__expand"] : []), ...stickyKeys.value]) {
      out[k] = Math.round(x * 100) / 100;
      x += widthOf(k);
    }
  const outR: Record<string, number> = {};
  let r = 0;
  for (const k of [...endKeys.value].reverse()) {
    outR[k] = Math.round(r * 100) / 100;
    r += widthOf(k);
  }
  const same = (a: Record<string, number>, b: Record<string, number>) =>
    Object.keys(a).length === Object.keys(b).length && Object.entries(a).every(([k, v]) => b[k] === v);
  if (!same(out, lefts.value)) lefts.value = out;
  if (!same(outR, rights.value)) rights.value = outR;
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
  () => [cols.value, props.selectable, props.expandable, !!slots.actions],
  () => nextTick(() => (measure(), observe())),
);
const stick = (key: string) => (anySticky.value ? { left: `${lefts.value[key] ?? 0}px` } : undefined);
const colSticky = (c: ArTableColumn<Row>) => stickyKeys.value.includes(c.key);
const colEnd = (c: ArTableColumn<Row>) => endKeys.value.includes(c.key);
const stickAttr = (c: ArTableColumn<Row>) => (colSticky(c) ? "start" : colEnd(c) ? "end" : undefined);
const edgeAttr = (c: ArTableColumn<Row>) => (c.key === lastSticky.value ? "start" : c.key === firstEnd.value ? "end" : undefined);
const stickStyle = (c: ArTableColumn<Row>) => (colSticky(c) ? stick(c.key) : colEnd(c) ? { right: `${rights.value[c.key] ?? 0}px` } : undefined);

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
  [
    selectedSet.value.has(keyOf(row)) && "selected",
    isOpen(row) && "expanded",
    props.rowOff?.(row) && "off",
    dragging.value === keyOf(row) && "dragging",
    anyLines.value && hoverKey.value === keyOf(row) && lineCount(row) > 1 && "hover",
  ]
    .filter(Boolean)
    .join(" ") || undefined;
/* ---- 行の並べ替え（sortableRows） ---- */
const rootEl = ref<HTMLElement | null>(null);
const armed = ref<ArRowKey | null>(null);
const dragging = ref<ArRowKey | null>(null);
const dropAt = ref<{ key: ArRowKey; position: "before" | "after" } | null>(null);
const announce = ref("");
function moveRow(from: number, to: number, focus = false) {
  if (from === to || from < 0 || to < 0 || from >= props.rows.length || to >= props.rows.length) return;
  const next = [...props.rows];
  const [row] = next.splice(from, 1);
  next.splice(to, 0, row!);
  const key = keyOf(row!);
  emit("update:rows", next);
  emit("reorder", { key, from, to });
  announce.value = L.value.moved.replace("{n}", String(to + 1));
  if (focus)
    void nextTick(() =>
      Array.from(rootEl.value?.querySelectorAll<HTMLElement>('[data-part="drag-handle"]') ?? [])
        .find((el) => el.dataset.key === String(key))
        ?.focus(),
    );
}
function onHandleKey(e: KeyboardEvent, i: number) {
  if (!e.altKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
  e.preventDefault();
  moveRow(i, i + (e.key === "ArrowUp" ? -1 : 1), true);
}
function onRowDragStart(e: DragEvent, row: Row) {
  if (!props.sortableRows || armed.value !== keyOf(row)) return e.preventDefault();
  dragging.value = keyOf(row);
  e.dataTransfer?.setData("text/plain", String(keyOf(row)));
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
}
function onRowDragOver(e: DragEvent, row: Row) {
  if (dragging.value === null) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const y = box.height ? (e.clientY - box.top) / box.height : 1;
  dropAt.value = { key: keyOf(row), position: y < 0.5 ? "before" : "after" };
}
function onRowDrop(e: DragEvent) {
  e.preventDefault();
  const src = dragging.value;
  const at = dropAt.value;
  endDrag();
  if (src === null || !at) return;
  const from = allKeys.value.indexOf(src);
  let to = allKeys.value.indexOf(at.key) + (at.position === "after" ? 1 : 0);
  if (to > from) to -= 1;
  moveRow(from, to);
}
function endDrag() {
  dragging.value = null;
  dropAt.value = null;
  armed.value = null;
}
const colspan = computed(
  () =>
    cols.value.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0) + (hasActions.value ? 1 : 0) + (handleColumn.value ? 1 : 0),
);
</script>

<template>
  <div
    ref="rootEl"
    data-ar="table"
    data-part="root"
    :data-variant="variant"
    :data-density="density"
    :data-sticky-header="stickyHeader || undefined"
    :data-sortable="sortableRows || undefined"
  >
    <div data-part="viewport" role="region" :aria-label="caption" tabindex="0">
      <table ref="tableEl" data-part="table">
        <caption data-ar-visually-hidden>{{ caption }}</caption>
        <colgroup>
          <col v-if="handleColumn" data-col="drag" />
          <col v-if="selectable" data-col="select" />
          <col v-if="expandable" data-col="expand" />
          <col v-for="c in cols" :key="c.key" :style="c.width ? { width: `${c.width}px` } : undefined" />
          <col v-if="hasActions" data-col="actions" />
        </colgroup>
        <thead data-part="head" :data-tiers="head.two ? 2 : undefined">
          <tr>
            <th v-if="handleColumn" data-part="header-cell" data-col="drag" scope="col" :rowspan="headSpan"><span data-ar-visually-hidden>{{ L.dragHandle }}</span></th>
            <th
              v-if="selectable"
              data-part="header-cell"
              data-col="select"
              :data-sticky="anySticky ? 'start' : undefined"
              :data-sticky-key="anySticky ? '__select' : undefined"
              :style="stick('__select')"
              scope="col"
              :rowspan="headSpan"
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
                  <ArIcon line v-if="allState === 'some'" name="minus" size="sm" />
                  <ArIcon line v-else-if="allState === 'all'" name="check" size="sm" />
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
              :rowspan="headSpan"
            />
            <template v-for="h in head.top" :key="h.key">
              <th
                v-if="h.kind === 'group'"
                data-part="header-cell"
                data-group-cell
                scope="colgroup"
                :colspan="h.colspan"
                :data-collapsible="h.group.collapsible || undefined"
                :data-group-start="true"
              >
                <button
                  v-if="h.group.collapsible"
                  type="button"
                  data-part="group-toggle"
                  aria-expanded="true"
                  @click="toggleGroups(h.group.key)"
                >
                  <ArIcon v-if="groupToggle === 'menu'" name="menu" size="sm" /><ArIcon v-else line name="cd" size="sm" />{{ h.group.title }}<span data-part="toggle-hint">{{ h.group.openHint ?? "閉じる" }}</span>
                </button>
                <template v-else>{{ h.group.title }}</template>
              </th>
              <th
                v-else
                data-part="header-cell"
                scope="col"
                :rowspan="h.rowspan > 1 ? h.rowspan : undefined"
                :data-align="alignOf(h.col)"
                :data-sticky="stickAttr(h.col)"
                :data-sticky-key="stickAttr(h.col) ? h.col.key : undefined"
                :data-sticky-edge="edgeAttr(h.col)"
                :style="stickStyle(h.col)"
                :aria-sort="ariaSort(h.col)"
                :data-person="h.col.avatar ? (h.col.sub ? 'with-sub' : 'single') : undefined"
                :data-total="h.col.total || undefined"
                :data-collapsed="h.collapsed ? true : undefined"
              >
                <slot :name="`head-${h.col.key}`" :column="h.col">
                  <button v-if="h.collapsed" type="button" data-part="group-toggle" aria-expanded="false" @click="toggleGroups(h.collapsed.key)">
                    <ArIcon v-if="groupToggle === 'menu'" name="menu" size="sm" /><ArIcon v-else line name="cr" size="sm" />{{ h.col.title }}<span data-part="toggle-hint">{{ h.collapsed.closedHint ?? "内訳" }}</span>
                  </button>
                  <button
                    v-else-if="h.col.toggles"
                    type="button"
                    data-part="group-toggle"
                    data-toggle="column"
                    :aria-expanded="togglesOpen(h.col)"
                    @click="toggleGroups(h.col.toggles)"
                  >
                    <ArIcon v-if="groupToggle === 'menu'" name="menu" size="sm" /><ArIcon v-else line :name="togglesOpen(h.col) ? 'minus' : 'plus'" size="sm" />{{ h.col.title }}
                  </button>
                  <button v-else-if="h.col.sortable" type="button" data-part="sort" :data-order="orderOf(h.col)" @click="cycleSort(h.col)">
                    <span>{{ h.col.title }}</span>
                    <svg data-part="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path data-dir="asc" data-shape="chevron" d="m8 9 4-4 4 4" />
                      <path data-dir="desc" data-shape="chevron" d="m8 15 4 4 4-4" />
                      <path data-dir="asc" data-shape="caret" d="M12 2.5 20 11H4Z" />
                      <path data-dir="desc" data-shape="caret" d="M12 21.5 4 13h16Z" />
                    </svg>
                  </button>
                  <template v-else>{{ h.col.title }}</template>
                </slot>
              </th>
            </template>
            <th v-if="hasActions" data-part="header-cell" data-col="actions" data-align="end" scope="col" :rowspan="headSpan">
              <span data-ar-visually-hidden>{{ L.actions }}</span>
            </th>
          </tr>
          <tr v-if="head.two" data-tier="2">
            <template v-for="h in head.bottom" :key="h.key">
              <th
                v-if="h.kind === 'col'"
                data-part="header-cell"
                scope="col"
                :data-align="alignOf(h.col)"
                :data-total="h.col.total || undefined"
                :data-group-start="groupStart(h.col) || undefined"
                :aria-sort="ariaSort(h.col)"
              >
                <slot :name="`head-${h.col.key}`" :column="h.col">
                  <button v-if="h.col.sortable" type="button" data-part="sort" :data-order="orderOf(h.col)" @click="cycleSort(h.col)">
                    <span>{{ h.col.title }}</span>
                    <svg data-part="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path data-dir="asc" data-shape="chevron" d="m8 9 4-4 4 4" />
                      <path data-dir="desc" data-shape="chevron" d="m8 15 4 4 4-4" />
                      <path data-dir="asc" data-shape="caret" d="M12 2.5 20 11H4Z" />
                      <path data-dir="desc" data-shape="caret" d="M12 21.5 4 13h16Z" />
                    </svg>
                  </button>
                  <template v-else>{{ h.col.title }}</template>
                </slot>
              </th>
            </template>
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
            <tr
              v-for="j in anyLines ? lineCount(row) : 1"
              :key="j"
              data-part="row"
              :data-state="rowState(row)"
              :data-line="anyLines ? j - 1 : undefined"
              :data-line-last="anyLines && j === lineCount(row) ? '' : undefined"
              :data-drop="dropAt?.key === keyOf(row) && dragging !== keyOf(row) && j === (dropAt.position === 'before' ? 1 : anyLines ? lineCount(row) : 1) ? dropAt.position : undefined"
              :draggable="sortableRows && armed === keyOf(row) ? 'true' : undefined"
              @click="emit('row-click', row, i)"
              @dragstart="onRowDragStart($event, row)"
              @dragover="onRowDragOver($event, row)"
              @drop="onRowDrop"
              @dragend="endDrag"
              @mouseenter="anyLines && (hoverKey = keyOf(row))"
              @mouseleave="anyLines && hoverKey === keyOf(row) && (hoverKey = null)"
            >
              <template v-if="j === 1">
                <td v-if="handleColumn" data-part="cell" data-col="drag" :rowspan="anyLines && lineCount(row) > 1 ? lineCount(row) : undefined" @click.stop>
                  <button
                    type="button"
                    data-part="drag-handle"
                    :data-key="keyOf(row)"
                    :aria-label="L.dragHandle"
                    @click.stop
                    @keydown="onHandleKey($event, i)"
                    @mousedown="armed = keyOf(row)"
                    @mouseup="dragging === null && (armed = null)"
                    @touchstart.passive="armed = keyOf(row)"
                  >
                    <ArIcon name="grip" size="sm" />
                  </button>
                </td>
                <td
                  v-if="selectable"
                  data-part="cell"
                  data-col="select"
                  :rowspan="anyLines && lineCount(row) > 1 ? lineCount(row) : undefined"
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
                      <ArIcon line v-if="selectedSet.has(keyOf(row))" name="check" size="sm" />
                    </span>
                  </span>
                </td>
                <td
                  v-if="expandable"
                  data-part="cell"
                  data-col="expand"
                  :rowspan="anyLines && lineCount(row) > 1 ? lineCount(row) : undefined"
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
                    <ArIcon line name="cr" size="sm" />
                  </button>
                </td>
              </template>
              <template v-for="c in cols" :key="c.key">
                <td
                  v-if="(j === 1 || c.lines) && spanOf(row, c, i) > 0"
                  data-part="cell"
                  :rowspan="rowspanOf(row, c, i) > 1 ? rowspanOf(row, c, i) : undefined"
                  :data-align="alignOf(c)"
                  :data-numeric="c.numeric || undefined"
                  :data-emphasis="c.emphasis"
                  :data-blank="(!canEdit(row, c) && isBlank(cellValue(row, c, lineOf(c, j - 1))) && (!c.lines || j === 1)) || undefined"
                  :data-sticky="stickAttr(c)"
                  :data-sticky-edge="edgeAttr(c)"
                  :data-total="c.total || undefined"
                  :data-group-start="groupStart(c) || undefined"
                  :data-editing="canEdit(row, c) || undefined"
                  :data-line-cell="(anyLines && c.lines) || undefined"
                  :data-edge="c === cols[0] ? 'first' : c === cols[cols.length - 1] ? 'last' : undefined"
                  :style="stickStyle(c)"
                >
                  <button
                    v-if="sortableRows && !handleColumn && c === cols[0] && j === 1"
                    type="button"
                    data-part="drag-handle"
                    :data-key="keyOf(row)"
                    :aria-label="L.dragHandle"
                    @click.stop
                    @keydown="onHandleKey($event, i)"
                    @mousedown="armed = keyOf(row)"
                    @mouseup="dragging === null && (armed = null)"
                    @touchstart.passive="armed = keyOf(row)"
                  >
                    <ArIcon name="grip" size="sm" />
                  </button>
                  <slot
                    :name="`cell-${c.key}`"
                    :row="row"
                    :value="cellValue(row, c, lineOf(c, j - 1))"
                    :index="i"
                    :line="lineOf(c, j - 1)"
                    :Default="defaultOf(row, c, lineOf(c, j - 1))"
                  >
                    <ArTableCellBody v-bind="bodyProps(row, c, i, lineOf(c, j - 1))" />
                  </slot>
                </td>
              </template>
              <td
                v-if="hasActions && j === 1"
                data-part="cell"
                data-col="actions"
                data-align="end"
                :rowspan="anyLines && lineCount(row) > 1 ? lineCount(row) : undefined"
                @click.stop
              >
                <span data-part="actions"><slot name="actions" :row="row" :index="i" /></span>
              </td>
            </tr>
            <tr v-if="expandable && isOpen(row)" data-part="expanded-row">
              <td v-if="handleColumn" data-col="drag" />
              <td v-if="selectable" data-col="select" />
              <td :colspan="colspan - (selectable ? 1 : 0) - (handleColumn ? 1 : 0)"><slot name="expanded" :row="row" /></td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="footer" data-part="foot">
          <tr>
            <td v-if="handleColumn" data-part="cell" data-col="drag" />
            <td v-if="selectable" data-part="cell" data-col="select" :data-sticky="anySticky ? 'start' : undefined" :style="stick('__select')" />
            <td v-if="expandable" data-part="cell" data-col="expand" :data-sticky="anySticky ? 'start' : undefined" :style="stick('__expand')" />
            <td
              v-for="f in footCells"
              :key="f.col.key"
              data-part="cell"
              :colspan="f.span > 1 ? f.span : undefined"
              :data-align="alignOf(f.col)"
              :data-numeric="f.col.numeric || undefined"
              :data-sticky="stickAttr(f.col)"
              :data-sticky-edge="edgeAttr(f.col)"
              :data-total="f.col.total || undefined"
              :data-group-start="groupStart(f.col) || undefined"
              :style="stickStyle(f.col)"
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
    <span v-if="sortableRows" data-part="status" data-ar-visually-hidden aria-live="polite">{{ announce }}</span>
  </div>
</template>
