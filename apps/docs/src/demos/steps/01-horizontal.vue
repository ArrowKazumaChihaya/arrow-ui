<!-- 横の手順 | ページの手順。今はテーマ色、済みは淡い面、エラーは赤（items の status か、今の手順なら status="error"）。幅が足りないとき（手順1つあたり 150px 未満）は、名前と数字が重ならないよう縦の並びに切り替わる（responsive。false で切り替えない）。 -->
<script setup lang="ts">
import { ArSteps } from "@s_and_a/arrow-ui";
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
