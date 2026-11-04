<!-- 区切り線 | ブロック同士は区切り線。文字つきは13px太字。左寄せ・点線・縦の線（文中の項目の区切り・高さ14px）。subtle は淡い線（カードの中のまとまりの区切り）、bleed はカードの本文の左右の余白の外まで伸ばす。 -->
<script setup lang="ts">
import { ArCard, ArDivider, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3">
  <ArDivider>中央の文字</ArDivider>
  <ArDivider align="start">左寄せの文字</ArDivider>
  <ArDivider align="end" plain>右寄せ・細い文字</ArDivider>
  <ArDivider dashed />
  <ArDivider />
  <ArDivider subtle />
  <ArCard title="カードの中" icon="cal" variant="band" style="max-width: 420px">
    上のまとまり
    <ArDivider subtle bleed style="margin-block: 14px" />
    下のまとまり（線はカードの端から端まで）
  </ArCard>
  <div style="font-size: 13px">シフト<ArDivider orientation="vertical" />勤怠<ArDivider orientation="vertical" />給与</div>
</ArStack>
</template>
