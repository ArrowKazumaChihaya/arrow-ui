<script setup lang="ts">
/**
 * ArCheckbox 1.0 — チェック（18px・角丸5）。default slot がラベル。
 * indeterminate は「一部だけ」（テーマ色に白い横線）。表の行・見出しでは slot なしで label（読み上げ）だけ渡す。
 */
import { onMounted, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArCheckboxProps } from "./ArCheckbox.contract";

const props = withDefaults(defineProps<ArCheckboxProps>(), {
  indeterminate: false,
  disabled: false,
  label: undefined,
  id: undefined,
});
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const input = ref<HTMLInputElement | null>(null);
const sync = () => input.value && (input.value.indeterminate = props.indeterminate);
onMounted(sync);
watch(() => props.indeterminate, sync);
function onChange(e: Event) {
  const el = e.target as HTMLInputElement;
  emit("update:modelValue", el.checked);
  // 親が値を変えないときも見た目を値に合わせる
  el.checked = props.modelValue;
  sync();
}
</script>

<template>
  <label
    data-ar="checkbox"
    data-part="root"
    :data-state="[indeterminate ? 'indeterminate' : modelValue && 'checked', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
    :data-bare="$slots.default ? undefined : ''"
  >
    <span data-part="control">
      <input
        :id="id"
        ref="input"
        data-part="input"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :aria-label="$slots.default ? undefined : label"
        :aria-checked="indeterminate ? 'mixed' : undefined"
        @change="onChange"
      />
      <span data-part="box" aria-hidden="true">
        <span v-if="indeterminate" data-part="mark" data-kind="dash" />
        <ArIcon v-else-if="modelValue" name="check" size="sm" data-part="mark" />
      </span>
    </span>
    <span v-if="$slots.default" data-part="label"><slot /></span>
  </label>
</template>
