<!-- 頭文字の丸 | 名前の頭文字。地は淡いテーマ色（tone="accent"）。大きさは xs 24（セレクトの中）・sm 28（表の名前の列・ヘッダー）・md 32・lg 44・xl 60。四角（shape="square"）や意味の色、人の印（icon）もある。 -->
<script setup lang="ts">
import { ArAvatar } from "@arrow/ui";
</script>

<template>
<div style="display: grid; gap: 16px">
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
    <ArAvatar name="佐藤 美咲" size="xs" />
    <ArAvatar name="田中 健" size="sm" />
    <ArAvatar name="田中 健" />
    <ArAvatar name="山本 葵" size="lg" />
    <ArAvatar name="鈴木 大地" size="xl" shape="square" tone="event" />
    <ArAvatar icon="user" tone="neutral" label="未登録の人" />
  </div>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
    <ArAvatar v-for="(n, i) in ['千速 一真', '末永 修也', '新里 匠', '中口 万由香', '松田 照恵']" :key="n" :name="n" :seed="i" />
    <span style="font-size: 12px; color: var(--ar-color-text-muted)">seed で人ごとの色（シフト画面の並び）</span>
  </div>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
    <ArAvatar text="OK" tone="ok" />
    <ArAvatar text="注" tone="warn" />
    <ArAvatar text="誤" tone="danger" />
    <ArAvatar text="会" tone="event" />
  </div>
</div>
</template>
