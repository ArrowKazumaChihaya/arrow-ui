<!-- 大きな数字 | 数字は26px・等幅。prefix・suffix（単位は小さく）、増減は意味の色（増＝緑・減＝赤）。tone で数字の色。size="sm" は小さな箱の中（18px）。 -->
<script setup lang="ts">
import { ArCard, ArStatistic } from "@s_and_a/arrow-ui";
</script>

<template>
<div style="display: grid; gap: 24px">
  <div style="display: flex; gap: 34px; flex-wrap: wrap; align-items: flex-start">
    <ArStatistic title="今月の人件費" :value="1284500" prefix="¥" trend="down" trend-value="3.2%" />
    <ArStatistic title="出勤人数" title-icon="info" :value="8" suffix="/ 9名" />
    <ArStatistic title="前月比" :value="11.28" :precision="2" suffix="%" trend="up" trend-value="0.4pt" />
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 180px)); gap: 8px">
    <ArCard variant="plain"><ArStatistic title="提出済み" :value="3" suffix="/5名" size="sm" /></ArCard>
    <ArCard variant="plain"><ArStatistic title="未提出" :value="2" suffix="名" size="sm" tone="warn" /></ArCard>
    <ArCard variant="plain"><ArStatistic title="人数が足りない日" :value="4" suffix="日" size="sm" tone="danger" /></ArCard>
  </div>
</div>
</template>
