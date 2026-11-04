<!-- ページごとの色 | ページ（機能）ごとに色を変える。中の部品は accent 系の色だけを使うので、囲むだけで色が替わる。 -->
<script setup lang="ts">
import { ArThemeScope, ArButton, ArTag, ArCluster, ArStack } from "@s_and_a/arrow-ui";
const list = ["blue", "green", "yellow", "pink", "orange", "teal", "amber"] as const;
</script>

<template>
<ArStack :gap="3">
  <ArThemeScope v-for="p in list" :key="p" :palette="p">
    <ArCluster :gap="2">
      <ArButton tone="primary" icon="check">{{ p }}</ArButton>
      <ArButton tone="subtle">日毎人件費</ArButton>
      <ArTag tone="accent">人件費 ¥31,500</ArTag>
    </ArCluster>
  </ArThemeScope>
</ArStack>
</template>
