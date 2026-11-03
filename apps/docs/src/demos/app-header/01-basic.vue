<!-- PC の画面の頭 | 1段目にロゴ・お知らせ・やること・管理ページ、2段目にメニュー。今いるメニューはテーマ色で塗り、下端にテーマ色の線。項目は props で渡す。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArAppHeader } from "@arrow/ui";
import type { ArAppNavItem } from "@arrow/ui";
const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;

const menus: ArAppNavItem[] = [
  { key: "shift", label: "シフト", icon: "cal", palette: "blue" },
  { key: "attendance", label: "勤怠", icon: "brief", palette: "green" },
  { key: "payment", label: "給与賞与報酬年調", icon: "calc", palette: "yellow" },
  { key: "document", label: "書類集計", icon: "files", palette: "pink" },
  { key: "notification", label: "通知", icon: "speaker", palette: "orange" },
];
const menusEnd: ArAppNavItem[] = [
  { key: "company", label: "会社情報", icon: "bld", palette: "teal" },
  { key: "employee", label: "社員情報", icon: "users", palette: "teal" },
  { key: "config", label: "設定", icon: "gear", palette: "teal" },
];
const current = ref("shift");
const last = ref("");
</script>

<template>
<div style="margin: -24px; overflow-x: auto">
  <div style="min-width: 1100px; padding-bottom: 8px">
    <ArAppHeader
      :menus="menus"
      :menus-end="menusEnd"
      :current="current"
      :pills="[
        { key: 'notice', label: 'システムからのお知らせ', count: 5, icon: 'speaker', tone: 'notice' },
        { key: 'todo', label: 'やることリスト', count: 3, icon: 'todo', tone: 'todo' },
      ]"
      :account="{ label: '管理ページ', initial: '管' }"
      :account-menu="[
        { key: 'status', label: '契約状況' },
        { key: 'personal', label: '個人ページ' },
        { key: 'manager', label: '管理ページ' },
        { key: 'logout', label: 'ログアウト' },
      ]"
      @navigate="(k) => (current = k)"
      @pill="(k) => (last = k)"
      @account="(k) => (last = k)"
    >
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArAppHeader>
    <p style="margin: 16px 24px 0; font-size: 12px">押したもの：{{ last || "—" }}（メニューを押すと今いる場所が変わる）</p>
  </div>
</div>
</template>
