<!-- 凡例・空・操作なし | legend に配列を渡すとその凡例だけ、patterns でパターンの色を足す。toolbar=false で表・合計・凡例だけ。ownBranchIds を省くとすべての札を「この店舗」の形で出す。行がないとき・検索に当てはまらないときは空の表示。 -->
<script setup lang="ts">
import { ArShiftViewTable } from "@arrow/ui";
import { branches, patterns, people, shifts, today, weekDates } from "./_data";
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <ArShiftViewTable
      :dates="weekDates"
      :rows="people.slice(0, 3)"
      :shifts="shifts"
      :branches="branches"
      :today="today"
      :toolbar="false"
      :patterns="patterns"
      :show-totals="false"
      label="パターンの色の凡例"
    />
    <ArShiftViewTable
      :dates="weekDates"
      :rows="people.slice(0, 2).map((p) => ({ ...p, avatar: false, sub: '' }))"
      :shifts="shifts"
      :branches="branches"
      :own-branch-ids="[1]"
      :toolbar="false"
      :legend="[
        { kind: 'own', label: 'ARROW事業部', color: '#4C5FC4' },
        { kind: 'other', label: '他の店舗' },
      ]"
      label="凡例を渡す"
    />
    <ArShiftViewTable :dates="weekDates" :rows="[]" :shifts="[]" :zoom="false" :search="false" label="空の表" />
  </div>
</template>
