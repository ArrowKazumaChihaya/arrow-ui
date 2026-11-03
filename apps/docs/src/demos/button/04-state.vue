<!-- 読み込み中・押せない・幅いっぱい | loading の間は押せない。block は親の幅いっぱい。点線（dashed）を block にすると表の上の「シフト追加」（高さ40）。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArStack } from "@arrow/ui";
import { ref } from "vue";
const busy = ref(false);
function save() { busy.value = true; setTimeout(() => (busy.value = false), 1500); }
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="3" align="center" wrap="wrap">
    <ArButton tone="primary" icon="check" :loading="busy" @click="save">保存する</ArButton>
    <ArButton tone="primary" loading>保存中</ArButton>
    <ArButton tone="secondary" loading>読み込み中</ArButton>
    <ArButton tone="primary" disabled>次へ</ArButton>
    <ArButton tone="secondary" disabled>押せない</ArButton>
    <ArButton tone="ghost" icon="plus" disabled>行を追加</ArButton>
    <ArButton tone="link" href="#button">a 要素のリンク</ArButton>
  </ArCluster>
  <div style="max-width: 520px"><ArButton tone="dashed" icon="plus" block>シフト追加</ArButton></div>
  <ArButton tone="primary" block>横いっぱい</ArButton>
</ArStack>
</template>
