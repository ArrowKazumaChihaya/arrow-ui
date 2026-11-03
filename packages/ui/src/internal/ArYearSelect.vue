<script setup lang="ts">
/**
 * 年のプルダウン（ライブラリの中だけで使う。ArYearInput・ArYearMonthInput が使う）。
 * 端末の標準の選択は使わず、ArFloat で一覧を出す。WAI-ARIA の「選ぶだけのコンボボックス」の作法：
 * フォーカスはボタンに置いたまま、↑↓・PageUp/PageDown（10年）・Home/End で動かし、Enter・Space で決める。
 * 閉じていても ↑↓ で開き、数字を打つとその年へ飛ぶ。Escape・外を押すと閉じる。
 */
import { computed, nextTick, ref, watch } from "vue";
import ArIcon from "../components/ArIcon.vue";
import ArFloat from "./ArFloat.vue";
import { useId } from "../provider/context";

const props = withDefaults(
  defineProps<{
    modelValue: number | null;
    /** 並べる年（上から）。 */
    years: readonly number[];
    labelOf?: (y: number) => string;
    /** 空（未選択）を選べるようにする。 */
    allowEmpty?: boolean;
    placeholder?: string;
    invalid?: boolean;
    disabled?: boolean;
    label?: string;
    id?: string;
  }>(),
  { labelOf: (y: number) => String(y), allowEmpty: false, placeholder: "", invalid: false, disabled: false, label: undefined, id: undefined },
);
const emit = defineEmits<{ "update:modelValue": [value: number | null] }>();

const listId = useId("ar-year-list");
const button = ref<HTMLButtonElement | null>(null);
const open = ref(false);
/** 一覧の行（空の行を含む）。 */
const rows = computed<(number | null)[]>(() => (props.allowEmpty ? [null, ...props.years] : [...props.years]));
const active = ref(0);
const optId = (i: number) => `${listId}-o${i}`;
const selectedIndex = computed(() => rows.value.indexOf(props.modelValue));

function show(at?: number) {
  if (props.disabled) return;
  active.value = at ?? Math.max(0, selectedIndex.value);
  open.value = true;
  scrollActive();
}
function close() {
  open.value = false;
}
function choose(i: number) {
  const v = rows.value[i];
  if (v === undefined) return;
  if (v !== props.modelValue) emit("update:modelValue", v);
  close();
  button.value?.focus();
}
async function scrollActive() {
  await nextTick();
  await nextTick();
  document.getElementById(optId(active.value))?.scrollIntoView?.({ block: "nearest" });
}
function move(to: number) {
  active.value = Math.min(rows.value.length - 1, Math.max(0, to));
  scrollActive();
}

let typed = "";
let typedAt = 0;
function jump(ch: string) {
  const now = Date.now();
  typed = now - typedAt > 900 ? ch : typed + ch;
  typedAt = now;
  const i = rows.value.findIndex((y) => y !== null && String(y).startsWith(typed));
  const j = i >= 0 ? i : rows.value.findIndex((y) => y !== null && String(y).endsWith(typed));
  if (j < 0) return;
  if (open.value) move(j);
  else if (rows.value[j] !== props.modelValue) emit("update:modelValue", rows.value[j]!);
}

function onKey(e: KeyboardEvent) {
  const k = e.key;
  const ch = k.length === 1 ? k.normalize("NFKC") : "";
  if (/^\d$/.test(ch)) {
    e.preventDefault();
    jump(ch);
    return;
  }
  if (!open.value) {
    if (k === "ArrowDown" || k === "ArrowUp" || k === "Enter" || k === " ") {
      e.preventDefault();
      show();
    } else if (k === "Home" || k === "End") {
      e.preventDefault();
      show(k === "Home" ? 0 : rows.value.length - 1);
    }
    return;
  }
  const map: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 10, PageUp: -10 };
  if (k in map) {
    e.preventDefault();
    move(active.value + map[k]!);
  } else if (k === "Home" || k === "End") {
    e.preventDefault();
    move(k === "Home" ? 0 : rows.value.length - 1);
  } else if (k === "Enter" || k === " ") {
    e.preventDefault();
    choose(active.value);
  } else if (k === "Tab") {
    choose(active.value);
  }
}
watch(
  () => props.disabled,
  (d) => d && close(),
);
const text = computed(() => (props.modelValue === null ? props.placeholder : props.labelOf(props.modelValue)));
defineExpose({ focus: () => button.value?.focus() });
</script>

<template>
  <button
    :id="id"
    ref="button"
    type="button"
    data-part="year"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="open ? 'true' : 'false'"
    :aria-controls="listId"
    :aria-activedescendant="open ? optId(active) : undefined"
    :aria-label="label"
    :aria-invalid="invalid ? 'true' : undefined"
    :disabled="disabled"
    :data-state="[open && 'open', modelValue === null && 'empty'].filter(Boolean).join(' ') || undefined"
    @click="open ? close() : show()"
    @keydown="onKey"
  >
    <span data-part="value">{{ text }}</span>
    <ArIcon name="cd" size="sm" data-part="arrow" />
  </button>
  <ArFloat :open="open" :anchor="button" ar="year-list" placement="bottom-start" match-width="min" role="listbox" :id="listId" :label="label" @close="close">
    <div
      v-for="(y, i) in rows"
      :id="optId(i)"
      :key="y ?? 'empty'"
      role="option"
      data-part="option"
      :aria-selected="i === selectedIndex ? 'true' : 'false'"
      :data-state="[i === selectedIndex && 'selected', i === active && 'active'].filter(Boolean).join(' ') || undefined"
      @pointerdown.prevent
      @pointermove="active = i"
      @click="choose(i)"
    >
      <span data-part="option-label">{{ y === null ? " " : labelOf(y) }}</span>
      <ArIcon v-if="i === selectedIndex" name="check" size="sm" data-part="check" />
    </div>
  </ArFloat>
</template>
