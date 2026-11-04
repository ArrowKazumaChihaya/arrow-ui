<!-- フリガナつきの氏名 | 名前の上に小さくフリガナ。スマホの幅（768px 以下）と inline では「名前（フリガナ）」の1行。 -->
<script setup lang="ts">
import { ArKanaText, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="5" style="padding-top: 14px">
  <ArKanaText name="千速 一真" kana="チハヤ カズマ" />
  <ArKanaText>中口 万由香<template #kana>ナカグチ マユカ</template></ArKanaText>
  <ArKanaText name="松田 照恵" kana="マツダ テルエ" layout="inline" />
  <ArKanaText name="フリガナなし 太郎" />
</ArStack>
</template>
