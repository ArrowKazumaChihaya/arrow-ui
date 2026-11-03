<!-- スマホの画面の頭 | 左にロゴ、右にお知らせのボタンと件数の丸。下端にテーマ色の線。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArMobileHeader, ArStack } from "@arrow/ui";
const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;
const n = ref(5);
</script>

<template>
<ArStack :gap="5">
  <div style="width: 390px; max-width: 100%">
    <ArMobileHeader :count="n" notice-label="システムからのお知らせ" @notice="n = 0">
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArMobileHeader>
  </div>
  <div style="width: 390px; max-width: 100%">
    <ArMobileHeader :count="0" notice-label="システムからのお知らせ">
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArMobileHeader>
  </div>
  <div style="width: 390px; max-width: 100%">
    <ArMobileHeader :count="120" notice-label="システムからのお知らせ">
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArMobileHeader>
  </div>
</ArStack>
</template>
