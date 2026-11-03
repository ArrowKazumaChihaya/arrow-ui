<!-- 項目の行 | 左に項目名（幅 title-width、既定 200px）、右に入力。補足（info）と「詳細」、必須の印（required）。中の入力とはスロットの値（id・aria-*）で結ぶ。 -->
<script setup lang="ts">
import { ArItem, ArSelect, ArTextInput, ArSwitch } from "@arrow/ui";
import { ref } from "vue";
const round = ref<string | null>("part");
const name = ref("山田 太郎");
const on = ref(true);
const opened = ref(0);
const types = [
  { value: "full", label: "正社員" },
  { value: "part", label: "アルバイト" },
  { value: "pt", label: "パート" },
];
</script>

<template>
<div style="width: 900px; max-width: 100%">
  <ArItem title="打刻の丸め" info="15分単位で丸めます" detail @detail="opened++">
    <template #default="c"><ArSelect v-bind="c" v-model="round" :options="types" null-option placeholder="未選択" style="width: 200px" /></template>
  </ArItem>
  <ArItem title="氏名" required>
    <template #default="c"><ArTextInput v-bind="c" v-model="name" style="width: 200px" /></template>
  </ArItem>
  <ArItem title="有効にする">
    <template #default="c"><ArSwitch :id="c.id" v-model="on" label="有効にする" /></template>
  </ArItem>
</div>
<p class="demo-note">「詳細」を押した回数：{{ opened }}</p>
</template>
