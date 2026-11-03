<script setup lang="ts">
/**
 * ArText 1.0 — 文中の文字。意味の色（type）・太字・下線・取り消し・印・コード・キー・コピー・「…」で切る。
 */
import { computed, onBeforeUnmount, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArTextProps } from "./ArText.contract";

const props = withDefaults(defineProps<ArTextProps>(), {
  type: undefined,
  strong: false,
  underline: false,
  del: false,
  mark: false,
  code: false,
  kbd: false,
  copyable: false,
  ellipsis: false,
  size: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{ copy: [text: string] }>();
const content = ref<HTMLElement | null>(null);
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(timer));

/** 意味が一番強い要素を中身の要素にする（ほかの飾りは属性で当てる）。 */
const tag = computed(() =>
  props.code ? "code" : props.kbd ? "kbd" : props.mark ? "mark" : props.del ? "del" : props.strong ? "strong" : props.underline ? "u" : "span",
);
const copyLabel = computed(() => (copied.value ? (props.labels.copied ?? "コピーしました") : (props.labels.copy ?? "コピー")));

async function copy() {
  const text = typeof props.copyable === "string" ? props.copyable : (content.value?.textContent ?? "").trim();
  try {
    await navigator.clipboard?.writeText(text);
  } catch {
    /* コピーできない環境でも知らせは出す */
  }
  emit("copy", text);
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1500);
}
function onEnter() {
  const e = content.value;
  if (!e) return;
  if (e.scrollWidth > e.clientWidth) e.title = e.textContent?.trim() ?? "";
  else e.removeAttribute("title");
}
</script>

<template>
  <span
    data-ar="text"
    data-part="root"
    :data-type="type"
    :data-size="size"
    :data-ellipsis="ellipsis || undefined"
  >
    <component
      :is="tag"
      ref="content"
      data-part="content"
      :data-strong="strong || undefined"
      :data-underline="underline || undefined"
      :data-del="del || undefined"
      :data-mark="mark || undefined"
      :data-code="code || undefined"
      :data-kbd="kbd || undefined"
      @mouseenter="ellipsis && onEnter()"
    ><slot /></component>
    <button
      v-if="copyable !== false"
      type="button"
      data-part="copy"
      :data-state="copied ? 'copied' : undefined"
      :aria-label="copyLabel"
      :title="copyLabel"
      @click="copy"
    >
      <ArIcon :name="copied ? 'check' : 'copy'" size="sm" />
    </button>
    <span v-if="copyable !== false" data-ar-visually-hidden aria-live="polite">{{ copied ? copyLabel : "" }}</span>
  </span>
</template>
