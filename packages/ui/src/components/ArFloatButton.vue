<script setup lang="ts">
/**
 * ArFloatButton 1.0 — 浮かぶボタン。1つのボタン・縦につないだグループ・ページの上へ戻る（backTop）。
 * 主なものだけテーマ色（tone="primary"）。件数は赤の丸。
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArFloatButtonProps } from "./ArFloatButton.contract";

const props = withDefaults(defineProps<ArFloatButtonProps>(), {
  icon: undefined,
  label: undefined,
  tone: "default",
  badge: undefined,
  items: undefined,
  backTop: false,
  visibilityHeight: 400,
  fixed: false,
  href: undefined,
});
const emit = defineEmits<{ click: [event: MouseEvent]; select: [key: string] }>();
const visible = ref(!props.backTop);
const name = computed(() => props.label ?? (props.backTop ? "ページの上へ戻る" : ""));
const showBadge = (b: number | string | undefined) => b !== undefined && b !== "" && b !== 0;

if (!props.items && !props.label && !props.backTop) console.warn("[ArFloatButton] label が必要です");

function onScroll() {
  visible.value = window.scrollY > props.visibilityHeight;
}
onMounted(() => {
  if (!props.backTop) return;
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

function onClick(e: MouseEvent) {
  emit("click", e);
  if (props.backTop) {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
}
</script>

<template>
  <div
    v-if="items"
    data-ar="float-button"
    data-part="root"
    data-shape="group"
    role="group"
    :aria-label="label"
    :data-fixed="fixed || undefined"
  >
    <button
      v-for="it in items"
      :key="it.key"
      type="button"
      data-part="item"
      :aria-label="it.label"
      :title="it.label"
      @click="emit('select', it.key)"
    >
      <ArIcon :name="it.icon" data-part="icon" size="sm" />
      <span v-if="showBadge(it.badge)" data-part="badge" aria-hidden="true">{{ it.badge }}</span>
    </button>
  </div>
  <component
    :is="href ? 'a' : 'button'"
    v-else-if="visible"
    data-ar="float-button"
    data-part="root"
    :data-tone="tone"
    :data-fixed="fixed || undefined"
    :type="href ? undefined : 'button'"
    :href="href"
    :aria-label="showBadge(badge) ? `${name}（${badge}件）` : name"
    :title="name"
    @click="onClick"
  >
    <ArIcon :name="icon ?? (backTop ? 'up' : 'plus')" data-part="icon" />
    <span v-if="showBadge(badge)" data-part="badge" aria-hidden="true">{{ badge }}</span>
  </component>
</template>
