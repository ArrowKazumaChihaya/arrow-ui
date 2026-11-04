<!-- 状態 | 間違い・使えない・読み取りのみ。 -->
<script setup lang="ts">
import { ArMentions, ArGrid } from "@s_and_a/arrow-ui";
const people = ["佐藤 美咲", "田中 健"];
</script>

<template>
<ArGrid min-item="sm" :gap="3">
  <ArMentions model-value="@田中 健 さん" :options="people" invalid label="間違い" />
  <ArMentions model-value="@田中 健 さん" :options="people" disabled label="使えない" />
  <ArMentions model-value="@田中 健 さん" :options="people" readonly label="読み取りのみ" />
</ArGrid>
</template>
