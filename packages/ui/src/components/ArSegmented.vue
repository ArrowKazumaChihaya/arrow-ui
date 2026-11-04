<script setup lang="ts">
/**
 * ArSegmented 1.2 — 2〜4つの表示の切り替え（セグメント）。ArRadioGroup の type="button" も同じ見た目（CSS は1つ）。大きさは sm 30・md 36・lg 42（ほかの入力と同じ段）。
 * radiogroup として読み上げ、←→（↑↓）で選び直す。選んでいるものだけ Tab で止まる。
 */
import { computed, nextTick, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArBadge from "./ArBadge.vue";
import type { ArSegmentedOption, ArSegmentedProps } from "./ArSegmented.contract";

const props = withDefaults(defineProps<ArSegmentedProps>(), { size: "md", block: false, disabled: false });
const emit = defineEmits<{ "update:modelValue": [value: string | number]; change: [value: string | number] }>();
const root = ref<HTMLElement | null>(null);
const opts = computed<ArSegmentedOption[]>(() =>
  props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o)),
);
const usable = (o: ArSegmentedOption) => !props.disabled && !o.disabled;
/** 選んでいるものが無い・使えないときは、最初の使えるものに Tab で止まる。 */
const tabStop = computed(() => {
  const cur = opts.value.find((o) => o.value === props.modelValue && usable(o));
  return (cur ?? opts.value.find(usable))?.value;
});

function select(o: ArSegmentedOption) {
  if (!usable(o) || o.value === props.modelValue) return;
  emit("update:modelValue", o.value);
  emit("change", o.value);
}
function onKeydown(e: KeyboardEvent, i: number) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  const list = opts.value;
  let target: number | undefined;
  if (step !== undefined) {
    for (let k = 1; k <= list.length; k++) {
      const j = (i + step * k + list.length * k) % list.length;
      if (usable(list[j]!)) {
        target = j;
        break;
      }
    }
  } else if (e.key === "Home") target = list.findIndex(usable);
  else if (e.key === "End") target = list.length - 1 - [...list].reverse().findIndex(usable);
  else return;
  e.preventDefault();
  if (target === undefined || target < 0) return;
  select(list[target]!);
  void nextTick(() => root.value?.querySelectorAll<HTMLElement>('[data-part="item"]')[target!]?.focus());
}
</script>

<template>
  <div
    ref="root"
    data-ar="segmented"
    data-part="root"
    role="radiogroup"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    :data-size="size"
    :data-block="block || undefined"
    :data-state="disabled ? 'disabled' : undefined"
  >
    <button
      v-for="(o, i) in opts"
      :key="String(o.value)"
      type="button"
      role="radio"
      data-part="item"
      :aria-checked="o.value === modelValue"
      :aria-label="o.iconOnly ? o.label : undefined"
      :title="o.iconOnly ? o.label : undefined"
      :data-state="[o.value === modelValue && 'selected', !usable(o) && 'disabled'].filter(Boolean).join(' ') || undefined"
      :data-icon-only="o.iconOnly || undefined"
      :disabled="!usable(o)"
      :tabindex="o.value === tabStop ? 0 : -1"
      @click="select(o)"
      @keydown="onKeydown($event, i)"
    >
      <ArIcon v-if="o.icon" :name="o.icon" data-part="icon" size="sm" />
      <span v-if="!o.iconOnly" data-part="label">{{ o.label }}</span>
      <ArBadge
        v-if="o.count && !o.iconOnly"
        data-part="count"
        :count="o.count"
        :tone="o.countTone ?? 'accent'"
        :variant="o.countTone && o.countTone !== 'accent' ? 'subtle' : 'solid'"
        label=""
      />
    </button>
  </div>
</template>
