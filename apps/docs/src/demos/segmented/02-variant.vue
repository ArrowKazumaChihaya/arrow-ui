<!-- 大きさ・アイコン・幅いっぱい・使えない | sm 30・md 36・lg 42。アイコンだけの選択肢は label が読み上げの名前になる。block で等分。 -->
<script setup lang="ts">
import { ArSegmented, ArStack } from "@arrow/ui";
import { ref } from "vue";
const v = ref("week");
const view = ref("cal");
const days = [{ value: "day", label: "日" }, { value: "week", label: "週" }, { value: "month", label: "月" }];
</script>

<template>
<ArStack :gap="4" align="start">
  <ArSegmented v-model="v" label="期間（小）" size="sm" :options="days" />
  <ArSegmented v-model="v" label="期間" :options="days" />
  <ArSegmented v-model="v" label="期間（大）" size="lg" :options="days" />
  <ArSegmented v-model="view" label="表示" :options="[{ value: 'cal', label: 'カレンダー', icon: 'cal' }, { value: 'table', label: 'テーブル', icon: 'grid' }, { value: 'chart', label: 'チャート', icon: 'chart', disabled: true }]" />
  <ArSegmented v-model="view" label="表示（アイコン）" :options="[{ value: 'cal', label: 'カレンダー', icon: 'cal', iconOnly: true }, { value: 'table', label: 'テーブル', icon: 'grid', iconOnly: true }, { value: 'chart', label: 'チャート', icon: 'chart', iconOnly: true }]" />
  <div style="width: 360px"><ArSegmented v-model="v" label="期間（幅いっぱい）" block :options="days" /></div>
  <ArSegmented v-model="v" label="期間（使えない）" disabled :options="days" />
</ArStack>
</template>
