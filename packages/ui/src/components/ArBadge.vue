<script setup lang="ts">
/**
 * ArBadge 1.0 — 件数の丸・点・状態の点。
 * 子（アイコンのボタンなど）の右上に件数（赤＝重要／テーマ色）や点を重ねる。status を渡すと「点＋言葉」の状態の表示になる。
 * 「提出済」のような札は ArTag を使う。
 */
import { computed, useSlots } from "vue";
import type { ArBadgeProps } from "./ArBadge.contract";

const props = withDefaults(defineProps<ArBadgeProps>(), {
  count: undefined,
  max: 99,
  showZero: false,
  dot: false,
  tone: "danger",
  status: undefined,
  text: undefined,
  label: undefined,
});
const slots = useSlots();
const shown = computed(() => (props.count === undefined ? "" : props.count > props.max ? `${props.max}+` : String(props.count)));
const visible = computed(() => props.dot || (props.count !== undefined && (props.count > 0 || props.showZero)));
const name = computed(() => props.label ?? (props.dot ? "新しいお知らせがあります" : `${props.count ?? 0}件`));
</script>

<template>
  <span v-if="status" data-ar="badge" data-part="root" data-mode="status" :data-tone="status">
    <span data-part="status-dot" aria-hidden="true" />
    <span data-part="text"><slot>{{ text }}</slot></span>
  </span>
  <span
    v-else
    data-ar="badge"
    data-part="root"
    data-mode="count"
    :data-tone="tone"
    :data-standalone="!slots.default || undefined"
  >
    <slot />
    <template v-if="visible">
      <span v-if="dot" data-part="dot" aria-hidden="true" />
      <sup v-else data-part="count" :data-multi="shown.length > 1 || undefined" aria-hidden="true">{{ shown }}</sup>
      <span data-ar-visually-hidden>{{ name }}</span>
    </template>
  </span>
</template>
