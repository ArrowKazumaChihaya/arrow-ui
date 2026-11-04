<!-- 注意の印 | alert を付けたタブは文字の右に「!」を出す（確かめてほしいことがあるタブ。今の Tab の isExclamation）。読み上げの名前は alertLabel（既定「要確認」）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArTabs } from "@s_and_a/arrow-ui";
const v = ref("list");
const items = [
  { key: "calendar", label: "カレンダー", alert: true },
  { key: "list", label: "一覧" },
  { key: "view", label: "閲覧" },
];
</script>

<template>
<ArTabs v-model="v" variant="band" :items="items" label="表示の切り替え" />
</template>
