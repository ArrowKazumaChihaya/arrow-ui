<!-- 基本 | 高さ38・角丸10・枠は field。フォーカスするとテーマ色の枠と淡い輪。ArField の中に置くとラベル・必須・間違いと結ばれる。 -->
<script setup lang="ts">
import { ArTextInput, ArField, ArGrid } from "@arrow/ui";
import { ref } from "vue";
const title = ref("朝礼");
const memo = ref("");
</script>

<template>
<ArGrid min-item="md" :gap="5">
  <ArField label="タイトル" required>
    <template #default="f"><ArTextInput v-model="title" v-bind="f" block /></template>
  </ArField>
  <ArField label="メモ" help="従業員にも見えます">
    <template #default="f"><ArTextInput v-model="memo" v-bind="f" placeholder="例：本日の売上目標を共有" block /></template>
  </ArField>
</ArGrid>
</template>
