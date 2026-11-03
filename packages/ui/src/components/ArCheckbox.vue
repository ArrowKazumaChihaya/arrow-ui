<script setup lang="ts">
/** ArCheckbox 1.0 — チェック。default slot がラベル。indeterminate は「一部だけ」。 */
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
</script>

<template>
  <label
    data-ar="checkbox"
    data-part="root"
    :data-state="[modelValue && 'checked', indeterminate && 'indeterminate', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
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
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span data-part="box" aria-hidden="true">
        <ArIcon v-if="indeterminate" name="minus" size="sm" />
        <ArIcon v-else-if="modelValue" name="check" size="sm" />
      </span>
    </span>
    <span v-if="$slots.default" data-part="label"><slot /></span>
  </label>
</template>
