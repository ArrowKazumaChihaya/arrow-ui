<!-- アイコンの一覧 | 線のアイコン。色は文字の色を受け継ぐ。label を付けると読み上げられ、付けなければ飾りとして隠れる。 -->
<script setup lang="ts">
import { ArIcon, icons } from "@arrow/ui";
const names = Object.keys(icons) as (keyof typeof icons)[];
</script>

<template>
<div class="demo-icons">
  <div v-for="n in names" :key="n" class="demo-icon">
    <ArIcon :name="n" size="lg" />
    <code>{{ n }}</code>
  </div>
</div>
</template>
