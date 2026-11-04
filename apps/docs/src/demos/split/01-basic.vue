<!-- 横に2つ（狭いと縦） | 一覧と詳細、操作盤と本文など。stack-below より狭いと縦に積む。 -->
<script setup lang="ts">
import { ArSplit } from "@s_and_a/arrow-ui";
</script>

<template>
<ArSplit start="sm" :gap="4" stack-below="sm">
  <template #start><div class="demo-box">start（店舗の一覧）</div></template>
  <template #end><div class="demo-box">end（シフトの詳細）</div></template>
</ArSplit>
</template>
