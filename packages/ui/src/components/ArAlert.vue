<script setup lang="ts">
/**
 * ArAlert 1.1 — 画面の中のお知らせ。間違いは danger、注意は warn、終わったことは ok、案内は info、ロック中などは neutral。
 * 先頭にアイコン、見出し（title）と本文、右に操作（#action）と閉じる。banner はページの上いっぱいの帯（角丸なし）。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArAlertProps } from "./ArAlert.contract";

const props = withDefaults(defineProps<ArAlertProps>(), {
  tone: "info",
  title: undefined,
  icon: undefined,
  closable: false,
  closeLabel: "閉じる",
  banner: false,
});
const emit = defineEmits<{ close: [] }>();
const defaults: Record<NonNullable<ArAlertProps["tone"]>, ArIconName> = { info: "info", ok: "check", warn: "alert", danger: "alert", neutral: "lock" };
const iconName = computed<ArIconName | null>(() => (props.icon === false ? null : (props.icon ?? defaults[props.tone])));
</script>

<template>
  <div
    data-ar="alert"
    data-part="root"
    :data-tone="tone"
    :data-banner="banner || undefined"
    :data-titled="title || $slots.title ? '' : undefined"
    :role="tone === 'danger' || tone === 'warn' ? 'alert' : 'status'"
  >
    <ArIcon v-if="iconName" :name="iconName" size="sm" data-part="icon" />
    <div data-part="content">
      <strong v-if="title || $slots.title" data-part="title"><slot name="title">{{ title }}</slot></strong>
      <div v-if="$slots.default" data-part="body"><slot /></div>
    </div>
    <div v-if="$slots.action" data-part="action"><slot name="action" /></div>
    <button v-if="closable" type="button" data-part="close" :aria-label="closeLabel" @click="emit('close')">
      <ArIcon name="x" size="sm" />
    </button>
  </div>
</template>
