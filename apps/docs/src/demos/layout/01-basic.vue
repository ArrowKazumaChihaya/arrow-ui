<!-- 画面の枠 | ヘッダーの下に3pxのテーマ色の線。Sider（設定などの横のメニュー）の選択中はテーマ色の塗り。中身の地は bg、まとまりは白いカード。フッターは白・上に線。 -->
<script setup lang="ts">
import { ArLayout, ArMenu } from "@arrow/ui";
import { ref } from "vue";
const page = ref("shift");
const items = [{ key: "shift", label: "シフト" }, { key: "att", label: "勤怠" }, { key: "pay", label: "給与賞与" }, { key: "set", label: "設定" }];
</script>

<template>
<div style="height: 220px; max-width: 628px">
  <ArLayout bordered fill :sider-width="150">
    <template #header><b style="font-size: 12px; letter-spacing: .1em">ARROW</b><span style="font-size: 12px; color: #66727F; font-weight: 500">Header（ヘッダー2段）</span></template>
    <template #sider><ArMenu v-model:selected="page" :items="items" size="sm" :bordered="false" label="ページ" /></template>
    <div style="height: 100%; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #66727F">Content（地は bg）</div>
    <template #footer>Footer</template>
  </ArLayout>
</div>
</template>
