<!-- スマホのカード（閲覧） | スマホでもカードにタブを置き、閲覧を開ける（最初は週の表示）。size="auto"（既定）は部品の幅が 600px 未満で sm になり、名前の列が細く（132px）頭文字の丸を出さず、説明と検索が1行ずつ並ぶ。表は横にスクロールし、名前の列は止まる。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArCard, ArDivider, ArPeriodNav, ArShiftViewTable, ArTabs } from "@arrow/ui";
import { branches, halfDates, monthDates, people, shifts, today, totals, weekDates } from "./_data";

const tab = ref("view");
const tabs = [
  { key: "calendar", label: "カレンダー", icon: "cal" as const },
  { key: "table", label: "テーブル", icon: "grid" as const },
  { key: "view", label: "閲覧", icon: "eye" as const },
];
const period = ref("week");
const dates = computed(() => (period.value === "month" ? monthDates : period.value === "half" ? halfDates : weekDates));
</script>

<template>
  <div style="width: 390px; max-width: 100%; padding: 16px 12px; box-sizing: border-box; background: var(--ar-color-bg); border-radius: 12px">
    <ArCard title="シフト閲覧" icon="eye" variant="band" size="sm">
      <template #tabs><ArTabs v-model="tab" variant="band" size="sm" :items="tabs" label="表示の切り替え" /></template>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <ArPeriodNav label="2026年10月" pickable today-label="今日" today-disabled :labels="{ prev: '前の月', next: '次の月', pick: '年月を選ぶ' }" />
        <ArDivider subtle bleed />
        <ArShiftViewTable
          v-model:period="period"
          :dates="dates"
          :rows="people"
          :shifts="shifts"
          :branches="branches"
          :own-branch-ids="[1]"
          :today="today"
          :totals="totals"
          note="すべての店舗・部署のシフトを表示しています"
          :period-options="[
            { value: 'week', label: '週' },
            { value: 'half', label: '半月' },
            { value: 'month', label: '月' },
          ]"
        />
      </div>
    </ArCard>
  </div>
</template>
