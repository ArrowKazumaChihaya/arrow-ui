<script setup lang="ts">
/** ArMobileHeader 1.0 — スマホの画面の頭。左にロゴ（slot）、右にお知らせのボタンと件数の丸。下端にテーマ色の線。 */
import ArIcon from "./ArIcon.vue";
import type { ArMobileHeaderProps } from "./ArMobileHeader.contract";

withDefaults(defineProps<ArMobileHeaderProps>(), { count: 0, noticeLabel: "お知らせ", icon: "speaker", hideNotice: false, labels: () => ({ count: "件" }) });
const emit = defineEmits<{ notice: [] }>();
</script>

<template>
  <header data-ar="mobile-header" data-part="root">
    <span data-part="logo"><slot name="logo" /></span>
    <span v-if="$slots.actions" data-part="actions"><slot name="actions" /></span>
    <button
      v-if="!hideNotice"
      type="button"
      data-part="notice"
      :data-state="count ? 'has-count' : 'empty'"
      :aria-label="count ? `${noticeLabel} ${count}${labels.count}` : noticeLabel"
      :title="noticeLabel"
      @click="emit('notice')"
    >
      <ArIcon :name="icon" size="lg" />
      <span v-if="count" data-part="count" aria-hidden="true">{{ count > 99 ? "99+" : count }}</span>
    </button>
  </header>
</template>
