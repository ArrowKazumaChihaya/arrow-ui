<!-- 前へ・次へなし・帯の上 | arrows=false は期間を見せるだけ（今の MonthChanger の isPagenation=false・DateChanger の isChange=false）。inverse はテーマ色の帯の上に置く形（今の社員の切り替え EmployeeChanger）。週・年・社員の切り替えも同じ部品で、label に「2026年11月01日〜2026年11月07日」「2026年」「0002 山田 太郎」を渡す。 -->
<script setup lang="ts">
import { ArPeriodNav, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const people = ["0001 佐藤 花子", "0002 山田 太郎", "0003 鈴木 一郎"];
const i = ref(1);
const y = ref(2026);
</script>

<template>
<ArStack :gap="5" style="max-width: 520px">
  <ArPeriodNav label="2026年11月" :arrows="false" />
  <ArPeriodNav label="11月05日" weekday="木" size="lg" :arrows="false" />
  <ArPeriodNav label="2026年11月01日〜2026年11月07日" :labels="{ prev: '前の週', next: '次の週', pick: '週を選ぶ' }" />
  <ArPeriodNav :label="`${y}年`" :labels="{ prev: '前の年', next: '次の年', pick: '年を選ぶ' }" @prev="y--" @next="y++" />
  <div style="padding: 0 12px; background: var(--ar-accent)">
    <ArPeriodNav
      :label="people[i]!"
      inverse
      :prev-disabled="i === 0"
      :next-disabled="i === people.length - 1"
      :labels="{ prev: '前の社員', next: '次の社員', pick: '社員を選ぶ' }"
      @prev="i--"
      @next="i++"
    />
  </div>
</ArStack>
</template>
