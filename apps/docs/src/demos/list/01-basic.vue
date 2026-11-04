<!-- 人の一覧 | 1行は「頭文字の丸・名前と説明・右の操作」。group が続く間は淡いテーマ色の見出しでまとめる（スクロールしても上に残る）。off は薄く出す。 -->
<script setup lang="ts">
import { ArButton, ArList } from "@s_and_a/arrow-ui";
const items = [
  { key: 1, title: "佐藤 美咲", description: "09:00〜18:00 ／ 渋谷店", avatar: true, group: "勤務可能な人（提出）" },
  { key: 2, title: "田中 健", description: "13:00〜22:00", avatar: true, group: "勤務可能な人（提出）" },
  { key: 3, title: "山本 葵", description: "登録済み", avatar: true, group: "勤務可能な人（提出）", off: true },
  { key: 4, title: "鈴木 大地", description: "希望なし", avatar: true, group: "まだ出していない人" },
];
</script>

<template>
<ArList :items="items" label="勤務可能な人">
  <template #actions="{ item }">
    <ArButton tone="subtle" size="sm" :disabled="item.off">シフトに入れる</ArButton>
    <ArButton tone="muted" size="sm" icon="eyeoff" :label="`${item.title}を隠す`" />
  </template>
</ArList>
</template>
