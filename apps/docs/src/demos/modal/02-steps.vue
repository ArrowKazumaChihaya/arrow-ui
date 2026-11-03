<!-- 手順のあるポップアップ（ARROW 特有） | steps と current-step で、いまどこかを見出しの下に出す。 -->
<script setup lang="ts">
import { ArModal, ArButton, ArCluster, ArField, ArDateInput, ArTimeInput, ArStack, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const open = ref(false);
const step = ref(0);
const date = ref<string | null>("2026-10-24");
const start = ref<ArTimeValue>({ time: "10:00", day: "same" });
</script>

<template>
<ArButton tone="primary" icon="plus" @click="(step = 0), (open = true)">イベントを追加…</ArButton>
<ArModal v-model:open="open" title="イベントを追加" :steps="['日時', '対象', '確認']" :current-step="step">
  <ArStack :gap="4">
    <ArField label="日付"><template #default="f"><ArDateInput v-model="date" :id="f.id" /></template></ArField>
    <ArField label="開始"><template #default="f"><ArTimeInput v-model="start" :id="f.id" /></template></ArField>
  </ArStack>
  <template #footer>
    <ArCluster justify="between" :gap="2">
      <ArButton tone="secondary" @click="open = false">キャンセル</ArButton>
      <ArCluster :gap="2">
        <ArButton tone="secondary" :disabled="step === 0" @click="step--">戻る</ArButton>
        <ArButton tone="primary" @click="step < 2 ? step++ : (open = false)">{{ step < 2 ? "次へ" : "追加する" }}</ArButton>
      </ArCluster>
    </ArCluster>
  </template>
</ArModal>
</template>
