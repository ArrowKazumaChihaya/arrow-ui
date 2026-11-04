<!-- 件数なし・管理ページのメニューなし | 件数が 0 のピルは丸を出さない。accountMenu を渡さなければ、右上を押すと account を出すだけ。 -->
<script setup lang="ts">
import { ArAppHeader, ArThemeScope } from "@s_and_a/arrow-ui";
const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;
</script>

<template>
<div style="margin: -24px; overflow-x: auto">
  <ArThemeScope palette="green" style="min-width: 1100px; padding-bottom: 8px">
    <ArAppHeader
      :menus="[
        { key: 'shift', label: 'シフト', icon: 'cal', palette: 'blue' },
        { key: 'attendance', label: '勤怠', icon: 'brief', palette: 'green' },
      ]"
      :menus-end="[{ key: 'config', label: '設定', icon: 'gear', palette: 'teal' }]"
      current="attendance"
      :pills="[
        { key: 'notice', label: 'システムからのお知らせ', count: 0, icon: 'speaker', tone: 'notice' },
        { key: 'todo', label: 'やることリスト', count: 0, icon: 'todo', tone: 'todo' },
      ]"
      :account="{ label: '個人ページ', initial: '千' }"
    >
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArAppHeader>
  </ArThemeScope>
</div>
</template>
