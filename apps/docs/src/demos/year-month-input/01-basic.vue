<!-- 年月 | 年はプルダウン、月は数字の欄（全角でも入る）。1〜12 以外は受け付けない。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArYearMonthInput, ArCluster, ArStack } from "@s_and_a/arrow-ui";
const v = ref<string | null>("2026-10");
const e = ref<string | null>("2019-04");
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="5" align="center">
    <ArYearMonthInput v-model="v" label="支給月" />
    <span>値：{{ v ?? "なし" }}</span>
  </ArCluster>
  <ArYearMonthInput v-model="e" era label="対象の月" />
  <ArCluster :gap="5" align="center">
    <ArYearMonthInput model-value="2026-13" invalid label="間違い" />
    <ArYearMonthInput model-value="2026-10" disabled label="使えない" />
  </ArCluster>
</ArStack>
</template>
