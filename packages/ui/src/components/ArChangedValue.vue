<script setup lang="ts">
/**
 * ArChangedValue 1.2 — 変更前→変更後。変わっていなければ今の値だけを出す。
 * layout="text" は今の UI/ChangedValue と同じ1つの文「前 → 後」（変わったときは class="changed"）。
 * items を渡すと「項目｜変更前｜変更後」の表（table）か、1列の一覧（list）にまとめる（保存前の確認・変更履歴の詳細）。
 * 読み上げでは「変更前 … 変更後 …」と読む（矢印は飾り）。
 */
import { computed } from "vue";
import type { ArChangedValueHeaders, ArChangedValueItem, ArChangedValueProps } from "./ArChangedValue.contract";

const props = withDefaults(defineProps<ArChangedValueProps>(), {
  before: null,
  after: null,
  changed: null,
  empty: "—",
  labels: () => ({ before: "変更前", after: "変更後" }),
  items: null,
  layout: undefined,
  headers: () => ({}),
  numeric: false,
  caption: "変更する項目",
});
const show = (v: string | number | null | undefined) => (v === null || v === undefined || v === "" ? props.empty : String(v));
const isChanged = computed(() => props.changed ?? show(props.before) !== show(props.after));
const form = computed(() => props.layout ?? (props.items ? "table" : "inline"));
const H = computed<ArChangedValueHeaders>(() => ({ label: "項目", before: "変更前", after: "変更後", list: "項目（変更前 → 変更後）", ...props.headers }));
const itemChanged = (it: ArChangedValueItem) => show(it.before) !== show(it.after);
const keyOf = (it: ArChangedValueItem) => it.key ?? it.label;
/** text：今の UI/ChangedValue と同じ（null は空の文字、変わったかはそのまま比べる）。 */
const raw = (v: string | number | null | undefined) => (v === null || v === undefined ? "" : String(v));
const textChanged = computed(() => props.changed ?? props.before !== props.after);
</script>

<template>
  <table v-if="form === 'table'" data-ar="changed-value" data-part="root" data-layout="table" :data-numeric="numeric || undefined">
    <caption data-ar-visually-hidden>{{ caption }}</caption>
    <thead data-part="head">
      <tr>
        <th data-part="head-cell" scope="col">{{ H.label }}</th>
        <th data-part="head-cell" data-col="before" scope="col">{{ H.before }}</th>
        <th data-part="head-cell" data-col="after" scope="col">{{ H.after }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="it in items ?? []" :key="keyOf(it)" data-part="row" :data-state="itemChanged(it) ? 'changed' : undefined">
        <th data-part="label" scope="row">{{ it.label }}</th>
        <td data-part="cell" data-col="before"><component :is="itemChanged(it) ? 's' : 'span'" data-part="before">{{ show(it.before) }}</component></td>
        <td data-part="cell" data-col="after">
          <span data-part="change"><span v-if="itemChanged(it)" data-part="arrow" aria-hidden="true">→</span><span data-ar-visually-hidden>{{ labels.after }}</span><b data-part="after">{{ show(it.after) }}</b></span>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else-if="form === 'list'" data-ar="changed-value" data-part="root" data-layout="list" role="table" :aria-label="caption">
    <div data-part="head" role="row"><span data-part="head-cell" role="columnheader">{{ H.list }}</span></div>
    <div v-for="it in items ?? []" :key="keyOf(it)" data-part="row" role="row" :data-state="itemChanged(it) ? 'changed' : undefined">
      <span data-part="change" role="cell">
        <b data-part="label">{{ it.label }}</b>
        <template v-if="itemChanged(it)"><span data-ar-visually-hidden>{{ labels.before }}</span><s data-part="before">{{ show(it.before) }}</s>
        <span data-part="arrow" aria-hidden="true">→</span></template>
        <span data-ar-visually-hidden>{{ labels.after }}</span><b data-part="after">{{ show(it.after) }}</b>
      </span>
    </div>
  </div>
  <span
    v-else-if="form === 'text'"
    data-ar="changed-value"
    data-part="root"
    data-layout="text"
    :class="{ changed: textChanged }"
    :data-state="textChanged ? 'changed' : undefined"
  >{{ textChanged ? `${raw(before)} → ${raw(after)}` : raw(after) }}</span>
  <component :is="$slots.before || $slots.after ? 'div' : 'span'" v-else data-ar="changed-value" data-part="root" :data-rich="$slots.before || $slots.after ? '' : undefined" :data-state="isChanged ? 'changed' : undefined">
    <template v-if="isChanged">
      <span :data-ar-visually-hidden="$slots.before || $slots.after ? undefined : ''" data-part="before-label">{{ labels.before }}</span>
      <component :is="$slots.before ? 'div' : 's'" data-part="before"><slot name="before">{{ show(before) }}</slot></component>
      <span data-part="arrow" aria-hidden="true">→</span>
      <span :data-ar-visually-hidden="$slots.before || $slots.after ? undefined : ''" data-part="after-label">{{ labels.after }}</span>
      <component :is="$slots.after ? 'div' : 'span'" data-part="after"><slot name="after">{{ show(after) }}</slot></component>
    </template>
    <component :is="$slots.after ? 'div' : 'span'" v-else data-part="after"><slot name="after">{{ show(after) }}</slot></component>
  </component>
</template>
