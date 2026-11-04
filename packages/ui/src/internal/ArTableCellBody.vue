<script setup lang="ts">
/**
 * ArTable のセルの既定の中身（ライブラリの中だけで使う）。
 * ArTable は cell-<key> のスロットの引数 Default にこれを包んだ部品を渡し、製品はスロットの中で既定の表示をそのまま描ける
 * （行の中で追加する行だけ入力に差し替え、ほかの行は既定の「頭文字の丸・名前・色の四角つきの sub」のまま、など）。
 * 中身は td の直下に並べる（デザインの CSS が td>[data-part=…] で当てるため、包む要素を作らない）。
 */
import { computed } from "vue";
import ArAvatar from "../components/ArAvatar.vue";
import ArIcon from "../components/ArIcon.vue";
import ArSelect from "../components/ArSelect.vue";
import ArTimeInput from "../components/ArTimeInput.vue";
import type { ArTableColumn, ArTableEditValue } from "../components/ArTable.contract";
import type { ArTimeValue } from "../components/ArTimeInput.contract";
import { editKeyOf, isBlankCell, sameEditValue, toTimeValue } from "./table";

type Row = object;
const props = withDefaults(
  defineProps<{
    row: Row;
    col: ArTableColumn<Row>;
    /** セルの値（段に分けた列では、その段の値）。 */
    value: unknown;
    /** 行の key（入力の key を作る）。 */
    rowKey: string | number;
    /** 行の順番（頭文字の丸の色の元）。 */
    index: number;
    /** 段に分けた列の段の番号（0から）。 */
    line?: number;
    variant: "box" | "board";
    edits: Readonly<Record<string, ArTableEditValue>>;
    invalidCells: readonly string[];
    blank: string;
  }>(),
  { line: undefined },
);
const emit = defineEmits<{ edit: [key: string, value: ArTableEditValue] }>();

const col = computed(() => props.col);
const canEdit = computed(() => (typeof col.value.edit === "function" ? col.value.edit(props.row) : !!col.value.edit));
const editor = computed(() => col.value.editor ?? "amount");
const keyFor = (line?: number) => editKeyOf(props.rowKey, col.value.key, line);
const asText = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const linesOf = (v: unknown): unknown[] => (Array.isArray(v) ? v : [v]);

/** 入力に出す値：edits にあればそれ、無ければ元の値。 */
function current(raw: unknown, line?: number): ArTableEditValue {
  const k = keyFor(line);
  if (k in props.edits) return props.edits[k]!;
  if (editor.value === "time") return toTimeValue(raw);
  if (editor.value === "select") return raw === undefined ? null : (raw as ArTableEditValue);
  return asText(raw);
}
function stateOf(raw: unknown, line?: number) {
  const k = keyFor(line);
  const base = editor.value === "time" ? toTimeValue(raw) : editor.value === "select" ? (raw ?? null) : asText(raw);
  const s = [props.invalidCells.includes(k) && "invalid", k in props.edits && !sameEditValue(props.edits[k], base as ArTableEditValue) && "changed"]
    .filter(Boolean)
    .join(" ");
  return s || undefined;
}
const invalid = (line?: number) => props.invalidCells.includes(keyFor(line));
const label = (line?: number) => col.value.editLabel?.(props.row, line) ?? (line === undefined || props.line !== undefined ? col.value.title : `${col.value.title} ${line + 1}`);
const optionsOf = computed(() => (typeof col.value.options === "function" ? col.value.options(props.row) : (col.value.options ?? [])));
const timeOf = (v: ArTableEditValue): ArTimeValue => toTimeValue(v);

const avatar = computed(() => {
  const a = typeof col.value.avatar === "function" ? col.value.avatar(props.row) : {};
  const text = a.text ?? (Array.from(String(props.value ?? "").trim())[0] ?? "");
  return { text, tone: a.tone, seed: a.tone ? undefined : (a.seed ?? props.index) };
});
const sub = computed(() => {
  const v = col.value.sub?.(props.row);
  return v === undefined || v === "" ? null : typeof v === "string" ? { text: v, color: undefined } : v;
});
const delta = computed(() => {
  const d = col.value.delta?.(props.row);
  if (d === undefined || d === "" || props.line !== undefined) return null;
  return typeof d === "string" ? { text: d, tone: "muted" as const } : { tone: "muted" as const, ...d };
});
/** 段に分けた列は、その段の値を1つのセルとして出す（配列の中身を並べない）。 */
const lineKey = computed(() => props.line);
</script>

<template>
  <span v-if="col.lead" data-part="lead" aria-hidden="true">{{ col.lead }}</span>
  <template v-if="canEdit && col.stack && lineKey === undefined">
    <span data-part="stack" @click.stop>
      <input
        v-for="(v, j) in linesOf(value)"
        :key="j"
        data-part="cell-input"
        type="text"
        inputmode="numeric"
        :value="current(v, j) as string"
        :data-state="stateOf(v, j)"
        :aria-invalid="invalid(j) || undefined"
        :aria-label="label(j)"
        @input="emit('edit', keyFor(j), ($event.target as HTMLInputElement).value)"
      />
    </span>
  </template>
  <span v-else-if="canEdit && editor === 'time'" data-part="cell-editor" data-editor="time" :data-state="stateOf(value, lineKey)" @click.stop>
    <ArTimeInput
      size="sm"
      :model-value="timeOf(current(value, lineKey))"
      :day-shift="col.dayShift ?? false"
      :overnight="col.overnight ?? false"
      :placeholder="col.placeholder"
      :invalid="invalid(lineKey)"
      :label="label(lineKey)"
      @update:model-value="(v: ArTimeValue) => emit('edit', keyFor(lineKey), v)"
    />
  </span>
  <span v-else-if="canEdit && editor === 'select'" data-part="cell-editor" data-editor="select" :data-state="stateOf(value, lineKey)" @click.stop>
    <ArSelect
      size="sm"
      block
      :model-value="(current(value, lineKey) as string | number | null)"
      :options="optionsOf"
      value-description
      :placeholder="col.placeholder"
      :invalid="invalid(lineKey)"
      :label="label(lineKey)"
      @update:model-value="(v) => emit('edit', keyFor(lineKey), v as ArTableEditValue)"
    />
  </span>
  <template v-else-if="canEdit">
    <input
      data-part="cell-input"
      :data-editor="editor === 'text' ? 'text' : undefined"
      type="text"
      :inputmode="editor === 'text' ? undefined : 'numeric'"
      :placeholder="col.placeholder"
      :value="current(value, lineKey) as string"
      :data-state="stateOf(value, lineKey)"
      :aria-invalid="invalid(lineKey) || undefined"
      :aria-label="label(lineKey)"
      @click.stop
      @input="emit('edit', keyFor(lineKey), ($event.target as HTMLInputElement).value)"
    />
  </template>
  <template v-else>
    <span v-if="col.stack && lineKey === undefined" data-part="stack">
      <span v-for="(v, j) in linesOf(value)" :key="j">{{ isBlankCell(v) ? "" : v }}</span>
    </span>
    <span v-else-if="col.avatar" data-part="person" :data-single="!col.sub || undefined">
      <ArAvatar v-bind="avatar" :size="variant === 'board' ? 'md' : 'sm'" />
      <span data-part="name">
        <b>{{ value }}</b>
        <small v-if="sub" data-part="sub">
          <i v-if="sub.color" data-part="sub-mark" :style="{ background: sub.color }" aria-hidden="true" />{{ sub.text }}
        </small>
      </span>
    </span>
    <span v-else-if="lineKey === undefined && Array.isArray(value) && !isBlankCell(value)" data-part="lines">
      <span v-for="(v, j) in value as unknown[]" :key="j">{{ v }}</span>
    </span>
    <template v-else>{{ isBlankCell(value) ? (lineKey !== undefined && lineKey > 0 ? "" : blank) : value }}</template>
  </template>
  <ArIcon v-if="col.marked?.(row)" line name="pen" size="sm" data-part="mark" label="手で直した金額" />
  <small v-if="delta" data-part="delta" :data-tone="delta.tone">{{ delta.text }}</small>
</template>
