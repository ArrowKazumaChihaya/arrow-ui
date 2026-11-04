<!-- 子のメニューと「メニュー」の一覧 | 項目の children は、押すとメニューの真上に子の段が出る（今の ARROW のスマホのフッターと同じく、押すと navigate も出す。右半分の項目は右に寄せる。↑ キーで子の段へ、Escape で閉じる）。max（既定5）より多い項目は右端の「メニュー」に入り、押すと下から一覧が出る（親と子を順にタイルで並べる。今の ARROW のメニューのページ）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArBottomNav } from "@s_and_a/arrow-ui";
import type { ArAppNavItem } from "@s_and_a/arrow-ui";
/** 製品の leftMenuList・rightMenuList（title・icon・submenu）を ArAppNavItem に直した形。 */
const items: ArAppNavItem[] = [
  { key: "shift", label: "シフト", icon: "cal", palette: "blue", children: [{ key: "shift-submit", label: "シフト提出" }, { key: "shift-regist", label: "シフト登録" }, { key: "shift-view", label: "シフト閲覧" }] },
  { key: "attendance", label: "勤怠", icon: "brief", palette: "green", children: [{ key: "punch-gps", label: "GPS打刻", icon: "pin" }, { key: "attendance-list", label: "勤怠" }] },
  { key: "payment", label: "給与賞与報酬年調", icon: "calc", palette: "yellow", children: [{ key: "pay", label: "給与" }, { key: "bonus", label: "賞与" }, { key: "nencho", label: "年末調整" }] },
  { key: "document", label: "書類集計", icon: "files", palette: "pink" },
  { key: "notification", label: "通知", icon: "speaker", palette: "orange" },
  { key: "company", label: "会社情報", icon: "bld", palette: "teal" },
  { key: "employee", label: "社員情報", icon: "users", palette: "teal", children: [{ key: "employees", label: "社員一覧" }, { key: "paid-hol", label: "有給管理" }] },
  { key: "config", label: "設定", icon: "gear", palette: "teal" },
];
const current = ref("shift-regist");
</script>

<template>
<div style="width: 390px; max-width: 100%; padding-top: 72px">
  <ArBottomNav :items="items" :current="current" :fixed="false" @navigate="(k) => (current = k)" />
  <p style="margin: 8px 0 0; font-size: 12px">今いる所：{{ current }}</p>
</div>
</template>
