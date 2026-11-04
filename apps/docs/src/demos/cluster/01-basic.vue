<!-- 横に並べて折り返す | ボタンやタグの並び。justify="between" で両端に分ける。 -->
<script setup lang="ts">
import { ArCluster, ArButton, ArTextInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const q = ref("");
</script>

<template>
<ArCluster justify="between" :gap="2">
  <ArCluster :gap="2">
    <ArButton tone="primary" icon="plus">シフト追加</ArButton>
    <ArButton tone="subtle" icon="yen">日毎人件費</ArButton>
  </ArCluster>
  <ArTextInput v-model="q" icon="search" placeholder="名前で探す" label="名前で探す" />
</ArCluster>
</template>
