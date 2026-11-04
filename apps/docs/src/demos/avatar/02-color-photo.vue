<!-- 写真・決めた色・部品の中の丸 | src で写真、color で社員ごとに決めた [地, 文字] の色。シフト表・チャートの名前の列、ヘッダーの管理ページ、セレクトの人の選択肢の頭文字の丸も、すべてこの部品（sm＝28・xs＝24）。 -->
<script setup lang="ts">
import { ArAvatar } from "@arrow/ui";

const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect width="56" height="56" fill="#CFE0F2"/><circle cx="28" cy="22" r="10" fill="#8FB3D9"/><rect x="12" y="36" width="32" height="20" rx="10" fill="#8FB3D9"/></svg>');
</script>

<template>
<div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
  <ArAvatar :src="photo" name="末永 修也" size="sm" />
  <ArAvatar :src="photo" name="末永 修也" />
  <ArAvatar text="中" :color="['#FCE7F3', '#9D174D']" size="sm" label="中口（社員ごとの色）" />
  <ArAvatar text="管" tone="neutral" size="sm" label="管理ページ" />
  <ArAvatar text="末" size="xs" :seed="1" label="セレクトの値" />
</div>
</template>
