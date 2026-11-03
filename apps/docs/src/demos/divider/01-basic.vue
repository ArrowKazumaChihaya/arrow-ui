<!-- 区切り線 | ブロック同士は区切り線。文字つきは13px太字。左寄せ・点線・縦の線（文中の項目の区切り・高さ14px）。 -->
<script setup lang="ts">
import { ArDivider, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <ArDivider>中央の文字</ArDivider>
  <ArDivider align="start">左寄せの文字</ArDivider>
  <ArDivider align="end" plain>右寄せ・細い文字</ArDivider>
  <ArDivider dashed />
  <ArDivider />
  <div style="font-size: 13px">シフト<ArDivider orientation="vertical" />勤怠<ArDivider orientation="vertical" />給与</div>
</ArStack>
</template>
