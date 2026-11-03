<!-- アイコンの一覧 | remix は線のアイコン。classic はデザインが持つ今の ARROW の塗りの絵（ArDesign.icons）で描き、絵の無い名前は線のまま。色は文字の色を受け継ぐ（2色の絵はその色のまま）。label を付けると読み上げられ、付けなければ飾りとして隠れる。 -->
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
