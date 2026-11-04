<script setup lang="ts">
/**
 * ArRadio 1.1 — ラジオ1つ。ArRadioGroup の各選択肢・ArChoiceCard の variant="radio" もこれで描く（丸の印・カードの見た目は1つだけ）。
 * 単独では ArRadioGroup に並べられない所（表の行の頭、選択肢の行の中に表や入力を置く画面）で使う。
 * modelValue と value が同じなら選ばれた形。押すと update:modelValue に value を出す（今の ARROW の UI/Radio：value・thisValue）。
 * 中身は本物の input type="radio"。同じ name を付けたものの間は←→↑↓で移れる。
 * 1.1：variant（plain・card）・size（sm・md・lg）・description。
 */
import { computed, useAttrs } from "vue";
import { useId } from "../provider/context";
import type { ArRadioValue } from "./ArRadioGroup.contract";
import type { ArRadioProps } from "./ArRadio.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArRadioProps>(), {
  name: undefined,
  disabled: false,
  invalid: false,
  label: undefined,
  id: undefined,
  variant: "plain",
  size: "md",
  description: undefined,
});
const emit = defineEmits<{ "update:modelValue": [value: ArRadioValue]; change: [value: ArRadioValue] }>();
const attrs = useAttrs();
const descId = useId("ar-radio-desc");
/** class・style・data-part（ArRadioGroup が "item" を渡す）は根に、ほかは input に付ける。 */
const rootPart = computed(() => (attrs["data-part"] as string | undefined) ?? "root");
const inputAttrs = computed(() => {
  const { class: _c, style: _s, "data-part": _p, ...rest } = attrs;
  return rest;
});
const checked = computed(() => props.modelValue === props.value);
function select() {
  if (props.disabled || checked.value) return;
  emit("update:modelValue", props.value);
  emit("change", props.value);
}
</script>

<template>
  <label
    :class="$attrs.class"
    :style="$attrs.style as any"
    data-ar="radio"
    :data-part="rootPart"
    :data-variant="variant"
    :data-size="size"
    :data-desc="description ? '' : undefined"
    :data-bare="$slots.default ? undefined : ''"
    :data-state="[checked && 'checked', disabled && 'disabled', invalid && 'invalid'].filter(Boolean).join(' ') || undefined"
  >
    <span data-part="control">
      <input
        :id="id"
        v-bind="inputAttrs"
        data-part="input"
        type="radio"
        :name="name"
        :value="String(value)"
        :checked="checked"
        :disabled="disabled"
        :aria-label="$slots.default ? undefined : label"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="description ? descId : undefined"
        @change="select"
      />
      <span data-part="mark" aria-hidden="true" />
    </span>
    <span v-if="$slots.default" data-part="label"><slot /></span>
    <span v-if="description" :id="descId" data-part="description">{{ description }}</span>
  </label>
</template>
