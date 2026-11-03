<script setup lang="ts">
/**
 * 浮かぶメニューの中身（ArDropdown と ArMenu の子メニューで使う。製品には出さない）。
 * role="menu"。↑↓・Home・End で移り、Enter・Space で選ぶ。文字を打つとその文字で始まる項目へ。Tab で閉じる。
 */
import { computed, nextTick, onMounted, ref } from "vue";
import ArIcon from "../components/ArIcon.vue";
import type { ArMenuItem } from "../components/ArMenu.contract";

const props = withDefaults(defineProps<{ items: readonly ArMenuItem[]; selected?: string; autofocus?: boolean; variant?: string }>(), {
  selected: undefined,
  variant: undefined,
  autofocus: true,
});
const emit = defineEmits<{ select: [key: string, item: ArMenuItem]; close: [] }>();
const root = ref<HTMLElement | null>(null);

type Row = { kind: "item"; item: ArMenuItem } | { kind: "divider"; key: string } | { kind: "group"; key: string; label: string };
const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  for (const it of props.items) {
    if (it.type === "divider") out.push({ kind: "divider", key: it.key });
    else if (it.type === "group") {
      out.push({ kind: "group", key: it.key, label: it.label ?? "" });
      for (const c of it.children ?? []) out.push(c.type === "divider" ? { kind: "divider", key: c.key } : { kind: "item", item: c });
    } else out.push({ kind: "item", item: it });
  }
  return out;
});
const rich = computed(() => rows.value.some((r) => r.kind === "item" && !!r.item.description));
const usable = (it: ArMenuItem) => !it.disabled && !it.locked;
const buttons = () => [...(root.value?.querySelectorAll<HTMLElement>('[data-part="item"]:not([aria-disabled="true"])') ?? [])];

function focusAt(i: number) {
  const list = buttons();
  if (!list.length) return;
  list[(i + list.length) % list.length]?.focus();
}
function onKeydown(e: KeyboardEvent) {
  const list = buttons();
  const i = list.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown") focusAt(i + 1);
  else if (e.key === "ArrowUp") focusAt(i < 0 ? -1 : i - 1);
  else if (e.key === "Home") focusAt(0);
  else if (e.key === "End") focusAt(-1);
  else if (e.key === "Tab") {
    emit("close");
    return;
  } else if (e.key.length === 1 && /\S/.test(e.key)) {
    const k = e.key.toLowerCase();
    const n = list.length;
    for (let s = 1; s <= n; s++) {
      const el = list[(i + s) % n]!;
      if ((el.textContent ?? "").trim().toLowerCase().startsWith(k)) {
        el.focus();
        break;
      }
    }
  } else return;
  e.preventDefault();
}
function choose(it: ArMenuItem, e: Event) {
  if (!usable(it)) {
    e.preventDefault();
    return;
  }
  emit("select", it.key, it);
}
onMounted(() => {
  if (!props.autofocus) return;
  void nextTick(() => {
    const list = buttons();
    const sel = list.find((b) => b.dataset.key === props.selected);
    (sel ?? list[0])?.focus();
  });
});
defineExpose({ focusAt });
</script>

<template>
  <div ref="root" data-part="list" :data-rich="rich || undefined" :data-variant="variant" @keydown="onKeydown">
    <template v-for="r in rows" :key="r.kind === 'item' ? r.item.key : r.key">
      <div v-if="r.kind === 'divider'" data-part="divider" role="separator" />
      <div v-else-if="r.kind === 'group'" data-part="group" role="presentation">{{ r.label }}</div>
      <component
        :is="r.item.href && usable(r.item) ? 'a' : 'button'"
        v-else
        :type="r.item.href && usable(r.item) ? undefined : 'button'"
        :href="usable(r.item) ? r.item.href : undefined"
        role="menuitem"
        tabindex="-1"
        data-part="item"
        :data-key="r.item.key"
        :data-tone="r.item.danger ? 'danger' : undefined"
        :data-state="[r.item.key === selected && 'selected', r.item.disabled && 'disabled', r.item.locked && 'locked'].filter(Boolean).join(' ') || undefined"
        :aria-disabled="!usable(r.item) || undefined"
        @click="choose(r.item, $event)"
      >
        <span v-if="rich && (r.item.icon || r.item.locked)" data-part="icon-box"><ArIcon :line="!!r.item.locked" :name="r.item.locked ? 'lock' : r.item.icon!" size="sm" /></span>
        <ArIcon v-else-if="r.item.icon || r.item.locked" :line="!!r.item.locked" :name="r.item.locked ? 'lock' : r.item.icon!" data-part="icon" size="sm" />
        <span v-if="rich" data-part="text"><span data-part="label">{{ r.item.label }}</span><span v-if="r.item.description" data-part="description">{{ r.item.description }}</span></span>
        <span v-else data-part="label">{{ r.item.label }}</span>
      </component>
    </template>
  </div>
</template>
