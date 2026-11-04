<!-- 状態と桁数 | invalid（間違い）・disabled（押せない）。桁数は length（4桁の暗証番号など）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArOtpInput } from "@s_and_a/arrow-ui";
const a = ref("4821");
const b = ref("482193");
const c = ref("");
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 328px">
    <ArOtpInput v-model="a" invalid />
    <ArOtpInput v-model="b" disabled />
    <ArOtpInput v-model="c" :length="4" label="暗証番号" />
  </div>
</template>
