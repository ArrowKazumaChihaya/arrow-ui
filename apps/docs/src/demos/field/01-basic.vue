<!-- ラベル・必須・説明・エラー | 中に置いた入力と id・ラベル・説明が結ばれる（スロットの id を渡す）。 -->
<script setup lang="ts">
import { ArField, ArTextInput, ArGrid } from "@arrow/ui";
import { ref } from "vue";
const title = ref("朝礼");
const wage = ref("12OO");
</script>

<template>
<ArGrid min-item="md" :gap="5">
  <ArField label="タイトル" required help="シフト表に出ます">
    <template #default="f"><ArTextInput v-model="title" :id="f.id" /></template>
  </ArField>
  <ArField label="時給" error="半角の数字で入れてください">
    <template #default="f"><ArTextInput v-model="wage" :id="f.id" suffix="円" invalid /></template>
  </ArField>
</ArGrid>
</template>
