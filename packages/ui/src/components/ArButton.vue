<script setup lang="ts">
/**
 * ArButton 1.0 — ボタン。種類（tone）・大きさ・形・アイコン・読み込み中・押せない・幅いっぱい。
 * href を渡すとリンク（a 要素）として出す。
 */
import { computed, useSlots } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArButtonProps } from "./ArButton.contract";

const props = withDefaults(defineProps<ArButtonProps>(), {
  tone: "secondary",
  size: "md",
  shape: "default",
  icon: undefined,
  iconEnd: undefined,
  label: undefined,
  loading: false,
  disabled: false,
  block: false,
  type: "button",
  href: undefined,
});
const emit = defineEmits<{ click: [event: MouseEvent] }>();
const slots = useSlots();
const iconOnly = computed(() => !slots.default && !!(props.icon || props.iconEnd));
/** 同じ見た目の別名をまとめる（デザインの CSS は元の名前だけを見る）。 */
const tone = computed(() =>
  props.tone === "danger-fill" ? "danger" : props.tone === "danger-outline" ? "danger-subtle" : props.tone,
);
const state = computed(() => [props.loading && "loading", props.disabled && "disabled"].filter(Boolean).join(" "));
const inactive = computed(() => props.disabled || props.loading);

// アイコンだけのボタンには名前が要る
if ((props.icon || props.iconEnd) && !props.label && !slots.default) console.warn("[ArButton] アイコンだけのボタンには label が必要です");

function onClick(e: MouseEvent) {
  if (inactive.value) {
    e.preventDefault();
    return;
  }
  emit("click", e);
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    data-ar="button"
    data-part="root"
    :data-tone="tone"
    :data-size="size"
    :data-shape="shape !== 'default' ? shape : undefined"
    :data-state="state || undefined"
    :data-block="block || undefined"
    :data-icon-only="iconOnly || undefined"
    :type="href ? undefined : type"
    :href="href && !inactive ? href : undefined"
    :role="href && inactive ? 'link' : undefined"
    :disabled="href ? undefined : inactive"
    :aria-disabled="href && inactive ? 'true' : undefined"
    :aria-busy="loading || undefined"
    :aria-label="iconOnly ? label : undefined"
    :title="iconOnly ? label : undefined"
    @click="onClick"
  >
    <span v-if="loading" data-part="spinner" aria-hidden="true" />
    <ArIcon v-else-if="icon" :name="icon" data-part="icon" size="sm" />
    <span v-if="$slots.default" data-part="label"><slot /></span>
    <ArIcon v-if="iconEnd && !(loading && !icon && !$slots.default)" :name="iconEnd" data-part="icon-end" size="sm" />
  </component>
</template>
