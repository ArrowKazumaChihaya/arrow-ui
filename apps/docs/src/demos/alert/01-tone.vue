<!-- 種類 | info はテーマ色の淡い面、ok・warn・danger は意味の色。先頭にアイコン、言葉は1〜2行で直し方まで書く。 -->
<script setup lang="ts">
import { ArAlert, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3">
  <ArAlert tone="info">曜日とパターンで決めた時間と人数は、<b>次のページで1日ごとに確認・編集できます</b>。</ArAlert>
  <ArAlert tone="ok" title="取り込みました" closable>32件のシフトを登録しました。</ArAlert>
  <ArAlert tone="warn">勤怠ロック中の日は登録されません。</ArAlert>
  <ArAlert tone="danger">エラーの2行は取り込まれません。<a href="#">エラーを見る</a></ArAlert>
</ArStack>
</template>
