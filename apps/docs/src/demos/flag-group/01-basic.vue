<!-- ビットのチェック | 曜日などをビットの合計の1つの数で受け渡す。allowed で出す項目を絞れる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArFlagGroup, ArStack } from "@s_and_a/arrow-ui";
const week = [
  { value: 1, label: "日" },
  { value: 2, label: "月" },
  { value: 4, label: "火" },
  { value: 8, label: "水" },
  { value: 16, label: "木" },
  { value: 32, label: "金" },
  { value: 64, label: "土" },
];
const v = ref<number | null>(2 + 8 + 32);
const over = ref<number | null>(1);
</script>

<template>
<ArStack :gap="5">
  <ArStack :gap="2">
    <ArFlagGroup v-model="v" :options="week" label="勤務する曜日" />
    <div style="font-size: 12px">値：{{ v }}</div>
  </ArStack>
  <ArFlagGroup v-model="v" :options="week" :allowed="2 + 4 + 8 + 16 + 32" label="平日だけ" />
  <ArFlagGroup
    v-model="over"
    vertical
    :options="[
      { value: 1, label: '1日8時間を超えた分' },
      { value: 2, label: '週40時間を超えた分' },
      { value: 4, label: '深夜（22時〜5時）', disabled: true },
    ]"
    label="残業の扱い"
  />
  <ArFlagGroup :model-value="10" :options="week" disabled label="使えない" />
</ArStack>
</template>
