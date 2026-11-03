<!-- 種類 | 行の中に添える小さな札。テーマ色（既定）・イベント・灰色。押せない。 -->
<script setup lang="ts">
import { ArChip, ArCluster, ArStack, ArThemeScope } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="2" align="center">
    <ArChip>繰り返し</ArChip>
    <ArChip>2</ArChip>
    <ArChip tone="event">朝礼</ArChip>
    <ArChip tone="neutral">下書き</ArChip>
  </ArCluster>
  <ArCluster :gap="2" align="center">
    <span style="font-size: 13.5px; font-weight: 700">店長会議</span>
    <span style="font-size: 12.5px">10:00〜11:00</span>
    <ArChip>繰り返し</ArChip>
  </ArCluster>
  <ArCluster :gap="2" align="center">
    <ArThemeScope palette="green"><ArChip>勤怠</ArChip></ArThemeScope>
    <ArThemeScope palette="yellow"><ArChip>給与</ArChip></ArThemeScope>
    <ArThemeScope palette="pink"><ArChip>書類</ArChip></ArThemeScope>
  </ArCluster>
</ArStack>
</template>
