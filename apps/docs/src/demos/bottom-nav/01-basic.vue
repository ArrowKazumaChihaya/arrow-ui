<!-- スマホの下のメニュー | 5つを等分に並べ、今いるものをテーマ色で示す。製品では画面の下に固定する（見本は fixed=false）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArBottomNav, ArStack } from "@s_and_a/arrow-ui";
import type { ArAppNavItem } from "@s_and_a/arrow-ui";
const items: ArAppNavItem[] = [
  { key: "shift", label: "シフト", icon: "cal", palette: "blue" },
  { key: "attendance", label: "勤怠", icon: "brief", palette: "green" },
  { key: "payment", label: "給与賞与報酬年調", icon: "calc", palette: "yellow" },
  { key: "document", label: "書類集計", icon: "files", palette: "pink" },
  { key: "menu", label: "メニュー", icon: "menu" },
];
const current = ref("shift");
</script>

<template>
<ArStack :gap="4">
  <div style="width: 390px; max-width: 100%">
    <ArBottomNav :items="items" :current="current" :fixed="false" @navigate="(k) => (current = k)" />
  </div>
  <div style="width: 390px; max-width: 100%">
    <ArBottomNav :items="items" current="document" :fixed="false" />
  </div>
</ArStack>
</template>
