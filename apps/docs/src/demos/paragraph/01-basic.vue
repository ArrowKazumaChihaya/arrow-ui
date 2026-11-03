<!-- 段落 | 本文は 13.5px・行の高さ1.75。size="sm" は補足の段落。ellipsis に行数を渡すと、その行数で切る。 -->
<script setup lang="ts">
import { ArParagraph, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3" style="max-width: 480px">
  <ArParagraph>シフトは月ごとに作り、公開すると従業員のアプリに表示されます。公開の前に、不足している日がないかを確かめてください。</ArParagraph>
  <ArParagraph size="sm" type="muted">公開の期間は「操作」メニューの「公開期間設定」で決められます。</ArParagraph>
  <ArParagraph :ellipsis="2">長い説明は2行で切ります。シフトは月ごとに作り、公開すると従業員のアプリに表示されます。公開の前に、不足している日がないかを確かめてください。不足している日は赤い印で分かります。</ArParagraph>
  <ArParagraph type="danger" strong>終了は開始より後の時刻にしてください。</ArParagraph>
</ArStack>
</template>
