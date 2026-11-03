<!-- 縦に並べる | gap は余白の段階（0〜8）だけを受け取る。px は書かない。 -->
<script setup lang="ts">
import { ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <div class="demo-box">1</div>
  <div class="demo-box">2</div>
  <div class="demo-box">3</div>
</ArStack>
</template>
