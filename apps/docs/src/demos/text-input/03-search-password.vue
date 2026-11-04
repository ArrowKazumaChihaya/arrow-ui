<!-- 探す・パスワード・文字数・消す | type="search" は頭に虫めがね（Enter で search）。type="password" は目のボタンで見せる・隠す。show-count で文字数、clearable で消すボタン。 -->
<script setup lang="ts">
import { ArTextInput, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const q = ref("");
const pw = ref("password");
const memo = ref("本日の売上目標を共有");
const code = ref("S1001");
const searched = ref("");
</script>

<template>
<ArStack :gap="3">
  <ArTextInput v-model="q" type="search" placeholder="名前・社員コードで探す" label="探す" clearable block @search="searched = $event" />
  <p v-if="searched" style="margin: 0; font-size: 12px">「{{ searched }}」で探しました</p>
  <ArTextInput v-model="pw" type="password" icon="lock" label="パスワード" block />
  <ArTextInput v-model="memo" :maxlength="30" show-count label="メモ" block />
  <ArTextInput v-model="code" clearable label="社員コード" style="width: 240px" />
</ArStack>
</template>
