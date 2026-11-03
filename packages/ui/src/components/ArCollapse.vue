<script setup lang="ts">
/**
 * ArCollapse 1.0 — 折りたたみ。見出しは bg-2 の地に太字、開くと矢印が下を向く。
 * 見出しのボタンは ↑↓ Home End で移り、Enter・Space で開閉する（WAI-ARIA の Accordion）。
 */
import { ref } from "vue";
import ArIcon from "./ArIcon.vue";
import { useId } from "../provider/context";
import type { ArCollapseItem, ArCollapseProps } from "./ArCollapse.contract";

const props = withDefaults(defineProps<ArCollapseProps>(), { modelValue: () => [], accordion: false, ghost: false, headingLevel: 3 });
const emit = defineEmits<{ "update:modelValue": [keys: string[]] }>();
const uid = useId("ar-collapse");
const triggers = ref<HTMLButtonElement[]>([]);

const isOpen = (it: ArCollapseItem) => props.modelValue.includes(it.key);
function toggle(it: ArCollapseItem) {
  if (it.disabled) return;
  if (isOpen(it)) emit("update:modelValue", props.modelValue.filter((k) => k !== it.key));
  else emit("update:modelValue", props.accordion ? [it.key] : [...props.modelValue, it.key]);
}
function onKey(e: KeyboardEvent, i: number) {
  const list = triggers.value.filter((b) => !b.disabled);
  const at = list.indexOf(triggers.value[i]!);
  const go = (n: number) => {
    e.preventDefault();
    list[(n + list.length) % list.length]?.focus();
  };
  if (e.key === "ArrowDown") go(at + 1);
  else if (e.key === "ArrowUp") go(at - 1);
  else if (e.key === "Home") go(0);
  else if (e.key === "End") go(list.length - 1);
}
</script>

<template>
  <div data-ar="collapse" data-part="root" :data-ghost="ghost || undefined">
    <div
      v-for="(it, i) in items"
      :key="it.key"
      data-part="panel"
      :data-state="[isOpen(it) && 'open', it.disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
    >
      <component :is="`h${headingLevel}`" data-part="header">
        <button
          :id="`${uid}-h-${i}`"
          ref="triggers"
          type="button"
          data-part="trigger"
          :aria-expanded="isOpen(it)"
          :aria-controls="`${uid}-p-${i}`"
          :disabled="it.disabled"
          @click="toggle(it)"
          @keydown="onKey($event, i)"
        >
          <ArIcon name="cr" size="sm" data-part="arrow" />
          <ArIcon v-if="it.icon" :name="it.icon" size="sm" data-part="icon" />
          <span data-part="title">{{ it.title }}</span>
          <span v-if="it.extra || $slots[`extra-${it.key}`]" data-part="extra">
            <slot :name="`extra-${it.key}`">{{ it.extra }}</slot>
          </span>
        </button>
      </component>
      <div
        v-show="isOpen(it)"
        :id="`${uid}-p-${i}`"
        data-part="body"
        role="region"
        :aria-labelledby="`${uid}-h-${i}`"
      >
        <slot :name="`panel-${it.key}`"><slot name="panel" :item="it" /></slot>
      </div>
    </div>
  </div>
</template>
