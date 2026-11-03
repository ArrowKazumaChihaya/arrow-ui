<script setup lang="ts">
/**
 * ArNotification 1.0 — 右上に出る白いカード（1つ分）。印は意味の色、残り時間はテーマ色の線。
 * ふつうは useArNotification() で出し、ArNotificationHost が並べる。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArNotificationProps } from "./ArNotification.contract";

const props = withDefaults(defineProps<ArNotificationProps>(), {
  description: undefined,
  tone: "info",
  icon: undefined,
  closable: true,
  closeLabel: "閉じる",
  duration: 0,
  paused: false,
  progress: undefined,
  actions: undefined,
});
const emit = defineEmits<{ close: []; action: [index: number] }>();
const iconName = computed<ArIconName>(() => props.icon ?? ({ info: "info", ok: "check", warn: "alert", danger: "alert" } as const)[props.tone]);
const line = computed(() => {
  if (props.progress !== undefined) return { width: `${Math.max(0, Math.min(1, props.progress)) * 100}%` };
  if (props.duration > 0) return { animationDuration: `${props.duration}s`, animationPlayState: props.paused ? "paused" : "running" };
  return null;
});
</script>

<template>
  <div data-ar="notification" data-part="root" :data-tone="tone" :role="tone === 'danger' ? 'alert' : 'status'">
    <ArIcon :name="iconName" data-part="icon" />
    <div data-part="content">
      <strong data-part="title">{{ title }}</strong>
      <div v-if="description || $slots.default" data-part="description"><slot>{{ description }}</slot></div>
    </div>
    <button v-if="closable" type="button" data-part="close" :aria-label="closeLabel" @click="emit('close')">
      <ArIcon name="x" size="sm" />
    </button>
    <div v-if="$slots.actions || actions?.length" data-part="actions">
      <slot name="actions">
        <button
          v-for="(a, i) in actions"
          :key="a.label"
          type="button"
          data-part="action"
          :data-tone="a.tone ?? 'subtle'"
          @click="emit('action', i)"
        >{{ a.label }}</button>
      </slot>
    </div>
    <span v-if="line" data-part="progress" :data-animated="progress === undefined || undefined" :style="line" aria-hidden="true" />
  </div>
</template>
