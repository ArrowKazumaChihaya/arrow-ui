<!-- 閉じられるタブ | variant="card"。×か Delete キーで close、「＋」で add。消す・足すは使う側が items を変える。 -->
<script setup lang="ts">
import { ArTabs, type ArTabItem } from "@arrow/ui";
import { ref } from "vue";
const items = ref<ArTabItem[]>([{ key: "10", label: "10月分", closable: true }, { key: "11", label: "11月分", closable: true }]);
const tab = ref("10");
function close(key: string) {
  const i = items.value.findIndex((t) => t.key === key);
  items.value = items.value.filter((t) => t.key !== key);
  if (tab.value === key) tab.value = items.value[Math.max(0, i - 1)]?.key ?? "";
}
function add() {
  const n = Number(items.value.at(-1)?.key ?? 9) + 1;
  const m = ((n - 1) % 12) + 1;
  items.value = [...items.value, { key: String(n), label: `${m}月分`, closable: true }];
  tab.value = String(n);
}
</script>

<template>
<ArTabs v-model="tab" :items="items" variant="card" addable add-label="月を足す" label="月" @close="close" @add="add" />
</template>
