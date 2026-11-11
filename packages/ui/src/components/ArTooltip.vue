<script setup lang="ts">
/**
 * ArTooltip 1.1 — 短い説明の吹き出し（濃い ink の吹き出し。remix はシフトの .r-tip の形、classic は antd の Tooltip）。
 * 乗せると少し遅れて出て、フォーカスではすぐ出る。Escape で消える。吹き出しへ移る間は消さない。
 * アイコンだけのボタンには必ず付ける。説明は基準の要素の aria-describedby で読み上げる。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ArFloat from "../internal/ArFloat.vue";
import { delayed, setAria, triggerTarget } from "../internal/trigger";
import { useId } from "../provider/context";
import type { ArTooltipProps } from "./ArTooltip.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArTooltipProps>(), {
  title: undefined,
  placement: "top",
  tone: "ink",
  delay: 100,
  hideDelay: 100,
  disabled: false,
  open: undefined,
  wide: false,
  anchor: undefined,
});
const emit = defineEmits<{ "update:open": [open: boolean] }>();
const id = useId("ar-tooltip");
const wrap = ref<HTMLElement | null>(null);
/** 吹き出しが指す要素：包みの中の最初の操作できる要素（包みが親いっぱいに伸びても中身を指す）。 */
const anchorEl = computed(() => props.anchor ?? triggerTarget(wrap.value));
const inner = ref(false);
const shown = computed(() => !props.disabled && (props.open ?? inner.value));
const timer = delayed();

function set(v: boolean) {
  const was = shown.value;
  inner.value = v;
  if (was !== v) emit("update:open", v);
}
const show = (ms = props.delay) => timer.run(ms, () => set(true));
const hide = (ms = props.hideDelay) => timer.run(ms, () => set(false));

function onFocusIn(e: FocusEvent) {
  // マウスで押したときのフォーカスでは出し直さない（乗せたときの遅れに任せる）
  let visible = true;
  try {
    visible = (e.target as HTMLElement).matches(":focus-visible");
  } catch {
    /* :focus-visible を知らない環境ではいつも出す */
  }
  if (visible) show(0);
}

watch(shown, (v) => setAria(anchorEl.value, "aria-describedby", v ? id : undefined));
onMounted(() => shown.value && setAria(anchorEl.value, "aria-describedby", id));
onBeforeUnmount(() => timer.clear());
</script>

<template>
  <span
    ref="wrap"
    v-bind="$attrs"
    data-ar="tooltip"
    data-part="trigger"
    @mouseenter="show()"
    @mouseleave="hide()"
    @focusin="onFocusIn"
    @focusout="hide(0)"
  >
    <slot />
  </span>
  <ArFloat
    :id="id"
    :open="shown"
    :anchor="anchorEl"
    :placement="placement"
    :offset="9"
    :close-on-outside="false"
    ar="tooltip"
    role="tooltip"
    @close="hide(0)"
  >
    <span data-part="panel" :data-tone="tone" :data-wide="wide || undefined" @mouseenter="timer.clear()" @mouseleave="hide()">
      <span data-part="arrow" aria-hidden="true" />
      <span data-part="body"><slot name="content">{{ title }}</slot></span>
    </span>
  </ArFloat>
</template>
