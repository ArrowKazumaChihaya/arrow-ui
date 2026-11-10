<!-- 領域の切り替え・畳む・子のメニュー・ピルの一覧 | domains で「人事・労務」「経費精算」を渡す（note で「未契約」を添える）。既定はメニューの上のタブ、domain-style="menu" で1段目のロゴの右のボタンから開くメニューにする。collapsible で右に「ヘッダーを閉じる」（v-model:collapsed。畳むと右上に「＋」）。メニューの children は指す・フォーカス・指で押す・↓ キーで真下に出る（社員情報 → 社員一覧・有給管理）。ピルの items は指す・押す・↓ キーで下に一覧が出る。top の slot は1段目に足すもの（デザインの選択）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArAppHeader, ArButton } from "@s_and_a/arrow-ui";
import type { ArAppNavItem } from "@s_and_a/arrow-ui";
const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;
const menus: ArAppNavItem[] = [
  { key: "shift", label: "シフト", icon: "cal", palette: "blue" },
  { key: "attendance", label: "勤怠", icon: "brief", palette: "green", children: [{ key: "attendance-list", label: "勤怠一覧" }, { key: "paid", label: "有給管理" }] },
  { key: "payment", label: "給与賞与", icon: "calc", palette: "yellow" },
];
const menusEnd: ArAppNavItem[] = [
  { key: "company", label: "会社情報", icon: "bld", palette: "teal" },
  { key: "employee", label: "社員情報", icon: "users", palette: "teal", children: [{ key: "employees", label: "社員一覧" }, { key: "paid-hol", label: "有給管理" }] },
  { key: "config", label: "設定", icon: "gear", palette: "teal" },
];
const domain = ref("hr");
const collapsed = ref(false);
const last = ref("");
</script>

<template>
<div style="margin: -24px; overflow-x: auto">
  <div style="min-width: 1100px; padding-bottom: 96px">
    <ArAppHeader
      v-model:collapsed="collapsed"
      :menus="menus"
      :menus-end="menusEnd"
      current="shift"
      :domains="[{ key: 'hr', label: '人事・労務', icon: 'users' }, { key: 'expense', label: '経費精算', icon: 'calc', note: '未契約' }]"
      :domain="domain"
      collapsible
      domain-style="menu"
      :pills="[
        { key: 'notice', label: 'システムからのお知らせ', count: 2, icon: 'speaker', tone: 'notice', items: [{ key: 'n1', label: '新機能リリースのお知らせ' }, { key: 'n2', label: 'メンテナンス予定' }] },
        { key: 'todo', label: 'やることリスト', count: 3, icon: 'todo', tone: 'todo', items: [{ key: 't1', label: '住民税改定' }, { key: 't2', label: '残業承認' }, { key: 't3', label: '打刻修正承認' }] },
      ]"
      :account="{ label: '管理ページ', initial: '管' }"
      @domain="(k) => (domain = k)"
      @navigate="(k) => (last = k)"
      @pill-item="(p, k) => (last = `${p}:${k}`)"
    >
      <template #logo><img :src="logo" alt="ARROW" /></template>
      <template #top><ArButton size="sm" tone="secondary" @click="last = 'design'">デザインを選択</ArButton></template>
    </ArAppHeader>
    <p style="margin: 16px 24px 0; font-size: 12px">押したもの：{{ last || "—" }}</p>
  </div>
</div>
</template>
