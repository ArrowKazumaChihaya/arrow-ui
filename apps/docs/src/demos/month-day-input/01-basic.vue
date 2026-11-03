<!-- 月日 | 年のない日付（起算日・記念日など）。月が決まると日の欄へ進む。2月30日は2月29日に寄せる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArMonthDayInput, ArCluster, ArStack } from "@arrow/ui";
const v = ref<string | null>("04-01");
const n = ref<string | null>(null);
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="5" align="center">
    <ArMonthDayInput v-model="v" label="起算日" />
    <span>値：{{ v ?? "なし" }}</span>
  </ArCluster>
  <ArCluster :gap="5" align="center">
    <ArMonthDayInput v-model="n" label="空" />
    <ArMonthDayInput model-value="12-31" invalid label="間違い" />
    <ArMonthDayInput model-value="12-31" disabled label="使えない" />
  </ArCluster>
</ArStack>
</template>
