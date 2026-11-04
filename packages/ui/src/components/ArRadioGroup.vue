<script setup lang="ts">
/**
 * ArRadioGroup 1.2 — 選択肢から1つ選ぶ（並べて見せる）。7つ以上なら ArSelect を使う。
 * 1.2：各選択肢は ArRadio で描く（丸の印・カードの見た目は ArRadio・ArChoiceCard の variant="radio" と1つ）。
 * variant：card＝選ぶカード（年末調整の なし／あり。remix の既定）、plain＝丸と文字だけ（密集した所。classic の既定）。
 * size：sm・md・lg（ArSelect・ArTextInput と同じ段）。columns でカードを等しい幅の列に並べる。
 * type="button" はボタン型（ArSegmented と同じ形・同じ大きさの段）。どちらも中身は本物のラジオなので、←→↑↓で選べる。
 * 1.1：#label（{ option, checked }）で名前の所に任意の部品、#extra（{ option, checked }）で選択肢の下に表や入力を置ける
 * （extra はラジオの外に置くので、中の入力を押してもラジオは切り替わらない）。
 */
import { computed } from "vue";
import { useDesignForm, useId } from "../provider/context";
import ArRadio from "./ArRadio.vue";
import type { ArChoiceVariant, ArRadioOption, ArRadioValue, ArRadioGroupProps } from "./ArRadioGroup.contract";

const props = withDefaults(defineProps<ArRadioGroupProps>(), {
  type: "radio",
  variant: undefined,
  size: "md",
  direction: "horizontal",
  columns: undefined,
  block: false,
  disabled: false,
});
const emit = defineEmits<{ "update:modelValue": [value: ArRadioValue] }>();
const name = useId("ar-radio");
/** 形を省いたときはデザインの既定（remix＝card、classic＝plain。classic の forms に ArRadioGroup.variant）。 */
const designVariant = useDesignForm<ArChoiceVariant>("ArRadioGroup", "variant", "card");
const shape = computed<ArChoiceVariant>(() => props.variant ?? designVariant.value);
const grid = computed(() => (props.type === "radio" && props.columns && props.columns > 0 ? props.columns : undefined));
/** 無効のまとまり・無効の項目は、change が届いても値を出さない（選んでいる項目をもう一度選んでも出さない）。 */
function pick(o: ArRadioOption) {
  if (props.disabled || o.disabled || o.value === props.modelValue) return;
  emit("update:modelValue", o.value);
}
</script>

<template>
  <div
    data-ar="radio-group"
    data-part="root"
    role="radiogroup"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    :data-type="type"
    :data-variant="type === 'radio' ? shape : undefined"
    :data-size="size"
    :data-direction="type === 'button' ? 'horizontal' : direction"
    :data-block="block || undefined"
    :data-columns="grid"
    :style="grid ? { '--ar-choice-columns': grid } : undefined"
  >
    <template v-for="o in options" :key="String(o.value)">
      <ArRadio
        v-if="type === 'radio'"
        data-part="item"
        :model-value="modelValue"
        :value="o.value"
        :name="name"
        :variant="shape"
        :size="size"
        :description="o.description"
        :disabled="disabled || o.disabled"
        @update:model-value="pick(o)"
        ><slot name="label" :option="o" :checked="o.value === modelValue">{{ o.label }}</slot></ArRadio
      >
      <label
        v-else
        data-part="item"
        :data-state="[o.value === modelValue && 'checked', (disabled || o.disabled) && 'disabled'].filter(Boolean).join(' ') || undefined"
      >
        <span data-part="control">
          <input
            data-part="input"
            type="radio"
            :name="name"
            :value="String(o.value)"
            :checked="o.value === modelValue"
            :disabled="disabled || o.disabled"
            @change="pick(o)"
          />
        </span>
        <span data-part="label"><slot name="label" :option="o" :checked="o.value === modelValue">{{ o.label }}</slot></span>
      </label>
      <div v-if="type === 'radio' && $slots.extra" data-part="extra" :data-state="o.value === modelValue ? 'checked' : undefined">
        <slot name="extra" :option="o" :checked="o.value === modelValue" />
      </div>
    </template>
  </div>
</template>
