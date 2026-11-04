<!-- 横のメニュー・浮かぶ子メニュー | horizontal はタブと同じ下線（子メニューは下に浮かぶ）。vertical は子メニューを右に浮かせる。 -->
<script setup lang="ts">
import { ArMenu, ArStack, type ArMenuItem } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref("shift");
const b = ref("store");
const top: ArMenuItem[] = [
  { key: "shift", label: "シフト", icon: "cal" },
  { key: "att", label: "勤怠", icon: "brief" },
  { key: "pay", label: "給与賞与", icon: "calc", children: [{ key: "pay-slip", label: "給与明細" }, { key: "bonus", label: "賞与明細" }] },
  { key: "set", label: "設定", icon: "gear" },
];
const side: ArMenuItem[] = [
  { key: "store", label: "店舗", icon: "store" },
  { key: "member", label: "社員", icon: "users", children: [{ key: "list", label: "社員の一覧", icon: "users" }, { key: "invite", label: "招待する", icon: "mail" }] },
  { key: "hr", type: "divider" },
  { key: "close", label: "契約の解除", icon: "trash", danger: true },
];
</script>

<template>
<ArStack :gap="5">
  <ArMenu v-model:selected="a" :items="top" mode="horizontal" label="サービス" />
  <div style="width: 230px"><ArMenu v-model:selected="b" :items="side" mode="vertical" label="設定" /></div>
</ArStack>
</template>
