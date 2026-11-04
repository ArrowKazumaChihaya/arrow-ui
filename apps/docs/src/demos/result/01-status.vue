<!-- 種類 | 大きな印（意味の色の淡い丸）＋見出し＋説明＋次の一手（default slot のボタン）。見つからないページは status="404" で大きな数。 -->
<script setup lang="ts">
import { ArResult, ArButton, ArGrid } from "@s_and_a/arrow-ui";
</script>

<template>
<ArGrid :columns="3" :gap="2">
  <ArResult status="success" title="5名に送りました" description="提出のしめきりは 10月25日（日）です。">
    <ArButton>閉じる</ArButton>
    <ArButton tone="primary">提出状況を見る</ArButton>
  </ArResult>
  <ArResult status="error" title="取り込めませんでした" description="2行にエラーがあります。">
    <ArButton tone="subtle">エラーを見る</ArButton>
  </ArResult>
  <ArResult status="404" title="ページが見つかりません">
    <ArButton tone="primary">シフトに戻る</ArButton>
  </ArResult>
  <ArResult status="info" title="まだ募集していません" description="募集を始めると、ここに提出状況が出ます。" />
  <ArResult status="warning" title="未提出の人がいます" description="しめきりまでに知らせてください。" />
  <ArResult status="403" title="このページを見る権限がありません" />
</ArGrid>
</template>
