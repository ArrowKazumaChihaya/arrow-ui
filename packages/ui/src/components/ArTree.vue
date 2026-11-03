<script setup lang="ts">
/**
 * ArTree 1.0 — 店舗・部署の階層。開け閉め、選んだものは淡いテーマ色、checkable は ArCheckbox、draggable はつまみで並べ替え。
 * キーボード（WAI-ARIA の tree）：↑↓ で移り、→ で開く／子へ、← で閉じる／親へ、Home / End、Enter で選ぶ、
 * Space でチェック（checkable のとき）、文字で飛ぶ、Alt+↑↓ で並べ替え（draggable のとき）。
 */
import { computed, nextTick, onMounted, onUpdated, ref } from "vue";
import ArCheckbox from "./ArCheckbox.vue";
import ArIcon from "./ArIcon.vue";
import type { ArTreeDrop, ArTreeKey, ArTreeNode, ArTreeProps } from "./ArTree.contract";

const props = withDefaults(defineProps<ArTreeProps>(), {
  modelValue: null,
  expanded: undefined,
  defaultExpandAll: false,
  checkable: false,
  checked: () => [],
  selectable: true,
  draggable: false,
  label: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [key: ArTreeKey];
  "update:expanded": [keys: ArTreeKey[]];
  "update:checked": [keys: ArTreeKey[]];
  select: [node: ArTreeNode];
  drop: [drop: ArTreeDrop];
}>();

interface Row {
  node: ArTreeNode;
  depth: number;
  parent: ArTreeNode | null;
  siblings: readonly ArTreeNode[];
  index: number;
  branch: boolean;
}

/* 開いているもの */
function allBranches(list: readonly ArTreeNode[], out: ArTreeKey[] = []): ArTreeKey[] {
  for (const n of list)
    if (n.children?.length) {
      out.push(n.key);
      allBranches(n.children, out);
    }
  return out;
}
const innerExpanded = ref<ArTreeKey[]>(props.defaultExpandAll ? allBranches(props.items) : []);
const expandedSet = computed(() => new Set(props.expanded ?? innerExpanded.value));
function setExpanded(key: ArTreeKey, open: boolean) {
  const s = new Set(expandedSet.value);
  if (open) s.add(key);
  else s.delete(key);
  innerExpanded.value = [...s];
  emit("update:expanded", [...s]);
}

/* 見えている行 */
const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  const walk = (list: readonly ArTreeNode[], depth: number, parent: ArTreeNode | null) =>
    list.forEach((node, index) => {
      const branch = !!node.children?.length;
      out.push({ node, depth, parent, siblings: list, index, branch });
      if (branch && expandedSet.value.has(node.key)) walk(node.children!, depth + 1, node);
    });
  walk(props.items, 0, null);
  return out;
});

/* チェック（親は子から決まる） */
const checkedSet = computed(() => new Set(props.checked));
function checkState(n: ArTreeNode): "on" | "off" | "some" {
  if (!n.children?.length) return checkedSet.value.has(n.key) ? "on" : "off";
  const st = n.children.map(checkState);
  if (st.every((s) => s === "on")) return "on";
  return st.some((s) => s !== "off") ? "some" : "off";
}
function toggleCheck(n: ArTreeNode) {
  if (n.disabled) return;
  const on = checkState(n) !== "on";
  const s = new Set(checkedSet.value);
  const mark = (x: ArTreeNode) => {
    if (x.disabled && x !== n) return;
    if (on) s.add(x.key);
    else s.delete(x.key);
    x.children?.forEach(mark);
  };
  mark(n);
  // 親の印を付け直す（子がすべて付いた親だけ入れる）
  const fix = (list: readonly ArTreeNode[]): boolean[] =>
    list.map((x) => {
      if (!x.children?.length) return s.has(x.key);
      const all = fix(x.children).every(Boolean);
      if (all) s.add(x.key);
      else s.delete(x.key);
      return all;
    });
  fix(props.items);
  emit("update:checked", [...s]);
}

/* 選ぶ・フォーカス */
const list = ref<HTMLElement | null>(null);
const active = ref<ArTreeKey | null>(null);
const focusKey = computed(() => {
  const keys = rows.value.map((r) => r.node.key);
  if (active.value !== null && keys.includes(active.value)) return active.value;
  if (props.modelValue !== null && keys.includes(props.modelValue)) return props.modelValue;
  return rows.value.find((r) => !r.node.disabled)?.node.key ?? null;
});
function focusRow(key: ArTreeKey) {
  active.value = key;
  void nextTick(() =>
    Array.from(list.value?.querySelectorAll<HTMLElement>('[data-part="node"]') ?? [])
      .find((el) => el.dataset.key === String(key))
      ?.focus(),
  );
}
function choose(r: Row) {
  active.value = r.node.key;
  if (r.node.disabled) return;
  if (!props.selectable) {
    if (r.branch) setExpanded(r.node.key, !expandedSet.value.has(r.node.key));
    return;
  }
  emit("update:modelValue", r.node.key);
  emit("select", r.node);
}

let typed = "";
let typedAt = 0;
function onKey(e: KeyboardEvent, r: Row) {
  const i = rows.value.indexOf(r);
  const open = expandedSet.value.has(r.node.key);
  const go = (j: number) => {
    const t = rows.value[j];
    if (t) focusRow(t.node.key);
  };
  if (e.altKey && props.draggable && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    e.preventDefault();
    if (r.node.fixed) return;
    const sib = r.siblings[r.index + (e.key === "ArrowUp" ? -1 : 1)];
    if (sib) emit("drop", { key: r.node.key, target: sib.key, position: e.key === "ArrowUp" ? "before" : "after" });
    focusRow(r.node.key);
    return;
  }
  switch (e.key) {
    case "ArrowDown":
      go(i + 1);
      break;
    case "ArrowUp":
      go(i - 1);
      break;
    case "ArrowRight":
      if (r.branch && !open) setExpanded(r.node.key, true);
      else if (r.branch) go(i + 1);
      break;
    case "ArrowLeft":
      if (r.branch && open) setExpanded(r.node.key, false);
      else if (r.parent) focusRow(r.parent.key);
      break;
    case "Home":
      go(0);
      break;
    case "End":
      go(rows.value.length - 1);
      break;
    case "Enter":
      choose(r);
      break;
    case " ":
      if (props.checkable) toggleCheck(r.node);
      else choose(r);
      break;
    default: {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      const now = Date.now();
      typed = now - typedAt > 600 ? e.key : typed + e.key;
      typedAt = now;
      const order = [...rows.value.slice(i + 1), ...rows.value.slice(0, i + 1)];
      const hit = order.find((x) => x.node.label.toLowerCase().startsWith(typed.toLowerCase()));
      if (hit) focusRow(hit.node.key);
      return;
    }
  }
  e.preventDefault();
}

/* ドラッグで並べ替え */
const dragging = ref<ArTreeKey | null>(null);
const over = ref<{ key: ArTreeKey; position: ArTreeDrop["position"] } | null>(null);
function onDragStart(e: DragEvent, r: Row) {
  if (!props.draggable || r.node.fixed) return e.preventDefault();
  dragging.value = r.node.key;
  e.dataTransfer?.setData("text/plain", String(r.node.key));
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
}
function isInside(key: ArTreeKey, target: ArTreeNode): boolean {
  return target.key === key || !!target.children?.some((c) => isInside(key, c));
}
function onDragOver(e: DragEvent, r: Row) {
  if (dragging.value === null) return;
  const src = rows.value.find((x) => x.node.key === dragging.value)?.node;
  if (!src || isInside(r.node.key, src)) return;
  e.preventDefault();
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const y = (e.clientY - box.top) / box.height;
  over.value = { key: r.node.key, position: y < 0.3 ? "before" : y > 0.7 ? "after" : "inside" };
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  if (dragging.value !== null && over.value) emit("drop", { key: dragging.value, target: over.value.key, position: over.value.position });
  dragging.value = null;
  over.value = null;
}
function onDragEnd() {
  dragging.value = null;
  over.value = null;
}

const rowState = (r: Row) =>
  [
    r.node.key === props.modelValue && props.selectable && "selected",
    r.node.disabled && "disabled",
    r.node.key === dragging.value && "dragging",
  ]
    .filter(Boolean)
    .join(" ") || undefined;

// 中のチェックは行が受けるので、Tab で止まらないようにする
const untab = () => list.value?.querySelectorAll<HTMLInputElement>('[data-part="check"] input').forEach((x) => (x.tabIndex = -1));
onMounted(untab);
onUpdated(untab);
</script>

<template>
  <div
    ref="list"
    data-ar="tree"
    data-part="root"
    role="tree"
    :aria-label="label"
    :aria-multiselectable="checkable || undefined"
    :data-draggable="draggable || undefined"
    @drop="onDrop"
  >
    <div
      v-for="r in rows"
      :key="r.node.key"
      data-part="node"
      role="treeitem"
      :data-key="r.node.key"
      :data-depth="r.depth"
      :data-state="rowState(r)"
      :data-drop="over?.key === r.node.key ? over.position : undefined"
      :style="{ '--ar-tree-depth': r.depth }"
      :aria-level="r.depth + 1"
      :aria-setsize="r.siblings.length"
      :aria-posinset="r.index + 1"
      :aria-expanded="r.branch ? expandedSet.has(r.node.key) : undefined"
      :aria-selected="selectable ? r.node.key === modelValue : undefined"
      :aria-checked="checkable ? (checkState(r.node) === 'some' ? 'mixed' : checkState(r.node) === 'on') : undefined"
      :aria-disabled="r.node.disabled || undefined"
      :tabindex="r.node.key === focusKey ? 0 : -1"
      :draggable="draggable && !r.node.fixed ? 'true' : undefined"
      @click="choose(r)"
      @keydown="onKey($event, r)"
      @focus="active = r.node.key"
      @dragstart="onDragStart($event, r)"
      @dragover="onDragOver($event, r)"
      @dragleave="over?.key === r.node.key && (over = null)"
      @dragend="onDragEnd"
    >
      <span v-if="draggable && r.branch && !r.node.fixed" data-part="handle" aria-hidden="true"><ArIcon line name="grip" size="sm" /></span>
      <span
        data-part="switcher"
        :data-state="r.branch ? (expandedSet.has(r.node.key) ? 'open' : 'closed') : 'leaf'"
        aria-hidden="true"
        @click.stop="r.branch ? setExpanded(r.node.key, !expandedSet.has(r.node.key)) : choose(r)"
      >
        <ArIcon line v-if="r.branch" :name="expandedSet.has(r.node.key) ? 'cd' : 'cr'" size="sm" />
        <ArIcon line v-else-if="draggable && !r.node.fixed" name="grip" size="sm" data-part="grip" />
      </span>
      <span v-if="checkable" data-part="check" @click.stop>
        <ArCheckbox
          :model-value="checkState(r.node) === 'on'"
          :indeterminate="checkState(r.node) === 'some'"
          :disabled="r.node.disabled"
          :label="r.node.label"
          @update:model-value="toggleCheck(r.node)"
        />
      </span>
      <ArIcon v-if="r.node.icon" :name="r.node.icon" size="sm" data-part="icon" />
      <span data-part="label">{{ r.node.label }}</span>
    </div>
  </div>
</template>
