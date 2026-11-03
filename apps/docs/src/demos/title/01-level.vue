<!-- 見出しの段 | level 1〜5（remix は 28/22/18/16/14px）。文書の段に合わせて選ぶ。 -->
<script setup lang="ts">
import { ArTitle, ArCluster, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="4" align="baseline">
    <ArTitle :level="1">見出し1</ArTitle>
    <ArTitle :level="2">見出し2</ArTitle>
    <ArTitle :level="3">見出し3</ArTitle>
    <ArTitle :level="4">見出し4</ArTitle>
    <ArTitle :level="5">見出し5</ArTitle>
  </ArCluster>
  <ArCluster :gap="4" align="baseline">
    <ArTitle :level="4" type="secondary">補足の見出し</ArTitle>
    <ArTitle :level="4" type="danger">間違いのある見出し</ArTitle>
  </ArCluster>
  <div style="width: 220px"><ArTitle :level="4" ellipsis>とても長い見出しは1行に収まらないと「…」で切れます</ArTitle></div>
</ArStack>
</template>
