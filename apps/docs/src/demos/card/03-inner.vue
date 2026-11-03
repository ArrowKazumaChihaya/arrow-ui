<!-- 中の小さなカード | elevated（白・角丸18・影）と outlined（線）は見出しの行・本文・#footer のアイコンの操作を持つ。#cover は上の絵。plain は数字などの小さな線の箱（角丸12）。 -->
<script setup lang="ts">
import { ArButton, ArCard } from "@arrow/ui";
</script>

<template>
<div style="display: grid; gap: 24px">
  <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap">
    <div style="width: 240px">
      <ArCard title="今月の人件費" variant="elevated" :heading-level="3">
        <template #actions><ArButton tone="link" size="sm">詳しく</ArButton></template>
        <b style="font: 700 22px var(--ar-font-family-numeric); color: var(--ar-color-text)">¥1,284,500</b><br />前月より 3.2% 少ない
        <template #footer>
          <ArButton tone="muted" icon="pen" label="変更" />
          <ArButton tone="muted" icon="sheet" label="書き出す" />
          <ArButton tone="muted" icon="more" label="その他" />
        </template>
      </ArCard>
    </div>
    <div style="width: 200px">
      <ArCard variant="outlined">
        <template #cover><span /></template>
        <b style="color: var(--ar-color-text)">Card.Meta</b><br />cover つき
      </ArCard>
    </div>
    <div style="width: 240px">
      <ArCard title="勤怠の締め" icon="lock" variant="outlined" size="sm" :heading-level="3">毎月20日に締めます。</ArCard>
    </div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 180px)); gap: 8px">
    <ArCard title="提出済み" variant="plain" :heading-level="4"><b style="font-size: 18px">3</b><small style="font-size: 12px; font-weight: 700">/5名</small></ArCard>
    <ArCard title="未提出" variant="plain" :heading-level="4"><b style="font-size: 18px; color: var(--ar-color-warn)">2<small style="font-size: 12px">名</small></b></ArCard>
    <ArCard title="人数が足りない日" variant="plain" :heading-level="4"><b style="font-size: 18px; color: var(--ar-color-danger-ink)">4<small style="font-size: 12px">日</small></b></ArCard>
  </div>
</div>
</template>
