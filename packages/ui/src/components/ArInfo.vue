<script setup lang="ts">
/**
 * ArInfo 1.0 — 小さな説明・注意（今の Info・Attention）。
 * note と attention は文字（改行はそのまま出す）。mark（？）と detail（詳細）は押せる印で、
 * href があれば新しいタブで開き、無ければ open を出す（説明のポップアップは製品が ArModal で出す）。
 */
import ArIcon from "./ArIcon.vue";
import type { ArInfoProps } from "./ArInfo.contract";

const props = withDefaults(defineProps<ArInfoProps>(), {
  kind: "note",
  text: undefined,
  href: undefined,
  labels: () => ({ mark: "説明", detail: "詳細" }),
});
const emit = defineEmits<{ open: [] }>();
</script>

<template>
  <p v-if="kind === 'note'" data-ar="info" data-part="root" data-kind="note">
    <span data-part="text"><slot>{{ text }}</slot></span>
  </p>
  <div v-else-if="kind === 'attention'" data-ar="info" data-part="root" data-kind="attention" role="note">
    <ArIcon line name="alert" data-part="icon" />
    <span data-part="text"><slot>{{ text }}</slot></span>
  </div>
  <component
    :is="href ? 'a' : 'button'"
    v-else
    data-ar="info"
    data-part="root"
    :data-kind="kind"
    :type="href ? undefined : 'button'"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    :aria-label="kind === 'mark' ? (props.text ?? labels.mark) : undefined"
    :title="kind === 'mark' ? (props.text ?? labels.mark) : undefined"
    @click="href || emit('open')"
  >
    <ArIcon line v-if="kind === 'mark'" name="help" data-part="icon" />
    <span v-else data-part="text"><slot>{{ text ?? labels.detail }}</slot></span>
  </component>
</template>
