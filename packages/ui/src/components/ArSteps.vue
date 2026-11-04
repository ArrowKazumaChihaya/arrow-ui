<script setup lang="ts">
/**
 * ArSteps 1.1 — 手順。横・縦（承認の流れ）・mini（ポップアップの上の小さな手順）。
 * 今はテーマ色、済みは淡い面（mini は緑の丸にチェック）、エラーは赤。clickable なら済んだ手順を押して戻れる。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ArStepsProps, ArStepStatus } from "./ArSteps.contract";

const props = withDefaults(defineProps<ArStepsProps>(), {
  current: 0,
  status: "process",
  direction: "horizontal",
  size: "default",
  clickable: false,
  label: "手順",
  responsive: true,
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
/* 幅が足りないときは縦に並べる（ResizeObserver で根の幅を見る）。 */
const root = ref<HTMLElement | null>(null);
const width = ref<number | null>(null);
const perStep = computed(() => (props.responsive === false ? 0 : typeof props.responsive === "number" ? props.responsive : 150));
/* 縦にしたら、下限より 24px 広くなるまで横に戻さない（行き来して揺れないように）。 */
const narrow = ref(false);
const shownDirection = computed(() => {
  if (props.size === "mini") return "horizontal";
  if (props.direction === "vertical") return "vertical";
  return narrow.value ? "vertical" : "horizontal";
});
function judge() {
  const min = perStep.value * props.items.length;
  const w = width.value;
  if (!min || w === null || w <= 0) narrow.value = false;
  else if (w < min) narrow.value = true;
  else if (w >= min + 24) narrow.value = false;
}
let ro: ResizeObserver | undefined;
onMounted(() => {
  if (!root.value || typeof ResizeObserver === "undefined") return;
  ro = new ResizeObserver((es) => {
    const el = es[0]?.target as HTMLElement | undefined;
    width.value = el ? el.getBoundingClientRect().width : null;
    judge();
  });
  ro.observe(root.value);
});
onBeforeUnmount(() => ro?.disconnect());
watch(() => [props.items.length, perStep.value], judge);
function pick(i: number) {
  emit("update:current", i);
  emit("change", i);
}
</script>

<template>
  <ol data-ar="steps" data-part="root" ref="root" :data-direction="shownDirection" :data-responsive="shownDirection !== direction && size !== 'mini' ? '' : undefined" :data-size="size" :aria-label="label">
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
