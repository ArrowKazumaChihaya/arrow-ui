<!-- 大きさ・形・アイコンだけ | xs 28（表の行の中の小さな操作）・sm 30・md 34・lg 42。アイコンだけのボタンは label で読み上げの名前を付ける。shape は round（両端が丸い）と circle（丸）。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="4">
  <ArCluster :gap="3" align="center">
    <ArButton tone="subtle" size="xs" icon="plus">シフトに入れる</ArButton>
    <ArButton tone="subtle" size="xs" icon="plus" disabled>登録済み</ArButton>
    <ArButton tone="primary" size="sm">小さい</ArButton>
    <ArButton tone="primary">ふつう</ArButton>
    <ArButton tone="primary" size="lg">大きい</ArButton>
    <ArButton tone="secondary" size="sm" icon="print">印刷</ArButton>
    <ArButton tone="secondary" icon="print">印刷</ArButton>
    <ArButton tone="secondary" size="lg" icon="print">印刷</ArButton>
  </ArCluster>
  <ArCluster :gap="3" align="center">
    <ArButton tone="muted" icon="pen" label="変更" />
    <ArButton tone="danger-ghost" icon="trash" label="削除" />
    <ArButton tone="secondary" icon="more" label="その他の操作" size="sm" />
    <ArButton tone="secondary" icon="more" label="その他の操作" />
    <ArButton tone="secondary" icon="more" label="その他の操作" size="lg" />
    <ArButton tone="primary" shape="round">丸い</ArButton>
    <ArButton tone="secondary" shape="circle" icon="search" label="探す" />
    <ArButton tone="primary" shape="circle" icon="plus" label="追加" />
    <ArButton tone="primary" icon-end="cd">操作</ArButton>
  </ArCluster>
</ArStack>
</template>
