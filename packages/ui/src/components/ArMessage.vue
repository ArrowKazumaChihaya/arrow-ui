<script setup lang="ts">
/**
 * ArMessage 1.0 — 上の真ん中に短く出る言葉（1つ分）。
 * ふつうは useArMessage() の success・info・warning・error・loading で出し、ArMessageHost が並べる。
 * 元に戻せる操作のあとは ArToast（「元に戻す」つき）を使う。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArMessageProps } from "./ArMessage.contract";

const props = withDefaults(defineProps<ArMessageProps>(), { tone: "info", content: undefined });
const icon = computed<ArIconName | null>(() =>
  props.tone === "loading" ? null : ({ ok: "check", info: "info", warn: "alert", danger: "alert" } as const)[props.tone],
);
</script>

<template>
  <div data-ar="message" data-part="root" :data-tone="tone" :role="tone === 'danger' ? 'alert' : 'status'">
    <span v-if="tone === 'loading'" data-part="spinner" aria-hidden="true" />
    <ArIcon v-else-if="icon" :name="icon" size="sm" data-part="icon" />
    <span data-part="text"><slot>{{ content }}</slot></span>
  </div>
</template>
