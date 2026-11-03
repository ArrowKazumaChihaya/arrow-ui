<!-- ラベルが上（ポップアップ） | ラベルは .lbl（12.5px 太字）、必須は赤い札。説明は入力の下に灰色で、間違いは赤い文字で直し方まで書く。スロットの値を v-bind すると id・説明・間違いが入力と結ばれる。 -->
<script setup lang="ts">
import { ArField, ArTextInput, ArSelect, ArTextarea, ArGrid } from "@arrow/ui";
import { ref } from "vue";
const title = ref("朝礼");
const q = ref("");
const repeat = ref<string | number | null>("week");
const store = ref<string | number | null>("all");
const memo = ref("");
const empty = ref("");
const repeats = [
  { value: "week", label: "毎週（曜日を選ぶ）" },
  { value: "month", label: "毎月（日にちを選ぶ）" },
];
const stores = [
  { value: "all", label: "ARROW事業部" },
  { value: "shibuya", label: "渋谷店" },
];
</script>

<template>
<ArGrid :cols="2" :gap="5">
  <ArField label="タイトル" required>
    <template #default="f"><ArTextInput v-model="title" v-bind="f" block /></template>
  </ArField>
  <ArField label="探す">
    <template #default="f"><ArTextInput v-model="q" v-bind="f" type="search" placeholder="名前・社員コードで探す" block /></template>
  </ArField>
  <ArField label="繰り返し方法">
    <template #default="f"><ArSelect v-model="repeat" v-bind="f" :options="repeats" block /></template>
  </ArField>
  <ArField label="店舗">
    <template #default="f"><ArSelect v-model="store" v-bind="f" :options="stores" variant="selbox" icon="store" block /></template>
  </ArField>
  <ArField label="備考" help="従業員にも見えます" style="grid-column: span 2">
    <template #default="f"><ArTextarea v-model="memo" v-bind="f" :rows="2" placeholder="例：本日の売上目標を共有" /></template>
  </ArField>
  <ArField label="タイトル" required error="タイトルを入れてください">
    <template #default="f"><ArTextInput v-model="empty" v-bind="f" block /></template>
  </ArField>
</ArGrid>
</template>
