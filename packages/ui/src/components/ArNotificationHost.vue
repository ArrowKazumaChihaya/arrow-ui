<script setup lang="ts">
/**
 * ArNotificationHost 1.0 — useArNotification() で出した通知を、画面の右上に並べる入れ物。
 * 製品が ArUiProvider の中（テーマ色の効く場所）に1つ置く。マウスが乗っている間は時間を止める。
 */
import { computed } from "vue";
import ArNotification from "./ArNotification.vue";
import { useDesignForm } from "../provider/context";
import { arNotificationStore, notificationInternals, type ArNotificationAction } from "../feedback";
import type { ArNotificationHostProps } from "./ArNotificationHost.contract";

withDefaults(defineProps<ArNotificationHostProps>(), { top: undefined });
/** 並べ方（デザインが選ぶ）：newest-first＝新しい通知を上に、newest-last＝新しい通知を下に足す（antd と同じ）。 */
const order = useDesignForm<"newest-first" | "newest-last">("ArNotificationHost", "order", "newest-first");
const list = computed(() => (order.value === "newest-last" ? [...arNotificationStore].reverse() : arNotificationStore));

async function act(key: string, a: ArNotificationAction | undefined) {
  if (!a) return;
  const r = await a.onClick?.();
  if (r !== false) notificationInternals.close(key);
}
</script>

<template>
  <div data-ar="notification-host" data-part="root" :style="top !== undefined ? { top: `${top}px` } : undefined">
    <TransitionGroup name="ar-notification">
      <ArNotification
        v-for="n in list"
        :key="n.key"
        :title="n.title"
        :description="n.description"
        :tone="n.tone"
        :icon="n.icon"
        :closable="n.closable"
        :duration="n.duration"
        :paused="n.paused"
        :actions="n.actions"
        @action="(i: number) => act(n.key, n.actions?.[i])"
        @close="notificationInternals.close(n.key)"
        @mouseenter="notificationInternals.setPaused(n.key, true)"
        @mouseleave="notificationInternals.setPaused(n.key, false)"
        @focusin="notificationInternals.setPaused(n.key, true)"
        @focusout="notificationInternals.setPaused(n.key, false)"
      />
    </TransitionGroup>
  </div>
</template>
