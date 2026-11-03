<!-- 縦のメニュー（inline） | 子メニューはその場で開く。上の段の選択中はテーマ色の塗り（白文字）、子の選択中は淡い面とテーマ色の文字。権限がない項目は鍵と灰色。 -->
<script setup lang="ts">
import { ArMenu, type ArMenuItem } from "@arrow/ui";
import { ref } from "vue";
const selected = ref("shift");
const open = ref(["pay"]);
const items: ArMenuItem[] = [
  { key: "g", type: "group", label: "シフト", children: [
    { key: "shift", label: "シフト", icon: "cal" },
    { key: "att", label: "勤怠", icon: "brief", children: [{ key: "att-day", label: "日次" }, { key: "att-month", label: "月次" }] },
    { key: "pay", label: "給与賞与", icon: "calc", children: [{ key: "pay-slip", label: "給与明細" }, { key: "bonus", label: "賞与明細" }] },
    { key: "nencho", label: "年調（権限なし）", locked: true },
  ] },
];
</script>

<template>
<div style="width: 230px">
  <ArMenu v-model:selected="selected" v-model:open-keys="open" :items="items" label="ページ" />
</div>
</template>
