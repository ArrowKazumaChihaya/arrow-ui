<!-- 店舗の GPS | 真ん中のピンと打刻範囲の円。restriction="strict"（範囲内でのみ打刻可能）はテーマ色の実線、"warn"（勤怠エラーのみ）は橙の点線、"none"（制限なし）は円なし。半径が 10〜9999m の外なら円を出さず案内の札。 -->
<script setup lang="ts">
import { ArMapPreview, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="5">
  <ArMapPreview :radius="100" restriction="strict" address="東京都渋谷区道玄坂1-12-1" :latitude="35.658034" :longitude="139.698217" />
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <ArMapPreview :radius="500" restriction="warn" address="東京都新宿区新宿3-1-1" width="360px" height="200px" />
    <ArMapPreview :radius="20" restriction="strict" width="360px" height="200px" source="" />
    <ArMapPreview :radius="null" restriction="strict" width="360px" height="200px" />
    <ArMapPreview :radius="100" restriction="none" width="360px" height="200px" caption="制限なし" />
  </div>
</ArStack>
</template>
