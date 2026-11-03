<!-- 外す・追加・選べる札 | closable で × を出して外せる（close）。dashed は点線の「タグを追加」。checkable は選べる札（CheckableTag）で、選ぶとテーマ色の塗り（v-model:checked、aria-pressed）。 -->
<script setup lang="ts">
import { ArTag } from "@arrow/ui";
import { ref } from "vue";
const tags = ref(["早番", "遅番"]);
const stores = ref<Record<string, boolean>>({ 渋谷店: true, 新宿店: false, 池袋店: false });
let n = 0;
</script>

<template>
<div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center">
  <ArTag v-for="t in tags" :key="t" tone="accent" closable :close-label="`${t}を外す`" @close="tags = tags.filter((x) => x !== t)">{{ t }}</ArTag>
  <ArTag dashed icon="plus" @click="tags = [...tags, `タグ${++n}`]">タグを追加</ArTag>
  <ArTag v-for="(on, s) in stores" :key="s" checkable v-model:checked="stores[s]">{{ s }}</ArTag>
  <ArTag checkable disabled>使えない</ArTag>
</div>
</template>
