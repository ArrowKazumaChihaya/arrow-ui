<!-- カードの右上のリボン | 中にカードを入れる。テーマ色の塗りに白い文字。placement="start" で左上。 -->
<script setup lang="ts">
import { ArCard, ArRibbon } from "@s_and_a/arrow-ui";
</script>

<template>
<div style="display: flex; gap: 24px; flex-wrap: wrap">
  <div style="width: 260px">
    <ArRibbon text="おすすめ">
      <ArCard variant="outlined"><div style="padding-top: 4px"><b style="color: var(--ar-color-text)">スタンダードプラン</b><br />従業員30名まで</div></ArCard>
    </ArRibbon>
  </div>
  <div style="width: 260px">
    <ArRibbon text="終了間近" tone="danger" placement="start">
      <ArCard variant="outlined"><div style="padding-top: 4px; text-align: right"><b style="color: var(--ar-color-text)">年末年始の募集</b><br />12月20日まで</div></ArCard>
    </ArRibbon>
  </div>
</div>
</template>
