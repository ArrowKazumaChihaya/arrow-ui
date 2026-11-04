<script setup lang="ts">
/**
 * ArBadge 1.1 — 件数の丸・点・状態の点。
 * 子（アイコンのボタンなど）の右上に件数（赤＝お知らせ・やること／テーマ色）や点を重ねる。status を渡すと「点＋言葉」の状態の表示になる。
 * 件数の丸はライブラリの中でこれ1つ。ほかの部品（ヘッダー・メニューのタイル・タブ・切り替えなど）の件数もこれで描く。
 * 「提出済」のような札・「4名」のような件数の札（高さ22）は ArTag（shape="pill"）を使う。
 */
import { computed, useSlots } from "vue";
import type { ArBadgeProps } from "./ArBadge.contract";

const props = withDefaults(defineProps<ArBadgeProps>(), {
  count: undefined,
  max: 99,
  showZero: false,
  dot: false,
  tone: "danger",
  variant: "solid",
  ring: undefined,
  status: undefined,
  text: undefined,
  label: undefined,
});
const slots = useSlots();
const shown = computed(() =>
  props.count === undefined ? "" : typeof props.count === "number" && props.count > props.max ? `${props.max}+` : String(props.count),
);
const visible = computed(() =>
  props.dot || (props.count !== undefined && (typeof props.count === "string" ? props.count !== "" : props.count > 0 || props.showZero)),
);
const name = computed(() => props.label ?? (props.dot ? "新しいお知らせがあります" : `${props.count ?? 0}件`));
/** 白い縁：省くと、子に重ねるときだけ付ける。 */
const ringOn = computed(() => props.ring ?? !!slots.default);
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
    :data-variant="variant !== 'solid' ? variant : undefined"
    :data-ring="ringOn || undefined"
    :data-standalone="!slots.default || undefined"
  >
    <slot />
    <template v-if="visible">
      <span v-if="dot" data-part="dot" aria-hidden="true" />
      <sup v-else data-part="count" :data-multi="shown.length > 1 || undefined" :aria-hidden="name ? 'true' : undefined">{{ shown }}</sup>
      <span v-if="name" data-ar-visually-hidden>{{ name }}</span>
    </template>
  </span>
</template>
