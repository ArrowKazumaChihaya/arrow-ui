<!-- 中身を自由に・点だけ | item slot で中身の形を変えられる。arrows=false で前後のボタンを消し、点だけにする。height で高さを変える。 -->
<script setup lang="ts">
import { ArCarousel, ArButton } from "@arrow/ui";
const items = ["給与", "書類"];
</script>

<template>
<div style="max-width: 548px">
  <ArCarousel :items="items" :arrows="false" :height="120" label="案内">
    <template #item="{ item, index }">
      <div style="display: flex; align-items: center; gap: 16px">
        <span style="font: 700 16px/1.5 var(--ar-font-family)">{{ index + 1 }}. {{ item }}の新しい画面をお試しください</span>
        <ArButton tone="secondary" size="sm">見る</ArButton>
      </div>
    </template>
  </ArCarousel>
</div>
</template>
