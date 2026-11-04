<!-- 左右に交互・中身を自由に | mode="alternate" で中央の線の左右に交互に並べる。item slot で中身を、dot slot で点（アイコンなど）を変えられる。 -->
<script setup lang="ts">
import { ArIcon, ArTimeline } from "@s_and_a/arrow-ui";
const items = [
  { title: "入社", description: "2024/04/01" },
  { title: "時給 ¥1,100 → ¥1,200", description: "2025/04/01", tone: "ok" as const },
  { title: "店長代理", description: "2026/10/01", status: "current" as const },
];
</script>

<template>
<ArTimeline :items="items" mode="alternate" label="経歴">
  <template #dot="{ index }">
    <ArIcon v-if="index === 1" name="yen" size="sm" />
  </template>
</ArTimeline>
</template>
