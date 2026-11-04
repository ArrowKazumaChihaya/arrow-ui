<!-- 操作・帯 | #action で右に操作のボタンを置く。banner はページの上いっぱいに置く帯（角丸なし）。 -->
<script setup lang="ts">
import { ArAlert, ArButton, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const shown = ref(true);
</script>

<template>
<ArStack :gap="3">
  <ArAlert tone="info" title="11月のシフト募集を始めました">しめきりは 10月25日（日）23:59 です。
    <template #action><ArButton size="sm" tone="primary">提出状況を見る</ArButton></template>
  </ArAlert>
  <ArAlert tone="warn" title="未提出の人が2名います" closable>しめきりを過ぎると、提出は受け付けられません。
    <template #action><ArButton size="sm" tone="secondary">もう一度知らせる</ArButton></template>
  </ArAlert>
  <ArAlert v-if="shown" tone="info" banner closable @close="shown = false">メンテナンスのため、11月3日（火）2:00〜4:00 は使えません。</ArAlert>
  <ArAlert tone="danger" banner :icon="false">保存できませんでした。通信を確かめて、もう一度押してください。</ArAlert>
</ArStack>
</template>
