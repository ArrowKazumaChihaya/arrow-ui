<script setup lang="ts">
/**
 * ArCascader 1.0 — 店舗・部署のような階層を、段ごとの列で選ぶ。
 * 選んだ道筋は淡いテーマ色、最後の段はチェック。使えない項目は灰色。押す所には「ARROW事業部 / 東京 / 渋谷店」と出す。
 * キーボード：↓↑で段の中を動く、→ で次の段へ、← で前の段へ、Enter で選ぶ、Escape で閉じる。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import ArFloat from "../internal/ArFloat.vue";
import ArOptionRow from "../internal/ArOptionRow.vue";
import { useId } from "../provider/context";
import { createTypeahead, firstEnabled, isPrintableKey, step } from "../internal/options";
import type { ArCascaderOption, ArCascaderProps, ArCascaderValue } from "./ArCascader.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArCascaderProps>(), {
  placeholder: "選んでください",
  variant: "field",
  icon: undefined,
  size: "md",
  invalid: false,
  disabled: false,
  clearable: false,
  changeOnSelect: false,
  expandTrigger: "click",
  separator: " / ",
  displayLast: false,
  block: false,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [value: ArCascaderValue[] | null];
  /** 選んだとき。値の道筋と、その項目の道筋。 */
  change: [value: ArCascaderValue[] | null, options: ArCascaderOption[]];
  "open-change": [open: boolean];
}>();

const uid = useId("ar-cascader");
const rootId = computed(() => props.id ?? uid);
const root = ref<HTMLElement | null>(null);
const open = ref(false);
/** 開いている道筋（列を出す元）。 */
const expanded = ref<ArCascaderValue[]>([]);
const active = ref<{ col: number; index: number }>({ col: 0, index: -1 });

/** 値の道筋 → 項目の道筋。 */
function pathOf(values: readonly ArCascaderValue[] | null): ArCascaderOption[] {
  const out: ArCascaderOption[] = [];
  let level: readonly ArCascaderOption[] | undefined = props.options;
  for (const v of values ?? []) {
    const o: ArCascaderOption | undefined = level?.find((x) => x.value === v);
    if (!o) break;
    out.push(o);
    level = o.children;
  }
  return out;
}
const selected = computed(() => pathOf(props.modelValue));
const columns = computed(() => {
  const cols: (readonly ArCascaderOption[])[] = [props.options];
  for (const o of pathOf(expanded.value)) if (o.children?.length) cols.push(o.children);
  return cols;
});
const display = computed(() =>
  props.displayLast ? (selected.value.at(-1)?.label ?? "") : selected.value.map((o) => o.label).join(props.separator),
);
const empty = computed(() => selected.value.length === 0);
const isLeaf = (o: ArCascaderOption) => !o.children?.length;
const optionId = (c: number, i: number) => `${uid}-c${c}-${i}`;
const activeId = computed(() => (open.value && active.value.index >= 0 ? optionId(active.value.col, active.value.index) : undefined));

function setOpen(v: boolean) {
  if (v === open.value || (v && props.disabled)) return;
  open.value = v;
  emit("open-change", v);
  if (v) {
    const vals = (props.modelValue ?? []).slice();
    const path = pathOf(vals);
    expanded.value = path.filter((o) => !isLeaf(o)).map((o) => o.value);
    const col = Math.max(0, path.length - 1);
    const list = columns.value[col] ?? [];
    const idx = path.length ? list.findIndex((o) => o.value === path[col]?.value) : firstEnabled(list.length, (i) => !list[i]?.disabled);
    active.value = { col, index: idx };
  }
}
function close(refocus = true) {
  setOpen(false);
  if (refocus) root.value?.focus();
}
function commit(path: ArCascaderOption[]) {
  const v = path.length ? path.map((o) => o.value) : null;
  emit("update:modelValue", v);
  emit("change", v, path);
}
function expandAt(col: number, o: ArCascaderOption) {
  expanded.value = [...expanded.value.slice(0, col), o.value];
}
function pick(col: number, index: number, viaKey = false) {
  const o = columns.value[col]?.[index];
  if (!o || o.disabled) return;
  active.value = { col, index };
  if (isLeaf(o)) {
    commit([...pathOf(expanded.value.slice(0, col)), o]);
    close();
    return;
  }
  expandAt(col, o);
  if (props.changeOnSelect) commit(pathOf(expanded.value));
  if (viaKey) {
    const next = columns.value[col + 1] ?? [];
    active.value = { col: col + 1, index: firstEnabled(next.length, (i) => !next[i]?.disabled) };
  }
}
function onHover(col: number, index: number) {
  const o = columns.value[col]?.[index];
  if (!o || o.disabled) return;
  active.value = { col, index };
  if (props.expandTrigger === "hover" && !isLeaf(o)) expandAt(col, o);
}
const typeahead = createTypeahead();
function onKey(e: KeyboardEvent) {
  if (props.disabled) return;
  const { col, index } = active.value;
  const list = columns.value[col] ?? [];
  const en = (i: number) => !!list[i] && !list[i]!.disabled;
  switch (e.key) {
    case "ArrowDown":
    case "ArrowUp":
      e.preventDefault();
      if (!open.value) return setOpen(true);
      active.value = { col, index: index < 0 ? firstEnabled(list.length, en) : step(index, e.key === "ArrowDown" ? 1 : -1, list.length, en) };
      return;
    case "ArrowRight": {
      if (!open.value) return;
      e.preventDefault();
      const o = list[index];
      if (o && !o.disabled && !isLeaf(o)) pick(col, index, true);
      return;
    }
    case "ArrowLeft": {
      if (!open.value || col === 0) return;
      e.preventDefault();
      const prev = columns.value[col - 1] ?? [];
      expanded.value = expanded.value.slice(0, col);
      active.value = { col: col - 1, index: prev.findIndex((o) => o.value === expanded.value[col - 1]) };
      return;
    }
    case "Enter":
    case " ":
      e.preventDefault();
      if (!open.value) return setOpen(true);
      if (index >= 0) {
        const o = list[index];
        if (o && !isLeaf(o) && props.changeOnSelect && e.key === "Enter") {
          commit([...pathOf(expanded.value.slice(0, col)), o]);
          close();
        } else pick(col, index, true);
      }
      return;
    case "Tab":
      if (open.value) setOpen(false);
      return;
    default:
      if (isPrintableKey(e)) {
        if (!open.value) setOpen(true);
        const i = typeahead(e.key, list.map((o) => o.label), index, en);
        if (i >= 0) active.value = { col, index: i };
      }
  }
}
watch(
  activeId,
  (id) => id && nextTick(() => document.getElementById(id)?.scrollIntoView?.({ block: "nearest" })),
);
function clear() {
  commit([]);
  root.value?.focus();
}
const canClear = computed(() => props.clearable && !empty.value && !props.disabled);
const state = computed(
  () => [open.value && "open", empty.value && "empty", props.invalid && "invalid", props.disabled && "disabled"].filter(Boolean).join(" ") || undefined,
);
const isPath = (col: number, o: ArCascaderOption) => expanded.value[col] === o.value && !isLeaf(o);
const isChosen = (col: number, o: ArCascaderOption) => isLeaf(o) && selected.value[col]?.value === o.value && pathOf(expanded.value.slice(0, col)).every((p, i) => selected.value[i]?.value === p.value);
defineExpose({ focus: () => root.value?.focus(), open: () => setOpen(true), close: () => setOpen(false) });
</script>

<template>
  <div
    v-bind="$attrs"
    :id="rootId"
    ref="root"
    data-ar="cascader"
    data-part="root"
    role="combobox"
    :tabindex="disabled ? -1 : 0"
    aria-haspopup="tree"
    :aria-expanded="open"
    :aria-controls="open ? `${uid}-panel` : undefined"
    :aria-activedescendant="activeId"
    :aria-label="label"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-disabled="disabled || undefined"
    :data-size="size"
    :data-variant="variant"
    :data-block="block || undefined"
    :data-state="state"
    @click="!disabled && setOpen(!open)"
    @keydown="onKey"
  >
    <ArIcon v-if="icon" :name="icon" size="sm" data-part="icon" />
    <span v-if="!empty" data-part="value"><span data-part="value-text">{{ display }}</span></span>
    <span v-else data-part="placeholder">{{ placeholder }}</span>
    <button v-if="canClear" type="button" data-part="clear" tabindex="-1" aria-label="選んだものを消す" @mousedown.prevent @click.stop="clear">
      <ArIcon line name="x" size="sm" />
    </button>
    <ArIcon line name="cd" size="sm" data-part="arrow" />
  </div>
  <ArFloat :id="`${uid}-panel`" ar="cascader-panel" :open="open" :anchor="root" :offset="6" @close="(r) => close(r === 'escape')">
      <div
        v-for="(list, c) in columns"
        :key="c"
        data-part="column"
        @mousedown.prevent
        role="listbox"
        :aria-label="c === 0 ? label : (pathOf(expanded)[c - 1]?.label ?? '')"
      >
        <ArOptionRow
          v-for="(o, i) in list"
          :id="optionId(c, i)"
          :key="String(o.value)"
          :pieces="[{ text: o.label, match: false }]"
          :selected="isChosen(c, o)"
          :path="isPath(c, o)"
          :active="active.col === c && active.index === i"
          :disabled="o.disabled"
          :more="!isLeaf(o)"
          @click="pick(c, i)"
          @mouseenter="onHover(c, i)"
        />
      </div>
  </ArFloat>
</template>
