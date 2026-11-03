<script setup lang="ts">
/**
 * ArSaveBar 1.0 — 保存バー。保存していない変更の件数と項目名、直すところへ飛ぶボタン、「変更を取り消す」「この内容で保存」。
 * 置く場所（ページの下・ポップアップの足）は製品が決める。sticky で画面の下に貼りつく。
 */
import { computed } from "vue";
import ArButton from "./ArButton.vue";
import { useDesignForm } from "../provider/context";
import type { ArSaveBarProps } from "./ArSaveBar.contract";

const props = withDefaults(defineProps<ArSaveBarProps>(), {
  items: () => [],
  errorCount: 0,
  saving: false,
  saveDisabled: false,
  sticky: false,
  size: "md",
  countText: undefined,
  errorText: "直すところ {n}件",
  discardText: undefined,
  saveText: undefined,
  label: "保存していない変更",
});
const emit = defineEmits<{ save: [event: MouseEvent]; discard: [event: MouseEvent]; jump: [event: MouseEvent] }>();
/** 形（ArDesign.forms.ArSaveBar）。 */
const summary = useDesignForm<"show" | "hidden">("ArSaveBar", "summary", "show");
const texts = useDesignForm<"remix" | "arrow">("ArSaveBar", "buttonText", "remix");
const sm = computed(() => props.size === "sm");
const countLabel = computed(() => (props.countText ?? (sm.value ? "未保存 {n}件" : "未保存の変更 {n}件")).replace("{n}", String(props.count)));
const discardLabel = computed(() => props.discardText ?? (texts.value === "arrow" ? "キャンセル" : sm.value ? "取り消す" : "変更を取り消す"));
const saveLabel = computed(() => props.saveText ?? (texts.value === "arrow" ? "実行" : sm.value ? "保存" : "この内容で保存"));
</script>

<template>
  <div
    data-ar="save-bar"
    data-part="root"
    role="region"
    :aria-label="label"
    :data-size="size"
    :data-sticky="sticky || undefined"
    :data-summary="summary"
  >
    <span data-part="count" aria-live="polite">{{ countLabel }}</span>
    <span v-if="!sm && items.length" data-part="items" :title="items.join('・')">{{ items.join("・") }}</span>
    <span v-else data-part="spacer" />
    <ArButton v-if="errorCount > 0" tone="danger-subtle" size="sm" icon="alert" @click="emit('jump', $event)">{{ errorText.replace("{n}", String(errorCount)) }}</ArButton>
    <ArButton tone="secondary" :size="sm ? 'sm' : 'md'" :icon="sm ? undefined : texts === 'arrow' ? 'x' : 'undo'" @click="emit('discard', $event)">{{ discardLabel }}</ArButton>
    <ArButton tone="primary" :size="sm ? 'sm' : 'md'" icon="check" :loading="saving" :disabled="saveDisabled" :blink="texts === 'arrow'" @click="emit('save', $event)">{{ saveLabel }}</ArButton>
  </div>
</template>
