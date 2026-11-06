<script setup lang="ts">
/**
 * ArRichTextEditor 1.0 — 書式のツールバー・変数のメニュー・文字数のある文章の入力（書類集計の自作書類・通知のメールテンプレート）。
 * 依存を増やさず contenteditable で作る。値は HTML（v-model）。危ないタグと属性は入るときも出すときも消す。
 * 変数（`{{ $employee_name }}`）は本文の中で札に見せる（値はただの文字のまま）。plain なら文字と改行だけ。
 * キーボード：ツールバーは ←→ Home End で道具を移り（Tab で止まるのは1つ）、メニューは ↑↓ Enter Escape。
 * 本文では Ctrl/⌘+B・I・U・Z・Shift+Z（ブラウザの編集の操作）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import ArVariablePanel from "./ArVariablePanel.vue";
import { froalaGlyphs, lineGlyphs, type EditorGlyph } from "../internal/editorGlyphs";
import {
  countChars,
  countWords,
  decorateTokens,
  defaultTokenPattern,
  plainHtml,
  sanitizeHtml,
  serialize,
} from "../internal/richText";
import { useDesignForm, useId } from "../provider/context";
import type { ArRichTextEditorLabels, ArRichTextEditorProps, ArRichTextTool } from "./ArRichTextEditor.contract";
import type { ArVariableGroup, ArVariableItem } from "./ArVariablePanel.contract";

defineOptions({ inheritAttrs: false });
const defaultLabels: ArRichTextEditorLabels = {
  toolbar: "書式",
  fontSize: "文字の大きさ",
  bold: "太字",
  italic: "斜体",
  underline: "下線",
  color: "文字の色",
  colorRemove: "色を消す",
  align: "揃え",
  alignLeft: "左揃え",
  alignCenter: "中央揃え",
  alignRight: "右揃え",
  alignJustify: "両端揃え",
  paragraph: "段落の形",
  paragraphNormal: "標準",
  heading1: "見出し1",
  heading2: "見出し2",
  heading3: "見出し3",
  heading4: "見出し4",
  list: "箇条書き",
  table: "表の挿入",
  pageBreak: "改ページ",
  pageBreakText: "~~~~~~~~~~ 改ページ ~~~~~~~~~~",
  undo: "元に戻す",
  redo: "やり直す",
  help: "ヘルプ",
  count: "文字数 : {n}",
  countMax: "文字数 : {n} / {max}",
  words: "Words : {n}",
  variableCount: "{n}件",
};

const props = withDefaults(defineProps<ArRichTextEditorProps>(), {
  id: undefined,
  modelValue: "",
  toolbar: () =>
    ["variables", "|", "fontSize", "bold", "italic", "underline", "color", "|", "align", "paragraph", "list", "|", "table", "pageBreak", "spacer", "undo", "redo", "help"] as const,
  plain: false,
  variables: () => [],
  variablesLabel: "ARROWの変数",
  variablesPlacement: undefined,
  variablesOpen: undefined,
  variablesNote: undefined,
  tokenPattern: undefined,
  counter: true,
  countPlacement: "footer",
  maxLength: undefined,
  placeholder: undefined,
  paper: false,
  paperWidth: "560px",
  minHeight: undefined,
  maxHeight: undefined,
  fontSizes: () => [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96],
  colors: () => [
    "#61BD6D", "#1ABC9C", "#54ACD2", "#2C82C9", "#9365B8", "#475577", "#CCCCCC",
    "#41A85F", "#00A885", "#3D8EB9", "#2969B0", "#553982", "#28324E", "#000000",
    "#F7DA64", "#FBA026", "#EB6B56", "#E25041", "#A38F84", "#EFEFEF", "#FFFFFF",
    "#FAC51C", "#F37934", "#D14841", "#B8312F", "#7C706B", "#D1D5D8",
  ],
  disabled: false,
  readonly: false,
  invalid: false,
  label: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{
  "update:modelValue": [html: string];
  "update:variablesOpen": [open: boolean];
  help: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  "insert-variable": [token: string];
}>();
defineSlots<{ "footer-extra"?: () => unknown; "toolbar-end"?: () => unknown }>();

const slots = useSlots();
const L = computed<ArRichTextEditorLabels>(() => ({ ...defaultLabels, ...props.labels }));
const id = useId("ar-rte");
const contentId = computed(() => props.id ?? `${id}-content`);
const attrs = useAttrs();
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }));
const contentAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const accessibleLabel = computed(() => typeof attrs["aria-label"] === "string" ? attrs["aria-label"] : props.label);
const invalidState = computed(() => props.invalid || attrs["aria-invalid"] === "true" || attrs["aria-invalid"] === true);
const placementForm = useDesignForm<"inline" | "menu">("ArRichTextEditor", "variables", "inline");
const iconForm = useDesignForm<"line" | "froala">("ArRichTextEditor", "icons", "line");
const varButtonForm = useDesignForm<"label" | "icon">("ArRichTextEditor", "variableButton", "label");
const countForm = useDesignForm<"auto" | "footer">("ArRichTextEditor", "count", "auto");
const countAt = computed(() => (countForm.value === "footer" ? "footer" : props.countPlacement));
const placement = computed(() => props.variablesPlacement ?? placementForm.value);
const glyphs = computed<Record<string, EditorGlyph>>(() => (iconForm.value === "froala" ? froalaGlyphs : lineGlyphs));
const glyph = (name: string) => glyphs.value[name] ?? lineGlyphs[name]!;
const pattern = computed(() => props.tokenPattern ?? defaultTokenPattern);
const editable = computed(() => !props.disabled && !props.readonly);

/* ---------- 本文 ---------- */
const content = ref<HTMLElement | null>(null);
const focused = ref(false);
const chars = ref(0);
const words = ref(0);
const empty = ref(true);
let lastEmitted: string | null = null;

const clean = (html: string) => (props.plain ? plainHtml(html) : sanitizeHtml(html));
function render(html: string) {
  const el = content.value;
  if (!el) return;
  el.innerHTML = clean(html ?? "");
  decorateTokens(el, pattern.value);
  measure();
}
function measure() {
  const el = content.value;
  if (!el) return;
  chars.value = countChars(el);
  words.value = countWords(el);
  empty.value = chars.value === 0 && !el.querySelector("table,hr,li,img");
}
function sync() {
  const el = content.value;
  if (!el) return;
  measure();
  const out = serialize(el, props.plain);
  if (out === lastEmitted) return;
  lastEmitted = out;
  emit("update:modelValue", out);
}
watch(
  () => props.modelValue,
  (v) => {
    if (v === lastEmitted) return;
    lastEmitted = v ?? "";
    render(v ?? "");
  },
);
watch(pattern, () => render(props.modelValue ?? ""));
onMounted(() => {
  lastEmitted = props.modelValue ?? "";
  render(props.modelValue ?? "");
  document.addEventListener("selectionchange", onSelectionChange);
});
onBeforeUnmount(() => document.removeEventListener("selectionchange", onSelectionChange));

/* 変数を打ち込んだときも札にする（カーソルは札の後ろへ） */
function onInput() {
  const el = content.value;
  if (!el) return;
  const text = el.textContent ?? "";
  const re = new RegExp(pattern.value.source, "g");
  const loose = [...el.childNodes].length && re.test(text);
  if (loose) {
    const before = el.querySelectorAll('[data-part="token"]').length;
    decorateTokens(el, pattern.value);
    const after = el.querySelectorAll('[data-part="token"]');
    if (after.length > before) placeCaretAfter(after[after.length - 1] as HTMLElement);
  }
  sync();
  refreshState();
}
function placeCaretAfter(node: Node) {
  const sel = window.getSelection();
  if (!sel) return;
  const r = document.createRange();
  r.setStartAfter(node);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);
  saved = r.cloneRange();
}

/** ブラウザの編集の操作（古い API で、無い環境もある）。 */
type EditDoc = {
  execCommand?: (cmd: string, ui: boolean, value?: string) => boolean;
  queryCommandState?: (cmd: string) => boolean;
  queryCommandEnabled?: (cmd: string) => boolean;
};
const editDoc = () => document as unknown as EditDoc;
/* カーソルの位置を覚える（ツールバー・パネルを押してもそこへ入れる） */
let saved: Range | null = null;
const active = ref<Record<string, boolean>>({});
const currentSize = ref<number | null>(null);
/** 元に戻せる・やり直せるか（押せないときは淡くする。押すことはできる）。 */
const canUndo = ref(false);
const canRedo = ref(false);
function inside(n: Node | null) {
  return !!(n && content.value && content.value.contains(n));
}
function onSelectionChange() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const r = sel.getRangeAt(0);
  if (!inside(r.commonAncestorContainer)) return;
  saved = r.cloneRange();
  refreshState();
}
function refreshState() {
  const q = (c: string) => {
    try {
      return !!editDoc().queryCommandState?.(c);
    } catch {
      return false;
    }
  };
  active.value = { bold: q("bold"), italic: q("italic"), underline: q("underline"), list: q("insertUnorderedList") };
  const en = (c: string) => {
    try {
      return !!editDoc().queryCommandEnabled?.(c);
    } catch {
      return false;
    }
  };
  canUndo.value = en("undo");
  canRedo.value = en("redo");
  const n = saved?.startContainer;
  const el = n ? (n.nodeType === 1 ? (n as HTMLElement) : n.parentElement) : null;
  currentSize.value = el && inside(el) ? Math.round(parseFloat(getComputedStyle(el).fontSize)) || null : null;
}
function restore() {
  const el = content.value;
  if (!el) return;
  el.focus({ preventScroll: true });
  const sel = window.getSelection();
  if (!sel) return;
  let r = saved;
  if (!r || !inside(r.commonAncestorContainer)) {
    r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
  }
  sel.removeAllRanges();
  sel.addRange(r);
}
function exec(cmd: string, value?: string): boolean {
  try {
    return !!editDoc().execCommand?.(cmd, false, value);
  } catch {
    return false;
  }
}
/** 覚えた位置に HTML を入れる。ブラウザの編集の操作で入れ（元に戻せる）、使えなければ DOM で入れる。 */
function insertAt(html: string) {
  if (!editable.value) return;
  restore();
  const safe = props.plain ? plainHtml(html) : sanitizeHtml(html);
  if (!exec("insertHTML", safe)) {
    const sel = window.getSelection();
    const r = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    if (r) {
      r.deleteContents();
      const t = document.createElement("template");
      t.innerHTML = safe;
      const last = t.content.lastChild;
      r.insertNode(t.content);
      if (last) placeCaretAfter(last);
    }
  }
  decorateTokens(content.value!, pattern.value);
  const sel = window.getSelection();
  if (sel && sel.rangeCount) saved = sel.getRangeAt(0).cloneRange();
  sync();
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function insertText(text: string) {
  insertAt(esc(text).replace(/\n/g, "<br>"));
}
function insertVariable(token: string) {
  insertText(token);
  emit("insert-variable", token);
}
defineExpose({ insertText, insertHtml: insertAt, focus: () => restore() });

function onPaste(e: ClipboardEvent) {
  if (!editable.value) return;
  const dt = e.clipboardData;
  if (!dt) return;
  e.preventDefault();
  const html = dt.getData("text/html");
  if (html && !props.plain) insertAt(html);
  else insertText(dt.getData("text/plain"));
}
function onDrop(e: DragEvent) {
  /* 外から落とした HTML も消毒して入れる */
  if (!editable.value || !e.dataTransfer) return;
  const html = e.dataTransfer.getData("text/html");
  const text = e.dataTransfer.getData("text/plain");
  if (!html && !text) return;
  e.preventDefault();
  if (html && !props.plain) insertAt(html);
  else insertText(text);
}
function onKeydown(e: KeyboardEvent) {
  if (props.plain && e.key === "Enter") {
    /* メールの本文は改行を <br> にする（今の ARROW の enter: ENTER_BR） */
    e.preventDefault();
    if (!exec("insertLineBreak")) insertAt("<br>");
    else sync();
  }
}

/* ---------- ツールバー ---------- */
const toolbarEl = ref<HTMLElement | null>(null);
const focusIndex = ref(0);
interface ToolView {
  key: string;
  tool: ArRichTextTool;
  label: string;
  glyph?: string;
  menu?: "fontSize" | "color" | "align" | "paragraph" | "variables";
  pressed?: boolean;
  /** 今は効かない（元に戻すものがない など）。 */
  idle?: boolean;
}
const tools = computed<ToolView[]>(() =>
  props.toolbar.map((t, i): ToolView => {
    const key = `${t}-${i}`;
    switch (t) {
      case "variables":
        return { key, tool: t, label: props.variablesLabel, glyph: "variables", menu: placement.value === "menu" ? "variables" : undefined };
      case "fontSize":
        return { key, tool: t, label: L.value.fontSize, glyph: "fontSize", menu: "fontSize" };
      case "color":
        return { key, tool: t, label: L.value.color, glyph: "color", menu: "color" };
      case "align":
        return { key, tool: t, label: L.value.align, glyph: "alignCenter", menu: "align" };
      case "paragraph":
        return { key, tool: t, label: L.value.paragraph, glyph: "paragraph", menu: "paragraph" };
      case "|":
      case "spacer":
        return { key, tool: t, label: "" };
      default:
        return {
          key,
          tool: t,
          label: L.value[t],
          glyph: t,
          pressed: ["bold", "italic", "underline", "list"].includes(t) ? !!active.value[t] : undefined,
          idle: t === "undo" ? !canUndo.value : t === "redo" ? !canRedo.value : undefined,
        };
    }
  }),
);
const buttons = computed(() => tools.value.filter((t) => t.tool !== "|" && t.tool !== "spacer"));
function toolButtons(): HTMLElement[] {
  return Array.from(toolbarEl.value?.querySelectorAll<HTMLElement>('[data-part="tool"]') ?? []);
}
function onToolbarKey(e: KeyboardEvent) {
  const list = toolButtons();
  const i = list.indexOf(e.target as HTMLElement);
  if (i < 0) return;
  const map: Record<string, number> = { ArrowRight: (i + 1) % list.length, ArrowLeft: (i - 1 + list.length) % list.length, Home: 0, End: list.length - 1 };
  const j = map[e.key];
  if (j === undefined) return;
  e.preventDefault();
  focusIndex.value = j;
  list[j]?.focus();
}

/* inline の変数パネル */
const innerVarsOpen = ref(false);
const varsOpen = computed(() => props.variablesOpen ?? innerVarsOpen.value);
function setVarsOpen(v: boolean) {
  innerVarsOpen.value = v;
  emit("update:variablesOpen", v);
}

/* 浮かぶメニュー */
const menu = ref<ToolView["menu"] | null>(null);
const menuAnchor = ref<HTMLElement | null>(null);
const openGroup = ref<string | null>(null);
function onTool(t: ToolView, e: MouseEvent) {
  if (!editable.value) return;
  const btn = e.currentTarget as HTMLElement;
  focusIndex.value = toolButtons().indexOf(btn);
  if (t.tool === "variables" && placement.value === "inline") {
    setVarsOpen(!varsOpen.value);
    return;
  }
  if (t.menu) {
    if (menu.value === t.menu) return closeMenu();
    menuAnchor.value = btn;
    menu.value = t.menu;
    openGroup.value = null;
    void nextTick(() => firstMenuItem()?.focus());
    return;
  }
  run(t.tool);
}
function run(tool: ArRichTextTool) {
  switch (tool) {
    case "bold":
    case "italic":
    case "underline":
      restore();
      exec(tool);
      break;
    case "list":
      restore();
      exec("insertUnorderedList");
      break;
    case "undo":
    case "redo":
      restore();
      exec(tool);
      break;
    case "table":
      insertAt(
        '<table style="width: 100%; border-collapse: collapse"><tbody><tr><td style="width: 50%; border: 1px solid #888888"><br></td><td style="width: 50%; border: 1px solid #888888"><br></td></tr><tr><td style="width: 50%; border: 1px solid #888888"><br></td><td style="width: 50%; border: 1px solid #888888"><br></td></tr></tbody></table><p><br></p>',
      );
      return;
    case "pageBreak":
      insertAt(`<div class="page-break" style="page-break-before: always"><span>${esc(L.value.pageBreakText)}</span></div><p><br></p>`);
      return;
    case "help":
      emit("help");
      return;
  }
  sync();
  refreshState();
}
function closeMenu(refocus = true) {
  const a = menuAnchor.value;
  menu.value = null;
  openGroup.value = null;
  if (refocus) a?.focus();
}
const menuEl = ref<InstanceType<typeof ArFloat> | null>(null);
function menuItems(): HTMLElement[] {
  return Array.from((menuEl.value?.panel as HTMLElement | null | undefined)?.querySelectorAll<HTMLElement>('[data-part="option"]') ?? []);
}
function firstMenuItem() {
  return menuItems()[0];
}
function onMenuKey(e: KeyboardEvent) {
  const list = menuItems();
  const i = list.indexOf(document.activeElement as HTMLElement);
  const grid = menu.value === "color";
  const step: Record<string, number> = grid
    ? { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }
    : { ArrowDown: 1, ArrowUp: -1, ...(menu.value === "variables" && iconForm.value === "froala" && openGroup.value === null ? { ArrowRight: 1, ArrowLeft: -1 } : {}) };
  if (e.key === "Tab") {
    closeMenu(false);
    return;
  }
  if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    list[e.key === "Home" ? 0 : list.length - 1]?.focus();
    return;
  }
  const s = step[e.key];
  if (s === undefined) return;
  e.preventDefault();
  const j = i < 0 ? 0 : Math.min(list.length - 1, Math.max(0, i + s));
  list[j]?.focus();
}
function applySize(px: number) {
  restore();
  exec("styleWithCSS", "false");
  if (exec("fontSize", "7")) {
    content.value?.querySelectorAll('font[size="7"]').forEach((f) => {
      const sp = document.createElement("span");
      sp.style.fontSize = `${px}px`;
      while (f.firstChild) sp.appendChild(f.firstChild);
      f.replaceWith(sp);
    });
  }
  closeMenu();
  sync();
  refreshState();
}
function applyColor(c: string | null) {
  restore();
  exec("styleWithCSS", "true");
  if (c) exec("foreColor", c);
  else exec("removeFormat");
  closeMenu();
  sync();
}
function applyAlign(a: "Left" | "Center" | "Right" | "Full") {
  restore();
  exec(`justify${a}`);
  closeMenu();
  sync();
}
function applyBlock(tag: string) {
  restore();
  exec("formatBlock", `<${tag}>`);
  closeMenu();
  sync();
}
function pickVariable(token: string) {
  closeMenu(false);
  insertVariable(token);
}
const tokenOf = (it: ArVariableItem) => it.token ?? `{{ $${it.key} }}`;
function toggleGroup(g: ArVariableGroup) {
  openGroup.value = openGroup.value === g.key ? null : g.key;
  void nextTick(() => {
    if (openGroup.value) (menuEl.value?.panel as HTMLElement | null | undefined)?.querySelector<HTMLElement>(`[data-group="${g.key}"] [data-part="items"] [data-part="option"]`)?.focus();
  });
}
const aligns = computed(() => [
  { k: "Left" as const, label: L.value.alignLeft, glyph: "alignLeft" },
  { k: "Center" as const, label: L.value.alignCenter, glyph: "alignCenter" },
  { k: "Right" as const, label: L.value.alignRight, glyph: "alignRight" },
  { k: "Full" as const, label: L.value.alignJustify, glyph: "alignJustify" },
]);
const blocks = computed(() => [
  { tag: "p", label: L.value.paragraphNormal },
  { tag: "h1", label: L.value.heading1 },
  { tag: "h2", label: L.value.heading2 },
  { tag: "h3", label: L.value.heading3 },
  { tag: "h4", label: L.value.heading4 },
]);

const countText = computed(() =>
  (props.maxLength ? L.value.countMax : L.value.count).replace("{n}", String(chars.value)).replace("{max}", String(props.maxLength ?? "")),
);
const over = computed(() => !!props.maxLength && chars.value > props.maxLength);
const state = computed(
  () =>
    [focused.value && "focused", props.disabled && "disabled", props.readonly && "readonly", (invalidState.value || over.value) && "invalid", empty.value && "empty"]
      .filter(Boolean)
      .join(" ") || undefined,
);
const showToolbar = computed(() => !props.readonly && props.toolbar.length > 0);
const showFooter = computed(() => (props.counter && countAt.value === "footer") || !!slots["footer-extra"]);
const bodyStyle = computed(() => ({ minHeight: props.minHeight, maxHeight: props.maxHeight }));
</script>

<template>
  <div
    v-bind="rootAttrs"
    data-ar="rich-text-editor"
    data-part="root"
    :data-state="state"
    :data-paper="paper || undefined"
    :data-plain="plain || undefined"
    :data-variables="placement"
    :data-icons="iconForm"
  >
    <div
      v-if="showToolbar"
      ref="toolbarEl"
      data-part="toolbar"
      role="toolbar"
      :aria-label="L.toolbar"
      :aria-controls="contentId"
      @keydown="onToolbarKey"
    >
      <template v-for="t in tools" :key="t.key">
        <span v-if="t.tool === '|' || t.tool === 'spacer'" data-part="separator" :data-kind="t.tool === 'spacer' ? 'spacer' : undefined" aria-hidden="true" />
        <button
          v-else
          type="button"
          data-part="tool"
          :data-tool="t.tool"
          :data-form="t.tool === 'variables' ? varButtonForm : undefined"
          :data-state="
            [t.pressed && 'on', t.idle && 'idle', (menu === t.menu && t.menu) || (t.tool === 'variables' && placement === 'inline' && varsOpen) ? 'open' : ''].filter(Boolean).join(' ') ||
            undefined
          "
          :aria-label="t.tool === 'variables' && varButtonForm === 'label' ? undefined : t.label"
          :title="t.tool === 'variables' && varButtonForm === 'label' ? undefined : t.label"
          :aria-pressed="t.pressed === undefined ? undefined : t.pressed"
          :aria-haspopup="t.menu ? 'menu' : undefined"
          :aria-expanded="t.menu ? menu === t.menu : t.tool === 'variables' ? varsOpen : undefined"
          :aria-controls="t.tool === 'variables' && placement === 'inline' ? `${id}-vars` : undefined"
          :tabindex="buttons.indexOf(t) === focusIndex ? 0 : -1"
          :disabled="disabled"
          @mousedown.prevent
          @click="onTool(t, $event)"
        >
          <template v-if="t.tool === 'variables'">
            <svg
              v-if="varButtonForm === 'icon' || glyph('variables').fill"
              data-part="glyph"
              :data-fill="glyph('variables').fill || undefined"
              :viewBox="glyph('variables').viewBox"
              aria-hidden="true"
              focusable="false"
              v-html="glyph('variables').body"
            />
            <svg v-else data-part="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false" v-html="lineGlyphs.braces!.body" />
            <span v-if="varButtonForm === 'label'" data-part="tool-label">{{ t.label }}</span>
            <svg v-if="varButtonForm === 'label'" data-part="caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false" v-html="lineGlyphs.caret!.body" />
          </template>
          <template v-else-if="t.tool === 'fontSize'">
            <svg v-if="glyph('fontSize').fill" data-part="glyph" data-fill :viewBox="glyph('fontSize').viewBox" aria-hidden="true" focusable="false" v-html="glyph('fontSize').body" />
            <span v-else data-part="tool-value">{{ currentSize ?? 14 }}</span>
            <svg data-part="caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false" v-html="lineGlyphs.caret!.body" />
          </template>
          <svg
            v-else
            data-part="glyph"
            :data-fill="glyph(t.glyph!).fill || undefined"
            :viewBox="glyph(t.glyph!).viewBox"
            aria-hidden="true"
            focusable="false"
            v-html="glyph(t.glyph!).body"
          />
        </button>
      </template>
      <span v-if="(counter && countAt === 'toolbar') || $slots['toolbar-end']" data-part="spacer" />
      <slot name="toolbar-end" />
      <span v-if="counter && countAt === 'toolbar'" data-part="count" :data-state="over ? 'over' : undefined" aria-live="polite">{{ countText }}</span>
    </div>

    <div v-if="showToolbar && placement === 'inline' && varsOpen && variables.length" :id="`${id}-vars`" data-part="variables">
      <ArVariablePanel layout="chips" :groups="variables" :description="variablesNote" :disabled="!editable" max-height="112px" @insert="insertVariable" />
    </div>

    <div data-part="body" :style="paper ? bodyStyle : undefined">
      <div data-part="paper" :style="paper ? { width: paperWidth } : bodyStyle">
        <div
          v-bind="contentAttrs"
          :id="contentId"
          ref="content"
          data-part="content"
          role="textbox"
          aria-multiline="true"
          :aria-label="accessibleLabel"
          :aria-disabled="disabled || undefined"
          :aria-readonly="readonly || undefined"
          :aria-invalid="invalidState || over || undefined"
          :contenteditable="editable ? 'true' : 'false'"
          :tabindex="disabled ? -1 : 0"
          spellcheck="false"
          @input="onInput"
          @paste="onPaste"
          @drop="onDrop"
          @keydown="onKeydown"
          @keyup="refreshState"
          @mouseup="refreshState"
          @focus="focused = true; emit('focus', $event)"
          @blur="focused = false; emit('blur', $event)"
        />
        <div v-if="empty && placeholder" data-part="placeholder" aria-hidden="true">{{ placeholder }}</div>
      </div>
    </div>

    <div v-if="showFooter" data-part="footer">
      <span v-if="counter && countAt === 'footer'" data-part="count" :data-state="over ? 'over' : undefined" aria-live="polite">{{ countText }}</span>
      <span v-if="counter && countAt === 'footer'" data-part="words" aria-hidden="true">{{ L.words.replace("{n}", String(words)) }}</span>
      <div v-if="$slots['footer-extra']" data-part="footer-extra"><slot name="footer-extra" /></div>
    </div>

    <ArFloat
      ref="menuEl"
      :open="!!menu"
      :anchor="menuAnchor"
      :placement="'bottom-start'"
      :offset="menu === 'variables' && iconForm === 'froala' ? 0 : 4"
      ar="rich-text-menu"
      :role="undefined"
      @close="(r: string) => closeMenu(r === 'escape')"
    >
      <div data-part="menu" :data-kind="menu" :data-icons="iconForm" @keydown="onMenuKey">
        <template v-if="menu === 'fontSize'">
          <div role="menu" :aria-label="L.fontSize" data-part="list">
            <button
              v-for="s in fontSizes"
              :key="s"
              type="button"
              role="menuitemradio"
              data-part="option"
              :aria-checked="currentSize === s"
              :data-state="currentSize === s ? 'selected' : undefined"
              tabindex="-1"
              @mousedown.prevent
              @click="applySize(s)"
            >
              {{ s }}
            </button>
          </div>
        </template>
        <template v-else-if="menu === 'color'">
          <div role="menu" :aria-label="L.color" data-part="swatches">
            <button
              v-for="c in colors"
              :key="c"
              type="button"
              role="menuitem"
              data-part="option"
              data-kind="swatch"
              :aria-label="c"
              :title="c"
              :style="{ background: c }"
              tabindex="-1"
              @mousedown.prevent
              @click="applyColor(c)"
            />
            <button type="button" role="menuitem" data-part="option" data-kind="remove" :aria-label="L.colorRemove" :title="L.colorRemove" tabindex="-1" @mousedown.prevent @click="applyColor(null)">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </template>
        <template v-else-if="menu === 'align'">
          <div role="menu" :aria-label="L.align" data-part="list">
            <button v-for="a in aligns" :key="a.k" type="button" role="menuitem" data-part="option" :aria-label="a.label" :title="a.label" tabindex="-1" @mousedown.prevent @click="applyAlign(a.k)">
              <svg data-part="glyph" :data-fill="glyph(a.glyph).fill || undefined" :viewBox="glyph(a.glyph).viewBox" aria-hidden="true" focusable="false" v-html="glyph(a.glyph).body" />
              <span data-part="option-label">{{ a.label }}</span>
            </button>
          </div>
        </template>
        <template v-else-if="menu === 'paragraph'">
          <div role="menu" :aria-label="L.paragraph" data-part="list">
            <button v-for="b in blocks" :key="b.tag" type="button" role="menuitem" data-part="option" :data-block="b.tag" tabindex="-1" @mousedown.prevent @click="applyBlock(b.tag)">
              <component :is="b.tag" data-part="option-label">{{ b.label }}</component>
            </button>
          </div>
        </template>
        <template v-else-if="menu === 'variables'">
          <div role="menu" :aria-label="variablesLabel" data-part="groups">
            <div v-for="g in variables" :key="g.key" data-part="group" :data-group="g.key" :data-state="openGroup === g.key ? 'open' : undefined">
              <button
                type="button"
                role="menuitem"
                data-part="option"
                data-kind="group"
                aria-haspopup="menu"
                :aria-expanded="openGroup === g.key"
                tabindex="-1"
                @mousedown.prevent
                @click="toggleGroup(g)"
              >
                <svg data-part="group-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" v-html="lineGlyphs.variables!.body" />
                <span data-part="option-label">{{ g.label }}</span>
                <span data-part="group-count" :aria-label="L.variableCount.replace('{n}', String(g.items.length))">{{ g.items.length }}</span>
                <svg data-part="caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false" v-html="lineGlyphs.caret!.body" />
              </button>
              <div v-if="openGroup === g.key" data-part="items" role="menu" :aria-label="g.label">
                <button
                  v-for="it in g.items"
                  :key="it.key"
                  type="button"
                  role="menuitem"
                  data-part="option"
                  data-kind="variable"
                  :title="it.description"
                  tabindex="-1"
                  @mousedown.prevent
                  @click="pickVariable(tokenOf(it))"
                >
                  {{ it.label }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </ArFloat>
  </div>
</template>
