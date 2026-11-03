<script setup lang="ts" generic="Row extends object">
/**
 * ArTreeTable 1.0 — 列のある木の表。1列目が木（字下げ・開け閉め・つなぎの線）、ほかの列は値、右端に行の操作。
 * draggable でつまみをつかんで行を動かす（前・後・子に）。キーボードでも動かせる（つまみで Alt+↑↓←→）。
 * キーボード（WAI-ARIA の treegrid）：行で ↑↓ で移り、→ で開く／子へ、← で閉じる／親へ、Home / End、Enter で row-click。
 */
import { computed, nextTick, ref, useSlots, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArEmpty from "./ArEmpty.vue";
import { useDesignForm } from "../provider/context";
import type { ArRowKey } from "./ArTable.contract";
import type { ArTreeTableColumn, ArTreeTableDrop, ArTreeTableLabels, ArTreeTableProps } from "./ArTreeTable.contract";

const props = withDefaults(defineProps<ArTreeTableProps<Row>>(), {
  childrenKey: "children",
  expanded: undefined,
  defaultExpandAll: true,
  draggable: false,
  allowDrop: undefined,
  footer: null,
  emptyText: "データがありません",
  blank: "—",
  labels: () => ({}),
});
const emit = defineEmits<{
  "update:expanded": [keys: ArRowKey[]];
  "update:rows": [rows: Row[]];
  drop: [drop: ArTreeTableDrop];
  "row-click": [row: Row];
}>();

/** 形（ArDesign.forms.ArTreeTable.toggle）：box は四角の中の −／＋（antd の Tree の showLine）。 */
const toggleForm = useDesignForm<"chevron" | "box">("ArTreeTable", "toggle", "chevron");
const L = computed<ArTreeTableLabels>(() => ({
  expand: "開く",
  collapse: "閉じる",
  dragHandle: "動かす（ドラッグ、または Alt+矢印）",
  actions: "操作",
  moved: "動かしました",
  ...props.labels,
}));

const keyOf = (row: Row): ArRowKey =>
  typeof props.rowKey === "function" ? props.rowKey(row) : (row[props.rowKey] as ArRowKey);
const kidsOf = (row: Row): readonly Row[] => ((row as Record<string, unknown>)[props.childrenKey] as readonly Row[] | undefined) ?? [];
const valueOf = (row: Row, col: ArTreeTableColumn<Row>) => (col.value ? col.value(row) : (row as Record<string, unknown>)[col.key]);
const isBlank = (v: unknown) => v === null || v === undefined || v === "";
const alignOf = (col: ArTreeTableColumn<Row>) => col.align ?? (col.numeric ? "end" : "start");

/* ---- 開いている行 ---- */
function branches(list: readonly Row[], out: ArRowKey[] = []): ArRowKey[] {
  for (const r of list)
    if (kidsOf(r).length) {
      out.push(keyOf(r));
      branches(kidsOf(r), out);
    }
  return out;
}
const inner = ref<ArRowKey[]>(props.defaultExpandAll ? branches(props.rows) : []);
const openSet = computed(() => new Set(props.expanded ?? inner.value));
function setOpen(key: ArRowKey, open: boolean) {
  const s = new Set(openSet.value);
  if (open) s.add(key);
  else s.delete(key);
  inner.value = [...s];
  emit("update:expanded", [...s]);
}

/* ---- 見えている行（つなぎの線の形も） ---- */
interface Line {
  row: Row;
  key: ArRowKey;
  depth: number;
  parent: Row | null;
  siblings: readonly Row[];
  index: number;
  branch: boolean;
  open: boolean;
  /** 上の段ごとに、縦の線を通すか（その段の行の下に、まだ兄弟が続く）。 */
  through: boolean[];
  last: boolean;
}
const lines = computed<Line[]>(() => {
  const out: Line[] = [];
  const walk = (list: readonly Row[], depth: number, parent: Row | null, through: boolean[]) =>
    list.forEach((row, index) => {
      const key = keyOf(row);
      const branch = kidsOf(row).length > 0;
      const open = branch && openSet.value.has(key);
      const last = index === list.length - 1;
      out.push({ row, key, depth, parent, siblings: list, index, branch, open, through, last });
      if (open) walk(kidsOf(row), depth + 1, row, [...through, !last]);
    });
  walk(props.rows, 0, null, []);
  return out;
});
/** つなぎの線：段ごとの縦線（through：下にまだ兄弟が続く段）、自分の段の「└」（corner）、開いた行の開け閉めから下への線（down）。 */
function guidesOf(l: Line) {
  const g: { col: number; kind: "through" | "corner" | "down" }[] = [];
  l.through.forEach((t, col) => {
    if (col < l.depth - 1 && t) g.push({ col, kind: "through" });
  });
  if (l.depth > 0) {
    if (!l.last) g.push({ col: l.depth - 1, kind: "through" });
    g.push({ col: l.depth - 1, kind: "corner" });
  }
  if (l.open) g.push({ col: l.depth, kind: "down" });
  return g;
}

/* ---- フォーカス（行を1つだけ Tab で止める） ---- */
const rootEl = ref<HTMLElement | null>(null);
const active = ref<ArRowKey | null>(null);
const focusKey = computed(() => {
  const keys = lines.value.map((l) => l.key);
  return active.value !== null && keys.includes(active.value) ? active.value : (keys[0] ?? null);
});
function focusRow(key: ArRowKey, part: "row" | "drag-handle" = "row") {
  active.value = key;
  void nextTick(() =>
    Array.from(rootEl.value?.querySelectorAll<HTMLElement>(`[data-part="${part}"]`) ?? [])
      .find((el) => el.dataset.key === String(key))
      ?.focus(),
  );
}
function onRowKey(e: KeyboardEvent, l: Line) {
  if (e.target !== e.currentTarget) return;
  const i = lines.value.indexOf(l);
  const go = (j: number) => {
    const t = lines.value[j];
    if (t) focusRow(t.key);
  };
  switch (e.key) {
    case "ArrowDown":
      go(i + 1);
      break;
    case "ArrowUp":
      go(i - 1);
      break;
    case "ArrowRight":
      if (l.branch && !l.open) setOpen(l.key, true);
      else if (l.open) go(i + 1);
      break;
    case "ArrowLeft":
      if (l.open) setOpen(l.key, false);
      else if (l.parent) focusRow(keyOf(l.parent));
      break;
    case "Home":
      go(0);
      break;
    case "End":
      go(lines.value.length - 1);
      break;
    case "Enter":
      emit("row-click", l.row);
      break;
    default:
      return;
  }
  e.preventDefault();
}

/* ---- 動かす ---- */
const announce = ref("");
function contains(row: Row, key: ArRowKey): boolean {
  return keyOf(row) === key || kidsOf(row).some((c) => contains(c, key));
}
function find(key: ArRowKey): Row | undefined {
  return lines.value.find((l) => l.key === key)?.row;
}
function canDrop(d: ArTreeTableDrop): boolean {
  const src = find(d.key);
  if (!src || d.key === d.target || contains(src, d.target)) return false;
  return props.allowDrop ? props.allowDrop(d) : true;
}
/** 木から key の行を抜き、target の前・後・中に入れた新しい木を作る（元のデータは変えない）。 */
function moved(list: readonly Row[], d: ArTreeTableDrop): Row[] {
  let taken: Row | undefined;
  const take = (rows: readonly Row[]): Row[] =>
    rows.flatMap((r) => {
      if (keyOf(r) === d.key) {
        taken = r;
        return [];
      }
      const kids = kidsOf(r);
      return kids.length ? [{ ...r, [props.childrenKey]: take(kids) } as Row] : [r];
    });
  const rest = take(list);
  if (!taken) return [...list];
  const put = (rows: readonly Row[]): Row[] =>
    rows.flatMap((r) => {
      const kids = kidsOf(r);
      const self = kids.length || d.position === "inside" ? ({ ...r, [props.childrenKey]: put(kids) } as Row) : r;
      if (keyOf(r) !== d.target) return [self];
      if (d.position === "inside") return [{ ...r, [props.childrenKey]: [...put(kids), taken!] } as Row];
      return d.position === "before" ? [taken!, self] : [self, taken!];
    });
  return put(rest);
}
function commit(d: ArTreeTableDrop, focus = false) {
  if (!canDrop(d)) return;
  emit("drop", d);
  emit("update:rows", moved(props.rows, d));
  if (d.position === "inside" && !openSet.value.has(d.target)) setOpen(d.target, true);
  announce.value = L.value.moved;
  if (focus) focusRow(d.key, "drag-handle");
}
function onHandleKey(e: KeyboardEvent, l: Line) {
  if (!e.altKey) return;
  let d: ArTreeTableDrop | null = null;
  if (e.key === "ArrowUp" && l.index > 0) d = { key: l.key, target: keyOf(l.siblings[l.index - 1]!), position: "before" };
  else if (e.key === "ArrowDown" && l.index < l.siblings.length - 1) d = { key: l.key, target: keyOf(l.siblings[l.index + 1]!), position: "after" };
  else if (e.key === "ArrowRight" && l.index > 0) d = { key: l.key, target: keyOf(l.siblings[l.index - 1]!), position: "inside" };
  else if (e.key === "ArrowLeft" && l.parent) d = { key: l.key, target: keyOf(l.parent), position: "after" };
  else if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
  e.preventDefault();
  if (d) commit(d, true);
}
const armed = ref<ArRowKey | null>(null);
const dragging = ref<ArRowKey | null>(null);
const over = ref<{ key: ArRowKey; position: ArTreeTableDrop["position"] } | null>(null);
function onDragStart(e: DragEvent, l: Line) {
  if (!props.draggable || armed.value !== l.key) return e.preventDefault();
  dragging.value = l.key;
  e.dataTransfer?.setData("text/plain", String(l.key));
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
}
function onDragOver(e: DragEvent, l: Line) {
  if (dragging.value === null) return;
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const y = box.height ? (e.clientY - box.top) / box.height : 1;
  const position: ArTreeTableDrop["position"] = y < 0.3 ? "before" : y > 0.7 ? "after" : "inside";
  if (!canDrop({ key: dragging.value, target: l.key, position })) {
    over.value = null;
    return;
  }
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  over.value = { key: l.key, position };
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  const src = dragging.value;
  const at = over.value;
  endDrag();
  if (src !== null && at) commit({ key: src, target: at.key, position: at.position });
}
function endDrag() {
  dragging.value = null;
  over.value = null;
  armed.value = null;
}
watch(
  () => props.rows,
  () => {
    if (active.value !== null && !lines.value.some((l) => l.key === active.value)) active.value = null;
  },
);

const rowState = (l: Line) => [l.key === dragging.value && "dragging"].filter(Boolean).join(" ") || undefined;
const colspan = computed(() => props.columns.length + (hasActions.value ? 1 : 0));
const slots = useSlots();
const hasActions = computed(() => !!slots.actions);
</script>

<template>
  <div ref="rootEl" data-ar="tree-table" data-part="root" :data-toggle="toggleForm" :data-draggable="draggable || undefined">
    <div data-part="viewport">
      <table data-part="table" role="treegrid" :aria-label="caption">
        <colgroup>
          <col v-for="c in columns" :key="c.key" :style="c.width ? { width: `${c.width}px` } : undefined" />
          <col v-if="hasActions" data-col="actions" />
        </colgroup>
        <thead data-part="head">
          <tr role="row">
            <th v-for="c in columns" :key="c.key" data-part="header-cell" role="columnheader" scope="col" :data-align="alignOf(c)">
              <slot :name="`head-${c.key}`" :column="c">{{ c.title }}</slot>
            </th>
            <th v-if="hasActions" data-part="header-cell" data-col="actions" role="columnheader" scope="col">
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
          <tr v-if="!lines.length">
            <td data-part="empty" :colspan="colspan">
              <slot name="empty"><ArEmpty :text="emptyText" /></slot>
            </td>
          </tr>
          <tr
            v-for="l in lines"
            :key="l.key"
            data-part="row"
            role="row"
            :data-key="l.key"
            :data-depth="l.depth"
            :data-state="rowState(l)"
            :data-drop="over?.key === l.key ? over.position : undefined"
            :aria-level="l.depth + 1"
            :aria-setsize="l.siblings.length"
            :aria-posinset="l.index + 1"
            :aria-expanded="l.branch ? l.open : undefined"
            :tabindex="l.key === focusKey ? 0 : -1"
            :draggable="draggable && armed === l.key ? 'true' : undefined"
            @keydown="onRowKey($event, l)"
            @focus="active = l.key"
            @click="emit('row-click', l.row)"
            @dragstart="onDragStart($event, l)"
            @dragover="onDragOver($event, l)"
            @drop="onDrop"
            @dragend="endDrag"
          >
            <td
              v-for="(c, ci) in columns"
              :key="c.key"
              data-part="cell"
              role="gridcell"
              :data-align="alignOf(c)"
              :data-numeric="c.numeric || undefined"
              :data-tree="ci === 0 || undefined"
              :style="ci === 0 ? { '--ar-tt-depth': l.depth } : undefined"
            >
              <template v-if="ci === 0">
                <span v-for="(g, gi) in guidesOf(l)" :key="gi" data-part="guide" :data-kind="g.kind" :style="{ '--ar-tt-col': g.col }" aria-hidden="true" />
                <span data-part="tree">
                  <button
                    v-if="l.branch"
                    type="button"
                    data-part="toggle"
                    tabindex="-1"
                    :data-state="l.open ? 'open' : 'closed'"
                    :aria-label="l.open ? L.collapse : L.expand"
                    @click.stop="setOpen(l.key, !l.open)"
                  >
                    <span v-if="toggleForm === 'box'" data-part="toggle-box"><ArIcon line :name="l.open ? 'minus' : 'plus'" size="sm" /></span>
                    <ArIcon v-else line :name="l.open ? 'cd' : 'cr'" size="sm" />
                  </button>
                  <span v-else data-part="toggle" data-state="leaf" aria-hidden="true" />
                  <button
                    v-if="draggable"
                    type="button"
                    data-part="drag-handle"
                    :data-key="l.key"
                    :aria-label="L.dragHandle"
                    @click.stop
                    @keydown="onHandleKey($event, l)"
                    @mousedown="armed = l.key"
                    @mouseup="dragging === null && (armed = null)"
                    @touchstart.passive="armed = l.key"
                  >
                    <ArIcon name="grip" size="sm" />
                  </button>
                  <span data-part="content">
                    <slot :name="`cell-${c.key}`" :row="l.row" :value="valueOf(l.row, c)" :depth="l.depth">{{
                      isBlank(valueOf(l.row, c)) ? blank : valueOf(l.row, c)
                    }}</slot>
                  </span>
                </span>
              </template>
              <slot v-else :name="`cell-${c.key}`" :row="l.row" :value="valueOf(l.row, c)" :depth="l.depth">{{
                isBlank(valueOf(l.row, c)) ? blank : valueOf(l.row, c)
              }}</slot>
            </td>
            <td v-if="hasActions" data-part="cell" data-col="actions" role="gridcell" @click.stop>
              <span data-part="actions"><slot name="actions" :row="l.row" /></span>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="footer" data-part="foot">
          <tr>
            <td v-for="c in columns" :key="c.key" data-part="cell" :data-align="alignOf(c)" :data-numeric="c.numeric || undefined">
              <slot :name="`foot-${c.key}`" :value="footer[c.key]">{{ footer[c.key] ?? "" }}</slot>
            </td>
            <td v-if="hasActions" data-part="cell" data-col="actions" />
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-if="$slots.below" data-part="below"><slot name="below" /></div>
    <span v-if="draggable" data-part="status" data-ar-visually-hidden aria-live="polite">{{ announce }}</span>
  </div>
</template>
