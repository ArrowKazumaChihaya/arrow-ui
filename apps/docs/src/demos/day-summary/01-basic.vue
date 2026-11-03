<!-- 日の要約 | シフト画面の日付の下に置く札の並び。最後の「公開中」は押すと非公開と切り替わる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArDaySummary, ArStack } from "@arrow/ui";
const pub = ref(true);
const off = ref(false);
</script>

<template>
<ArStack :gap="4">
  <ArDaySummary :items="[{ label: '人件費', value: '¥36,300' }]" v-model:published="pub" />
  <ArDaySummary :items="[{ label: '勤怠ロック中', value: '10月31日まで', tone: 'locked', icon: 'lock' }, { label: '人件費', value: '¥31,500' }]" v-model:published="off" />
  <ArDaySummary
    align="start"
    :items="[
      { label: '不足', value: '1名', tone: 'danger' },
      { label: '提出', value: '2名', tone: 'ok' },
      { label: '出勤', value: '4名' },
    ]"
    :published="true"
    publish-disabled
  />
</ArStack>
</template>
