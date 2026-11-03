<!-- 帯と平ら | band は画面の大きなまとまり（タイトルの帯）。plain は中の小さなまとまり。 -->
<script setup lang="ts">
import { ArCard, ArButton, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="4">
  <ArCard title="シフト詳細" icon="users" variant="band">
    <template #actions><ArButton tone="ghost" icon="help" label="使い方" /></template>
    10月24日（土）の勤務メンバーと人件費。
  </ArCard>
  <ArCard title="勤怠の締め" icon="lock">
    <template #actions><ArButton tone="secondary" size="sm">設定</ArButton></template>
    毎月20日に締めます。
  </ArCard>
</ArStack>
</template>
