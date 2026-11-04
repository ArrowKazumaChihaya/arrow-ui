<!-- 見出し・枠なし・空 | #header・#footer。bordered=false は枠なし。maxHeight でスクロール。項目がないときは emptyText。 -->
<script setup lang="ts">
import { ArList } from "@s_and_a/arrow-ui";
const items = Array.from({ length: 8 }, (_, i) => ({ key: i, title: `お知らせ ${i + 1}`, description: `10月${21 - i}日` }));
</script>

<template>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start">
  <ArList :items="items" label="お知らせ" :max-height="200" size="sm">
    <template #header>お知らせ</template>
  </ArList>
  <ArList :items="[]" label="勤務可能な人" empty-text="この日に出勤できると出している人はいません" />
</div>
</template>
