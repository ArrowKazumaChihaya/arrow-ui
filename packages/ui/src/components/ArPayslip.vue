<script setup lang="ts">
/**
 * ArPayslip 1.0 — 明細書の紙の形。上に書類名・支給分・会社や氏名、4列の表（勤怠／支給／控除／その他）、下に合計の箱。
 * compare で前回と比べる（差は自動で計算。文字の差も渡せる）。値の並べ方は渡した順のまま。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArPayslipProps, ArPayslipRow, ArPayslipSection, ArPayslipTotal } from "./ArPayslip.contract";

const props = withDefaults(defineProps<ArPayslipProps>(), {
  period: undefined,
  meta: () => [],
  totals: () => [],
  compare: "off",
  size: "md",
  zeroDiff: "±0",
  prevLabel: "前",
});

const fmt = (v: number | string) => (typeof v === "number" ? v.toLocaleString("ja-JP").replace("-", "−") : v);
function diffOf(x: { value: number | string; prev?: number | null; diff?: string }) {
  if (x.diff !== undefined) {
    const sign = /^[−-]/.test(x.diff) ? "down" : /^\+/.test(x.diff) ? "up" : "zero";
    return { text: x.diff, sign };
  }
  if (typeof x.value !== "number" || x.prev === undefined || x.prev === null) return null;
  const d = x.value - x.prev;
  if (d === 0) return { text: props.zeroDiff, sign: "zero" };
  return { text: (d > 0 ? "+" : "−") + Math.abs(d).toLocaleString("ja-JP"), sign: d > 0 ? "up" : "down" };
}
const cols = computed(() => props.columns.map((c) => (Array.isArray(c) ? c : [c]) as ArPayslipSection[]));
const showRowDiff = (r: ArPayslipRow) => props.compare !== "off" && diffOf(r) !== null;
const showTotalDiff = (t: ArPayslipTotal) => props.compare !== "off" && diffOf(t) !== null;
const neg = (v: number | string) => typeof v === "number" && v < 0;
</script>

<template>
  <article data-ar="payslip" data-part="root" :data-compare="compare" :data-size="size" :aria-label="period ? `${title}（${period}）` : title">
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
        <table v-for="sec in col" :key="sec.title" data-part="section">
          <thead>
            <tr><th data-part="section-title" :colspan="2" scope="colgroup">{{ sec.title }}</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, ri) in sec.rows"
              :key="ri"
              data-part="row"
              :data-state="[r.total && 'total', r.big && 'big'].filter(Boolean).join(' ') || undefined"
            >
              <th data-part="label" scope="row">{{ r.label }}</th>
              <td data-part="value" :data-negative="neg(r.value) || undefined">
                <span data-part="amount"
                  >{{ fmt(r.value) }}<ArIcon v-if="r.edited" name="pen" line data-part="edited" label="手で直した金額"
                /></span>
                <span v-if="showRowDiff(r)" data-part="diff" :data-sign="diffOf(r)!.sign">
                  <span v-if="compare === 'prev' && typeof r.value === 'number' && r.prev != null" data-part="prev">{{ prevLabel }} {{ fmt(r.prev) }}</span>
                  <b>{{ diffOf(r)!.text }}</b>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
