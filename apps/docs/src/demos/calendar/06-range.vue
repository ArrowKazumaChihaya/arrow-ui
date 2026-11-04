<!-- 締め日の期間 | range（"YYYY-MM-DD" の start〜end）を渡すと、その期間を含む週だけを並べる。期間の外の日は前後の月と同じ灰色（今の Calendar の started_on〜ended_on）。21日締めなら 10/21〜11/20 のように渡す。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCalendar } from "@s_and_a/arrow-ui";
const day = ref<string | null>("2026-11-05");
</script>

<template>
<ArCalendar
  v-model="day"
  month="2026-11"
  :range="{ start: '2026-10-21', end: '2026-11-20' }"
  today="2026-11-03"
  :show-header="false"
  weekend-colors
  label="締め日の期間のカレンダー"
/>
</template>
