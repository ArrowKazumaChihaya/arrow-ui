<!-- 1つ選ぶ | 押すとプルダウンが開く。選んでいる項目は淡いテーマ色＋チェック。↓↑・Enter・Escape・文字で飛ぶで操作できる。 -->
<script setup lang="ts">
import { ArSelect, ArField, ArGrid } from "@arrow/ui";
import { ref } from "vue";
const repeat = ref<string | number | null>("week");
const role = ref<string | number | null>(null);
const repeats = [
  { value: "none", label: "繰り返さない" },
  { value: "week", label: "毎週（曜日を選ぶ）" },
  { value: "month", label: "毎月（日にちを選ぶ）" },
  { value: "nth", label: "毎月（第何曜日）" },
];
const roles = [
  { value: 1, label: "正社員" },
  { value: 2, label: "アルバイト" },
  { value: 3, label: "パート" },
  { value: 4, label: "役員", disabled: true },
];
</script>

<template>
<ArGrid min-item="md" :gap="5">
  <ArField label="繰り返し方法">
    <template #default="f"><ArSelect v-model="repeat" v-bind="f" :options="repeats" block /></template>
  </ArField>
  <ArField label="雇用形態" help="役員は管理者だけが選べます">
    <template #default="f"><ArSelect v-model="role" v-bind="f" :options="roles" placeholder="未選択" clearable block /></template>
  </ArField>
</ArGrid>
</template>
