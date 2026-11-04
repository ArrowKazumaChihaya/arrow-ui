<!-- 前後のアイコン・文字 | icon・prefix は頭に、suffix・suffixIcon は後ろに出す（アイコンは15px）。addon-before・addon-after は区切った灰色の地の文字。 -->
<script setup lang="ts">
import { ArTextInput, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const name = ref("");
const wage = ref("1200");
const site = ref("arrow-payment.com");
const minutes = ref("15");
</script>

<template>
<ArStack :gap="3">
  <ArTextInput v-model="name" icon="user" suffix-icon="info" placeholder="氏名" label="氏名" block />
  <ArTextInput v-model="wage" prefix="¥" suffix="円" inputmode="numeric" label="時給" />
  <ArTextInput v-model="site" addon-before="https://" addon-after=".jp" label="サイト" block />
  <ArTextInput v-model="minutes" suffix="分" inputmode="numeric" label="休憩" style="width: 120px" />
</ArStack>
</template>
