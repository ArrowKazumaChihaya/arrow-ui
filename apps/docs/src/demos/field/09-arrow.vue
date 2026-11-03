<!-- 今の ARROW の使い方 | 今の ARROW の FormItem と同じ：必須の赤い「*」、間違いは入力の赤い枠と下の赤い文字。 -->
<script setup lang="ts">
import { ArField, ArTextInput } from "@arrow/ui";
import { ref } from "vue";
const mail = ref("abc");
</script>

<template>
<div style="width: 600px; max-width: 100%">
  <ArField label="メール" layout="inline" label-width="25%" required error="形式が正しくありません">
    <template #default="c"><ArTextInput v-bind="c" v-model="mail" style="width: 242px" /></template>
  </ArField>
</div>
</template>
