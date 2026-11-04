<!-- 縦（ポップアップ） | ラベルが上。rules を渡すと送るときと項目から出たときに確かめ、間違いを項目の下に出す（required なら必須の札も付く）。summary で上に間違いのまとめ。 -->
<script setup lang="ts">
import { ArForm, ArField, ArTextInput, ArSelect, ArTextarea, ArButton, ArCluster } from "@s_and_a/arrow-ui";
import type { ArFormRule } from "@s_and_a/arrow-ui";
import { reactive, ref } from "vue";
const model = reactive({ title: "", store: null as string | number | null, memo: "" });
const rules: Record<string, ArFormRule[]> = {
  title: [{ required: true, message: "タイトルを入れてください" }, { maxLength: 20 }],
  store: [{ required: true, message: "店舗を選んでください" }],
  memo: [{ maxLength: 100 }],
};
const stores = [
  { value: 1, label: "渋谷店" },
  { value: 2, label: "新宿店" },
];
const sent = ref("");
const form = ref<InstanceType<typeof ArForm> | null>(null);
function reset() {
  Object.assign(model, { title: "", store: null, memo: "" });
  form.value?.clearErrors();
}
</script>

<template>
<div style="max-width: 360px">
  <ArForm ref="form" :model="model" :rules="rules" summary @submit="sent = JSON.stringify($event)">
    <ArField label="タイトル" name="title">
      <template #default="f"><ArTextInput v-model="model.title" v-bind="f" block /></template>
    </ArField>
    <ArField label="店舗" name="store">
      <template #default="f"><ArSelect v-model="model.store" v-bind="f" :options="stores" variant="selbox" icon="store" placeholder="未選択" block /></template>
    </ArField>
    <ArField label="備考" name="memo" help="従業員にも見えます">
      <template #default="f"><ArTextarea v-model="model.memo" v-bind="f" :rows="2" placeholder="例：本日の売上目標を共有" /></template>
    </ArField>
    <ArCluster :gap="2" justify="end">
      <ArButton tone="secondary" @click="reset">やめる</ArButton>
      <ArButton type="submit" tone="primary">保存する</ArButton>
    </ArCluster>
  </ArForm>
  <p v-if="sent" style="margin: 8px 0 0; font-size: 12px">送った値：{{ sent }}</p>
</div>
</template>
