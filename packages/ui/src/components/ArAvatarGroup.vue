<script setup lang="ts">
/**
 * ArAvatarGroup 1.0 — 頭文字の丸を重ねて並べる（勤務中の人・担当の人）。
 * 中に ArAvatar を並べる。max を超えた分は灰色の「+N」にまとめる。
 */
import { Comment, Fragment, computed, provide, useSlots, type VNode } from "vue";
import ArAvatar from "./ArAvatar.vue";
import type { ArAvatarGroupProps } from "./ArAvatar.contract";

const props = withDefaults(defineProps<ArAvatarGroupProps>(), { max: undefined, size: "md", label: undefined });
const slots = useSlots();
provide("ar-avatar-group", { size: () => props.size });

const flat = (nodes: VNode[]): VNode[] =>
  nodes.flatMap((n) => (n.type === Fragment ? flat(n.children as VNode[]) : n.type === Comment ? [] : [n]));
const items = computed(() => flat(slots.default?.() ?? []));
const shown = computed(() => (props.max !== undefined && items.value.length > props.max ? items.value.slice(0, props.max) : items.value));
const rest = computed(() => items.value.length - shown.value.length);
</script>

<template>
  <span data-ar="avatar-group" data-part="root" :data-size="size" role="group" :aria-label="label">
    <component :is="v" v-for="(v, i) in shown" :key="i" />
    <ArAvatar v-if="rest > 0" data-part="rest" :text="`+${rest}`" tone="neutral" :size="size" :label="`ほか${rest}人`" />
  </span>
</template>
