<script setup lang="ts">
/**
 * ArQRCode 1.0 — QR コード（打刻用など）。点は ink、期限切れは白い幕と「作り直す」ボタン。
 * QR は中で作る（外の部品に頼らない。UTF-8・型番 1〜40・誤り訂正 L/M/Q/H）。
 */
import { computed } from "vue";
import ArButton from "./ArButton.vue";
import { encodeQr, qrPath } from "../internal/qrcode";
import type { ArQRCodeProps } from "./ArQRCode.contract";

const props = withDefaults(defineProps<ArQRCodeProps>(), {
  size: 120,
  level: "M",
  status: "active",
  bordered: true,
  label: "QRコード",
  labels: () => ({ expired: "期限切れ", refresh: "作り直す", loading: "作っています", scanned: "読み取りました", tooLong: "QR に入りきりません" }),
});
const emit = defineEmits<{ refresh: [] }>();

const qr = computed(() => {
  try {
    return encodeQr(props.value, props.level);
  } catch {
    return null;
  }
});
const path = computed(() => (qr.value ? qrPath(qr.value) : ""));
</script>

<template>
  <div
    data-ar="qr-code"
    data-part="root"
    :data-state="status === 'active' ? undefined : status"
    :data-bordered="bordered || undefined"
    :style="{ '--ar-qr-size': `${size}px` }"
  >
    <svg
      v-if="qr"
      data-part="code"
      :viewBox="`0 0 ${qr.size} ${qr.size}`"
      shape-rendering="crispEdges"
      role="img"
      :aria-label="label"
    >
      <path :d="path" fill="currentColor" />
    </svg>
    <div v-else data-part="message" role="alert">{{ labels.tooLong }}</div>
    <div v-if="status !== 'active'" data-part="overlay" role="status">
      <template v-if="status === 'expired'">
        <span data-part="message">{{ labels.expired }}</span>
        <ArButton tone="subtle" size="sm" icon="reload" data-part="refresh" @click="emit('refresh')">{{ labels.refresh }}</ArButton>
      </template>
      <template v-else-if="status === 'loading'">
        <span data-part="spinner" aria-hidden="true" />
        <span data-part="message">{{ labels.loading }}</span>
      </template>
      <span v-else data-part="message">{{ labels.scanned }}</span>
    </div>
  </div>
</template>
