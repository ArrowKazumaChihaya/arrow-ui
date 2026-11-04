<!-- コピー・「…」で切る | copyable はテーマ色のコピーアイコン（押すとチェックに変わる）。ellipsis は幅に収まらない文を「…」で切り、全文は吹き出しで出す。 -->
<script setup lang="ts">
import { ArText, ArStack, ArParagraph } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3" align="start">
  <ArParagraph>社員コード <ArText copyable>A-1024</ArText>　<ArText type="muted" size="sm">長い文は「…」で切り、全文は吹き出しで出す（ellipsis）。</ArText></ArParagraph>
  <ArText copyable="https://arrow.example.jp/s/A-1024" type="secondary">共有のリンクをコピー</ArText>
  <ArText ellipsis style="width: 240px">午後は通院のため早めに上がりたいです。夕方からは別の人に入ってもらえると助かります。</ArText>
</ArStack>
</template>
