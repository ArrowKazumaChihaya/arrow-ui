<!-- 回る輪・中身の上 | テーマ色の回る輪（sm 16・md 30・lg 40）。中身を包むと、読み込み中は白い幕と輪と言葉を重ね、中身は押せない。 -->
<script setup lang="ts">
import { ArSpin, ArCluster } from "@s_and_a/arrow-ui";
</script>

<template>
<ArCluster :gap="5" align="center">
  <ArSpin size="sm" />
  <ArSpin />
  <ArSpin size="lg" />
  <ArSpin tip="読み込み中">
    <div style="width: 220px; height: 90px; border-radius: 12px; box-shadow: inset 0 0 0 1px #E6EBF0; padding: 10px; box-sizing: border-box; font-size: 12px; color: #66727F">表の中身</div>
  </ArSpin>
</ArCluster>
</template>
