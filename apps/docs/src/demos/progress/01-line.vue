<!-- 線・刻み | 進行はテーマ色、取り込み中（active）は光が流れる、終わり（100%）は緑のチェック、失敗は赤。刻み（steps）は「いくつ中いくつ」。 -->
<script setup lang="ts">
import { ArProgress, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="2">
  <ArProgress :percent="72" />
  <ArProgress :percent="45" status="active" label="取り込み中" />
  <ArProgress :percent="100" />
  <ArProgress :percent="38" status="exception" />
  <ArProgress type="steps" :percent="60" :steps="5" />
</ArStack>
</template>
