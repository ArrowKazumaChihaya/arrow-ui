<!-- いろいろな入力 | icon・suffix・maxlength・読み取りのみ・押せない。 -->
<script setup lang="ts">
import { ArTextInput, ArGrid } from "@arrow/ui";
import { ref } from "vue";
const q = ref("");
const wage = ref("1200");
const memo = ref("");
</script>

<template>
<ArGrid min-item="sm" :gap="3">
  <ArTextInput v-model="q" icon="search" placeholder="名前で探す" label="名前で探す" />
  <ArTextInput v-model="wage" suffix="円" inputmode="numeric" label="時給" />
  <ArTextInput v-model="memo" :maxlength="20" placeholder="20文字まで" label="メモ" />
  <ArTextInput model-value="ARR-00123" readonly label="社員番号" />
  <ArTextInput model-value="入れられない" disabled label="押せない" />
  <ArTextInput model-value="abc" invalid label="エラー" />
</ArGrid>
</template>
