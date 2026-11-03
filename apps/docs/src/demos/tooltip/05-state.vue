<!-- 遅れ・出さない | delay で出るまでの時間（ミリ秒）を変えられる。disabled のときは出さない。押せないボタンに理由を出すときは、ボタンを span で包む。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArTooltip } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="3" align="center" wrap="wrap">
  <ArTooltip title="すぐ出る" :delay="0"><ArButton tone="secondary">すぐ</ArButton></ArTooltip>
  <ArTooltip title="0.5秒で出る" :delay="500"><ArButton tone="secondary">0.5秒</ArButton></ArTooltip>
  <ArTooltip title="出ない" disabled><ArButton tone="secondary">出さない</ArButton></ArTooltip>
  <ArTooltip title="締め日を過ぎたので変更できません">
    <span tabindex="0"><ArButton tone="primary" disabled>変更</ArButton></span>
  </ArTooltip>
</ArCluster>
</template>
