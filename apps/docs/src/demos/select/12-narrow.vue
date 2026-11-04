<!-- 狭い所の長い名前（スマホ 375px） | 画面の幅 375px（左右 16px の余白で中は 343px）の横並び（店舗の選択と「操作」のボタン）に置いても、長い店舗名は「…」で切れて下向きの印に重ならない。製品の UI/Select と同じく、ArSelect をもう1つの箱で包み（$attrs を渡す形）、その箱を横並びの中に置いた形でも同じ。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArSelect } from "@arrow/ui";
const long = "ARROW事業部 東京都渋谷区神南一丁目 第二ビル店（本館・新館）";
const options = [
  { value: 1, label: long },
  { value: 2, label: "渋谷店" },
];
const a = ref<number | null>(1);
const b = ref<number | null>(1);
const c = ref<number | null>(1);
</script>

<template>
<div style="width: 343px; display: flex; flex-direction: column; gap: 12px">
  <div data-case="selbox-row" style="display: flex; gap: 8px; align-items: center">
    <div class="select_component" style="flex: 1">
      <ArSelect v-model="a" variant="selbox" icon="store" block :options="options" label="店舗" />
    </div>
    <ArButton icon="hand" tone="primary">操作</ArButton>
  </div>
  <div data-case="field-row" style="display: flex; gap: 8px; align-items: center">
    <div class="select_component">
      <ArSelect v-model="b" :options="options" label="店舗" style="width: 100%" />
    </div>
    <ArButton tone="secondary">今日</ArButton>
  </div>
  <div data-case="field-120" style="display: flex; gap: 8px; align-items: center">
    <ArSelect v-model="c" :options="options" label="店舗" size="sm" style="width: 120px" />
    <ArSelect v-model="c" variant="selbox" icon="store" :options="options" label="店舗" style="width: 120px" />
  </div>
</div>
</template>
