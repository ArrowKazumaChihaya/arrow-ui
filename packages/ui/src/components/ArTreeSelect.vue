<script setup lang="ts">
/**
 * ArTreeSelect 1.1 — 部署のような木から選ぶ（プルダウンの中に木）。
 * multiple はチェックで選び、一部だけ選んでいる親は indeterminate（テーマ色に白い横線）。1つ選ぶときは選んだ行が淡いテーマ色。
 * キーボード：↓↑で行を動く、→ で開く・子へ、← で閉じる・親へ、Enter・Space で選ぶ／チェック、Escape で閉じる。
 * 1.1：「子店舗を含める」の切り替え（v-model:includeChildren）と、プルダウンの下の操作（actions・action）。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArButton from "./ArButton.vue";
import ArCheckbox from "./ArCheckbox.vue";
import ArIcon from "./ArIcon.vue";
import ArTextInput from "./ArTextInput.vue";
import ArFloat from "../internal/ArFloat.vue";
import { useId } from "../provider/context";
import { createTypeahead, fold, isPrintableKey, splitMatch } from "../internal/options";
import type { ArTreeSelectNode, ArTreeSelectProps, ArTreeSelectValue } from "./ArTreeSelect.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArTreeSelectProps>(), {
  multiple: false,
  checkStrictly: false,
  leafOnly: false,
  expanded: undefined,
  defaultExpandAll: false,
  searchable: false,
  searchPlaceholder: "探す",
  placeholder: "選んでください",
  variant: "field",
  icon: undefined,
  showPath: true,
  maxTags: 2,
  size: "md",
  invalid: false,
  disabled: false,
  clearable: false,
  emptyText: "選べるものがありません",
  block: false,
  listHeight: 300,
  label: undefined,
  id: undefined,
  nullOption: false,
  includeChildren: undefined,
  includeChildrenLabel: "子店舗を含める",
  includeChildrenMark: "子店舗を含む",
  actions: () => [],
});
const emit = defineEmits<{
  "update:modelValue": [value: ArTreeSelectValue | null | ArTreeSelectValue[]];
  change: [value: ArTreeSelectValue | null | ArTreeSelectValue[]];
  "update:expanded": [value: ArTreeSelectValue[]];
  "open-change": [open: boolean];
  "update:includeChildren": [value: boolean];
  action: [value: string];
}>();

const uid = useId("ar-tree-select");
const rootId = computed(() => props.id ?? uid);
const listId = `${uid}-tree`;
const root = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const search = ref<InstanceType<typeof ArTextInput> | null>(null);
const open = ref(false);
const query = ref("");
const active = ref<ArTreeSelectValue | null>(null);

/** 「未選択」の行の値（中だけで使う）。 */
const NULL_VALUE = "\u0000ar-tree-null";
/** 先頭に「未選択」の行を足した木（nullOption）。 */
const treeNodes = computed<readonly ArTreeSelectNode[]>(() =>
  props.nullOption && !props.multiple ? [{ value: NULL_VALUE, label: typeof props.nullOption === "string" ? props.nullOption : props.placeholder }, ...props.tree] : props.tree,
);
/** 値 → 項目・親・深さ。 */
interface Info {
  node: ArTreeSelectNode;
  parent: ArTreeSelectValue | null;
  level: number;
  leaves: ArTreeSelectValue[];
}
const index = computed(() => {
  const map = new Map<ArTreeSelectValue, Info>();
  const walk = (nodes: readonly ArTreeSelectNode[], parent: ArTreeSelectValue | null, level: number): ArTreeSelectValue[] => {
    const all: ArTreeSelectValue[] = [];
    for (const n of nodes) {
      const info: Info = { node: n, parent, level, leaves: [] };
      map.set(n.value, info);
      info.leaves = n.children?.length ? walk(n.children, n.value, level + 1).filter((v) => !map.get(v)?.node.disabled) : n.disabled ? [] : [n.value];
      all.push(...(n.children?.length ? info.leaves : [n.value]));
    }
    return all;
  };
  walk(treeNodes.value, null, 1);
  return map;
});
const pathOf = (v: ArTreeSelectValue): ArTreeSelectNode[] => {
  const out: ArTreeSelectNode[] = [];
  let cur: ArTreeSelectValue | null = v;
  while (cur !== null) {
    const info = index.value.get(cur);
    if (!info) break;
    out.unshift(info.node);
    cur = info.parent;
  }
  return out;
};
const values = computed<ArTreeSelectValue[]>(() =>
  props.multiple ? (Array.isArray(props.modelValue) ? [...props.modelValue] : []) : props.modelValue == null ? [] : [props.modelValue as ArTreeSelectValue],
);
const checkedSet = computed(() => new Set(values.value));
function checkState(n: ArTreeSelectNode): "on" | "mixed" | "off" {
  const leaves = index.value.get(n.value)?.leaves ?? [];
  if (props.checkStrictly || !n.children?.length) return checkedSet.value.has(n.value) ? "on" : "off";
  const c = leaves.filter((v) => checkedSet.value.has(v)).length;
  return c === 0 ? "off" : c === leaves.length ? "on" : "mixed";
}

/** 開いている部署。v-model:expanded がなければ中で持つ。 */
const innerExpanded = ref<ArTreeSelectValue[]>([]);
function initialExpanded() {
  if (props.defaultExpandAll) return [...index.value.values()].filter((i) => i.node.children?.length).map((i) => i.node.value);
  const set = new Set<ArTreeSelectValue>();
  for (const v of values.value) for (const n of pathOf(v).slice(0, -1)) set.add(n.value);
  return [...set];
}
innerExpanded.value = initialExpanded();
const expandedSet = computed(() => new Set(props.expanded ?? innerExpanded.value));
function setExpanded(v: ArTreeSelectValue, on: boolean) {
  const next = new Set(expandedSet.value);
  if (on) next.add(v);
  else next.delete(v);
  innerExpanded.value = [...next];
  emit("update:expanded", [...next]);
}

/** 探すとき：合う項目とその親だけを出し、全部開く。 */
const matchSet = computed(() => {
  const q = fold(query.value.trim());
  if (!q) return null;
  const set = new Set<ArTreeSelectValue>();
  for (const [v, info] of index.value) if (fold(info.node.label).includes(q)) for (const n of pathOf(v)) set.add(n.value);
  return set;
});
interface Row {
  node: ArTreeSelectNode;
  level: number;
  hasChildren: boolean;
  isOpen: boolean;
}
const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  const m = matchSet.value;
  const walk = (nodes: readonly ArTreeSelectNode[], level: number) => {
    for (const n of nodes) {
      if (m && !m.has(n.value)) continue;
      const hasChildren = !!n.children?.length;
      const isOpen = hasChildren && (m ? true : expandedSet.value.has(n.value));
      out.push({ node: n, level, hasChildren, isOpen });
      if (isOpen) walk(n.children!, level + 1);
    }
  };
  walk(treeNodes.value, 1);
  return out;
});
const rowIndex = computed(() => rows.value.findIndex((r) => r.node.value === active.value));
const nodeId = (v: ArTreeSelectValue) => `${uid}-n-${String(v).replace(/[^\w-]/g, "_")}`;
const activeId = computed(() => (open.value && active.value !== null ? nodeId(active.value) : undefined));
const selectable = (r: Row) => !r.node.disabled && r.node.selectable !== false && (props.multiple || !props.leafOnly || !r.hasChildren);

function setOpen(v: boolean) {
  if (v === open.value || (v && props.disabled)) return;
  open.value = v;
  emit("open-change", v);
  if (v) {
    query.value = "";
    if (!props.expanded) {
      const next = new Set(innerExpanded.value);
      for (const val of values.value) for (const n of pathOf(val).slice(0, -1)) next.add(n.value);
      innerExpanded.value = [...next];
    }
    active.value = values.value[0] ?? rows.value.find((r) => !r.node.disabled)?.node.value ?? null;
    nextTick(() => {
      if (props.searchable) search.value?.focus();
      scrollActive();
    });
  }
}
function close(refocus = true) {
  setOpen(false);
  if (refocus) root.value?.focus();
}
function commit(v: ArTreeSelectValue | null | ArTreeSelectValue[]) {
  emit("update:modelValue", v);
  emit("change", v);
}
function toggle(r: Row) {
  if (r.node.disabled) return;
  active.value = r.node.value;
  if (props.multiple) {
    if (props.checkStrictly && !selectable(r)) {
      if (r.hasChildren) setExpanded(r.node.value, !r.isOpen);
      return;
    }
    const leaves = props.checkStrictly ? [r.node.value] : index.value.get(r.node.value)?.leaves ?? [];
    const on = checkState(r.node) !== "on";
    const set = new Set(values.value);
    for (const v of leaves) (on ? set.add(v) : set.delete(v));
    commit([...set]);
  } else if (selectable(r)) {
    const v = r.node.value === NULL_VALUE ? null : r.node.value;
    if (v !== props.modelValue) commit(v);
    close();
  } else if (r.hasChildren) setExpanded(r.node.value, !r.isOpen);
}
function scrollActive() {
  if (activeId.value) document.getElementById(activeId.value)?.scrollIntoView?.({ block: "nearest" });
}
watch(active, () => nextTick(scrollActive));

const typeahead = createTypeahead();
function onKey(e: KeyboardEvent) {
  if (props.disabled) return;
  const i = rowIndex.value;
  const list = rows.value;
  const fromSearch = e.target !== root.value;
  const move = (to: number) => {
    const r = list[Math.max(0, Math.min(list.length - 1, to))];
    if (r) active.value = r.node.value;
  };
  switch (e.key) {
    case "ArrowDown":
    case "ArrowUp":
      e.preventDefault();
      if (!open.value) return setOpen(true);
      return move(i < 0 ? 0 : i + (e.key === "ArrowDown" ? 1 : -1));
    case "ArrowRight": {
      if (!open.value || fromSearch) return;
      e.preventDefault();
      const r = list[i];
      if (r?.hasChildren) r.isOpen ? move(i + 1) : setExpanded(r.node.value, true);
      return;
    }
    case "ArrowLeft": {
      if (!open.value || fromSearch) return;
      e.preventDefault();
      const r = list[i];
      if (r?.hasChildren && r.isOpen) setExpanded(r.node.value, false);
      else {
        const p = r ? index.value.get(r.node.value)?.parent : null;
        if (p !== null && p !== undefined) active.value = p;
      }
      return;
    }
    case "Home":
    case "End":
      if (!open.value || fromSearch) return;
      e.preventDefault();
      return move(e.key === "Home" ? 0 : list.length - 1);
    case "Enter":
      e.preventDefault();
      if (!open.value) return setOpen(true);
      if (list[i]) toggle(list[i]!);
      return;
    case " ":
      if (fromSearch) return;
      e.preventDefault();
      if (!open.value) return setOpen(true);
      if (list[i]) toggle(list[i]!);
      return;
    case "Tab":
      if (open.value) setOpen(false);
      return;
    default:
      if (!fromSearch && isPrintableKey(e)) {
        if (!open.value) setOpen(true);
        const j = typeahead(e.key, list.map((r) => r.node.label), i, (k) => !list[k]?.node.disabled);
        if (j >= 0) move(j);
      }
  }
}

const selectedNodes = computed(() => values.value.map((value) => {
  const node = index.value.get(value)?.node ?? { value, label: String(value) };
  const path = props.showPath ? pathOf(value).map((item) => item.label).join(" / ") : "";
  return { ...node, label: path || node.label };
}));
const display = computed(() => {
  const first = values.value[0];
  if (first === undefined) return "";
  const text = props.showPath ? pathOf(first).map((n) => n.label).join(" / ") : (index.value.get(first)?.node.label ?? String(first));
  return values.value.length > 1 ? `${index.value.get(first)?.node.label ?? first} ほか${values.value.length - 1}件` : text;
});
const empty = computed(() => values.value.length === 0);
const useTags = computed(() => props.multiple && props.variant === "field");
const canClear = computed(() => props.clearable && !empty.value && !props.disabled);
function removeTag(v: ArTreeSelectValue) {
  commit(values.value.filter((x) => x !== v));
}
function clear() {
  commit(props.multiple ? [] : null);
  root.value?.focus();
}
/** 「子店舗を含める」を出すか（v-model:includeChildren を渡したとき）。 */
const hasInclude = computed(() => typeof props.includeChildren === "boolean");
const includeId = `${uid}-include`;
/** 押す所の「子店舗を含む」の印：オンで、選んでいる部署に下の部署があるとき。 */
const showIncludeMark = computed(
  () => hasInclude.value && props.includeChildren && !props.multiple && values.value.some((v) => !!index.value.get(v)?.node.children?.length),
);
function toggleInclude() {
  emit("update:includeChildren", !props.includeChildren);
}
function runAction(v: string) {
  emit("action", v);
  close();
}
const state = computed(
  () => [open.value && "open", empty.value && "empty", props.invalid && "invalid", props.disabled && "disabled"].filter(Boolean).join(" ") || undefined,
);
defineExpose({ focus: () => root.value?.focus(), open: () => setOpen(true), close: () => setOpen(false) });
</script>

<template>
  <div
    v-bind="$attrs"
    :id="rootId"
    ref="root"
    data-ar="tree-select"
    data-part="root"
    role="combobox"
    :tabindex="disabled ? -1 : 0"
    aria-haspopup="tree"
    :aria-expanded="open"
    :aria-controls="open ? listId : undefined"
    :aria-activedescendant="searchable ? undefined : activeId"
    :aria-label="label"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-disabled="disabled || undefined"
    :data-size="size"
    :data-variant="variant"
    :data-multiple="useTags || undefined"
    :data-block="block || undefined"
    :data-state="state"
    @click="!disabled && setOpen(!open)"
    @keydown="onKey"
  >
    <ArIcon v-if="icon" :name="icon" size="sm" data-part="icon" />
    <template v-if="useTags">
      <span v-if="!empty" data-part="tags">
        <span v-for="n in selectedNodes.slice(0, maxTags)" :key="String(n.value)" data-part="tag"
          ><span data-part="tag-label">{{ n.label }}</span><button type="button" data-part="tag-remove" tabindex="-1" :aria-label="`${n.label}を外す`" :disabled="disabled" @mousedown.prevent @click.stop="removeTag(n.value)">
            <ArIcon line name="x" size="sm" /></button
        ></span>
        <span v-if="selectedNodes.length > maxTags" data-part="tag" data-kind="more">+{{ selectedNodes.length - maxTags }}</span>
      </span>
      <span v-else data-part="placeholder">{{ placeholder }}</span>
    </template>
    <template v-else>
      <span v-if="!empty" data-part="value"><span data-part="value-text">{{ display }}</span></span>
      <span v-else data-part="placeholder">{{ placeholder }}</span>
      <span v-if="showIncludeMark" data-part="include-mark">{{ includeChildrenMark }}</span>
    </template>
    <button v-if="canClear" type="button" data-part="clear" tabindex="-1" aria-label="選んだものを消す" @mousedown.prevent @click.stop="clear">
      <ArIcon line name="x" size="sm" />
    </button>
    <ArIcon line name="cd" size="sm" data-part="arrow" />
    <ArFloat ar="tree-select-panel" :open="open" :anchor="root" match-width="min" :offset="6" @close="(r) => close(r === 'escape')">
      <div v-if="searchable" data-part="search">
        <ArTextInput
          ref="search"
          v-model="query"
          size="sm"
          type="search"
          block
          :placeholder="searchPlaceholder"
          :label="searchPlaceholder"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="open"
          :aria-controls="listId"
          :aria-activedescendant="activeId"
          @keydown="onKey"
        />
      </div>
      <div
        :id="listId"
        ref="listEl"
        data-part="list"
        role="tree"
        :aria-label="label"
        :aria-labelledby="label ? undefined : rootId"
        :aria-multiselectable="multiple || undefined"
        :style="{ maxHeight: `${listHeight}px` }"
        @mousedown.prevent
      >
        <div
          v-for="r in rows"
          :id="nodeId(r.node.value)"
          :key="String(r.node.value)"
          data-part="node"
          role="treeitem"
          :aria-level="r.level"
          :aria-expanded="r.hasChildren ? r.isOpen : undefined"
          :aria-selected="multiple ? undefined : values.includes(r.node.value)"
          :aria-checked="multiple && (!checkStrictly || selectable(r)) ? (checkState(r.node) === 'mixed' ? 'mixed' : checkState(r.node) === 'on') : undefined"
          :aria-disabled="r.node.disabled || undefined"
          :data-level="r.level"
          :style="{ '--ar-tree-level': r.level - 1 }"
          :data-state="
            [
              !multiple && values.includes(r.node.value) && 'selected',
              r.node.value === active && 'active',
              r.node.disabled && 'disabled',
              (!multiple || checkStrictly) && !selectable(r) && 'group',
            ]
              .filter(Boolean)
              .join(' ') || undefined
          "
          @click="toggle(r)"
          @mousemove="!r.node.disabled && (active = r.node.value)"
        >
          <span data-part="switch" :data-open="r.isOpen || undefined" @click.stop="r.hasChildren && setExpanded(r.node.value, !r.isOpen)">
            <ArIcon line v-if="r.hasChildren" :name="r.isOpen ? 'cd' : 'cr'" size="sm" />
          </span>
          <ArCheckbox
            v-if="multiple && (!checkStrictly || selectable(r))"
            decorative
            data-part="check"
            :model-value="checkState(r.node) === 'on'"
            :indeterminate="checkState(r.node) === 'mixed'"
            :disabled="r.node.disabled"
          />
          <span data-part="node-label"
            ><template v-for="(p, k) in splitMatch(r.node.label, query)" :key="k"
              ><mark v-if="p.match" data-part="match">{{ p.text }}</mark
              ><template v-else>{{ p.text }}</template></template
            ></span
          >
        </div>
        <div v-if="!rows.length" data-part="empty" role="status">
          {{ query ? `「${query}」は見つかりません` : emptyText }}
        </div>
      </div>
      <div v-if="hasInclude || actions.length" data-part="footer">
        <ArCheckbox
          v-if="hasInclude"
          :id="includeId"
          data-part="include"
          :model-value="!!includeChildren"
          @update:model-value="toggleInclude"
          @keydown.escape="close()"
          >{{ includeChildrenLabel }}</ArCheckbox
        >
        <div v-for="a in actions" :key="a.value" data-part="action">
          <ArButton tone="primary" block :icon="a.icon" @click="runAction(a.value)">{{ a.label }}</ArButton>
        </div>
      </div>
    </ArFloat>
  </div>
</template>
