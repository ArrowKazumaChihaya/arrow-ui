<script setup lang="ts">
/**
 * ArBalloon 1.0 — 吹き出し。その場に置く（浮かばない）注意や目印。
 * 物に重ねて浮かべる説明は ArEllipsis などの吹き出し（ArFloat）を使う。
 */
import { computed } from "vue";
import type { ArBalloonProps } from "./ArBalloon.contract";

const props = withDefaults(defineProps<ArBalloonProps>(), { tail: "bottom", tone: "ink", shape: "bubble", size: 20, live: false });
const style = computed(() => (props.shape === "dot" ? { "--ar-balloon-size": `${props.size}px` } : undefined));
</script>

<template>
  <span
    data-ar="balloon"
    data-part="root"
    :data-tail="tail"
    :data-tone="tone"
    :data-shape="shape"
    :style="style"
    :role="live ? 'status' : undefined"
  ><span data-part="body"><slot /></span></span>
</template>
