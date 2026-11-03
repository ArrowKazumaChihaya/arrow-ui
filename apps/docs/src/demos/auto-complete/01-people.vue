<!-- 名前の候補 | 打った文字に合う人を出す。頭文字の丸つき、合っている文字はテーマ色の太字。読み（keywords）でも探せる（「さと」で「佐藤」）。 -->
<script setup lang="ts">
import { ArAutoComplete } from "@arrow/ui";
import { ref } from "vue";
const q = ref("さと");
const picked = ref<string | number | null>(null);
const people = [
  { value: 1, label: "さとう 美咲", keywords: "さとう みさき", avatar: "佐", description: "渋谷店" },
  { value: 2, label: "さとみ 健", keywords: "さとみ けん", avatar: "里" },
  { value: 3, label: "佐藤 大地", keywords: "さとう だいち" },
  { value: 4, label: "田中 健", keywords: "たなか けん" },
  { value: 5, label: "田村 葵", keywords: "たむら あおい" },
];
</script>

<template>
<div style="width: 280px">
  <ArAutoComplete v-model="q" :options="people" avatar icon="search" placeholder="名前で探す" label="名前" block @select="picked = $event" />
  <p style="margin: 8px 0 0; font-size: 12px">選んだ値：{{ picked ?? "—" }}</p>
</div>
</template>
