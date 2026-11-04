<!-- 帯のタブ | カードの頭に置く画面の切り替え（カレンダー／テーブル／閲覧）。選んでいるタブはテーマ色で塗る。 -->
<script setup lang="ts">
import { ArTabs } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref("cal");
const page = [{ key: "cal", label: "カレンダー", icon: "cal" as const }, { key: "table", label: "テーブル", icon: "grid" as const }, { key: "view", label: "閲覧", icon: "eye" as const }];
</script>

<template>
<div style="max-width: 420px"><ArTabs v-model="a" :items="page" variant="band" label="表示" /></div>
</template>
