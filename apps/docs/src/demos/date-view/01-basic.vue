<!-- 日付の表示 | 「11月05日(木)」の形。曜日は日曜・祝日（holiday）が赤、土曜が青、ほかは灰色。format="auto"（既定）は幅 499px 以下の画面で「11/05(木)」。long・short で固定もできる。 -->
<script setup lang="ts">
import { ArDateView } from "@arrow/ui";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 14px 28px; align-items: center">
    <ArDateView date="2026-11-05" />
    <ArDateView date="2026-11-07" />
    <ArDateView date="2026-11-08" />
    <ArDateView date="2026-11-03" holiday />
    <ArDateView date="2026-11-05" format="short" />
    <ArDateView :date="new Date(2026, 11, 24)" format="long" />
  </div>
</template>
