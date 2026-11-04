<script setup lang="ts">
/**
 * ArCheckboxGroup 1.1 — 選択肢から いくつでも選ぶ（並べて見せる）。
 * checkAll で上に「すべて」を出す。一部だけ選んでいるときは indeterminate。押せない選択肢は「すべて」でも変えない。
 * 1.1：variant（card・plain。省くとデザインの既定）・size（sm・md・lg）・columns・選択肢の description。ArRadioGroup と同じ考え方。
 */
import { computed } from "vue";
import { useDesignForm } from "../provider/context";
import ArCheckbox from "./ArCheckbox.vue";
import type { ArCheckboxGroupProps, ArCheckboxValue } from "./ArCheckboxGroup.contract";
import type { ArChoiceVariant } from "./ArRadioGroup.contract";

const props = withDefaults(defineProps<ArCheckboxGroupProps>(), {
  direction: "horizontal",
  variant: undefined,
  size: "md",
  columns: undefined,
  checkAll: false,
  disabled: false,
});
/** 形を省いたときはデザインの既定（remix＝card、classic＝plain。classic の forms に ArCheckboxGroup.variant）。 */
const designVariant = useDesignForm<ArChoiceVariant>("ArCheckboxGroup", "variant", "card");
const shape = computed<ArChoiceVariant>(() => props.variant ?? designVariant.value);
const grid = computed(() => (props.columns && props.columns > 0 ? props.columns : undefined));
const emit = defineEmits<{ "update:modelValue": [value: ArCheckboxValue[]] }>();

const has = (v: ArCheckboxValue) => props.modelValue.includes(v);
const ordered = (set: Set<ArCheckboxValue>) => props.options.map((o) => o.value).filter((v) => set.has(v));

function toggle(v: ArCheckboxValue, on: boolean) {
  const set = new Set(props.modelValue);
  if (on) set.add(v);
  else set.delete(v);
  emit("update:modelValue", ordered(set));
}

const enabled = computed(() => props.options.filter((o) => !o.disabled));
const allOn = computed(() => enabled.value.length > 0 && enabled.value.every((o) => has(o.value)));
const someOn = computed(() => !allOn.value && props.options.some((o) => has(o.value)));
const allLabel = computed(() => (typeof props.checkAll === "string" ? props.checkAll : "すべて"));

function toggleAll(on: boolean) {
  const set = new Set(props.modelValue);
  for (const o of enabled.value) {
    if (on) set.add(o.value);
    else set.delete(o.value);
  }
  emit("update:modelValue", ordered(set));
}
</script>

<template>
  <div
    data-ar="checkbox-group"
    data-part="root"
    role="group"
    :aria-label="label"
    :data-direction="direction"
    :data-variant="shape"
    :data-size="size"
    :data-columns="grid"
    :style="grid ? { '--ar-choice-columns': grid } : undefined"
  >
    <ArCheckbox
      v-if="checkAll"
      data-part="all"
      :variant="shape"
      :size="size"
      :model-value="allOn"
      :indeterminate="someOn"
      :disabled="disabled || enabled.length === 0"
      @update:model-value="toggleAll"
    >
      {{ allLabel }}
    </ArCheckbox>
    <div data-part="list">
      <ArCheckbox
        v-for="o in options"
        :key="String(o.value)"
        :model-value="has(o.value)"
        :variant="shape"
        :size="size"
        :description="o.description"
        :disabled="disabled || o.disabled"
        @update:model-value="(on: boolean) => toggle(o.value, on)"
      >
        {{ o.label }}
      </ArCheckbox>
    </div>
  </div>
</template>
