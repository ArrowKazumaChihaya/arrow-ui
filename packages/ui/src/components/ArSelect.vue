<script setup lang="ts">
/**
 * ArSelect 1.0 — 選択肢から選ぶ（ネイティブの select は使わない。押すとプルダウンが開く）。
 * 1つ選ぶ・複数（札で並べ、多いと「+n」）・探す欄（7つ以上で既定で出す）・まとまりの見出し・使えない項目・
 * 選んだ項目は淡いテーマ色＋チェック・消す・読み込み中・空のとき。
 * キーボード：↓↑ Home End で動く、Enter・Space で選ぶ、Escape で閉じる、文字を打つとその文字で始まる項目へ飛ぶ。
 * variant="selbox" は店舗の選択のような見た目（アイコン＋名前＋下向きの印）。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArTextInput from "./ArTextInput.vue";
import ArFloat from "../internal/ArFloat.vue";
import ArOptionRow from "../internal/ArOptionRow.vue";
import { useId } from "../provider/context";
import { createTypeahead, firstEnabled, fold, isPrintableKey, splitMatch, step } from "../internal/options";
import type { ArSelectGroup, ArSelectOption, ArSelectProps, ArSelectValue } from "./ArSelect.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArSelectProps>(), {
  multiple: false,
  maxTags: 2,
  placeholder: "選んでください",
  variant: "field",
  icon: undefined,
  size: "md",
  invalid: false,
  disabled: false,
  loading: false,
  clearable: false,
  searchable: undefined,
  searchPlaceholder: "探す",
  emptyText: "選べるものがありません",
  loadingText: "読み込み中…",
  block: false,
  listHeight: 264,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [value: ArSelectValue | null | ArSelectValue[]];
  /** 選んだ値が変わったとき（v-model と同じ値）。 */
  change: [value: ArSelectValue | null | ArSelectValue[]];
  /** プルダウンが開いた・閉じた。 */
  "open-change": [open: boolean];
  /** 探す欄に打ったとき。 */
  search: [query: string];
}>();

const uid = useId("ar-select");
const rootId = computed(() => props.id ?? uid);
const listId = `${uid}-list`;
const root = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const search = ref<InstanceType<typeof ArTextInput> | null>(null);
const open = ref(false);
const query = ref("");
const active = ref(-1);

const isGroup = (o: ArSelectOption | ArSelectGroup): o is ArSelectGroup => "options" in o;
const allOptions = computed(() => props.options.flatMap((o) => (isGroup(o) ? o.options : [o])));
/** 人を選ぶ（頭文字の丸がある）ときは、シフト画面の名前の選択と同じ形（行38px・丸26px・探す欄は灰色の地）。 */
const people = computed(() => allOptions.value.some((o) => o.avatar !== undefined));
const showSearch = computed(() => props.searchable ?? allOptions.value.length >= 7);
const matches = (o: ArSelectOption) => {
  const q = fold(query.value.trim());
  return !q || fold(o.label).includes(q) || (o.keywords !== undefined && fold(o.keywords).includes(q));
};
/** 見えている項目（探した結果）。まとまりの見出しは sections に、行は flat に。 */
const sections = computed(() => {
  const out: { label?: string; key: string; items: { opt: ArSelectOption; index: number }[] }[] = [];
  let index = 0;
  let loose: (typeof out)[number] | null = null;
  props.options.forEach((o, gi) => {
    if (isGroup(o)) {
      loose = null;
      const items = o.options.filter(matches).map((opt) => ({ opt, index: index++ }));
      if (items.length) out.push({ label: o.label, key: `g${gi}`, items });
    } else if (matches(o)) {
      if (!loose) out.push((loose = { key: `l${gi}`, items: [] }));
      loose.items.push({ opt: o, index: index++ });
    }
  });
  return out;
});
const flat = computed(() => sections.value.flatMap((s) => s.items.map((i) => i.opt)));
const enabled = (i: number) => !!flat.value[i] && !flat.value[i]!.disabled;

const values = computed<ArSelectValue[]>(() =>
  props.multiple ? (Array.isArray(props.modelValue) ? [...props.modelValue] : []) : props.modelValue == null ? [] : [props.modelValue as ArSelectValue],
);
const isSelected = (o: ArSelectOption) => values.value.includes(o.value);
const selectedOptions = computed(() =>
  values.value.map((v) => allOptions.value.find((o) => o.value === v) ?? { value: v, label: String(v) }),
);
const single = computed(() => (props.multiple ? undefined : selectedOptions.value[0]));
const shownTags = computed(() => selectedOptions.value.slice(0, props.maxTags));
const restCount = computed(() => Math.max(0, selectedOptions.value.length - props.maxTags));
const empty = computed(() => values.value.length === 0);
const canClear = computed(() => props.clearable && !empty.value && !props.disabled && !props.loading);
const optionId = (i: number) => `${uid}-opt-${i}`;
const activeId = computed(() => (open.value && active.value >= 0 ? optionId(active.value) : undefined));

function setOpen(v: boolean) {
  if (v === open.value || (v && props.disabled)) return;
  open.value = v;
  emit("open-change", v);
  if (v) {
    query.value = "";
    const sel = flat.value.findIndex((o) => isSelected(o) && !o.disabled);
    active.value = sel >= 0 ? sel : firstEnabled(flat.value.length, enabled);
    nextTick(() => {
      if (showSearch.value) search.value?.focus();
      scrollActive();
    });
  }
}
function close(refocus = true) {
  setOpen(false);
  if (refocus) root.value?.focus();
}
function commit(v: ArSelectValue | null | ArSelectValue[]) {
  emit("update:modelValue", v);
  emit("change", v);
}
function choose(i: number) {
  const o = flat.value[i];
  if (!o || o.disabled) return;
  if (props.multiple) {
    const next = isSelected(o) ? values.value.filter((v) => v !== o.value) : [...values.value, o.value];
    active.value = i;
    commit(next);
  } else {
    if (o.value !== props.modelValue) commit(o.value);
    close();
  }
}
function remove(v: ArSelectValue) {
  if (props.disabled) return;
  commit(values.value.filter((x) => x !== v));
}
function clear() {
  commit(props.multiple ? [] : null);
  root.value?.focus();
}
function scrollActive() {
  const el = listEl.value?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active.value))}`);
  el?.scrollIntoView?.({ block: "nearest" });
}
watch(active, () => nextTick(scrollActive));
watch(query, (q) => {
  emit("search", q);
  active.value = firstEnabled(flat.value.length, enabled);
});

const typeahead = createTypeahead();
function onKey(e: KeyboardEvent) {
  if (props.disabled) return;
  const n = flat.value.length;
  const fromSearch = e.target !== root.value;
  switch (e.key) {
    case "ArrowDown":
    case "ArrowUp": {
      e.preventDefault();
      if (!open.value) return setOpen(true);
      if (e.altKey && e.key === "ArrowUp") return choose(active.value);
      const dir = e.key === "ArrowDown" ? 1 : -1;
      active.value = active.value < 0 ? firstEnabled(n, enabled, dir < 0) : step(active.value, dir, n, enabled);
      return;
    }
    case "Home":
    case "End":
      if (!open.value || fromSearch) return;
      e.preventDefault();
      active.value = firstEnabled(n, enabled, e.key === "End");
      return;
    case "Enter":
      e.preventDefault();
      if (!open.value) return setOpen(true);
      if (active.value >= 0) choose(active.value);
      return;
    case " ":
      if (fromSearch) return;
      e.preventDefault();
      if (!open.value) return setOpen(true);
      if (active.value >= 0) choose(active.value);
      return;
    case "Tab":
      if (open.value) setOpen(false);
      return;
    case "Backspace":
      if (props.multiple && !query.value && values.value.length && !open.value) remove(values.value[values.value.length - 1]!);
      return;
    default:
      if (!fromSearch && isPrintableKey(e)) {
        if (!open.value) setOpen(true);
        const labels = flat.value.map((o) => o.label);
        const i = typeahead(e.key, labels, active.value, enabled);
        if (i >= 0) active.value = i;
      }
  }
}
function onRootClick() {
  if (props.disabled) return;
  setOpen(!open.value);
}
const state = computed(
  () =>
    [
      open.value && "open",
      empty.value && "empty",
      props.invalid && "invalid",
      props.disabled && "disabled",
      props.loading && "loading",
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);
defineExpose({ focus: () => root.value?.focus(), open: () => setOpen(true), close: () => setOpen(false) });
</script>

<template>
  <div
    v-bind="$attrs"
    :id="rootId"
    ref="root"
    data-ar="select"
    data-part="root"
    role="combobox"
    :tabindex="disabled ? -1 : 0"
    aria-haspopup="listbox"
    :aria-expanded="open"
    :aria-controls="open ? listId : undefined"
    :aria-activedescendant="showSearch ? undefined : activeId"
    :aria-label="label"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-disabled="disabled || undefined"
    :aria-busy="loading || undefined"
    :data-size="size"
    :data-variant="variant"
    :data-multiple="multiple || undefined"
    :data-block="block || undefined"
    :data-state="state"
    @click="onRootClick"
    @keydown="onKey"
  >
    <ArIcon v-if="icon" :name="icon" size="sm" data-part="icon" />
    <template v-if="multiple">
      <span v-if="!empty" data-part="tags">
        <span v-for="o in shownTags" :key="String(o.value)" data-part="tag"
          >{{ o.label
          }}<button
            type="button"
            data-part="tag-remove"
            tabindex="-1"
            :aria-label="`${o.label}を外す`"
            :disabled="disabled"
            @mousedown.prevent
            @click.stop="remove(o.value)"
          >
            <ArIcon name="x" size="sm" /></button
        ></span>
        <span v-if="restCount" data-part="tag" data-kind="more" :aria-label="`ほか${restCount}件`">+{{ restCount }}</span>
      </span>
      <span v-else data-part="placeholder">{{ placeholder }}</span>
    </template>
    <template v-else>
      <span v-if="single" data-part="value"
        ><span
          v-if="!icon && 'avatar' in single && single.avatar !== undefined"
          data-part="avatar"
          aria-hidden="true"
          :style="single.avatarColor || single.avatarInk ? { background: single.avatarColor, color: single.avatarInk } : undefined"
          >{{ single.avatar }}</span
        ><span data-part="value-text">{{ single.label }}</span></span
      >
      <span v-else data-part="placeholder">{{ placeholder }}</span>
    </template>
    <button
      v-if="canClear"
      type="button"
      data-part="clear"
      tabindex="-1"
      aria-label="選んだものを消す"
      @mousedown.prevent
      @click.stop="clear"
    >
      <ArIcon name="x" size="sm" />
    </button>
    <span v-if="loading" data-part="spinner" aria-hidden="true" />
    <ArIcon v-else name="cd" size="sm" data-part="arrow" />
  </div>
  <ArFloat ar="select-panel" :open="open" :anchor="root" match-width="min" :offset="6" @close="(r) => close(r === 'escape')">
    <div v-if="showSearch" data-part="search" :data-kind="people ? 'people' : undefined">
      <ArTextInput
        ref="search"
        v-model="query"
        :size="people ? 'md' : 'sm'"
        :variant="people ? 'filled' : 'outlined'"
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
      role="listbox"
      :data-kind="people ? 'people' : undefined"
      :aria-label="label"
      :aria-labelledby="label ? undefined : rootId"
      :aria-multiselectable="multiple || undefined"
      :style="{ maxHeight: `${listHeight}px` }"
      @mousedown.prevent
    >
      <template v-for="s in sections" :key="s.key">
        <div v-if="s.label" role="group" data-part="group" :aria-labelledby="`${uid}-${s.key}`">
          <div :id="`${uid}-${s.key}`" data-part="group-label">{{ s.label }}</div>
          <ArOptionRow
            v-for="it in s.items"
            :id="optionId(it.index)"
            :key="String(it.opt.value)"
            :pieces="splitMatch(it.opt.label, query)"
            :selected="isSelected(it.opt)"
            :active="it.index === active"
            :disabled="it.opt.disabled"
            :icon="it.opt.icon"
            :avatar="it.opt.avatar"
            :avatar-color="it.opt.avatarColor"
            :avatar-ink="it.opt.avatarInk"
            :description="it.opt.description"
            :description-tone="it.opt.descriptionTone"
            @click="choose(it.index)"
            @mousemove="!it.opt.disabled && (active = it.index)"
          />
        </div>
        <template v-else>
          <ArOptionRow
            v-for="it in s.items"
            :id="optionId(it.index)"
            :key="String(it.opt.value)"
            :pieces="splitMatch(it.opt.label, query)"
            :selected="isSelected(it.opt)"
            :active="it.index === active"
            :disabled="it.opt.disabled"
            :icon="it.opt.icon"
            :avatar="it.opt.avatar"
            :avatar-color="it.opt.avatarColor"
            :avatar-ink="it.opt.avatarInk"
            :description="it.opt.description"
            :description-tone="it.opt.descriptionTone"
            @click="choose(it.index)"
            @mousemove="!it.opt.disabled && (active = it.index)"
          />
        </template>
      </template>
      <div v-if="loading && !flat.length" data-part="empty" data-kind="loading" role="status">
        <span data-part="spinner" aria-hidden="true" />{{ loadingText }}
      </div>
      <div v-else-if="!flat.length" data-part="empty" role="status">
        <ArIcon v-if="query" name="search" size="sm" />{{ query ? `「${query}」は見つかりません` : emptyText }}
      </div>
    </div>
  </ArFloat>
</template>
