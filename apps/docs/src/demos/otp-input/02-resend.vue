<!-- 再送までの秒数 | resendable で下に「認証コードを再送」。resend-in（送った直後の待ち秒数）を数え、0 になると押せる。押すと resend を出し、cooldown 秒また待つ。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArOtpInput } from "@s_and_a/arrow-ui";
const a = ref("");
const b = ref("");
const sent = ref(0);
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start">
    <div style="width: 328px"><ArOtpInput v-model="a" resendable :resend-in="45" @resend="sent++" /></div>
    <div style="width: 328px"><ArOtpInput v-model="b" resendable :cooldown="30" @resend="sent++" /></div>
    <span style="font-size: 12.5px">再送した回数：{{ sent }}</span>
  </div>
</template>
