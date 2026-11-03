<!-- 幕なし・閉じるボタン・向き | mask=false で幕をかけず、指す要素をテーマ色の枠で示す。closable で右上に閉じるボタン。placement でカードの向き。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArCluster, ArTour } from "@arrow/ui";
const open = ref(false);
const a = ref<HTMLElement | null>(null);
const b = ref<HTMLElement | null>(null);
const steps = [
  { target: () => a.value, title: "印刷", description: "今の表をそのまま印刷します。", placement: "right" as const },
  { target: () => b.value, title: "Excel に出す", description: "表を Excel の形で保存します。", placement: "top-start" as const },
];
</script>

<template>
<ArCluster :gap="2" align="center">
  <span ref="a"><ArButton tone="secondary" icon="print">印刷</ArButton></span>
  <span ref="b"><ArButton tone="secondary" icon="xls">Excel</ArButton></span>
  <ArButton tone="ghost" icon="help" @click="open = true">幕なしで案内</ArButton>
</ArCluster>
<ArTour v-model:open="open" :steps="steps" :mask="false" closable />
</template>
