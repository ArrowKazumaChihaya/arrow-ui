<script setup lang="ts">
/**
 * ArTimeline 1.0 — 打刻・承認の履歴。点は意味の色（線の丸）、今はテーマ色の塗り、まだは灰色。点と点は細い線でつなぐ。
 * item slot（{ item, index }）で中身を、dot slot で点を変えられる。
 */
import { computed } from "vue";
import type { ArTimelineItem, ArTimelineProps } from "./ArTimeline.contract";

const props = withDefaults(defineProps<ArTimelineProps>(), { mode: "left", reverse: false, label: undefined });
defineSlots<{
  item?: (p: { item: ArTimelineItem; index: number }) => unknown;
  dot?: (p: { item: ArTimelineItem; index: number }) => unknown;
}>();
const list = computed(() => (props.reverse ? [...props.items].reverse() : [...props.items]));
</script>

<template>
  <ol data-ar="timeline" data-part="root" :data-mode="mode" :aria-label="label">
    <li
      v-for="(it, i) in list"
      :key="i"
      data-part="item"
      :data-tone="it.tone ?? 'accent'"
      :data-state="it.status ?? 'done'"
      :aria-current="it.status === 'current' ? 'step' : undefined"
    >
      <span data-part="dot" aria-hidden="true"><slot name="dot" :item="it" :index="i" /></span>
      <div data-part="content">
        <slot name="item" :item="it" :index="i">
          <b data-part="title">{{ it.title }}</b>
          <small v-if="it.description" data-part="description">{{ it.description }}</small>
        </slot>
      </div>
    </li>
  </ol>
</template>
