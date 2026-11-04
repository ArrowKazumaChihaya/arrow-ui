<!-- 承認の流れ・意味の色 | 差し戻しは danger、気をつけるは warn、行事は event。reverse で新しいものを上に。 -->
<script setup lang="ts">
import { ArTimeline } from "@s_and_a/arrow-ui";
const items = [
  { title: "申請", description: "10/18 09:12 佐藤 美咲", tone: "accent" as const },
  { title: "差し戻し", description: "10/18 13:40 店長：休憩の時間を直してください", tone: "danger" as const },
  { title: "再申請", description: "10/19 08:55 佐藤 美咲", tone: "warn" as const },
  { title: "承認", description: "10/19 10:02 店長", tone: "ok" as const },
  { title: "給与に反映", description: "10/25 予定", status: "pending" as const },
];
</script>

<template>
<ArTimeline :items="items" reverse label="申請の履歴" />
</template>
