<!-- 見出しと行の吹き出し | content slot の中で tip-row・tip-label・tip-value を使うと、シフト表のマスの吹き出し（.r-tip）と同じ「見出しの行＋ラベルと値の行」になる。ライブラリの吹き出しは、マス・帯・省いた文字・つまみの値まで、すべてこの1つの形。 -->
<script setup lang="ts">
import { ArButton, ArTooltip } from "@s_and_a/arrow-ui";
</script>

<template>
<div style="display: flex; gap: 220px; align-items: end; padding-top: 96px">
  <ArTooltip placement="top-start" :open="true">
    <ArButton tone="secondary" size="sm">末永 9/16（火）</ArButton>
    <template #content>
      <span data-part="tip-row" data-head>末永　9月16日（火）</span>
      <span data-part="tip-row"><span data-part="tip-label">シフト</span><span data-part="tip-value">09:00〜18:00</span></span>
      <span data-part="tip-row"><span data-part="tip-label">休憩</span><span data-part="tip-value">12:00〜13:00</span></span>
    </template>
  </ArTooltip>
  <ArTooltip title="勤怠ロック中（締めた月は変えられません）" placement="top" :open="true">
    <ArButton tone="secondary" size="sm">ロック</ArButton>
  </ArTooltip>
</div>
</template>
