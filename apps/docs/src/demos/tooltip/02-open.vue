<!-- 出したまま | open を渡すと、乗せなくても出しておける（初めての人への案内など）。見本の形：上に出し、矢印は基準の要素の中央を指す。 -->
<script setup lang="ts">
import { ArButton, ArTooltip } from "@arrow/ui";
</script>

<template>
<div style="display: grid; grid-template-columns: 260px 260px; align-items: end; padding-top: 44px">
  <div>
    <ArTooltip title="前日の打刻です（押すと当日に）" placement="top-start" :open="true">
      <ArButton tone="secondary" size="sm">前日</ArButton>
    </ArTooltip>
  </div>
  <div>
    <ArTooltip title="テーマ色の吹き出し" tone="accent" placement="top-start" :open="true">
      <ArButton tone="secondary" size="sm">テーマ色</ArButton>
    </ArTooltip>
  </div>
</div>
</template>
