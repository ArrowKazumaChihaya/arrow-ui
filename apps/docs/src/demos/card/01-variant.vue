<!-- 帯つきのカード | band はページの大きなまとまり：白・角丸18・影、頭に高さ54のテーマ色の帯（120度のやわらかいグラデーションに淡い白の丸）。size="sm" は低い帯（46px）。#actions は帯の右。 -->
<script setup lang="ts">
import { ArCard, ArButton } from "@s_and_a/arrow-ui";
</script>

<template>
<div style="display: grid; grid-template-columns: minmax(0, 541px) minmax(0, 260px); gap: 24px; align-items: start">
  <ArCard title="シフト詳細" icon="users" variant="band">
    <template #actions><ArButton tone="ghost" size="sm" icon="help" label="使い方" /></template>
    10月21日（水）の勤務メンバーと人件費。
  </ArCard>
  <ArCard title="シフト詳細" icon="users" variant="band" size="sm">ページの主なカードはテーマ色の帯。</ArCard>
</div>
</template>
