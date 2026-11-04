<!-- 土日の色・マスの中身 | weekendColors で日曜を赤・土曜を青に。マスの中身は cell slot に自由に置ける（人数・提出など）。週の始まりは weekStart（1 で月曜）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCalendar } from "@s_and_a/arrow-ui";
const date = ref<string | null>(null);
const count = (d: number) => [4, 4, 3, 3, 4, 5, 3][d % 7];
</script>

<template>
<ArCalendar v-model="date" month="2026-10" today="2026-10-20" weekend-colors :events="[{ date: '2026-10-27', label: '店長会議' }, { date: '2026-10-25', label: '不足1', tone: 'danger' }, { date: '2026-10-20', label: '提出2', tone: 'ok' }]">
  <template #cell="{ day, inMonth }">
    <span v-if="inMonth" style="align-self: flex-end; font-size: 11px; font-weight: 600; color: var(--ar-color-text-secondary)">{{ count(day) }}名</span>
  </template>
</ArCalendar>
</template>
