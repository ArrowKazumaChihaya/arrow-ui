<!-- 基本 | 打刻用の QR。点は ink。期限切れ（status="expired"）は白い幕と「作り直す」ボタン（refresh を出す）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCluster, ArQRCode } from "@s_and_a/arrow-ui";
const t = ref(1793000000);
const status = ref<"active" | "expired">("expired");
function refresh() {
  t.value += 60;
  status.value = "active";
  setTimeout(() => (status.value = "expired"), 5000);
}
</script>

<template>
<ArCluster :gap="4">
  <ArQRCode value="https://arrow.example.jp/punch?store=shibuya" label="渋谷店の打刻用QR" />
  <ArQRCode :value="`https://arrow.example.jp/punch?store=shibuya&t=${t}`" :status="status" label="渋谷店の打刻用QR" @refresh="refresh" />
</ArCluster>
</template>
