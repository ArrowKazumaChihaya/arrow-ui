<script setup lang="ts">
/**
 * ArSectionHead 1.0 — カードの中のまとまりの見出しの段。四角い箱のアイコン・見出し・件数の札・操作（actions）・右端（end）。
 * collapsible なら見出しの部分がボタンになり、押すと下の中身を開け閉めする（aria-expanded）。
 */
import ArIcon from "./ArIcon.vue";
import type { ArSectionHeadProps } from "./ArSectionHead.contract";

const props = withDefaults(defineProps<ArSectionHeadProps>(), {
  icon: undefined,
  count: undefined,
  headingLevel: 3,
  collapsible: false,
  open: true,
  controls: undefined,
});
const emit = defineEmits<{ "update:open": [open: boolean] }>();
</script>

<template>
  <div data-ar="section-head" data-part="root" :data-state="collapsible ? (open ? 'open' : 'closed') : undefined">
    <component
      :is="collapsible ? 'button' : 'div'"
      data-part="toggle"
      :type="collapsible ? 'button' : undefined"
      :aria-expanded="collapsible ? (open ? 'true' : 'false') : undefined"
      :aria-controls="collapsible ? controls : undefined"
      @click="collapsible && emit('update:open', !props.open)"
    >
      <span v-if="icon" data-part="icon" aria-hidden="true"><ArIcon :name="icon" size="sm" /></span>
      <component :is="`h${headingLevel}`" data-part="title">{{ title }}</component>
      <span v-if="count !== undefined" data-part="count">{{ count }}</span>
      <ArIcon line v-if="collapsible" name="cd" size="sm" data-part="caret" />
    </component>
    <div v-if="$slots.actions" data-part="actions"><slot name="actions" /></div>
    <div v-if="$slots.end" data-part="end"><slot name="end" /></div>
  </div>
</template>
