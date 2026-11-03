<!-- 種類 | 状態や区分を短く示す。押せるものには使わない（押せるならボタン）。 -->
<script setup lang="ts">
import { ArTag, ArCluster, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="2">
    <ArTag>下書き</ArTag>
    <ArTag tone="accent">人件費 ¥31,500</ArTag>
    <ArTag tone="solid">確定</ArTag>
    <ArTag tone="ok" icon="eye">公開中</ArTag>
    <ArTag tone="warn">未承認</ArTag>
    <ArTag tone="danger">不足1</ArTag>
    <ArTag tone="event">朝礼</ArTag>
  </ArCluster>
  <ArCluster :gap="2">
    <ArTag size="sm">小</ArTag>
    <ArTag size="sm" tone="accent" icon="clock">8:00</ArTag>
    <ArTag size="sm" tone="danger">遅刻</ArTag>
  </ArCluster>
</ArStack>
</template>
