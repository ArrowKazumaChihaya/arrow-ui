<!-- スマホ・画面の下に貼りつける | size="sm" は件数と小さな「取り消す」「保存」だけ。sticky でスクロールしても画面の下に残る。 -->
<script setup lang="ts">
import { ArSaveBar } from "@s_and_a/arrow-ui";
</script>

<template>
<div style="width: 370px; max-width: 100%; height: 220px; overflow: auto; border-radius: 16px; background: #EEF2F6; padding: 0 10px">
  <div v-for="n in 8" :key="n" style="padding: 12px 4px; font-size: 13px; border-bottom: 1px solid #E6EBF0">設定の項目 {{ n }}</div>
  <ArSaveBar :count="2" size="sm" sticky style="bottom: 10px" />
</div>
</template>
