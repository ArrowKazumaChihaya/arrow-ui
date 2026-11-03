<!-- 空の状態 | 何もないことと次の一手を言葉で書く。絵は使わず線のアイコン（icon）。#action に次の一手のボタン。size="md" はカードの中の広い場所。 -->
<script setup lang="ts">
import { ArButton, ArEmpty } from "@arrow/ui";
</script>

<template>
<div style="display: grid; gap: 12px; background: var(--ar-color-surface); padding: 8px; border-radius: 12px">
  <ArEmpty text="この日のシフトはまだありません。上の「シフト追加」から登録できます" />
  <ArEmpty icon="search" text="「たなか」に合う人はいません" />
  <ArEmpty icon="inbox" size="md" text="この日に出勤できると出している人はいません">
    <template #action><ArButton tone="subtle" size="sm" icon="send">出勤できる日を聞く</ArButton></template>
  </ArEmpty>
</div>
</template>
