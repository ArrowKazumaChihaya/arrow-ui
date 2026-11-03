<!-- 形 | 白・角丸18・後ろの幕。頭（題18px太字＋1行の説明＋右の閉じる）、頭の下に手順、中身（まとまりの間は16px）、足（右にキャンセルと主なボタン）。contained で親の中に出せる。 -->
<script setup lang="ts">
import { ArModal, ArField, ArTextInput, ArDateInput, ArTimeInput, ArCluster, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const open = ref(true);
const title = ref("朝礼");
const date = ref<string | null>("2026-10-23");
const start = ref<ArTimeValue>({ time: "09:00", day: "same" });
const end = ref<ArTimeValue>({ time: "09:15", day: "same" });
</script>

<template>
<div style="position: relative; height: 520px; background: #E4E9EF; overflow: hidden; border-radius: 8px">
  <ArModal
    v-model:open="open"
    contained
    title="イベントを追加"
    description="カレンダーに表示する予定です。シフトの時間には含みません。"
    :steps="['内容', '確認']"
    :current-step="0"
    ok-text="追加する"
    @ok="open = false"
    @close="open = true"
  >
    <ArField label="タイトル" required v-slot="f"><ArTextInput v-model="title" :id="f.id" block /></ArField>
    <ArField label="日付" v-slot="f"><ArDateInput v-model="date" :id="f.id" /></ArField>
    <ArField label="時間" v-slot="f">
      <ArCluster :gap="2"><ArTimeInput v-model="start" :id="f.id" /><span style="color: #A3AEB9">〜</span><ArTimeInput v-model="end" /></ArCluster>
    </ArField>
  </ArModal>
</div>
</template>
