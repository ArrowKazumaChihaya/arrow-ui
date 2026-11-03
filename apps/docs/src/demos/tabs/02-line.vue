<!-- 下線のタブ | カードの中の中身の切り替え。アイコン・件数の札・使えないタブ。 -->
<script setup lang="ts">
import { ArTabs } from "@arrow/ui";
import { ref } from "vue";
const b = ref("member");
const detail = [
  { key: "member", label: "勤務メンバー", icon: "users" as const, count: 8 },
  { key: "available", label: "勤務可能な人" },
  { key: "event", label: "イベント" },
  { key: "log", label: "履歴", disabled: true },
];
</script>

<template>
<ArTabs v-model="b" :items="detail" label="詳細" />
</template>
