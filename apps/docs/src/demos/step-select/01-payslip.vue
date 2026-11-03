<!-- 書類集計の段 | 上から 種類 › 書類 › 年月 › 社員 › ダウンロード の段を並べ、間に「下へ進む」矢印。済み（done）は緑のチェック、最初の済みでない段が「今」（枠を強める）、その先は番号。crumb-label・crumb-value を渡した段は上の道しるべの札になり、押すとその段へ戻る（jump）。中身は step-<key>、見出しの右は extra-<key> の slot。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArButton, ArChoiceCard, ArStepSelect, ArTextInput, ArThemeScope, ArYearMonthInput } from "@arrow/ui";
import type { ArStepSelectStep } from "@arrow/ui";
const kind = ref("pay");
const doc = ref("slip");
const ym = ref<string | null>("2026-10");
const n = ref(5);
const q = ref("");
const kinds = [["join", "入社関連", "4種類"], ["out", "退社関連", "5種類"], ["pay", "給与関連", "7種類"], ["remu", "報酬関連", "4種類"]];
const docs = [["slip", "給与明細書"], ["bonus", "賞与明細書"], ["gensen", "所得税徴収高計算書"]];
const steps = computed<ArStepSelectStep[]>(() => [
  { key: "kind", title: "書類の種類を選択してください", done: !!kind.value, crumbLabel: "種類", crumbValue: kinds.find((k) => k[0] === kind.value)?.[1] },
  { key: "doc", title: "書類を選択してください", done: !!doc.value, crumbLabel: "書類", crumbValue: docs.find((d) => d[0] === doc.value)?.[1] },
  { key: "ym", title: "対象年月を選択してください", done: !!ym.value, crumbLabel: "対象年月", crumbValue: ym.value ? ym.value.replace("-", "年") + "月" : undefined },
  { key: "emp", title: "対象社員を選択してください(複数選択可)", done: n.value > 0, count: `${n.value}名`, crumbLabel: "対象社員", crumbValue: `${n.value}名` },
  { key: "dl", title: "ダウンロードボタンを押してください" },
]);
const jumped = ref("");
</script>

<template>
  <ArThemeScope palette="pink">
    <div style="max-width: 976px">
      <ArStepSelect :steps="steps" @jump="(k) => (jumped = k)">
        <template #extra-kind><ArTextInput v-model="q" type="search" placeholder="書類名で探す（例：源泉）" label="書類名で探す" size="sm" style="width: 260px" /></template>
        <template #step-kind>
          <div role="radiogroup" aria-label="書類の種類" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px">
            <ArChoiceCard v-for="k in kinds" :key="k[0]" v-model="kind" variant="tile" :value="k[0]" icon="files" :title="k[1]!" :description="k[2]" />
          </div>
        </template>
        <template #step-doc>
          <div role="radiogroup" aria-label="書類" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px">
            <ArChoiceCard v-for="d in docs" :key="d[0]" v-model="doc" variant="tile" :value="d[0]" :title="d[1]!" />
          </div>
        </template>
        <template #step-ym><ArYearMonthInput v-model="ym" /></template>
        <template #extra-emp><span style="font-size: 13px"><b>{{ n }}名</b>を選択中</span></template>
        <template #step-emp>
          <div style="display: flex; gap: 8px"><ArButton size="sm" @click="n = Math.max(0, n - 1)">1人減らす</ArButton><ArButton size="sm" @click="n++">1人増やす</ArButton></div>
        </template>
        <template #step-dl><ArButton tone="primary" icon="dl">PDFダウンロード</ArButton></template>
      </ArStepSelect>
      <p style="margin: 8px 0 0; font-size: 12.5px">jump：{{ jumped || "（まだ）" }}</p>
    </div>
  </ArThemeScope>
</template>
