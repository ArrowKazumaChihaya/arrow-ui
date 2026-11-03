<script setup lang="ts">
/**
 * ArMentions 1.0 — ＠で人を呼べる複数行の入力（通知・お知らせ）。
 * 「@」に続けて打つと、合う人の候補（頭文字の丸・合っている文字はテーマ色の太字）が出る。
 * 呼んだ名前は淡いテーマ色の札で見せる（textarea の後ろに同じ文字を重ねて色を付ける）。
 * キーボード：↓↑で候補を動く、Enter・Tab で選ぶ、Escape で閉じる。
 */
import { computed, nextTick, onMounted, ref, useAttrs, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArOptionRow from "../internal/ArOptionRow.vue";
import { useDesignForm, useId } from "../provider/context";
import { firstEnabled, fold, initialOf, splitByReading, splitMatch, step, type ArTextPiece } from "../internal/options";
import type { ArMentionsOption, ArMentionsProps } from "./ArMentions.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArMentionsProps>(), {
  prefix: "@",
  placeholder: undefined,
  rows: 1,
  maxRows: 6,
  avatar: true,
  invalid: false,
  disabled: false,
  readonly: false,
  emptyText: undefined,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{
  "update:modelValue": [value: string];
  /** 人を選んだとき。 */
  select: [option: ArMentionsOption];
  /** 「@」のあとに打ったとき（サーバーで探すときに使う）。 */
  search: [query: string];
}>();

const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return rest;
});
const invalid = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);
const uid = useId("ar-mentions");
const listId = `${uid}-list`;
const root = ref<HTMLElement | null>(null);
const ta = ref<HTMLTextAreaElement | null>(null);
const mirror = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
/** 候補の出る場所（デザインが選ぶ）：field＝入力の下に入力と同じ幅、caret＝打っている「@」のすぐ後ろの下に中身の幅で。 */
const popupForm = useDesignForm<"field" | "caret">("ArMentions", "popup", "field");
const caret = ref<HTMLElement | null>(null);
const caretPos = ref({ left: 0, top: 0 });
const opts = computed<ArMentionsOption[]>(() => props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o)));

/** 今打っている「@…」（カーソルの前）。 */
const token = ref<{ start: number; query: string } | null>(null);
const active = ref(-1);
function readToken() {
  const t = ta.value;
  if (!t || t.selectionStart !== t.selectionEnd) return (token.value = null);
  const before = t.value.slice(0, t.selectionStart);
  const p = props.prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`(^|[\\s　])${p}([^\\s　${p}]*)$`).exec(before);
  token.value = m ? { start: before.length - m[2]!.length - props.prefix.length, query: m[2]! } : null;
  if (token.value) emit("search", token.value.query);
}
interface Row {
  opt: ArMentionsOption;
  pieces: ArTextPiece[];
}
const hits = computed<Row[]>(() => {
  if (!token.value) return [];
  const q = token.value.query;
  const fq = fold(q);
  const out: Row[] = [];
  for (const opt of opts.value) {
    if (!fq || fold(opt.label.replace(/[\s　]/g, "")).includes(fq) || fold(opt.label).includes(fq)) out.push({ opt, pieces: splitMatch(opt.label, q) });
    else {
      const r = opt.keywords ? splitByReading(opt.label, opt.keywords, q) : null;
      if (r) out.push({ opt, pieces: r });
    }
  }
  return out;
});
const enabled = (i: number) => !!hits.value[i];
const open = computed(() => !!token.value && (hits.value.length > 0 || props.emptyText !== undefined));
watch(hits, () => (active.value = firstEnabled(hits.value.length, enabled)));
const optionId = (i: number) => `${uid}-opt-${i}`;

/** 重ねて見せる文字：呼んだ名前（と今打っている「@…」）を札にする。 */
const pieces = computed(() => {
  const text = props.modelValue ?? "";
  const names = opts.value.map((o) => props.prefix + o.label).sort((a, b) => b.length - a.length);
  const out: { text: string; mention: boolean; typing?: boolean }[] = [];
  let i = 0;
  let plain = "";
  while (i < text.length) {
    const typing = token.value && i === token.value.start && open.value;
    const hit = typing ? props.prefix + token.value!.query : names.find((n) => text.startsWith(n, i));
    if (hit) {
      if (plain) out.push({ text: plain, mention: false });
      plain = "";
      out.push({ text: hit, mention: true, typing: !!typing });
      i += hit.length;
    } else plain += text[i++];
  }
  if (plain) out.push({ text: plain, mention: false });
  // 最後が改行なら、高さが合うように1文字足す
  if (text.endsWith("\n")) out.push({ text: " ", mention: false });
  return out;
});

/** caret の形：打っている「@」の右下に、候補の基準の点を置く（重ねた文字から位置を測る）。 */
function placeCaret() {
  if (popupForm.value !== "caret" || !open.value || !root.value || !mirror.value) return;
  const mark = mirror.value.querySelector<HTMLElement>("[data-typing]");
  const node = mark?.firstChild;
  if (!mark || !node || typeof document.createRange !== "function") return;
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, Math.min(props.prefix.length, node.textContent?.length ?? 0));
  const r = range.getBoundingClientRect?.();
  if (!r) return;
  const box = root.value.getBoundingClientRect();
  const line = parseFloat(getComputedStyle(mirror.value).lineHeight) || r.height;
  // 位置の基準は枠の内側（position:absolute）なので、枠の太さを引く
  const el = root.value;
  caretPos.value = {
    left: Math.floor(r.right - box.left - el.clientLeft),
    top: r.top - box.top - el.clientTop - (line - r.height) / 2 + line,
  };
}
watch([open, () => token.value?.query, () => props.modelValue, popupForm], () => nextTick(placeCaret));

function fit() {
  const t = ta.value;
  if (!t) return;
  const cs = getComputedStyle(t);
  const line = parseFloat(cs.lineHeight) || 21.6;
  const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) || 0;
  t.style.height = "auto";
  const max = props.maxRows * line + pad;
  const h = Math.min(max, Math.max(props.rows * line + pad, t.scrollHeight));
  t.style.height = `${h}px`;
  t.style.overflowY = t.scrollHeight > max ? "auto" : "hidden";
  syncScroll();
}
function syncScroll() {
  if (mirror.value && ta.value) mirror.value.scrollTop = ta.value.scrollTop;
}
watch(() => props.modelValue, () => nextTick(fit));
onMounted(fit);
watch(active, () =>
  nextTick(() => document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: "nearest" })),
);

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
  nextTick(readToken);
}
function choose(i: number) {
  const r = hits.value[i];
  const t = ta.value;
  if (!r || !t || !token.value) return;
  const before = props.modelValue.slice(0, token.value.start);
  const after = props.modelValue.slice(t.selectionStart);
  const insert = `${props.prefix}${r.opt.label} `;
  const next = before + insert + after.replace(/^ /, "");
  emit("update:modelValue", next);
  emit("select", r.opt);
  token.value = null;
  nextTick(() => {
    const pos = before.length + insert.length;
    t.focus();
    t.setSelectionRange(pos, pos);
  });
}
function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  const n = hits.value.length;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    active.value = step(active.value, e.key === "ArrowDown" ? 1 : -1, n, enabled);
  } else if ((e.key === "Enter" || e.key === "Tab") && active.value >= 0 && n) {
    e.preventDefault();
    choose(active.value);
  }
}
function close(reason: "outside" | "escape") {
  token.value = null;
  if (reason === "escape") ta.value?.focus();
}
const avatarOf = (o: ArMentionsOption) => o.avatar ?? (props.avatar ? initialOf(o.label) : undefined);
defineExpose({ focus: () => ta.value?.focus() });
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    data-ar="mentions"
    data-part="root"
    :data-state="[open && 'open', invalid && 'invalid', disabled && 'disabled', readonly && 'readonly'].filter(Boolean).join(' ') || undefined"
  >
    <div ref="mirror" data-part="mirror" aria-hidden="true"
      ><template v-for="(p, i) in pieces" :key="i"
        ><mark v-if="p.mention" data-part="mention" :data-typing="p.typing || undefined">{{ p.text }}</mark
        ><template v-else>{{ p.text }}</template></template
      ></div
    >
    <span
      v-if="popupForm === 'caret'"
      ref="caret"
      data-part="caret"
      aria-hidden="true"
      :style="{ position: 'absolute', left: `${caretPos.left}px`, top: `${caretPos.top}px`, width: 0, height: 0 }"
    />
    <textarea
      :id="id"
      ref="ta"
      v-bind="inputAttrs"
      data-part="input"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      role="combobox"
      aria-autocomplete="list"
      aria-multiline="true"
      :aria-expanded="open"
      :aria-controls="open ? listId : undefined"
      :aria-activedescendant="open && active >= 0 ? optionId(active) : undefined"
      :aria-label="id ? undefined : label"
      :aria-invalid="invalid ? 'true' : undefined"
      @input="onInput"
      @keydown="onKey"
      @keyup="(e) => !['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key) && readToken()"
      @click="readToken"
      @scroll="syncScroll"
      @blur="token = null"
    />
  </div>
  <ArFloat
    ar="select-panel"
    :open="open"
    :anchor="popupForm === 'caret' ? caret : root"
    :match-width="popupForm !== 'caret'"
    :offset="6"
    @close="close"
  >
    <div :id="listId" ref="listEl" data-part="list" :data-form="popupForm" role="listbox" aria-label="呼ぶ人" style="max-height: 232px" @mousedown.prevent>
      <ArOptionRow
        v-for="(r, i) in hits"
        :id="optionId(i)"
        :key="String(r.opt.value)"
        :pieces="r.pieces"
        :active="i === active"
        :avatar="avatarOf(r.opt)"
        :avatar-color="r.opt.avatarColor"
        :avatar-ink="r.opt.avatarInk"
        :description="r.opt.description"
        @click="choose(i)"
        @mousemove="active = i"
      />
      <div v-if="!hits.length" data-part="empty" role="status">{{ emptyText }}</div>
    </div>
  </ArFloat>
</template>
