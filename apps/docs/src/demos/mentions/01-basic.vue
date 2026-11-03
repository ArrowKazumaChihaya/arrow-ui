<!-- ＠で人を呼ぶ | 「@」に続けて打つと合う人が出る（↓↑・Enter・Tab で選ぶ）。呼んだ名前は淡いテーマ色の札。打った量に合わせて高さが伸びる。 -->
<script setup lang="ts">
import { ArMentions, ArField } from "@arrow/ui";
import { ref } from "vue";
const text = ref("@佐藤 美咲 さん、明日の朝礼を ");
const people = [
  { value: 1, label: "佐藤 美咲", keywords: "さとう みさき" },
  { value: 2, label: "田中 健", keywords: "たなか けん" },
  { value: 3, label: "田村 葵", keywords: "たむら あおい" },
  { value: 4, label: "鈴木 大地", keywords: "すずき だいち" },
];
</script>

<template>
<div style="max-width: 360px">
  <ArField label="お知らせの本文" help="@ で呼んだ人に通知が届きます">
    <template #default="f"><ArMentions v-model="text" v-bind="f" :options="people" placeholder="本文を入れる" /></template>
  </ArField>
</div>
</template>
