<!-- 形 | 右上に出る白いカード。印は意味の色、残り時間はテーマ色の線（progress で決まった長さ、duration で動く）。actions で右下に操作を出す。 -->
<script setup lang="ts">
import { ArNotification, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3" align="start">
  <ArNotification tone="ok" title="シフトを公開しました" description="11月分のシフトを従業員24名に知らせました。" :progress="0.6" />
  <ArNotification
    icon="bell"
    title="シフトの提出がありました"
    description="田中 健さんが11月の希望を出しました。"
    :actions="[{ label: 'あとで', tone: 'plain' }, { label: '見る' }]"
  />
  <ArNotification tone="warn" title="未提出の人が2名います" description="しめきりは 10月25日（日）23:59 です。" />
  <ArNotification tone="danger" title="送れませんでした" description="通信を確かめて、もう一度送ってください。" />
</ArStack>
</template>
