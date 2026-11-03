<script setup lang="ts">
/**
 * ArSteps 1.0 — 手順。横・縦（承認の流れ）・mini（ポップアップの上の小さな手順）。
 * 今はテーマ色、済みは淡い面（mini は緑の丸にチェック）、エラーは赤。clickable なら済んだ手順を押して戻れる。
 */
import { computed } from "vue";
import type { ArStepsProps, ArStepStatus } from "./ArSteps.contract";

const props = withDefaults(defineProps<ArStepsProps>(), {
  current: 0,
  status: "process",
  direction: "horizontal",
  size: "default",
  clickable: false,
  label: "手順",
});
const emit = defineEmits<{ "update:current": [index: number]; change: [index: number] }>();
const steps = computed(() =>
  props.items.map((it, i) => {
    const status: ArStepStatus = it.status ?? (i < props.current ? "finish" : i === props.current ? props.status : "wait");
    const canClick = props.clickable && !it.disabled && i !== props.current && (status === "finish" || i < props.current);
    return { ...it, i, status, canClick };
  }),
);
const mark = (s: { status: ArStepStatus; i: number }) => (s.status === "finish" ? "✓" : s.status === "error" ? "!" : String(s.i + 1));
const statusText = (s: ArStepStatus) => ({ wait: "未", process: "今", finish: "済み", error: "エラー" })[s];
function pick(i: number) {
  emit("update:current", i);
  emit("change", i);
}
</script>

<template>
  <ol data-ar="steps" data-part="root" :data-direction="size === 'mini' ? 'horizontal' : direction" :data-size="size" :aria-label="label">
    <template v-for="s in steps" :key="s.i">
      <li v-if="size === 'mini' && s.i > 0" data-part="connector" aria-hidden="true" />
      <li data-part="step" :data-status="s.status" :data-disabled="s.disabled || undefined" :aria-current="s.i === current ? 'step' : undefined">
        <component
          :is="s.canClick ? 'button' : 'div'"
          :type="s.canClick ? 'button' : undefined"
          data-part="body"
          :data-clickable="s.canClick || undefined"
          @click="s.canClick && pick(s.i)"
        >
          <span data-part="icon" aria-hidden="true">{{ mark(s) }}</span>
          <span data-part="content">
            <span data-part="title">{{ s.title }}<span data-ar-visually-hidden>（{{ statusText(s.status) }}）</span></span>
            <span v-if="s.description && size !== 'mini'" data-part="description">{{ s.description }}</span>
          </span>
        </component>
      </li>
    </template>
  </ol>
</template>
