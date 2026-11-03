<!-- 二段階認証 | ログインの「メール6桁コード」。1桁ずつの箱に入れ、メールの6桁を1つ目の箱に貼り付けると全部の箱に入る。全部入ると complete。送った直後は resend-in の秒数だけ再送を押せない。classic は今の ARROW と同じ1つの欄。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArField, ArOtpInput } from "@arrow/ui";
const code = ref("482");
const tried = ref(false);
const done = ref("");
</script>

<template>
  <div style="width: 388px; max-width: 100%; display: flex; flex-direction: column; gap: 14px">
    <ArField label="認証コード（6桁）" help="メールの6桁をコピーして1つ目の欄に貼り付けると、全部の欄に入ります。" :error="tried && code.length < 6 ? '認証コードは6桁の数字で入力してください' : undefined">
      <template #default="f"><ArOtpInput v-bind="f" v-model="code" @complete="(v) => (done = v)" /></template>
    </ArField>
    <ArButton tone="primary" block @click="tried = true">認証してログイン</ArButton>
    <p v-if="done" style="margin: 0; font-size: 12.5px">complete：{{ done }}</p>
  </div>
</template>
