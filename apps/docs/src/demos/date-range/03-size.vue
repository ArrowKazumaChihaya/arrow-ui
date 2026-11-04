<!-- 大きさ | size の3つの段。sm＝設定など密集した所、md＝ふつう（既定）、lg＝年末調整・スマホ。同じ段の入力・セレクト・ボタンと高さがそろう。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArDateRange, type ArDateRangeValue, ArButton, ArStack, ArCluster } from "@s_and_a/arrow-ui";
const v = ref<ArDateRangeValue>({ start: "2026-11-01", end: "2026-11-30" });
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
<ArStack :gap="4">
  <ArCluster v-for="s in sizes" :key="s" :gap="3" align="center">
    <ArDateRange v-model="v" :size="s" :label="`期間（${s}）`" />
    <ArButton :size="s">{{ s }}</ArButton>
  </ArCluster>
</ArStack>
</template>
