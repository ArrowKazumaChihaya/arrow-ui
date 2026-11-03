<!-- 賞与明細・報酬明細 | 列の数は自由（賞与は 支給／控除／その他 の3列）。合計の箱の単位は unit（既定「円」）。 -->
<script setup lang="ts">
import { ArThemeScope, ArPayslip } from "@arrow/ui";
</script>

<template>
  <ArThemeScope palette="yellow"><div style="max-width: 1000px">
    <ArPayslip
      title="賞与明細書"
      period="2026年 夏季賞与（7/10支給）"
      :meta="[{ label: '会社', value: '株式会社アロー' }, { label: '氏名', value: '千速 一真 様' }, { label: '計算期間', value: '2025/12/01〜2026/05/31' }]"
      :columns="[
        { title: '支給', rows: [{ label: '賞与', value: 400000 }] },
        { title: '控除', rows: [{ label: '健康保険料', value: 19800 }, { label: '厚生年金保険料', value: 36600 }, { label: '雇用保険料', value: 2400 }, { label: '所得税', value: 27036 }] },
        { title: 'その他', rows: [{ label: '算出税率', value: '6.759%' }, { label: '前月の社会保険料等控除後の給与', value: 236980 }] },
      ]"
      :totals="[{ label: '総支給額', value: 400000 }, { label: '控除合計', value: 85836 }, { label: '差引支給額', value: 314164, emphasis: true }, { label: '振込支給額', value: 314164 }, { label: '現金支給額', value: 0 }]"
    />
  </div></ArThemeScope>
</template>
