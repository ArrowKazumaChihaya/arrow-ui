<!-- 種類 | 画面の中に置くお知らせ。消えないもの（ロック中など）に使う。 -->
<script setup lang="ts">
import { ArAlert, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="2">
  <ArAlert tone="info">曜日とパターンで決めた時間と人数は、次のページで1日ごとに確認・編集できます。</ArAlert>
  <ArAlert tone="ok" title="取り込みました" closable>32件のシフトを登録しました。</ArAlert>
  <ArAlert tone="warn" title="勤怠ロック中">10月20日までの勤怠はロックされています。</ArAlert>
  <ArAlert tone="danger">エラーの2行は取り込まれません。</ArAlert>
</ArStack>
</template>
