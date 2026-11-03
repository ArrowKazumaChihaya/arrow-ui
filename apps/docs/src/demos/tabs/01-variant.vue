<!-- 線と帯 | line は中身の切り替え。band は画面の表示の切り替え（ページの一番上）。 -->
<script setup lang="ts">
import { ArTabs, ArStack } from "@arrow/ui";
import { ref } from "vue";
const a = ref("cal");
const b = ref("member");
const page = [{ key: "cal", label: "カレンダー", icon: "cal" as const }, { key: "table", label: "テーブル", icon: "grid" as const }, { key: "view", label: "閲覧", icon: "eye" as const }];
const detail = [{ key: "member", label: "勤務メンバー", count: 4 }, { key: "available", label: "勤務可能な人" }, { key: "off", label: "休み", disabled: true }];
</script>

<template>
<ArStack :gap="5">
  <ArTabs v-model="a" :items="page" variant="band" label="表示" />
  <ArTabs v-model="b" :items="detail" label="詳細" />
</ArStack>
</template>
