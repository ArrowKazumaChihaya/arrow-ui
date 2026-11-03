<script setup lang="ts">
/**
 * ArMenu 1.0 — メニュー。inline（子メニューをその場で開く）・vertical（子メニューを右に浮かせる）・horizontal（横に並べる）。
 * 選んでいる項目：上の段はテーマ色の塗り（白文字）、子は淡い面とテーマ色の文字。権限がない項目は鍵と灰色。
 * ↑↓（horizontal は ←→）で移り、Enter・Space で選ぶ・子メニューを開く。→ で子メニューを開き、← で閉じる。
 */
import { computed, nextTick, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArFloat from "../internal/ArFloat.vue";
import ArMenuPanel from "../internal/ArMenuPanel.vue";
import { useId } from "../provider/context";
import type { ArMenuItem, ArMenuProps } from "./ArMenu.contract";

const props = withDefaults(defineProps<ArMenuProps>(), {
  selected: undefined,
  openKeys: undefined,
  mode: "inline",
  size: "md",
  bordered: true,
});
const emit = defineEmits<{ "update:selected": [key: string]; "update:openKeys": [keys: string[]]; select: [key: string, item: ArMenuItem] }>();
const root = ref<HTMLElement | null>(null);
const uid = useId("ar-menu");

const hasSelected = (it: ArMenuItem): boolean => it.key === props.selected || !!it.children?.some(hasSelected);
/** 渡されていなければ、選んでいる項目の親を開いておく。 */
const innerOpen = ref<string[]>(
  props.openKeys ? [...props.openKeys] : props.items.filter((it) => it.children?.length && it.type !== "group" && hasSelected(it)).map((it) => it.key),
);
const openList = computed(() => props.openKeys ?? innerOpen.value);
function setOpenKeys(keys: string[]) {
  innerOpen.value = keys;
  emit("update:openKeys", keys);
}
const usable = (it: ArMenuItem) => !it.disabled && !it.locked;
const isParent = (it: ArMenuItem) => it.type !== "group" && !!it.children?.length;

type Row =
  | { kind: "item"; item: ArMenuItem; level: number; parent?: string }
  | { kind: "group"; key: string; label: string }
  | { kind: "divider"; key: string };
/** inline・vertical の行（inline は開いている子も並べる）。 */
const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  const add = (list: readonly ArMenuItem[], level: number, parent?: string) => {
    for (const it of list) {
      if (it.type === "divider") out.push({ kind: "divider", key: it.key });
      else if (it.type === "group") {
        out.push({ kind: "group", key: it.key, label: it.label ?? "" });
        add(it.children ?? [], level, parent);
      } else {
        out.push({ kind: "item", item: it, level, parent });
        if (props.mode === "inline" && isParent(it) && openList.value.includes(it.key)) add(it.children!, level + 1, it.key);
      }
    }
  };
  add(props.items, 0);
  return out;
});

/** 浮かせて出している子メニュー（vertical・horizontal）。 */
const flyout = ref<string | null>(null);
const flyAnchor = ref<HTMLElement | null>(null);
function openFly(it: ArMenuItem, el: HTMLElement) {
  flyAnchor.value = el;
  flyout.value = it.key;
}
function closeFly(refocus: boolean) {
  const k = flyout.value;
  flyout.value = null;
  if (refocus && k) void nextTick(() => focusKey(k));
}
const flyItems = computed(() => props.items.find((i) => i.key === flyout.value)?.children ?? []);

function focusKey(key: string) {
  root.value?.querySelector<HTMLElement>(`[data-part="item"][data-key="${key.replace(/["\\]/g, "\\$&")}"]`)?.focus();
}
const tabStop = computed(() => {
  const items = rows.value.filter((r): r is Extract<Row, { kind: "item" }> => r.kind === "item" && usable(r.item));
  const sel = items.find((r) => r.item.key === props.selected) ?? items.find((r) => hasSelected(r.item));
  return (sel ?? items[0])?.item.key;
});

function activate(it: ArMenuItem, el: HTMLElement) {
  if (!usable(it)) return;
  if (isParent(it)) {
    if (props.mode === "inline") {
      const now = openList.value;
      setOpenKeys(now.includes(it.key) ? now.filter((k) => k !== it.key) : [...now, it.key]);
    } else if (flyout.value === it.key) closeFly(false);
    else openFly(it, el);
    return;
  }
  emit("update:selected", it.key);
  emit("select", it.key, it);
}
function onFlySelect(key: string, item: ArMenuItem) {
  emit("update:selected", key);
  emit("select", key, item);
  closeFly(true);
}

function onKeydown(e: KeyboardEvent, r: Extract<Row, { kind: "item" }>) {
  const el = e.currentTarget as HTMLElement;
  const list = [...(root.value?.querySelectorAll<HTMLElement>(':scope > [data-part="item"]:not([aria-disabled="true"])') ?? [])];
  const i = list.indexOf(el);
  const horizontal = props.mode === "horizontal";
  const next = horizontal ? "ArrowRight" : "ArrowDown";
  const prev = horizontal ? "ArrowLeft" : "ArrowUp";
  const into = horizontal ? "ArrowDown" : "ArrowRight";
  const out = horizontal ? "ArrowUp" : "ArrowLeft";
  if (e.key === next) list[(i + 1) % list.length]?.focus();
  else if (e.key === prev) list[(i - 1 + list.length) % list.length]?.focus();
  else if (e.key === "Home") list[0]?.focus();
  else if (e.key === "End") list.at(-1)?.focus();
  else if (e.key === "Enter" || e.key === " ") activate(r.item, el);
  else if (e.key === into && isParent(r.item) && usable(r.item)) {
    if (props.mode === "inline") {
      if (!openList.value.includes(r.item.key)) setOpenKeys([...openList.value, r.item.key]);
      else void nextTick(() => list[i + 1]?.focus());
    } else openFly(r.item, el);
  } else if (e.key === out && props.mode === "inline") {
    if (isParent(r.item) && openList.value.includes(r.item.key)) setOpenKeys(openList.value.filter((k) => k !== r.item.key));
    else if (r.parent) focusKey(r.parent);
    else return;
  } else return;
  e.preventDefault();
}
const role = computed(() => (props.mode === "horizontal" ? "menubar" : "menu"));
</script>

<template>
  <nav
    ref="root"
    data-ar="menu"
    data-part="root"
    :data-mode="mode"
    :data-size="size"
    :data-bordered="bordered && mode !== 'horizontal' ? '' : undefined"
    :role="role"
    :aria-label="label"
    :aria-orientation="mode === 'horizontal' ? 'horizontal' : 'vertical'"
  >
    <template v-for="r in rows" :key="r.kind === 'item' ? r.item.key : r.key">
      <div v-if="r.kind === 'divider'" data-part="divider" role="separator" />
      <div v-else-if="r.kind === 'group'" data-part="group" role="presentation">{{ r.label }}</div>
      <component
        :is="r.item.href && usable(r.item) && !isParent(r.item) ? 'a' : 'div'"
        v-else
        :href="r.item.href && usable(r.item) && !isParent(r.item) ? r.item.href : undefined"
        role="menuitem"
        data-part="item"
        :data-key="r.item.key"
        :data-level="r.level"
        :data-tone="r.item.danger ? 'danger' : undefined"
        :data-state="
          [
            r.item.key === selected && 'selected',
            isParent(r.item) && hasSelected(r.item) && 'active',
            isParent(r.item) && (openList.includes(r.item.key) || flyout === r.item.key) && 'open',
            r.item.disabled && 'disabled',
            r.item.locked && 'locked',
          ].filter(Boolean).join(' ') || undefined
        "
        :tabindex="r.item.key === tabStop ? 0 : -1"
        :aria-disabled="!usable(r.item) || undefined"
        :aria-current="r.item.key === selected ? 'page' : undefined"
        :aria-haspopup="isParent(r.item) ? (mode === 'inline' ? undefined : 'menu') : undefined"
        :aria-expanded="isParent(r.item) ? openList.includes(r.item.key) || flyout === r.item.key : undefined"
        :aria-controls="isParent(r.item) && flyout === r.item.key ? `${uid}-fly` : undefined"
        @click="activate(r.item, $event.currentTarget as HTMLElement)"
        @keydown="onKeydown($event, r)"
      >
        <ArIcon v-if="r.item.locked || r.item.icon" :name="r.item.locked ? 'lock' : r.item.icon!" data-part="icon" size="sm" />
        <span data-part="label">{{ r.item.label }}</span>
        <span v-if="isParent(r.item)" data-part="arrow" aria-hidden="true">
          <ArIcon :name="mode === 'horizontal' || (mode === 'inline' && openList.includes(r.item.key)) ? 'cd' : 'cr'" size="sm" />
        </span>
      </component>
    </template>
    <ArFloat
      v-if="mode !== 'inline'"
      :id="`${uid}-fly`"
      ar="dropdown-menu"
      role="menu"
      :open="!!flyout"
      :anchor="flyAnchor"
      :placement="mode === 'horizontal' ? 'bottom-start' : 'right-start'"
      :offset="mode === 'horizontal' ? 6 : 8"
      @close="(r) => closeFly(r === 'escape')"
    >
      <ArMenuPanel v-if="flyout" :items="flyItems" :selected="selected" @select="onFlySelect" @close="closeFly(true)" />
    </ArFloat>
  </nav>
</template>
