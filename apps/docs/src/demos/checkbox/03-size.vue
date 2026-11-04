<!-- 大きさと形（sm・md・lg ／ plain・card） | 四角はラジオの丸と同じ段（sm 16・md 18・lg 18）。card はラジオの card と同じ面（年末調整の「メールを送る」など）。使い分け：sm＝設定の行・表の上、md＝ふつう、lg＝年末調整・スマホ（説明の文を入れる）。 -->
<script setup lang="ts">
import { ArCheckbox, ArSelect } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const a = ref(true);
const b = ref(false);
const mail = ref(true);
const s = ref<string | number | null>("all");
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <ArCheckbox v-model="a" :size="z">シフト</ArCheckbox>
      <ArCheckbox v-model="b" :size="z">勤怠</ArCheckbox>
      <ArCheckbox :model-value="false" indeterminate :size="z">一部</ArCheckbox>
      <ArCheckbox v-model="a" variant="card" :size="z">店舗管理者</ArCheckbox>
      <ArCheckbox v-model="b" variant="card" :size="z">一般</ArCheckbox>
      <ArSelect v-model="s" :size="z" :options="[{ value: 'all', label: '全店舗' }]" label="店舗" style="width: 120px" />
    </div>
  </template>
  <small>lg 説明つき</small>
  <div style="max-width: 576px">
    <ArCheckbox
      v-model="mail"
      variant="card"
      size="lg"
      description="※年末調整開始後に「操作」ボタンから送信することもできます。"
    >従業員に年末調整回答依頼のメールやアプリ通知を送信する</ArCheckbox>
  </div>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 70px 1fr; gap: 14px 12px; align-items: center; }
.r { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
