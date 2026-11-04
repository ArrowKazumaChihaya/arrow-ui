<!-- 年の表示 | 見出しの［月／年］で切り替え。年の表示は12か月のマスで、押すとその月の表示に戻る。年は見出しのセレクトで選ぶ。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCalendar } from "@s_and_a/arrow-ui";
const mode = ref<"month" | "year">("year");
const month = ref("2026-10");
const total = (m: number) => [512, 498, 530, 521, 540, 515, 560, 572, 528, 536, 0, 0][m - 1];
</script>

<template>
<ArCalendar v-model:mode="mode" v-model:month="month" today="2026-10-21">
  <template #month-cell="{ month: m }">
    <span v-if="total(m)" style="font-size: 11.5px; color: var(--ar-color-text-muted)">{{ total(m) }}時間</span>
  </template>
</ArCalendar>
</template>
