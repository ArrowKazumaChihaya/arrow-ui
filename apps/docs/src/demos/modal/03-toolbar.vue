<!-- 手順と切り替え・戻る | 頭の下の行に、左は #toolbar（切り替えなど）、右は手順（.stpr）。終わった手順は緑のチェック。足の左に「戻る」、主なボタンの左に補足の文字（footer-note-align="end"）。 -->
<script setup lang="ts">
import { ArModal, ArButton, ArSegmented } from "@arrow/ui";
import { computed, ref } from "vue";
const open = ref(false);
const step = ref(1);
const mode = ref("week");
const steps = ["対象", "曜日と時間", "確認"];
const note = computed(() => (step.value === 1 ? "「日付に当てはめる」を押してください" : undefined));
</script>

<template>
<ArButton tone="primary" icon="layers" @click="(step = 1), (open = true)">シフト一括登録…</ArButton>
<ArModal
  v-model:open="open"
  size="xl"
  title="シフト一括登録"
  description="曜日ごとに決まりを作って、選んだ人の1か月分のシフト・勤怠・休憩をまとめて作ります。"
  :steps="steps"
  v-model:current-step="step"
  steps-clickable
  :back-text="step > 0 ? '戻る' : undefined"
  :footer-note="note"
  footer-note-align="end"
  :ok-text="step < 2 ? '次へ' : '登録する'"
  cancel-text=""
  @back="step--"
  @ok="step < 2 ? step++ : (open = false)"
>
  <template #toolbar>
    <ArSegmented v-model="mode" label="作り方" :options="[{ value: 'week', label: '曜日で指定' }, { value: 'tpl', label: 'テンプレートから' }, { value: 'con', label: '雇用契約から' }]" />
  </template>
  <p style="margin: 0">手順 {{ step + 1 }}：{{ steps[step] }}</p>
</ArModal>
</template>
