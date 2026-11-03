<script setup lang="ts">
/**
 * ArKanaText 1.0 — フリガナつきの氏名（今の Kana）。名前の上に小さくフリガナを出す。
 * 幅が狭い画面（768px 以下）と layout="inline" では「名前（フリガナ）」の1行にする。
 */
import type { ArKanaTextProps } from "./ArKanaText.contract";

withDefaults(defineProps<ArKanaTextProps>(), { name: undefined, kana: undefined, layout: "stacked" });
</script>

<template>
  <span data-ar="kana-text" data-part="root" :data-layout="layout">
    <span data-part="stack">
      <span v-if="$slots.kana || kana" data-part="kana"><slot name="kana">{{ kana }}</slot></span>
      <span data-part="name"><slot>{{ name }}</slot></span>
    </span>
    <span data-part="inline"><slot>{{ name }}</slot><template v-if="$slots.kana || kana">（<slot name="kana">{{ kana }}</slot>）</template></span>
  </span>
</template>
