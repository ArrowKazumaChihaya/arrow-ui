<!-- 基本 | お知らせの切り替え。地は帯と同じやわらかいグラデーション。左右のボタン・下の点で切り替え、フォーカスがあれば ←→ でも動く。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCarousel } from "@s_and_a/arrow-ui";
const i = ref(0);
const items = ["年末年始のシフト募集が始まりました", "11月の給与明細を公開しました", "打刻アプリを新しくしました"];
</script>

<template>
<div style="max-width: 548px">
  <ArCarousel v-model="i" :items="items" label="お知らせ" />
</div>
</template>
