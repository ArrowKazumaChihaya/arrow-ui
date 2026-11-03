<!-- マイページのメニュー | 札なしの四角（variant="plain"）。件数のある所は、名前の下に赤い一言（note）で理由を書く（「12月分 未提出」「エラー 2日」）。件数は文字（「!」）も渡せる。 -->
<script setup lang="ts">
import { ArMenuTile } from "@arrow/ui";
import type { ArIconName, ArPaletteName } from "@arrow/ui";
const tiles: { label: string; icon: ArIconName; palette: ArPaletteName; count?: number | string; note?: string }[] = [
  { label: "シフト", icon: "cal", palette: "blue" },
  { label: "シフト提出", icon: "note", palette: "blue", count: "!", note: "12月分 未提出" },
  { label: "MyPC打刻", icon: "clock", palette: "green" },
  { label: "勤怠", icon: "brief", palette: "green", count: 2, note: "エラー 2日" },
  { label: "給与", icon: "yen", palette: "yellow" },
  { label: "賞与", icon: "yen", palette: "yellow" },
  { label: "年末調整", icon: "note", palette: "yellow", count: 3, note: "未入力 3" },
  { label: "書類集計", icon: "files", palette: "pink", count: 2, note: "合意待ち 2" },
  { label: "個人情報", icon: "user", palette: "teal" },
  { label: "変更申請", icon: "pen", palette: "teal" },
  { label: "休暇申請", icon: "umbrella", palette: "teal", count: 2, note: "申請中 2" },
  { label: "残業申請", icon: "clock", palette: "teal" },
  { label: "打刻申請", icon: "clock", palette: "teal" },
  { label: "お知らせ", icon: "speaker", palette: "orange", count: 2, note: "新着 2" },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 18px 10px; max-width: 1080px">
    <ArMenuTile v-for="t in tiles" :key="t.label" variant="plain" :label="t.label" :icon="t.icon" :palette="t.palette" :count="t.count" :note="t.note" />
  </div>
</template>
