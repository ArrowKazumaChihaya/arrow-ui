<!-- 大きさと状態 | sm・md・lg。最小・最大に届くと▲▼の片方が押せなくなる。間違い・使えない・読み取りのみ・空（placeholder）。 -->
<script setup lang="ts">
import { ArInputNumber, ArCluster, ArStack } from "@arrow/ui";
import { ref } from "vue";
const v = ref<number | null>(10);
const empty = ref<number | null>(null);
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="2" align="center" wrap="wrap">
    <ArInputNumber v-model="v" size="sm" :min="0" :max="10" label="小" />
    <ArInputNumber v-model="v" :min="0" :max="10" label="ふつう" />
    <ArInputNumber v-model="v" size="lg" :min="0" :max="10" label="大" />
  </ArCluster>
  <ArCluster :gap="2" align="center" wrap="wrap">
    <ArInputNumber v-model="empty" placeholder="未入力" label="空" />
    <ArInputNumber :model-value="-5" invalid label="間違い" />
    <ArInputNumber :model-value="3000" prefix="¥" disabled label="使えない" />
    <ArInputNumber :model-value="3000" prefix="¥" readonly label="読み取りのみ" />
  </ArCluster>
</ArStack>
</template>
