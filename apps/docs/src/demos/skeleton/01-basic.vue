<!-- 形 | 読み込み中の形。line-2 の地に淡い光。丸（avatar）と行（rows・widths）、ボタン・入力の形。読み込めたら loading=false で中身を出す。 -->
<script setup lang="ts">
import { ArSkeleton, ArStack, ArCluster } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <ArSkeleton avatar :rows="3" :widths="['40%', '90%', '70%']" />
  <ArCluster :gap="2">
    <ArSkeleton shape="button" />
    <ArSkeleton shape="input" />
    <ArSkeleton shape="avatar" />
  </ArCluster>
  <ArSkeleton shape="block" :active="false" />
</ArStack>
</template>
