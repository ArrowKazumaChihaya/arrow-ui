<!-- 重ねる | ArAvatarGroup に並べると白い縁で8px ずつ重なる。max を超えた分は灰色の「+N」にまとめる。 -->
<script setup lang="ts">
import { ArAvatar, ArAvatarGroup } from "@arrow/ui";
const names = ["佐藤 美咲", "田中 健", "山本 葵", "鈴木 大地", "高橋 樹", "中村 葵", "小池 さくら", "斎藤 湊"];
</script>

<template>
<div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap">
  <ArAvatarGroup :max="3" label="勤務中の人">
    <ArAvatar v-for="n in names" :key="n" :name="n" />
  </ArAvatarGroup>
  <ArAvatarGroup label="担当">
    <ArAvatar name="佐藤 美咲" />
    <ArAvatar name="田中 健" tone="ok" />
    <ArAvatar name="山本 葵" tone="warn" />
  </ArAvatarGroup>
  <ArAvatarGroup :max="4" size="sm" label="提出した人">
    <ArAvatar v-for="(n, i) in names" :key="n" :name="n" :seed="i" />
  </ArAvatarGroup>
</div>
</template>
