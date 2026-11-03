<!-- タブを入れる | #tabs にタブを置くと、見出しの下につながる。 -->
<script setup lang="ts">
import { ArCard, ArTabs } from "@arrow/ui";
import { ref } from "vue";
const tab = ref("member");
const items = [{ key: "member", label: "勤務メンバー", icon: "users" as const, count: 4 }, { key: "available", label: "勤務可能な人" }, { key: "event", label: "イベント" }];
</script>

<template>
<ArCard title="シフト詳細" variant="band">
  <template #tabs><ArTabs v-model="tab" :items="items" label="詳細" /></template>
  選んでいるタブ：{{ tab }}
</ArCard>
</template>
