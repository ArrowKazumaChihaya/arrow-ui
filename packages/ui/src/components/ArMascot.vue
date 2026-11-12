<script setup lang="ts">
/**
 * ArMascot 1.0 — マスコット（動くキャラクター）。製品が渡した絵（SVG）と動き（CSS）を表示し、名前で指定した動きを再生する。
 * 1回だけの動きは終わると待機の動きへ戻り、motionend を知らせる。動きを減らす設定の人には動かさない。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ArMascotProps } from "./ArMascot.contract";
import { mountMascotCss, scopeMascotSvg } from "./ArMascot.artwork";

const props = withDefaults(defineProps<ArMascotProps>(), { motion: undefined, replay: 0, loop: undefined, paused: false, size: undefined });
const emit = defineEmits<{ motionend: [motion: string] }>();

const figure = ref<HTMLElement>();
const idle = computed(() => props.artwork.idle ?? "idle");
/** いま再生している動き。1回だけの動きが終わると待機の動きになる。 */
const playing = ref("");
const once = ref(false);
const markup = computed(() => scopeMascotSvg(props.artwork));
let timer: ReturnType<typeof setTimeout> | undefined;

function play(name: string | undefined): void {
  clearTimeout(timer);
  const motions = props.artwork.motions;
  const motion = name && motions[name] ? name : idle.value;
  const entry = motions[motion];
  playing.value = motion;
  once.value = entry ? !(props.loop ?? entry.loop) : false;
  const svg = figure.value?.querySelector("svg");
  if (!svg || !entry) return;
  // いったん動きを外して描き直させると、同じ動きでも最初から再生される。
  svg.setAttribute("data-motion", "none");
  void svg.getBoundingClientRect();
  svg.style.setProperty("--duration", `${entry.seconds}s`);
  if (entry.expression) svg.setAttribute("data-expression", entry.expression);
  else svg.removeAttribute("data-expression");
  svg.setAttribute("data-motion", motion);
  if (once.value && motion !== idle.value)
    timer = setTimeout(() => {
      emit("motionend", motion);
      play(idle.value);
    }, entry.seconds * 1000);
}

onMounted(() => {
  mountMascotCss(props.artwork);
  play(props.motion);
});
watch(
  () => props.artwork,
  (artwork) => {
    mountMascotCss(artwork);
    // 絵が入れ替わってから動きを付ける。
    void Promise.resolve().then(() => play(props.motion));
  },
  { flush: "post" },
);
watch([() => props.motion, () => props.replay, () => props.loop], () => play(props.motion));
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <span
    data-ar="mascot"
    data-part="root"
    role="img"
    :aria-label="label"
    :data-artwork="artwork.id"
    :data-motion="playing || undefined"
    :data-once="once || undefined"
    :data-paused="paused || undefined"
    :style="size === undefined ? undefined : { '--ar-mascot-size': typeof size === 'number' ? `${size}px` : size }"
  >
    <!-- eslint-disable-next-line vue/no-v-html -- 製品が用意した絵だけを受け取る（契約）。危ない内容は scopeMascotSvg が落とす。 -->
    <span ref="figure" data-part="figure" aria-hidden="true" v-html="markup" />
  </span>
</template>
