<script setup lang="ts">
/**
 * ArSkeleton 1.0 — 読み込み中の形。line-2 の地に淡い光。読み込みが終わったら loading=false で中身を出す。
 */
import { computed } from "vue";
import type { ArSkeletonProps } from "./ArSkeleton.contract";

const props = withDefaults(defineProps<ArSkeletonProps>(), {
  shape: "text",
  avatar: false,
  rows: 3,
  widths: undefined,
  width: undefined,
  height: undefined,
  active: true,
  loading: true,
});
const len = (v: string | number | undefined) => (typeof v === "number" ? `${v}px` : v);
const lines = computed(() =>
  Array.from({ length: Math.max(1, props.rows) }, (_, i) => len(props.widths?.[i]) ?? (i === props.rows - 1 && props.rows > 1 ? "70%" : "100%")),
);
const box = computed(() => ({ width: len(props.width), height: len(props.height) }));
</script>

<template>
  <slot v-if="!loading" />
  <div v-else data-ar="skeleton" data-part="root" :data-shape="shape" :data-active="active || undefined" aria-busy="true" aria-live="polite">
    <template v-if="shape === 'text'">
      <i v-if="avatar" data-part="avatar" />
      <div data-part="lines">
        <i v-for="(w, i) in lines" :key="i" data-part="line" :style="{ width: w }" />
      </div>
    </template>
    <i v-else data-part="block" :style="box" />
  </div>
</template>
