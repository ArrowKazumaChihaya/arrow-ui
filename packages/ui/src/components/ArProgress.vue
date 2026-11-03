<script setup lang="ts">
/**
 * ArProgress 1.0 — 進み具合。線・円・刻み（steps）。進行はテーマ色、終わりは緑、失敗は赤。提出率などにも使う。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArProgressProps } from "./ArProgress.contract";

const props = withDefaults(defineProps<ArProgressProps>(), {
  type: "line",
  percent: 0,
  status: undefined,
  steps: 5,
  size: "md",
  showInfo: true,
  label: undefined,
  ariaLabel: undefined,
});
const pct = computed(() => Math.max(0, Math.min(100, Number.isFinite(props.percent) ? props.percent : 0)));
const state = computed(() => props.status ?? (pct.value >= 100 ? "success" : "normal"));
const onSteps = computed(() => Math.round((pct.value / 100) * props.steps));
const info = computed(() => props.label ?? (props.type === "steps" ? `${onSteps.value}/${props.steps}` : `${Math.round(pct.value)}%`));
/** 円：md は 96px（半径42・太さ8）、sm は 56px（半径23・太さ6）。 */
const ring = computed(() => (props.size === "sm" ? { box: 56, r: 23, w: 6 } : { box: 96, r: 42, w: 8 }));
const circ = computed(() => 2 * Math.PI * ring.value.r);
const icon = computed(() => (state.value === "success" ? "check" : state.value === "exception" ? "alert" : null));
</script>

<template>
  <div
    data-ar="progress"
    data-part="root"
    :data-type="type"
    :data-status="state"
    :data-size="type === 'circle' ? size : undefined"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(pct)"
    :aria-valuetext="label"
    :aria-label="ariaLabel"
  >
    <template v-if="type === 'circle'">
      <svg data-part="ring" :viewBox="`0 0 ${ring.box} ${ring.box}`" aria-hidden="true">
        <circle data-part="ring-track" :cx="ring.box / 2" :cy="ring.box / 2" :r="ring.r" fill="none" :stroke-width="ring.w" />
        <circle
          v-if="pct > 0"
          data-part="ring-bar"
          :cx="ring.box / 2"
          :cy="ring.box / 2"
          :r="ring.r"
          fill="none"
          :stroke-width="ring.w"
          stroke-linecap="round"
          :stroke-dasharray="circ.toFixed(1)"
          :stroke-dashoffset="(circ * (1 - pct / 100)).toFixed(1)"
        />
      </svg>
      <span v-if="showInfo" data-part="info">
        <ArIcon v-if="icon && !label" :name="icon" size="sm" /><template v-else>{{ info }}</template>
      </span>
    </template>
    <template v-else>
      <div data-part="track">
        <template v-if="type === 'steps'">
          <i v-for="n in steps" :key="n" data-part="step" :data-state="n <= onSteps ? 'on' : undefined" />
        </template>
        <i v-else data-part="bar" :style="{ width: `${pct}%` }" />
      </div>
      <span v-if="showInfo" data-part="info">
        <ArIcon v-if="icon && !label" :name="icon" size="sm" /><template v-else>{{ info }}</template>
      </span>
    </template>
  </div>
</template>
