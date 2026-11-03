<!-- 基本 | 初めての人への案内。指す要素のまわりを残して暗い幕、白いカードで説明、今の点はテーマ色。［次へ］［前へ］か ←→ で移り、Escape で閉じる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArCluster, ArTour } from "@arrow/ui";
const open = ref(false);
const current = ref(0);
const add = ref<HTMLElement | null>(null);
const ops = ref<HTMLElement | null>(null);
const steps = [
  { target: () => add.value, title: "シフトを追加", description: "表の中に入力の行が開きます。名前を選ぶと希望の時刻が入ります。" },
  { target: () => ops.value, title: "まとめて操作", description: "コピー・貼り付け・まとめて削除はここから。" },
  { title: "これで準備完了です", description: "あとから右上の「？」でもう一度見られます。" },
];
function start() {
  current.value = 0;
  open.value = true;
}
</script>

<template>
<ArCluster :gap="2" align="center">
  <span ref="add"><ArButton tone="primary" icon="plus">シフト追加</ArButton></span>
  <span ref="ops"><ArButton tone="secondary">操作</ArButton></span>
  <ArButton tone="ghost" icon="help" @click="start">案内を始める</ArButton>
</ArCluster>
<ArTour v-model:open="open" v-model:current="current" :steps="steps" />
</template>
