<script setup lang="ts">
/**
 * ArPayslip 1.0 — 明細書の紙の形。上に書類名・支給分・会社や氏名、4列の表（勤怠／支給／控除／その他）、下に合計の箱。
 * compare で前回と比べる（差は自動で計算。文字の差も渡せる）。値の並べ方は渡した順のまま。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ArPayslipTable from "./ArPayslipTable.vue";
import ArPayslipLine from "./ArPayslipLine.vue";
import { formatPayslipValue as fmt, isNegativePayslipValue as neg, payslipDifference } from "../internal/payslip";
import type { ArPayslipProps, ArPayslipTotal } from "./ArPayslip.contract";

const props = withDefaults(defineProps<ArPayslipProps>(), {
  columns: () => [],
  period: undefined,
  meta: () => [],
  totals: () => [],
  compare: "off",
  size: "md",
  layout: "auto",
  zeroDiff: "±0",
  prevLabel: "前",
});

const cols = computed(() => {
  const sections = props.columns.map((column) => Array.isArray(column) ? column : [column]);
  return props.columnCount ? Array.from({ length: props.columnCount }, (_, index) => sections[index] ?? []) : sections;
});
/** wide のとき、親の幅に合わせて縮める割合（1以下）。 */
const WIDE_WIDTH = 880;
const root = ref<HTMLElement | null>(null);
const scale = ref(1);
let observer: ResizeObserver | undefined;
function measure() {
  const parent = root.value?.parentElement;
  if (!parent) return;
  scale.value = Math.min(1, parent.clientWidth / WIDE_WIDTH);
}
function observe() {
  observer?.disconnect();
  if (props.layout === "wide" && root.value?.parentElement && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(measure);
    observer.observe(root.value.parentElement);
    measure();
  }
}
onMounted(observe);
watch(() => props.layout, observe);
onBeforeUnmount(() => observer?.disconnect());
const diffOf = (item: ArPayslipTotal) => payslipDifference(item, props.zeroDiff);
const showTotalDiff = (item: ArPayslipTotal) => props.compare !== "off" && diffOf(item) !== null;
</script>

<template>
  <article ref="root" data-ar="payslip" data-part="root" :data-compare="compare" :data-size="size" :data-layout="layout === 'wide' ? 'wide' : undefined" :style="layout === 'wide' ? { '--ar-payslip-scale': String(scale) } : undefined" :aria-label="period ? `${title}（${period}）` : title">
    <header data-part="head">
      <h2 data-part="title">{{ title }}</h2>
      <span v-if="period" data-part="period">{{ period }}</span>
      <dl v-if="meta.length" data-part="meta">
        <div v-for="m in meta" :key="m.label"><dt>{{ m.label }}</dt><dd>{{ m.value }}</dd></div>
      </dl>
      <div v-if="$slots.toolbar" data-part="toolbar"><slot name="toolbar" /></div>
    </header>
    <div data-part="columns" :style="{ '--ar-payslip-cols': cols.length }">
      <div v-for="(col, ci) in cols" :key="ci" data-part="column">
        <slot :name="`column-${ci}`">
          <ArPayslipTable v-for="section in col" :key="section.title" :title="section.title">
            <ArPayslipLine v-for="(row, index) in section.rows" :key="index" v-bind="row" :compare="compare" :zero-diff="zeroDiff" :prev-label="prevLabel" />
          </ArPayslipTable>
        </slot>
      </div>
    </div>
    <dl v-if="totals.length" data-part="totals">
      <div v-for="t in totals" :key="t.label" data-part="total" :data-state="t.emphasis ? 'emphasis' : undefined">
        <dt>{{ t.label }}</dt>
        <dd :data-negative="neg(t.value) || undefined">
          {{ fmt(t.value) }}<small v-if="(t.unit ?? '円') !== ''" data-part="unit">{{ t.unit ?? "円" }}</small>
          <small v-if="showTotalDiff(t)" data-part="diff" :data-sign="diffOf(t)!.sign">{{ diffOf(t)!.text }}</small>
        </dd>
      </div>
    </dl>
  </article>
</template>
