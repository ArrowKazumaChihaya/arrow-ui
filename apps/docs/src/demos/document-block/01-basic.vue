<!-- 書類の流れ | 書類の申請・確認の手順を上から順に並べる。2つ目からは arrow で上に「下へ進む」矢印を出す（既定で出る。最初のまとまりは :arrow="false"）。instruction は枠の見出し、中身は slot。 -->
<script setup lang="ts">
import { ArButton, ArDocumentBlock } from "@s_and_a/arrow-ui";
</script>

<template>
  <div style="max-width: 640px">
    <ArDocumentBlock :arrow="false" instruction="帳票を選んでください">
      <p style="margin: 0; padding: 10px">扶養控除等（異動）申告書</p>
    </ArDocumentBlock>
    <ArDocumentBlock instruction="提出された書類を確認してください">
      <p style="margin: 0; padding: 10px">提出 12件・未提出 3件</p>
      <div style="display: flex; justify-content: center; padding: 0 10px 10px"><ArButton tone="primary">確認する</ArButton></div>
    </ArDocumentBlock>
  </div>
</template>
