<script setup lang="ts">
/**
 * ArLogoSpin 1.0 — ロゴを動かす読み込み中の印。ロゴの絵は製品が slot（SVG）か src（画像）で渡し、部品は動きだけを付ける。
 * 動きを減らす設定の人には動かさない。
 */
import type { ArLogoSpinProps } from "./ArLogoSpin.contract";

withDefaults(defineProps<ArLogoSpinProps>(), { motion: "spin", src: undefined, label: "読み込み中", pivot: "344px 680px", fill: false });
</script>

<template>
  <div
    data-ar="logo-spin"
    data-part="root"
    role="status"
    :aria-label="label"
    :data-motion="motion"
    :data-fill="fill || undefined"
    :style="{ '--ar-logo-pivot': pivot }"
  >
    <span data-part="logo" aria-hidden="true">
      <img v-if="src" data-part="image" :src="src" alt="" />
      <slot v-else />
    </span>
  </div>
</template>
