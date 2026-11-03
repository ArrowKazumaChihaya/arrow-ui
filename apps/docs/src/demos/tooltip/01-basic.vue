<!-- 基本 | 短い説明は濃い吹き出し（ink）。テーマ色の吹き出し（accent）は案内を目立たせたいときだけ。乗せると少し遅れて出て、キーボードのフォーカスではすぐ出る。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArTooltip } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="4" align="center" wrap="wrap">
  <ArTooltip title="前日の打刻です（押すと当日に）" placement="top-start">
    <ArButton tone="secondary">前日</ArButton>
  </ArTooltip>
  <ArTooltip title="テーマ色の吹き出し" tone="accent" placement="top-start">
    <ArButton tone="subtle">テーマ色</ArButton>
  </ArTooltip>
  <ArTooltip title="長い説明は2行までにします。それ以上はポップオーバーにします。">
    <ArButton tone="secondary">長い説明</ArButton>
  </ArTooltip>
</ArCluster>
</template>
