<script setup lang="ts">
import { computed } from "vue";
import { useId } from "../provider/context";
import ArIcon from "./ArIcon.vue";
import type { ArFieldControlProps, ArFieldProps } from "./ArField.contract";

const props = withDefaults(defineProps<ArFieldProps>(), {
  required: false,
  help: undefined,
  error: undefined,
  layout: "stacked",
  labelSize: "md",
  requiredText: "必須",
});
defineSlots<{ default(props: ArFieldControlProps): unknown }>();

const id = useId("ar-field");
const helpId = `${id}-help`;
const errorId = `${id}-error`;
const control = computed<ArFieldControlProps>(() => {
  const describedBy = [props.error && errorId, props.help && helpId].filter(Boolean).join(" ");
  return {
    id,
    invalid: !!props.error,
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(props.error ? { "aria-invalid": "true" as const } : {}),
    ...(props.required ? { "aria-required": "true" as const } : {}),
  };
});
</script>

<template>
  <div
    data-ar="field"
    data-part="root"
    :data-layout="layout"
    :data-label-size="layout === 'inline' ? labelSize : undefined"
    :data-state="error ? 'invalid' : undefined"
  >
    <label data-part="label" :for="id"
      >{{ label }}<span v-if="required" data-part="required">{{ requiredText }}</span></label
    >
    <div data-part="control">
      <slot v-bind="control" />
      <p v-if="error" :id="errorId" data-part="error" role="alert"><ArIcon name="alert" size="sm" />{{ error }}</p>
      <p v-if="help" :id="helpId" data-part="help">{{ help }}</p>
    </div>
  </div>
</template>
