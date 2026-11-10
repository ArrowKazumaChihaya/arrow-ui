<script setup lang="ts">
/**
 * ArAutoComplete 1.0 — 打った文字に合う候補を出す入力（名前の選択など）。
 * 候補は頭文字の丸つき、合っている文字はテーマ色の太字。読み（keywords）でも探せる（「さと」で「佐藤」）。
 * キーボード：↓↑で候補を動く、Enter で選ぶ、Escape で閉じる。選ぶと入力に名前が入り、select を出す。
 */
import { computed, nextTick, ref, useAttrs, watch } from "vue";
import ArTextInput from "./ArTextInput.vue";
import ArFloat from "../internal/ArFloat.vue";
import ArOptionRow from "../internal/ArOptionRow.vue";
import { useId } from "../provider/context";
import { firstEnabled, fold, initialOf, splitByReading, splitMatch, step, type ArTextPiece } from "../internal/options";
import type { ArAutoCompleteOption, ArAutoCompleteProps } from "./ArAutoComplete.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArAutoCompleteProps>(), {
  placeholder: undefined,
  resetOption: false,
  icon: undefined,
  avatar: false,
  filter: true,
  minChars: 1,
  emptyText: undefined,
  size: "md",
  invalid: false,
  disabled: false,
  clearable: false,
  block: false,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [value: string];
  /** 候補を選んだとき。 */
  select: [value: string | number, option: ArAutoCompleteOption];
  /** 打ったとき（サーバーで探すときに使う）。 */
  search: [query: string];
  /** 「リセット」を選んだとき。 */
  reset: [];
}>();

const attrs = useAttrs();
const uid = useId("ar-ac");
const listId = `${uid}-list`;
const root = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const input = ref<InstanceType<typeof ArTextInput> | null>(null);
const open = ref(false);
const active = ref(-1);

const opts = computed<ArAutoCompleteOption[]>(() =>
  props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o)),
);
/** 「リセット」の行の値。 */
const RESET = "\u0000ar-reset";
interface Row {
  opt: ArAutoCompleteOption;
  pieces: ArTextPiece[];
}
const rows = computed<Row[]>(() => {
  const q = props.modelValue ?? "";
  const fq = fold(q.trim());
  const out: Row[] = [];
  for (const opt of opts.value) {
    const inLabel = !fq || fold(opt.label).includes(fq);
    if (inLabel) {
      out.push({ opt, pieces: splitMatch(opt.label, q) });
      continue;
    }
    const byReading = opt.keywords ? splitByReading(opt.label, opt.keywords, q) : null;
    if (byReading) out.push({ opt, pieces: byReading });
    else if (!props.filter) out.push({ opt, pieces: [{ text: opt.label, match: false }] });
  }
  if (props.resetOption !== false)
    out.unshift({ opt: { value: RESET, label: typeof props.resetOption === "string" ? props.resetOption : "リセット" }, pieces: [] });
  return out;
});
const enabled = (i: number) => !!rows.value[i] && !rows.value[i]!.opt.disabled;
const optionId = (i: number) => `${uid}-opt-${i}`;
const showPanel = computed(() => open.value && (rows.value.length > 0 || props.emptyText !== undefined));
/** 候補の板の幅は入力の幅（ただし 480px まで）。入力が画面いっぱいに広がっていても、候補は広げすぎない。 */
const rootWidth = ref(0);
watch(showPanel, (v) => {
  if (v && root.value) rootWidth.value = root.value.getBoundingClientRect().width;
});

function openIfReady() {
  if (props.disabled) return;
  open.value = [...(props.modelValue ?? "")].length >= props.minChars;
  // 「リセット」があるときは、どの行も選ばずに開く（↓で先頭へ）
  active.value = props.resetOption !== false ? -1 : firstEnabled(rows.value.length, enabled);
}
watch(active, () =>
  nextTick(() => document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: "nearest" })),
);

function onInput(v: string) {
  emit("update:modelValue", v);
  emit("search", v);
  void nextTick(openIfReady);
}
function choose(i: number) {
  const r = rows.value[i];
  if (!r || r.opt.disabled) return;
  if (r.opt.value === RESET) {
    emit("update:modelValue", "");
    emit("search", "");
    emit("reset");
    open.value = false;
    return;
  }
  emit("update:modelValue", r.opt.label);
  emit("select", r.opt.value, r.opt);
  open.value = false;
}
function onKey(e: KeyboardEvent) {
  const n = rows.value.length;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!open.value) return openIfReady();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    active.value = active.value < 0 ? firstEnabled(n, enabled, dir < 0) : step(active.value, dir, n, enabled);
  } else if (e.key === "Enter" && showPanel.value && active.value >= 0) {
    e.preventDefault();
    choose(active.value);
  } else if (e.key === "Tab") open.value = false;
}
function onBlur(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (next && listEl.value?.contains(next)) return;
  open.value = false;
}
const avatarOf = (o: ArAutoCompleteOption) => o.avatar ?? (props.avatar ? initialOf(o.label) : undefined);
defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <span
    ref="root"
    data-ar="auto-complete"
    data-part="root"
    :data-block="block || undefined"
    :data-state="showPanel ? 'open' : undefined"
    :class="attrs.class"
    :style="attrs.style as any"
  >
    <ArTextInput
      :id="id"
      ref="input"
      :model-value="modelValue"
      :placeholder="placeholder"
      :icon="icon"
      :size="size"
      :invalid="invalid"
      :disabled="disabled"
      :clearable="clearable"
      :label="label"
      block
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="showPanel"
      :aria-controls="showPanel ? listId : undefined"
      :aria-activedescendant="showPanel && active >= 0 ? optionId(active) : undefined"
      :aria-describedby="attrs['aria-describedby'] as string | undefined"
      :aria-labelledby="attrs['aria-labelledby'] as string | undefined"
      :aria-required="attrs['aria-required'] as string | undefined"
      :aria-invalid="(attrs['aria-invalid'] as string | undefined) ?? (invalid ? 'true' : undefined)"
      @update:model-value="onInput"
      @focus="openIfReady"
      @blur="onBlur"
      @keydown="onKey"
    />
    <ArFloat ar="select-panel" :open="showPanel" :anchor="root" :offset="6" @close="open = false">
      <div :id="listId" ref="listEl" data-part="list" role="listbox" :aria-label="label" style="max-height: 264px" :style="{ minWidth: `${Math.min(rootWidth, 480)}px`, maxWidth: 'calc(100vw - 16px)' }" @mousedown.prevent>
        <ArOptionRow
          v-for="(r, i) in rows"
          :id="optionId(i)"
          :key="String(r.opt.value)"
          :pieces="r.opt.value === RESET ? [{ text: r.opt.label, match: false }] : r.pieces"
          :data-kind="r.opt.value === RESET ? 'null' : undefined"
          :active="i === active"
          :disabled="r.opt.disabled"
          :avatar="avatarOf(r.opt)"
          :avatar-color="r.opt.avatarColor"
          :avatar-ink="r.opt.avatarInk"
          :description="r.opt.description"
          @click="choose(i)"
          @mousemove="!r.opt.disabled && (active = i)"
        />
        <div v-if="!rows.length" data-part="empty" role="status">{{ emptyText }}</div>
      </div>
    </ArFloat>
  </span>
</template>
