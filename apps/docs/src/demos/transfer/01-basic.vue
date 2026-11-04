<!-- トランスファー | 左右の一覧でチェックした人を ＞ ＜ で移す（シフト募集の相手・権限の割り当て）。見出しのチェックは見えている分をすべて。人数が多いときは表から選ぶ方を優先。 -->
<script setup lang="ts">
import { ArTransfer, ArStack, type ArTransferValue } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const people = [
  { value: 1, label: "田中 健", keywords: "たなか" },
  { value: 2, label: "山本 葵", keywords: "やまもと" },
  { value: 3, label: "鈴木 大地", keywords: "すずき" },
  { value: 4, label: "高橋 結衣", keywords: "たかはし" },
  { value: 5, label: "佐藤 美咲", keywords: "さとう" },
  { value: 6, label: "渡辺 翔", keywords: "わたなべ" },
  { value: 7, label: "伊藤 蓮", keywords: "いとう", disabled: true },
  { value: 8, label: "中村 陽菜", keywords: "なかむら" },
];
const to = ref<ArTransferValue[]>([5, 6]);
</script>

<template>
<ArStack :gap="3" align="start">
  <ArTransfer v-model="to" :items="people" :titles="['未選択', '送る相手']" unit="名" label="シフト募集の相手" />
  <span class="demo-note">送る相手：{{ to.join(", ") }}</span>
</ArStack>
</template>
