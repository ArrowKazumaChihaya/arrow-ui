<script setup lang="ts">
/**
 * ArAvatar 1.0 — 人の頭文字の丸。
 * 地は淡いテーマ色。シフト画面のように人を見分けたいときは seed で人ごとの色にする。
 * ArAvatarGroup に入れると白い縁で重なる。
 */
import { computed, inject } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArAvatarProps } from "./ArAvatar.contract";
import { arAvatarToneOf } from "./avatar";

const props = withDefaults(defineProps<ArAvatarProps>(), {
  name: undefined,
  text: undefined,
  icon: undefined,
  tone: undefined,
  seed: undefined,
  size: undefined,
  shape: "circle",
  label: undefined,
});
const group = inject<{ size: () => ArAvatarProps["size"] } | null>("ar-avatar-group", null);
const shown = computed(() => props.text ?? (props.name ? Array.from(props.name.trim())[0] ?? "" : ""));
const toneValue = computed(() => props.tone ?? (props.seed !== undefined ? arAvatarToneOf(props.seed) : "accent"));
const sizeValue = computed(() => props.size ?? group?.size() ?? "md");
const name = computed(() => props.label ?? props.name);
</script>

<template>
  <span
    data-ar="avatar"
    data-part="root"
    :data-tone="toneValue"
    :data-size="sizeValue"
    :data-shape="shape"
    :role="name ? 'img' : undefined"
    :aria-label="name"
    :aria-hidden="name ? undefined : 'true'"
  >
    <ArIcon v-if="icon" :name="icon" size="sm" data-part="icon" />
    <span v-else data-part="text" aria-hidden="true">{{ shown }}</span>
  </span>
</template>
