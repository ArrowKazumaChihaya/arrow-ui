<!-- 文字だけ（plain・設定の行） | variant="plain" は丸と文字だけ。設定の行・表の中など密集した所で使う（設定のキャンバスの .cf-op：丸18・13.5px・行32、横の間20）。sm はさらに詰める（丸16・13px・行30）。 -->
<script setup lang="ts">
import { ArRadioGroup } from "@arrow/ui";
import { ref } from "vue";
const unit = ref<string | null>("month");
const who = ref<string | null>("all");
const unit2 = ref<string | null>("period");
</script>

<template>
<div class="t">
  <span class="lb">集計の単位</span>
  <ArRadioGroup v-model="unit" variant="plain" :options="[{ value: 'month', label: '月単位' }, { value: 'period', label: '給与計算期間' }]" label="集計の単位" />
  <span class="lb">見られる範囲</span>
  <ArRadioGroup
    v-model="who"
    variant="plain"
    direction="vertical"
    :options="[{ value: 'me', label: '自分のみ' }, { value: 'day', label: '自分のシフトが存在する日の全員' }, { value: 'all', label: '全員' }]"
    label="見られる範囲"
  />
  <span class="lb">sm（密集した行）</span>
  <ArRadioGroup v-model="unit2" variant="plain" size="sm" :options="[{ value: 'month', label: '月単位' }, { value: 'period', label: '給与計算期間' }, { value: 'none', label: '使用しない', disabled: true }]" label="集計の単位（sm）" />
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 160px 1fr; gap: 16px 22px; align-items: start; }
.lb { padding-top: 6px; font-size: 13.5px; font-weight: 700; }
</style>
