<!-- 今の ARROW の使い方 | 今の ARROW の Form と同じ：ラベルが左（幅 25%＝label-col 6/24・右寄せ・後ろに「:」）、入力が右。 -->
<script setup lang="ts">
import { ArForm, ArField, ArTextInput, ArSelect } from "@s_and_a/arrow-ui";
import { reactive } from "vue";
const model = reactive({ name: "山田 太郎", type: "part" as string | null });
const types = [
  { value: "full", label: "正社員" },
  { value: "part", label: "アルバイト" },
];
</script>

<template>
<div style="width: 600px; max-width: 100%">
  <ArForm :model="model" layout="inline" label-width="25%">
    <ArField label="氏名" name="name"><template #default="c"><ArTextInput v-bind="c" v-model="model.name" style="width: 242px" /></template></ArField>
    <ArField label="雇用形態" name="type"><template #default="c"><ArSelect v-bind="c" v-model="model.type" :options="types" block /></template></ArField>
  </ArForm>
</div>
</template>
