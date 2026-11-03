<!-- 管理者のメニュー | 共通のメニュー画面（/manager/menu）。7列に並べ、色は機能のテーマ色（palette）。やることがある所は右上に件数（count）。remix は白い札（variant="card"・既定）、classic は今の ARROW のタイル。 -->
<script setup lang="ts">
import { ArMenuTile } from "@arrow/ui";
import type { ArIconName, ArPaletteName } from "@arrow/ui";
const tiles: { label: string; icon: ArIconName; palette: ArPaletteName; count?: number }[] = [
  { label: "シフト", icon: "cal", palette: "blue" },
  { label: "勤怠", icon: "brief", palette: "green" },
  { label: "給与", icon: "calc", palette: "yellow" },
  { label: "賞与", icon: "yen", palette: "yellow" },
  { label: "報酬", icon: "layers", palette: "yellow" },
  { label: "年末調整", icon: "note", palette: "yellow" },
  { label: "書類集計", icon: "files", palette: "pink" },
  { label: "通知", icon: "speaker", palette: "orange" },
  { label: "会社情報", icon: "bld", palette: "teal" },
  { label: "社員一覧", icon: "users", palette: "teal", count: 3 },
  { label: "有給管理", icon: "umbrella", palette: "teal" },
  { label: "設定", icon: "gear", palette: "teal" },
  { label: "契約状況", icon: "contract", palette: "teal" },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 10px 8px; max-width: 1360px; padding: 22px; border-radius: 18px; background: #fff">
    <ArMenuTile v-for="t in tiles" :key="t.label" :label="t.label" :icon="t.icon" :palette="t.palette" :count="t.count" />
  </div>
</template>
