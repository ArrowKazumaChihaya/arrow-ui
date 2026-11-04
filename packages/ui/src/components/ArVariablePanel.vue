<script setup lang="ts">
/**
 * ArVariablePanel 1.0 — 差し込む変数を探して、押すと入れるパネル（書類集計の「ARROWの変数」・通知の「ARROW 差し込み項目」）。
 * list：まとまりの見出しと「＋ 名前」の行。chips：まとまりのタブ・探す欄・「＋ 名前」の札。
 * 押すと insert（入れる文字・変数・まとまり）を出す。入れる先は製品（または ArRichTextEditor）が決める。
 * キーボード：タブは ←→ Home End で選び直し、札・行は Tab で移って Enter / Space で入れる。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArEmpty from "./ArEmpty.vue";
import { useDesignForm, useId } from "../provider/context";
import type { ArVariableGroup, ArVariableItem, ArVariablePanelProps } from "./ArVariablePanel.contract";

const props = withDefaults(defineProps<ArVariablePanelProps>(), {
  layout: "list",
  title: undefined,
  description: undefined,
  tab: undefined,
  query: undefined,
  searchable: true,
  maxHeight: undefined,
  disabled: false,
  labels: () => ({
    search: "変数を探す",
    searchPlaceholder: "変数を探す（例：入社）",
    empty: "「{q}」に合う変数はありません",
    tabs: "変数のまとまり",
    insert: "{label}を差し込む",
  }),
});
const emit = defineEmits<{
  insert: [token: string, item: ArVariableItem, group: ArVariableGroup];
  "update:tab": [key: string];
  "update:query": [query: string];
}>();
defineSlots<{ head?: () => unknown; note?: () => unknown }>();

const id = useId("ar-variable-panel");
/** 探す欄を出すか（デザインの形。classic は今の ARROW の変数のメニューに探す欄がないので off）。 */
const searchForm = useDesignForm<"on" | "off">("ArVariablePanel", "search", "on");
const showSearch = computed(() => props.searchable && searchForm.value !== "off");
const innerQuery = ref("");
const q = computed(() => props.query ?? innerQuery.value);
function setQuery(v: string) {
  innerQuery.value = v;
  emit("update:query", v);
}

/** 探す：名前・変数名・言葉のどれかに含まれる。大文字小文字とひらがな／カタカナの違いは見ない。 */
const fold = (s: string) => s.toLowerCase().replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const hit = (it: ArVariableItem, needle: string) =>
  !needle || [it.label, it.key, ...(it.keywords ?? [])].some((s) => fold(s).includes(needle));
const filtered = computed(() => {
  const needle = fold(q.value.trim());
  return props.groups.map((g) => ({ group: g, items: g.items.filter((it) => hit(it, needle)) }));
});

/* chips のタブ */
const innerTab = ref<string>(props.groups[0]?.key ?? "");
watch(
  () => props.groups.map((g) => g.key).join("\u0000"),
  () => {
    if (!props.groups.some((g) => g.key === innerTab.value)) innerTab.value = props.groups[0]?.key ?? "";
  },
);
const tabKey = computed(() => props.tab ?? innerTab.value);
function setTab(k: string) {
  innerTab.value = k;
  emit("update:tab", k);
}
const tabsEl = ref<HTMLElement | null>(null);
function onTabKey(e: KeyboardEvent, i: number) {
  const n = props.groups.length;
  const map: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
  const j = map[e.key];
  if (j === undefined) return;
  e.preventDefault();
  setTab(props.groups[j]!.key);
  void nextTick(() => tabsEl.value?.querySelectorAll<HTMLElement>('[data-part="tab"]')[j]?.focus());
}

/** 見せるまとまり：list は全部（合うものがあるもの）、chips は選んでいるタブだけ。 */
const shown = computed(() =>
  props.layout === "chips"
    ? filtered.value.filter((f) => f.group.key === tabKey.value)
    : filtered.value.filter((f) => f.items.length > 0),
);
const none = computed(() => shown.value.every((f) => f.items.length === 0));

const tokenOf = (it: ArVariableItem) => it.token ?? `{{ $${it.key} }}`;
function pick(it: ArVariableItem, g: ArVariableGroup) {
  if (props.disabled) return;
  emit("insert", tokenOf(it), it, g);
}
const insertLabel = (it: ArVariableItem) => props.labels.insert.replace("{label}", it.label);
const emptyText = computed(() => props.labels.empty.replace("{q}", q.value.trim()));
</script>

<template>
  <div
    data-ar="variable-panel"
    data-part="root"
    :data-layout="layout"
    :data-state="disabled ? 'disabled' : undefined"
    role="group"
    :aria-label="title ?? labels.tabs"
  >
    <div v-if="layout === 'list' && (title || description || showSearch || $slots.head)" data-part="head">
      <b v-if="title" data-part="title">{{ title }}</b>
      <span v-if="description" data-part="description">{{ description }}</span>
      <slot name="head" />
      <label v-if="showSearch" data-part="search">
        <ArIcon line name="search" data-part="search-icon" />
        <input
          data-part="search-input"
          type="search"
          :value="q"
          :placeholder="labels.searchPlaceholder"
          :aria-label="labels.search"
          :aria-controls="`${id}-body`"
          :disabled="disabled"
          @input="setQuery(($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <div v-if="layout === 'chips'" data-part="head">
      <div ref="tabsEl" data-part="tabs" role="tablist" :aria-label="labels.tabs">
        <button
          v-for="(f, i) in filtered"
          :id="`${id}-tab-${i}`"
          :key="f.group.key"
          type="button"
          role="tab"
          data-part="tab"
          :data-state="f.group.key === tabKey ? 'selected' : undefined"
          :aria-selected="f.group.key === tabKey"
          :aria-controls="`${id}-body`"
          :tabindex="f.group.key === tabKey ? 0 : -1"
          :disabled="disabled"
          @click="setTab(f.group.key)"
          @keydown="onTabKey($event, i)"
        >
          {{ f.group.label }}<span data-part="tab-count">{{ f.items.length }}</span>
        </button>
      </div>
      <label v-if="showSearch" data-part="search">
        <ArIcon line name="search" data-part="search-icon" />
        <input
          data-part="search-input"
          type="search"
          :value="q"
          :placeholder="labels.searchPlaceholder"
          :aria-label="labels.search"
          :aria-controls="`${id}-body`"
          :disabled="disabled"
          @input="setQuery(($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <div
      :id="`${id}-body`"
      data-part="body"
      :role="layout === 'chips' ? 'tabpanel' : undefined"
      :aria-labelledby="layout === 'chips' ? `${id}-tab-${filtered.findIndex((f) => f.group.key === tabKey)}` : undefined"
      :style="maxHeight ? { maxHeight } : undefined"
    >
      <template v-for="f in shown" :key="f.group.key">
        <div v-if="layout === 'list'" data-part="group" role="group" :aria-label="f.group.label">
          <div data-part="group-label">{{ f.group.label }}</div>
          <button
            v-for="it in f.items"
            :key="it.key"
            type="button"
            data-part="item"
            :title="it.description"
            :aria-label="insertLabel(it)"
            :disabled="disabled"
            @click="pick(it, f.group)"
          >
            <ArIcon line name="plus" data-part="item-icon" /><span data-part="item-label">{{ it.label }}</span>
          </button>
        </div>
        <template v-else>
          <button
            v-for="it in f.items"
            :key="it.key"
            type="button"
            data-part="item"
            :title="it.description"
            :aria-label="insertLabel(it)"
            :disabled="disabled"
            @click="pick(it, f.group)"
          >
            <ArIcon line name="plus" data-part="item-icon" /><span data-part="item-label">{{ it.label }}</span>
          </button>
        </template>
      </template>
      <ArEmpty v-if="none && q.trim()" data-part="empty" role="status" size="sm" icon="search" :text="emptyText" />
    </div>

    <div v-if="layout === 'chips' && (description || $slots.note)" data-part="note">
      <slot name="note">{{ description }}</slot>
    </div>
  </div>
</template>
