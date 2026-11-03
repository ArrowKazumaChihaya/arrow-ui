<script setup lang="ts">
/**
 * ArChangedValue 1.1 — 変更前→変更後。変わっていなければ今の値だけを出す。
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
const keyOf = (it: ArChangedValueItem) => it.key ?? it.label;
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
      <tr v-for="it in items ?? []" :key="keyOf(it)" data-part="row">
        <th data-part="label" scope="row">{{ it.label }}</th>
        <td data-part="cell" data-col="before"><s data-part="before">{{ show(it.before) }}</s></td>
        <td data-part="cell" data-col="after">
          <span data-part="change"><span data-part="arrow" aria-hidden="true">→</span><span data-ar-visually-hidden>{{ labels.after }}</span><b data-part="after">{{ show(it.after) }}</b></span>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else-if="form === 'list'" data-ar="changed-value" data-part="root" data-layout="list" role="table" :aria-label="caption">
    <div data-part="head" role="row"><span data-part="head-cell" role="columnheader">{{ H.list }}</span></div>
    <div v-for="it in items ?? []" :key="keyOf(it)" data-part="row" role="row">
      <span data-part="change" role="cell">
        <b data-part="label">{{ it.label }}</b>
        <span data-ar-visually-hidden>{{ labels.before }}</span><s data-part="before">{{ show(it.before) }}</s>
        <span data-part="arrow" aria-hidden="true">→</span>
        <span data-ar-visually-hidden>{{ labels.after }}</span><b data-part="after">{{ show(it.after) }}</b>
      </span>
    </div>
  </div>
  <span v-else data-ar="changed-value" data-part="root" :data-state="isChanged ? 'changed' : undefined">
    <template v-if="isChanged">
      <span data-ar-visually-hidden>{{ labels.before }}</span>
      <s data-part="before">{{ show(before) }}</s>
      <span data-part="arrow" aria-hidden="true">→</span>
      <span data-ar-visually-hidden>{{ labels.after }}</span>
      <span data-part="after">{{ show(after) }}</span>
    </template>
    <span v-else data-part="after">{{ show(after) }}</span>
  </span>
</template>
