<!-- 種類 | 上の真ん中に短く出る白い札。ok は緑のチェック、info はテーマ色、warn は橙、danger は赤、loading は回る輪。 -->
<script setup lang="ts">
import { ArMessage, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3" align="start">
  <ArMessage tone="ok" content="シフトを保存しました" />
  <ArMessage tone="info" content="公開期間設定を開きます" />
  <ArMessage tone="warn" content="ロック中の日は変更できません" />
  <ArMessage tone="danger" content="保存できませんでした" />
  <ArMessage tone="loading" content="送っています…" />
</ArStack>
</template>
