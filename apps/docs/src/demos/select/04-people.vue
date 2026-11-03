<!-- 人を選ぶ | avatar（頭文字の丸）と description（右の小さな文字）。登録済みの人は disabled で選べない。名前・コードで探せる（keywords）。 -->
<script setup lang="ts">
import { ArSelect } from "@arrow/ui";
import type { ArSelectOption } from "@arrow/ui";
import { ref } from "vue";
const member = ref<string | number | null>(null);
const people: ArSelectOption[] = [
  { value: 1, label: "千速 一真", avatar: "千", keywords: "ちはや かずま S1001", description: "登録済み", disabled: true },
  { value: 2, label: "末永 修也", avatar: "末", avatarColor: "#FCEBDD", avatarInk: "#9A4A12", keywords: "すえなが しゅうや S1002", description: "登録済み", disabled: true },
  { value: 3, label: "新里 匠", avatar: "新", avatarColor: "#E5F4EC", avatarInk: "#226B47", keywords: "にいざと たくみ S1003", description: "登録済み", disabled: true },
  { value: 4, label: "中口 万由香", avatar: "中", avatarColor: "#F3E8F8", avatarInk: "#6E3E8C", keywords: "なかぐち まゆか S1004", description: "希望あり", descriptionTone: "ok" },
  { value: 5, label: "松田 照恵", avatar: "松", avatarColor: "#FBF3D9", avatarInk: "#8A6A00", keywords: "まつだ てるえ S1005", description: "希望あり", descriptionTone: "ok" },
  { value: 6, label: "佐藤 美咲", avatar: "佐", keywords: "さとう みさき S1006" },
  { value: 7, label: "田中 健", avatar: "田", keywords: "たなか けん S1007" },
];
</script>

<template>
<ArSelect v-model="member" :options="people" placeholder="未選択" search-placeholder="名前・コードで検索" label="名前" style="width: 260px" />
</template>
