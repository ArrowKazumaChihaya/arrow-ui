<script setup lang="ts">
/**
 * ArCountdown 1.0 — しめきりまでの残り（Statistic.Timer）。残りが少ないと橙になる。
 * 見た目は ArStatistic のもの（この部品は残りを数えるだけ）。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ArStatistic from "./ArStatistic.vue";
import type { ArCountdownProps } from "./ArStatistic.contract";

const props = withDefaults(defineProps<ArCountdownProps>(), {
  title: undefined,
  format: undefined,
  warnWithin: 3 * 24 * 60 * 60 * 1000,
  size: "md",
});
const emit = defineEmits<{ finish: [] }>();
const now = ref(Date.now());
const end = computed(() => (props.target instanceof Date ? props.target.getTime() : props.target));
const left = computed(() => Math.max(0, end.value - now.value));
const pad = (n: number) => String(n).padStart(2, "0");
const text = computed(() => {
  const s = Math.floor(left.value / 1000);
  const d = Math.floor(s / 86400);
  const parts = { D: String(d), HH: pad(Math.floor((s % 86400) / 3600)), mm: pad(Math.floor((s % 3600) / 60)), ss: pad(s % 60) };
  const f = props.format ?? (d > 0 ? "D日 HH:mm:ss" : "HH:mm:ss");
  return f.replace(/D|HH|mm|ss/g, (k) => parts[k as keyof typeof parts]);
});
let timer: ReturnType<typeof setInterval> | undefined;
let done = false;
function tick() {
  now.value = Date.now();
  if (left.value === 0 && !done) {
    done = true;
    clearInterval(timer);
    emit("finish");
  }
}
onMounted(() => {
  tick();
  if (!done) timer = setInterval(tick, 1000);
});
onBeforeUnmount(() => clearInterval(timer));
watch(end, () => {
  done = false;
  clearInterval(timer);
  tick();
  if (!done) timer = setInterval(tick, 1000);
});
</script>

<template>
  <ArStatistic
    :title="title"
    :value="text"
    :size="size"
    :tone="left > 0 && left < warnWithin ? 'warn' : 'default'"
    data-kind="countdown"
    role="timer"
  />
</template>
