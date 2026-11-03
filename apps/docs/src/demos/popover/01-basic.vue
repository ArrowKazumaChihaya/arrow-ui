<!-- 基本 | 押すと開く白い吹き出し。見出し（title）・中身（content）・操作（footer slot）。外を押す・Escape で閉じ、押した場所へフォーカスを戻す。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArPopover } from "@arrow/ui";
</script>

<template>
<ArCluster :gap="3" align="center" wrap="wrap">
  <ArPopover title="10月21日（水）の不足" content="13:00〜17:00 に1名足りません。">
    <ArButton tone="danger-subtle" size="sm">不足1</ArButton>
    <template #footer="{ close }">
      <ArButton tone="subtle" size="sm" @click="close">勤務可能な人を見る</ArButton>
    </template>
  </ArPopover>
  <ArPopover title="打刻の位置" placement="bottom">
    <ArButton tone="secondary" size="sm" icon="pin">位置情報</ArButton>
    <template #content>渋谷店から 32m の場所で打刻しました。<br>精度 ±12m</template>
  </ArPopover>
  <ArPopover label="メモ" content="見出しのない吹き出し。読み上げの名前は label で付ける。" placement="bottom">
    <ArButton tone="secondary" size="sm" icon="note">メモ</ArButton>
  </ArPopover>
</ArCluster>
</template>
