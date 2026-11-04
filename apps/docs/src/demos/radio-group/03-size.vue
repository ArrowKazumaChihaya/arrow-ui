<!-- 大きさ（sm・md・lg） | 同じ段なら ArSelect・ArTextInput・ボタンと高さ・角丸がそろう（カード sm 30・md 36・lg 42、角丸 9・10・11）。使い分け：sm＝設定の行・表の上など密集した所。md＝ふつうの画面・ポップアップ。lg＝年末調整・スマホなど、大きく押しやすくしたい所（説明の文も入れられる）。 -->
<script setup lang="ts">
import { ArRadioGroup, ArSelect, ArTextInput, type ArRadioValue } from "@arrow/ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
type Z = (typeof sizes)[number];
const v = ref<Record<Z, ArRadioValue | null>>({ sm: "month", md: "month", lg: "month" });
const p = ref<Record<Z, ArRadioValue | null>>({ sm: "code", md: "code", lg: "code" });
const s = ref<string | number | null>("shibuya");
const t = ref("渋谷店");
const opts = [
  { value: "month", label: "月単位" },
  { value: "period", label: "給与計算期間" },
];
const order = [
  { value: "code", label: "コード順" },
  { value: "kana", label: "カナ順" },
];
const stores = [
  { value: "shibuya", label: "渋谷店" },
  { value: "shinjuku", label: "新宿店" },
];
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <ArRadioGroup v-model="v[z]" :size="z" :options="opts" :label="`集計の単位（${z}）`" />
      <ArSelect v-model="s" :size="z" :options="stores" label="店舗" style="width: 140px" />
      <ArTextInput v-model="t" :size="z" label="名前" style="width: 120px" />
    </div>
    <small>{{ z }} plain</small>
    <div class="r">
      <ArRadioGroup v-model="p[z]" variant="plain" :size="z" :options="order" :label="`並び順（${z}）`" />
      <ArSelect v-model="s" :size="z" :options="stores" label="店舗" style="width: 140px" />
    </div>
  </template>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 70px 1fr; gap: 14px 12px; align-items: center; }
.r { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
