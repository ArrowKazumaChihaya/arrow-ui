<script setup lang="ts">
/**
 * ArSkeleton 1.0 — 読み込み中の形。line-2 の地に淡い光。読み込みが終わったら loading=false で中身を出す。
 */
import { computed } from "vue";
import { useDesignForm } from "../provider/context";
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
/** 行の幅：widths で決めた行だけ指定する。決めていない行は幅いっぱい、最後の行（data-last）はデザインが決める短さ。 */
const lines = computed(() => Array.from({ length: Math.max(1, props.rows) }, (_, i) => len(props.widths?.[i])));
/** 見出しの行（デザインが選ぶ）：none＝行だけ、line＝行の上に半分の幅の見出しの行を足す（antd と同じ）。 */
const titleForm = useDesignForm<"none" | "line">("ArSkeleton", "title", "none");
const box = computed(() => ({ width: len(props.width), height: len(props.height) }));
</script>

<template>
  <slot v-if="!loading" />
  <div v-else data-ar="skeleton" data-part="root" :data-shape="shape" :data-active="active || undefined" aria-busy="true" aria-live="polite">
    <template v-if="shape === 'text'">
      <i v-if="avatar" data-part="avatar" />
      <div data-part="lines">
        <i v-if="titleForm === 'line'" data-part="title" />
        <i
          v-for="(w, i) in lines"
          :key="i"
          data-part="line"
          :data-last="i === lines.length - 1 && lines.length > 1 ? '' : undefined"
          :style="w ? { width: w } : undefined"
        />
      </div>
    </template>
    <i v-else data-part="block" :style="box" />
  </div>
</template>
