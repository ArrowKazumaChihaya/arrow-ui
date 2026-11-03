<!-- 帯の下のタブ | #tabs にタブを置くと、帯のすぐ下に淡いテーマ色の帯（下に線）としてつながる。 -->
<script setup lang="ts">
import { ArCard, ArTabs } from "@arrow/ui";
import { ref } from "vue";
const tab = ref("calendar");
const items = [
  { key: "calendar", label: "カレンダー", icon: "cal" as const },
  { key: "table", label: "テーブル", icon: "grid" as const },
  { key: "view", label: "閲覧", icon: "eye" as const },
];
</script>

<template>
<div style="max-width: 541px">
  <ArCard title="シフトカレンダー" icon="cal" variant="band">
    <template #tabs><ArTabs v-model="tab" variant="band" :items="items" label="表示の切り替え" /></template>
    選んでいるタブ：{{ tab }}
  </ArCard>
</div>
</template>
