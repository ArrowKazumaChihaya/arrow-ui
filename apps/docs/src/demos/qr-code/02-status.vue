<!-- 状態・大きさ・強さ | status は active・expired・loading・scanned。size で大きさ（px）、level で誤り訂正の強さ（L・M・Q・H）。bordered=false で枠なし。テーマ色は作っている途中の印だけ。 -->
<script setup lang="ts">
import { ArCluster, ArQRCode } from "@arrow/ui";
const url = "https://arrow.example.jp/punch?store=shinjuku";
</script>

<template>
<ArCluster :gap="4" align="end">
  <ArQRCode :value="url" status="loading" />
  <ArQRCode :value="url" status="scanned" />
  <ArQRCode :value="url" :size="80" level="L" />
  <ArQRCode :value="url" :size="160" level="H" :bordered="false" />
</ArCluster>
</template>
