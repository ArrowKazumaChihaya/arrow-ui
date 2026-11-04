<!-- 期間の箱（募集・一括登録の期間） | v-model は { mode, start, end }（"YYYY-MM-DD"）。1か月・半月を選ぶと月の初め〜末日、1〜15日／16日〜末日にそろえ、日付を直して合わなくなると「カスタム」に変わる。remix は切り替えと年・月・日の範囲（PopRecruit の「募集する期間」）、classic は今の ARROW の点線の箱に MonthChanger と「月／半月」「(前半)／(後半)」（カスタムは出さない）。 -->
<script setup lang="ts">
import { ArField, ArPeriodBox, type ArPeriodBoxValue } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const period = ref<ArPeriodBoxValue>({ mode: "month", start: "2026-11-01", end: "2026-11-30" });
</script>

<template>
  <div style="max-width: 860px">
    <ArField label="募集する期間" required>
      <ArPeriodBox v-model="period" label="募集する期間" hint="日付を変えると、合わなくなったときは「カスタム」に変わります" />
    </ArField>
    <p style="margin: 12px 0 0; font-size: 12px">値：{{ period }}</p>
  </div>
</template>
