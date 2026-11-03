<!-- 説明つき・自動で切り替え | { title, description } で説明を添える。autoplay（true＝5秒、数＝ミリ秒）で自動で切り替え、乗せている間・フォーカスの間は止まる。テーマ色はまわりのページの色を引き継ぐ。 -->
<script setup lang="ts">
import { ArCarousel, ArThemeScope, ArGrid } from "@arrow/ui";
const items = [
  { title: "年末年始のシフト募集", description: "12月10日までに希望を出してください。" },
  { title: "勤怠のしめ日が変わります", description: "来月から毎月20日しめになります。" },
];
</script>

<template>
<ArGrid :columns="2" :gap="4">
  <ArCarousel :items="items" :autoplay="4000" label="お知らせ" />
  <ArThemeScope palette="green">
    <ArCarousel :items="items" label="勤怠のお知らせ" :loop="false" />
  </ArThemeScope>
</ArGrid>
</template>
