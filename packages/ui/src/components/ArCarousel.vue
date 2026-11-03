<script setup lang="ts">
/**
 * ArCarousel 1.0 — お知らせの切り替え。地は帯と同じやわらかいテーマ色のグラデーション、白い太字、下に点、左右に前後のボタン。
 * ←→ で前後へ（フォーカスがあるとき）。自動の切り替えは乗せている間・フォーカスの間は止まる。
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import ArIcon from "./ArIcon.vue";
import { useId } from "../provider/context";
import type { ArCarouselItem, ArCarouselProps } from "./ArCarousel.contract";

const props = withDefaults(defineProps<ArCarouselProps>(), {
  modelValue: undefined,
  autoplay: false,
  loop: true,
  arrows: true,
  dots: true,
  height: undefined,
  label: undefined,
  labels: () => ({ prev: "前のお知らせ", next: "次のお知らせ", slide: "枚目" }),
});
const emit = defineEmits<{ "update:modelValue": [index: number] }>();
defineSlots<{ item?: (p: { item: ArCarouselItem; index: number }) => unknown }>();

const id = useId("ar-carousel");
const inner = ref(0);
const count = computed(() => props.items.length);
const current = computed(() => Math.min(Math.max(0, props.modelValue ?? inner.value), Math.max(0, count.value - 1)));
const canPrev = computed(() => props.loop || current.value > 0);
const canNext = computed(() => props.loop || current.value < count.value - 1);

function go(i: number) {
  if (!count.value) return;
  const n = props.loop ? (i + count.value) % count.value : Math.min(Math.max(0, i), count.value - 1);
  inner.value = n;
  emit("update:modelValue", n);
}
const prev = () => canPrev.value && go(current.value - 1);
const next = () => canNext.value && go(current.value + 1);

function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    prev();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    next();
  }
}

/* 自動で切り替える */
const paused = ref(false);
const interval = computed(() => (props.autoplay === true ? 5000 : typeof props.autoplay === "number" ? props.autoplay : 0));
let t: ReturnType<typeof setInterval> | undefined;
watch(
  [interval, paused, count],
  ([ms, p, n]) => {
    clearInterval(t);
    if (ms > 0 && !p && n > 1) t = setInterval(() => go(current.value + 1 >= n && !props.loop ? 0 : current.value + 1), ms);
  },
  { immediate: true },
);
onBeforeUnmount(() => clearInterval(t));

const titleOf = (it: ArCarouselItem) => (typeof it === "string" ? it : it.title);
const descOf = (it: ArCarouselItem) => (typeof it === "string" ? undefined : it.description);
const heightStyle = computed(() =>
  props.height === undefined ? undefined : { height: typeof props.height === "number" ? `${props.height}px` : props.height },
);
</script>

<template>
  <section
    data-ar="carousel"
    data-part="root"
    aria-roledescription="carousel"
    :aria-label="label"
    :style="heightStyle"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
    @keydown="onKey"
  >
    <div data-part="viewport" :aria-live="interval && !paused ? 'off' : 'polite'">
      <div data-part="track" :style="{ transform: `translateX(${-current * 100}%)` }">
        <div
          v-for="(it, i) in items"
          :id="`${id}-${i}`"
          :key="i"
          data-part="slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} / ${count}`"
          :aria-hidden="i !== current || undefined"
          :inert="i !== current || undefined"
          :data-state="i === current ? 'current' : undefined"
        >
          <slot name="item" :item="it" :index="i">
            <div data-part="title">{{ titleOf(it) }}</div>
            <div v-if="descOf(it)" data-part="description">{{ descOf(it) }}</div>
          </slot>
        </div>
      </div>
    </div>
    <template v-if="arrows && count > 1">
      <button type="button" data-part="prev" :aria-label="labels.prev" :disabled="!canPrev" @click="prev">
        <ArIcon line name="cl" size="sm" />
      </button>
      <button type="button" data-part="next" :aria-label="labels.next" :disabled="!canNext" @click="next">
        <ArIcon line name="cr" size="sm" />
      </button>
    </template>
    <div v-if="dots && count > 1" data-part="dots">
      <button
        v-for="(_, i) in items"
        :key="i"
        type="button"
        data-part="dot"
        :data-state="i === current ? 'current' : undefined"
        :aria-label="`${i + 1}${labels.slide}`"
        :aria-current="i === current || undefined"
        :aria-controls="`${id}-${i}`"
        @click="go(i)"
      />
    </div>
  </section>
</template>
