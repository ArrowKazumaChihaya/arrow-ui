<script setup lang="ts">
/**
 * ArCheckbox 1.1 — チェック（18px・角丸5）。default slot がラベル。
 * indeterminate は「一部だけ」（テーマ色に白い横線）。表の行・見出しでは slot なしで label（読み上げ）だけ渡す。
 * 1.1：variant（plain・card。card はラジオの card と同じ面）・size（sm・md・lg）・description・
 * decorative（input を持たない見た目だけの印。役目を持つ親の中に置く）。
 */
import { onMounted, ref, watch } from "vue";
import { useId } from "../provider/context";
import ArIcon from "./ArIcon.vue";
import type { ArCheckboxProps } from "./ArCheckbox.contract";

const props = withDefaults(defineProps<ArCheckboxProps>(), {
  indeterminate: false,
  disabled: false,
  label: undefined,
  id: undefined,
  variant: "plain",
  size: "md",
  description: undefined,
  decorative: false,
});
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const input = ref<HTMLInputElement | null>(null);
const descId = useId("ar-check-desc");
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
  <component
    :is="decorative ? 'span' : 'label'"
    data-ar="checkbox"
    data-part="root"
    :data-variant="variant"
    :data-size="size"
    :data-desc="description ? '' : undefined"
    :data-decorative="decorative ? '' : undefined"
    :aria-hidden="decorative ? 'true' : undefined"
    :data-state="[indeterminate ? 'indeterminate' : modelValue && 'checked', disabled && 'disabled'].filter(Boolean).join(' ') || undefined"
    :data-bare="$slots.default ? undefined : ''"
  >
    <span data-part="control">
      <input
        v-if="!decorative"
        :id="id"
        ref="input"
        data-part="input"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :aria-label="$slots.default ? undefined : label"
        :aria-checked="indeterminate ? 'mixed' : undefined"
        :aria-describedby="description ? descId : undefined"
        @change="onChange"
      />
      <span data-part="box" aria-hidden="true">
        <span v-if="indeterminate" data-part="mark" data-kind="dash" />
        <ArIcon line v-else-if="modelValue" name="check" size="sm" data-part="mark" />
      </span>
    </span>
    <span v-if="$slots.default" data-part="label"><slot /></span>
    <span v-if="description" :id="descId" data-part="description">{{ description }}</span>
  </component>
</template>
