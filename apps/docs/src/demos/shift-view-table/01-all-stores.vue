<!-- すべての店舗・部署を一度に（閲覧タブ） | シフトのキャンバスの閲覧タブ（RxView）。製品の read-view（is_all_branches）の形をそのまま渡す。この店舗はパターンの色の淡い地と左の線、ほかの店舗・部署は点線の白、有給は灰色の斜線。週・半月・月と列の幅（−／＋）は v-model、検索は部品が名前で絞る。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArCard, ArDivider, ArPeriodNav, ArShiftViewTable, ArTabs } from "@s_and_a/arrow-ui";
import { branches, halfDates, monthDates, people, shifts, today, totals, weekDates } from "./_data";

const tab = ref("view");
const tabs = [
  { key: "calendar", label: "カレンダー", icon: "cal" as const },
  { key: "table", label: "テーブル", icon: "grid" as const },
  { key: "view", label: "閲覧", icon: "eye" as const },
];
const period = ref("half");
const width = ref<number>(); // 省くとデザインの既定（remix 120・classic 136）
const query = ref("");
const dates = computed(() => (period.value === "month" ? monthDates : period.value === "week" ? weekDates : halfDates));
</script>

<template>
  <div style="max-width: 1376px">
    <ArCard title="シフト閲覧" icon="eye" variant="band">
      <template #tabs><ArTabs v-model="tab" variant="band" :items="tabs" label="表示の切り替え" /></template>
      <div style="display: flex; flex-direction: column; gap: 14px">
        <ArPeriodNav label="2026年10月" pickable today-label="今日" today-disabled :labels="{ prev: '前の月', next: '次の月', pick: '年月を選ぶ' }" />
        <ArDivider subtle bleed />
        <ArShiftViewTable
          v-model:period="period"
          v-model:column-width="width"
          v-model:query="query"
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
