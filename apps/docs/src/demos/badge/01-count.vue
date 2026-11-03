<!-- 件数と点 | 子（アイコンのボタン）の右上に重ねる。件数は赤（重要）かテーマ色（tone="accent"）。max を超えると「99+」。dot は数を出さない点。子がなければその場に出す。 -->
<script setup lang="ts">
import { ArBadge, ArButton } from "@arrow/ui";
</script>

<template>
<div style="display: flex; gap: 22px; align-items: center; flex-wrap: wrap">
  <ArBadge :count="5"><ArButton tone="secondary" icon="bell" label="通知" /></ArBadge>
  <ArBadge :count="120"><ArButton tone="secondary" icon="mail" label="メッセージ" /></ArBadge>
  <ArBadge dot><ArButton tone="secondary" icon="todo" label="やることリスト" /></ArBadge>
  <ArBadge :count="3" tone="accent"><ArButton tone="secondary" icon="users" label="勤務可能な人" /></ArBadge>
  <ArBadge :count="0"><ArButton tone="secondary" icon="bell" label="通知（0件は出さない）" /></ArBadge>
  <ArBadge :count="2" tone="accent" />
  <ArBadge :count="12" />
</div>
</template>
