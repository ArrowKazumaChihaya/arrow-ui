<!-- メニューのボタン | menus を渡すと右端にメニューのボタン。押すと下から一覧が出る（親とその子を順にタイルで並べる）。項目を押すと navigate。actions の slot にはベルの左に足すもの（やることの札など）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArMobileHeader } from "@arrow/ui";
import type { ArAppNavItem } from "@arrow/ui";
const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;
const menus: ArAppNavItem[] = [
  { key: "shift", label: "シフト", icon: "cal", palette: "blue", children: [{ key: "shift-submit", label: "シフト提出" }, { key: "shift-view", label: "シフト閲覧" }] },
  { key: "attendance", label: "勤怠", icon: "brief", palette: "green" },
  { key: "payment", label: "給与賞与報酬年調", icon: "calc", palette: "yellow" },
  { key: "document", label: "書類集計", icon: "files", palette: "pink" },
  { key: "notification", label: "通知", icon: "speaker", palette: "orange" },
  { key: "employee", label: "社員情報", icon: "users", palette: "teal", children: [{ key: "employees", label: "社員一覧" }, { key: "paid-hol", label: "有給管理" }] },
  { key: "config", label: "設定", icon: "gear", palette: "teal" },
];
const current = ref("shift-view");
</script>

<template>
<div style="width: 390px; max-width: 100%">
  <ArMobileHeader :count="3" notice-label="システムからのお知らせ" :menus="menus" :current="current" @navigate="(k) => (current = k)">
    <template #logo><img :src="logo" alt="ARROW" /></template>
  </ArMobileHeader>
  <p style="margin: 8px 0 0; font-size: 12px">今いる所：{{ current }}</p>
</div>
</template>
