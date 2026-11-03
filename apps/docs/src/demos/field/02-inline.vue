<!-- ラベルを横に | 設定画面のように、ラベルと入力を横に並べる。 -->
<script setup lang="ts">
import { ArField, ArTextInput, ArStack } from "@arrow/ui";
import { ref } from "vue";
const a = ref("渋谷店");
const b = ref("");
</script>

<template>
<ArStack :gap="3">
  <ArField label="店舗名" layout="inline" required>
    <template #default="f"><ArTextInput v-model="a" :id="f.id" /></template>
  </ArField>
  <ArField label="電話番号" layout="inline">
    <template #default="f"><ArTextInput v-model="b" :id="f.id" inputmode="tel" placeholder="03-0000-0000" /></template>
  </ArField>
</ArStack>
</template>
