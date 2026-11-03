<!-- 横の手順 | ページの手順。今はテーマ色、済みは淡い面、エラーは赤（items の status か、今の手順なら status="error"）。 -->
<script setup lang="ts">
import { ArSteps } from "@arrow/ui";
</script>

<template>
<ArSteps
  :current="1"
  :items="[
    { title: '期間と人数', description: '10/1〜10/31' },
    { title: '日ごとの確認', description: '31日' },
    { title: '相手' },
    { title: '送る', description: '2件エラー', status: 'error' },
  ]"
/>
</template>
