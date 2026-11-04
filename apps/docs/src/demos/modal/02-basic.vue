<!-- 開く・閉じる | ok-text を渡すと足に「キャンセル」と主なボタンが出る。開くと中の最初の入力にフォーカスし、Esc・× で閉じる。幕を押して閉じるのは close-on-scrim のときだけ。 -->
<script setup lang="ts">
import { ArModal, ArButton, ArField, ArTextInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const open = ref(false);
const name = ref("");
</script>

<template>
<ArButton tone="primary" icon="plus" @click="open = true">パターンを追加…</ArButton>
<ArModal
  v-model:open="open"
  title="パターンを追加"
  description="よく使う勤務時間を登録します。"
  size="sm"
  ok-text="追加する"
  :ok-disabled="!name"
  @ok="open = false"
>
  <ArField label="名前" required v-slot="f"><ArTextInput v-model="name" :id="f.id" placeholder="例：早番" /></ArField>
</ArModal>
</template>
