<!-- 横（設定の画面） | layout="inline" でラベルを左（120px・右寄せ）に。validator で自分で確かめる（終了は開始より後、など）。 -->
<script setup lang="ts">
import { ArForm, ArField, ArTextInput, ArInputNumber, ArStepper, ArButton } from "@s_and_a/arrow-ui";
import type { ArFormRule } from "@s_and_a/arrow-ui";
import { reactive } from "vue";
const model = reactive({ name: "渋谷店", wage: 1100 as number | null, people: 2, phone: "03-1234" });
const rules: Record<string, ArFormRule[]> = {
  name: [{ required: true }],
  wage: [{ required: true }, { min: 1163, message: "時給は東京都の最低賃金（1,163円）以上にしてください" }],
  people: [{ validator: (v) => (Number(v) > 10 ? "1日の募集は10人までにしてください" : true) }],
  phone: [{ pattern: /^\d{2,4}-\d{2,4}-\d{3,4}$/, message: "電話番号は 03-0000-0000 の形で入れてください" }],
};
</script>

<template>
<ArForm :model="model" :rules="rules" layout="inline" validate-on="change" style="max-width: 560px">
  <ArField label="店舗名" name="name">
    <template #default="f"><ArTextInput v-model="model.name" v-bind="f" block /></template>
  </ArField>
  <ArField label="時給" name="wage">
    <template #default="f"><ArInputNumber v-model="model.wage" v-bind="f" prefix="¥" :step="10" /></template>
  </ArField>
  <ArField label="募集人数" name="people">
    <template #default="f"><ArStepper v-model="model.people" v-bind="f" variant="split" :min="1" unit="人" /></template>
  </ArField>
  <ArField label="電話番号" name="phone">
    <template #default="f"><ArTextInput v-model="model.phone" v-bind="f" inputmode="tel" placeholder="03-0000-0000" block /></template>
  </ArField>
  <ArField label="">
    <template #default><ArButton type="submit" tone="primary">保存する</ArButton></template>
  </ArField>
</ArForm>
</template>
