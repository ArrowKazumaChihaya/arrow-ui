<!-- 折りたたみ | 見出しは bg-2 の地に太字、開くと矢印が下を向く。v-model で開いている key。extra は見出しの右の補足。accordion で1つだけ開く。↑↓ Home End で見出しを移る。 -->
<script setup lang="ts">
import { ArCollapse } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const open = ref(["live"]);
const open2 = ref<string[]>([]);
const items = [
  { key: "live", title: "勤怠ライブ", extra: "出勤中 4名" },
  { key: "gps", title: "位置情報" },
  { key: "more", title: "詳しい設定" },
  { key: "off", title: "使えない項目", disabled: true },
];
</script>

<template>
<div style="display: grid; gap: 20px; max-width: 560px">
  <ArCollapse v-model="open" :items="items">
    <template #panel-live>今日の出勤・休憩中・退勤の人を出します。</template>
    <template #panel-gps>打刻した場所を記録します。</template>
    <template #panel-more>締め日や丸めの設定です。</template>
  </ArCollapse>
  <ArCollapse v-model="open2" :items="items.slice(0, 3)" accordion ghost>
    <template #panel="{ item }">{{ item.title }}の中身（ghost・accordion）</template>
  </ArCollapse>
</div>
</template>
