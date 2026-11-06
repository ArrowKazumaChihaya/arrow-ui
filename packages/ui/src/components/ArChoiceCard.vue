<script setup lang="ts">
/**
 * ArChoiceCard 1.1 — 選ぶカード。プラン・支払い方法（card）、社員を追加の4択（option）、書類の種類（tile）、年調の なし／あり（radio）。
 * value と v-model を渡すと1つを選ぶ組（role="radio"・←→↑↓で隣へ動いて選ぶ）。並べ方は使う側の ArGrid や role="radiogroup" の箱が決める。
 * 1.1：size（sm・md・lg）。radio は ArRadio の card（ArRadioGroup の card と同じもの。見た目・CSS は1つ）で描く。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import ArRadio from "./ArRadio.vue";
import type { ArChoiceCardProps, ArChoiceValue } from "./ArChoiceCard.contract";

const props = withDefaults(defineProps<ArChoiceCardProps>(), {
  description: undefined,
  icon: undefined,
  variant: "card",
  value: undefined,
  modelValue: undefined,
  selected: false,
  tag: undefined,
  tagTone: "accent",
  reason: undefined,
  disabled: false,
  size: undefined,
  name: undefined,
  chevron: false,
});
const emit = defineEmits<{ "update:modelValue": [value: ArChoiceValue]; select: [value: ArChoiceValue | undefined] }>();

const inGroup = computed(() => props.value !== undefined);
const on = computed(() => (inGroup.value ? props.modelValue === props.value : props.selected));
const state = computed(() => [on.value && "on", props.disabled && "disabled"].filter(Boolean).join(" ") || undefined);
const role = computed(() => (inGroup.value ? "radio" : undefined));
const tabindex = computed(() => {
  if (!inGroup.value || props.disabled) return undefined;
  // 組の中では選ばれている札（なければ最初の札）だけが Tab で止まる
  return on.value || props.modelValue === undefined || props.modelValue === null ? 0 : -1;
});

/** 大きさを省いたとき：radio は年末調整の lg、ほかはキャンバスの md。 */
const sizeOf = computed(() => props.size ?? (props.variant === "radio" ? "lg" : "md"));
/** radio：本物のラジオ。組（value）でなければ selected を true の値として渡す。 */
const radioValue = computed(() => (inGroup.value ? (props.value as ArChoiceValue) : true));
const radioModel = computed(() => (inGroup.value ? props.modelValue : props.selected ? true : null));
function pickRadio() {
  if (props.disabled) return;
  if (inGroup.value) emit("update:modelValue", props.value as ArChoiceValue);
  emit("select", props.value);
}
/** name がないときは、同じ組（role="radiogroup" の箱）の札の間を ←→↑↓ で移って選ぶ。 */
function onRadioKeydown(e: KeyboardEvent) {
  if (props.name) return;
  const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as const;
  const step = keys[e.key as keyof typeof keys];
  if (!step) return;
  e.preventDefault();
  const me = e.currentTarget as HTMLInputElement;
  const group = me.closest('[role="radiogroup"]') ?? me.closest('[data-ar="radio"]')?.parentElement;
  const all = [...(group?.querySelectorAll<HTMLInputElement>('input[data-from="choice-card"]') ?? [])].filter((b) => !b.disabled);
  const i = all.indexOf(me);
  const next = all[(i + step + all.length) % all.length];
  if (next && next !== me) {
    next.focus();
    next.click();
  }
}

function pick() {
  if (props.disabled) return;
  if (inGroup.value) emit("update:modelValue", props.value as ArChoiceValue);
  emit("select", props.value);
}
function onKeydown(e: KeyboardEvent) {
  if (!inGroup.value) return;
  const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as const;
  const step = keys[e.key as keyof typeof keys];
  if (!step) return;
  e.preventDefault();
  const me = e.currentTarget as HTMLElement;
  const group = me.closest('[role="radiogroup"]') ?? me.parentElement;
  const all = [...(group?.querySelectorAll<HTMLButtonElement>('[data-ar="choice-card"][role="radio"]') ?? [])].filter((b) => !b.disabled);
  const i = all.indexOf(me as HTMLButtonElement);
  const next = all[(i + step + all.length) % all.length];
  if (next && next !== me) {
    next.focus();
    next.click();
  }
}
</script>

<template>
  <ArRadio
    v-if="variant === 'radio'"
    data-from="choice-card"
    variant="card"
    :size="sizeOf"
    :model-value="radioModel"
    :value="radioValue"
    :name="name"
    :description="description"
    :disabled="disabled"
    :tabindex="name ? undefined : tabindex"
    @update:model-value="pickRadio"
    @keydown="onRadioKeydown"
    ><span data-part="title">{{ title }}</span><span v-if="tag" data-part="tag" :data-tone="tagTone">{{ tag }}</span><slot
  /></ArRadio>
  <button
    v-else
    type="button"
    data-ar="choice-card"
    data-part="root"
    :data-variant="variant"
    :data-size="sizeOf"
    :data-state="state"
    :role="role"
    :aria-checked="inGroup ? (on ? 'true' : 'false') : undefined"
    :aria-pressed="!inGroup && variant !== 'option' ? (on ? 'true' : 'false') : undefined"
    :tabindex="tabindex"
    :disabled="disabled"
    @click="pick"
    @keydown="onKeydown"
  >
    <span v-if="variant === 'card'" data-part="check" aria-hidden="true"><ArIcon v-if="variant === 'card' && on" name="check" line /></span>
    <span v-if="icon" data-part="icon"><ArIcon :name="icon" /></span>
    <span data-part="body">
      <span data-part="title"
        ><span>{{ title }}</span><span v-if="tag && variant !== 'card'" data-part="tag" :data-tone="tagTone">{{ tag }}</span></span
      >
      <span v-if="description" data-part="description">{{ description }}</span>
      <span v-if="tag && variant === 'card'" data-part="tag" :data-tone="tagTone">{{ tag }}</span>
      <span v-if="reason" data-part="reason"><ArIcon name="lock" line />{{ reason }}</span>
      <slot />
    </span>
    <ArIcon v-if="chevron && variant === 'option'" data-part="chevron" name="cr" aria-hidden="true" />
  </button>
</template>
