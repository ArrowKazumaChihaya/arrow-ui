<script setup lang="ts">
/**
 * ArEmpty 1.0 — 空の状態。何もないことと、次の一手を言葉で書く（絵は使わず線のアイコン）。
 * slot：default（文）、action（次の一手のボタン）。
 */
import ArIcon from "./ArIcon.vue";
import type { ArEmptyProps } from "./ArEmpty.contract";

withDefaults(defineProps<ArEmptyProps>(), { text: undefined, icon: undefined, size: "sm" });
</script>

<template>
  <div data-ar="empty" data-part="root" :data-size="size" :data-icon="icon ? '' : undefined">
    <ArIcon v-if="icon" :name="icon" data-part="icon" />
    <p data-part="text"><slot>{{ text }}</slot></p>
    <div v-if="$slots.action" data-part="action"><slot name="action" /></div>
  </div>
</template>
