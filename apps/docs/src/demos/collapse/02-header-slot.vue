<!-- 見出しに部品を入れる | #title-<key>（{ item, open }）で見出しの文字の所に部品（太字の文・札・件数）。押すと開閉する（今の UI/Collapse の #header）。#header-extra-<key> は見出しのボタンの外の右に置き、押しても開閉しない（ボタン・スイッチはこちら）。1つだけの折りたたみ（今の UI/Collapse の value：true／false）は items を1つにして v-model を [key] か [] にする。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArButton, ArCollapse, ArSwitch, ArTag } from "@s_and_a/arrow-ui";
const open = ref<string[]>([]);
const guide = ref<string[]>(["guide"]);
const on = ref(true);
/** 今の UI/Collapse の value（boolean）と同じ使い方。 */
const expanded = computed({ get: () => open.value.includes("codes"), set: (v: boolean) => (open.value = v ? ["codes"] : []) });
const codes = [
  { code: "A01", name: "本社" },
  { code: "B02", name: "渋谷店" },
  { code: "B03", name: "新宿店" },
];
</script>

<template>
<div style="display: grid; gap: 20px; max-width: 560px">
  <ArCollapse v-model="open" :items="[{ key: 'codes', title: '会社コードの一覧' }]" ghost>
    <template #title-codes="{ open: isOpen }">
      <span>会社コードの一覧</span><ArTag size="sm">{{ codes.length }}件</ArTag><small v-if="!isOpen" style="color: #8592a0">押すと開く</small>
    </template>
    <template #panel-codes>
      <p v-for="c in codes" :key="c.code" style="margin: 4px 0">{{ c.code }}　{{ c.name }}</p>
    </template>
  </ArCollapse>
  <p style="margin: -12px 0 0; font-size: 12px">expanded（今の value と同じ boolean）：{{ expanded }}</p>
  <ArCollapse v-model="guide" :items="[{ key: 'guide', title: 'プログラムガイド' }, { key: 'auto', title: '自動で集計する' }]">
    <template #title-guide><b>プログラムガイド</b><ArTag size="sm" tone="accent">詳細</ArTag></template>
    <template #header-extra-guide><ArButton size="sm" tone="subtle" icon="files">コピー</ArButton></template>
    <template #header-extra-auto><ArSwitch v-model="on" label="自動で集計する" /></template>
    <template #panel-guide>このテンプレートで使える関数・定数・スタイル指定方法をまとめています。</template>
    <template #panel-auto>毎日 0 時に集計します（{{ on ? "オン" : "オフ" }}）。</template>
  </ArCollapse>
</div>
</template>
