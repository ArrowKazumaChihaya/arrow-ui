<!-- 年 | 新しい年が上のプルダウン。数字を打つとその年へ飛ぶ。↑↓ で開いて選び、Enter で決める。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArYearInput, ArCluster, ArStack } from "@s_and_a/arrow-ui";
const y = ref<number | null>(2026);
const e = ref<number | null>(2025);
const n = ref<number | null>(null);
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="5" align="center">
    <ArYearInput v-model="y" label="対象の年" />
    <span>選んだ値：{{ y ?? "なし" }}</span>
  </ArCluster>
  <ArCluster :gap="5" align="center">
    <ArYearInput v-model="e" era label="年度" />
    <ArYearInput v-model="n" allow-empty label="退職の年" />
  </ArCluster>
  <ArCluster :gap="5" align="center">
    <ArYearInput :model-value="2026" invalid label="間違い" />
    <ArYearInput :model-value="2026" disabled label="使えない" />
    <ArYearInput :model-value="2026" :show-unit="false" :min-year="2020" :max-year="2030" label="単位なし" />
  </ArCluster>
</ArStack>
</template>
