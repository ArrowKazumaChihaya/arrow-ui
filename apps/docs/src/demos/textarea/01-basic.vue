<!-- 基本・文字数 | 備考やメモに使う。show-count と maxlength で右下に「10 / 200」。右下のつまみで高さを変えられる。 -->
<script setup lang="ts">
import { ArTextarea, ArField, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const memo = ref("本日の売上目標を共有");
const note = ref("");
</script>

<template>
<ArStack :gap="5">
  <ArField label="備考">
    <template #default="f"><ArTextarea v-model="note" v-bind="f" :rows="2" placeholder="例：本日の売上目標を共有" /></template>
  </ArField>
  <ArField label="メモ" help="従業員にも見えます">
    <template #default="f"><ArTextarea v-model="memo" v-bind="f" :rows="2" :maxlength="200" show-count /></template>
  </ArField>
</ArStack>
</template>
