<!-- ラベルを横に（設定の画面） | layout="inline" でラベルを左（120px・右寄せ・13.5px）に置く。label-size で 88px・168px にも。ラベルは入力（と間違い・説明）の縦の真ん中にそろう。 -->
<script setup lang="ts">
import { ArField, ArTextInput, ArSelect, ArTextarea, ArStack } from "@arrow/ui";
import { ref } from "vue";
const a = ref("朝礼");
const store = ref<string | number | null>("shibuya");
const b = ref("");
const memo = ref("");
const stores = [{ value: "shibuya", label: "渋谷店" }, { value: "shinjuku", label: "新宿店" }];
</script>

<template>
<ArStack :gap="4">
  <ArField label="タイトル" layout="inline" required>
    <template #default="f"><ArTextInput v-model="a" v-bind="f" block /></template>
  </ArField>
  <ArField label="店舗" layout="inline">
    <template #default="f"><ArSelect v-model="store" v-bind="f" :options="stores" variant="selbox" icon="store" block /></template>
  </ArField>
  <ArField label="電話番号" layout="inline" error="電話番号は 03-0000-0000 の形で入れてください">
    <template #default="f"><ArTextInput v-model="b" v-bind="f" inputmode="tel" placeholder="03-0000-0000" block /></template>
  </ArField>
  <ArField label="メモ" layout="inline" help="従業員にも見えます">
    <template #default="f"><ArTextarea v-model="memo" v-bind="f" :rows="2" placeholder="例：本日の売上目標を共有" /></template>
  </ArField>
</ArStack>
</template>
