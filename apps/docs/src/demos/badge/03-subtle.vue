<!-- 文字の横の件数・白い縁 | 件数の丸はライブラリでこれ1つ。お知らせ・やること・メニューの赤はデザインシステムの count の赤（#DC2525。ボタン・間違いの赤とは別）。タブ・切り替え・札・表示内容の中の件数は variant="subtle"（淡い地）。アイコンに重ねるときは白い 2px の縁（ring。子に重ねると既定で付く）。count には「3/10」のような文字も渡せる。高さはどれも 18・角丸9。「4名」のような件数の札（22）は ArTag の shape="pill"。 -->
<script setup lang="ts">
import { ArBadge, ArTag } from "@s_and_a/arrow-ui";
</script>

<template>
<div style="display: grid; gap: 14px">
  <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap">
    <ArBadge :count="3" />
    <ArBadge :count="3" tone="accent" />
    <ArBadge :count="3" tone="warn" />
    <ArBadge :count="3" tone="neutral" />
    <span style="width: 12px" />
    <ArBadge :count="8" tone="accent" variant="subtle" label="" />
    <ArBadge :count="2" tone="danger" variant="subtle" label="" />
    <ArBadge :count="1" tone="warn" variant="subtle" label="" />
    <ArBadge :count="0" tone="neutral" variant="subtle" show-zero label="" />
    <ArBadge count="5/7" tone="accent" variant="subtle" label="" />
  </div>
  <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap">
    <ArBadge :count="12" ring />
    <ArBadge :count="12" tone="accent" ring />
    <span style="width: 12px" />
    <ArTag shape="pill" tone="accent" count>4名</ArTag>
    <ArTag shape="pill" tone="warn" count>未保存の変更 3件</ArTag>
  </div>
</div>
</template>
