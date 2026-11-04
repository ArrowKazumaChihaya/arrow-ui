<script setup lang="ts">
/**
 * ArRadio 1.0 — 単独で置くラジオ。ArRadioGroup に並べられない所（表の行の頭、選択肢の行の中に表や入力を置く画面）で使う。
 * modelValue と value が同じなら選ばれた形。押すと update:modelValue に value を出す（今の ARROW の UI/Radio：value・thisValue）。
 * 中身は本物の input type="radio"。同じ name を付けたものの間は←→↑↓で移れる。
 */
import { computed } from "vue";
import type { ArRadioValue } from "./ArRadioGroup.contract";
import type { ArRadioProps } from "./ArRadio.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArRadioProps>(), { name: undefined, disabled: false, invalid: false, label: undefined, id: undefined });
const emit = defineEmits<{ "update:modelValue": [value: ArRadioValue]; change: [value: ArRadioValue] }>();
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
    data-part="root"
    :data-state="[checked && 'checked', disabled && 'disabled', invalid && 'invalid'].filter(Boolean).join(' ') || undefined"
  >
    <span data-part="control">
      <input
        :id="id"
        v-bind="{ ...$attrs, class: undefined, style: undefined }"
        data-part="input"
        type="radio"
        :name="name"
        :value="String(value)"
        :checked="checked"
        :disabled="disabled"
        :aria-label="$slots.default ? undefined : label"
        :aria-invalid="invalid ? 'true' : undefined"
        @change="select"
      />
      <span data-part="mark" aria-hidden="true" />
    </span>
    <span v-if="$slots.default" data-part="label"><slot /></span>
  </label>
</template>
