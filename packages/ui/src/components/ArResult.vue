<script setup lang="ts">
/**
 * ArResult 1.0 — 操作の結果。大きな印（意味の色の淡い丸）＋見出し＋説明＋次の一手（default slot のボタン）。
 * 見つからない・入れないページは status="404" などで大きな数を出す。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArResultProps } from "./ArResult.contract";

const props = withDefaults(defineProps<ArResultProps>(), { status: "success", description: undefined, icon: undefined });
const isCode = computed(() => /^\d+$/.test(props.status));
const iconName = computed<ArIconName>(
  () => props.icon ?? ({ success: "check", error: "alert", info: "info", warning: "alert" } as Record<string, ArIconName>)[props.status] ?? "info",
);
</script>

<template>
  <div data-ar="result" data-part="root" :data-status="status">
    <span v-if="isCode" data-part="code">{{ status }}</span>
    <span v-else data-part="badge" aria-hidden="true"><slot name="icon"><ArIcon :name="iconName" size="lg" /></slot></span>
    <h3 data-part="title">{{ title }}</h3>
    <p v-if="description" data-part="description">{{ description }}</p>
    <div v-if="$slots.default" data-part="actions"><slot /></div>
  </div>
</template>
