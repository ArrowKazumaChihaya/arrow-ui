<!-- PC の画面の足 | 左にリンク、右に問い合わせのボタン、下に著作権。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArAppFooter } from "@s_and_a/arrow-ui";
const last = ref("");
</script>

<template>
<div style="margin: -24px; overflow-x: auto">
  <div style="min-width: 1100px">
    <ArAppFooter
      :links="[
        { key: 'guide', label: 'ご利用ガイド' },
        { key: 'terms', label: '利用規約' },
        { key: 'law', label: '特定商取引法' },
        { key: 'movie', label: '操作説明動画' },
        { key: 'help', label: 'ヘルプ', href: 'https://helpcenter.arrow-payment.com' },
      ]"
      :supports="[
        { key: 'bug', label: '問題報告・ご意見', icon: 'bug' },
        { key: 'tel', label: '03-5656-8348', icon: 'phone' },
        { key: 'contact', label: 'お問い合わせ', icon: 'mail' },
      ]"
      copyright="Copyright ©2019 S&A Co.,Ltd All rights reserved."
      @select="(k, e) => { if (k !== 'help') { e.preventDefault(); last = k; } }"
    />
    <p style="margin: 8px 24px 16px; font-size: 12px">押したもの：{{ last || "—" }}</p>
  </div>
</div>
</template>
