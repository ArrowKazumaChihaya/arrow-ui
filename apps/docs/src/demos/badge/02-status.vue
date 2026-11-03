<!-- 状態の点 | status で「点＋言葉」。ok＝出勤中、accent＝処理中（淡い輪つき）、warn＝未提出、danger＝エラー、neutral＝退勤。色だけで伝えず、必ず言葉を添える。札にしたいときは ArTag。 -->
<script setup lang="ts">
import { ArBadge } from "@arrow/ui";
</script>

<template>
<div style="display: grid; grid-template-columns: repeat(3, max-content); gap: 12px 28px">
  <ArBadge status="ok" text="出勤中" />
  <ArBadge status="accent" text="処理中" />
  <ArBadge status="neutral" text="退勤" />
  <ArBadge status="warn" text="未提出" />
  <ArBadge status="danger" text="エラー" />
</div>
</template>
