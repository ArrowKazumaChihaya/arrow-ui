<script setup lang="ts">
/**
 * ArStatistic 1.0 — 大きな数字（今月の人件費・出勤人数）。
 * 数字は等幅、単位は小さく、増減は意味の色（増＝緑・減＝赤）。
 */
import { computed } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArStatisticProps } from "./ArStatistic.contract";

const props = withDefaults(defineProps<ArStatisticProps>(), {
  title: undefined,
  titleIcon: undefined,
  precision: undefined,
  prefix: undefined,
  suffix: undefined,
  trend: undefined,
  trendValue: undefined,
  trendTone: "auto",
  trendLabel: undefined,
  trendPlacement: "inline",
  tone: "default",
  size: "md",
});
const text = computed(() =>
  typeof props.value === "number"
    ? props.value.toLocaleString("ja-JP", { minimumFractionDigits: props.precision, maximumFractionDigits: props.precision ?? 20 })
    : props.value,
);
</script>

<template>
  <div data-ar="statistic" data-part="root" :data-tone="tone" :data-size="size">
    <div v-if="title || $slots.title" data-part="title">
      <slot name="title">{{ title }}</slot><ArIcon v-if="titleIcon" :name="titleIcon" size="sm" data-part="title-icon" />
    </div>
    <div data-part="content">
      <span v-if="prefix" data-part="prefix">{{ prefix }}</span>
      <span data-part="value"><slot>{{ text }}</slot></span>
      <small v-if="suffix" data-part="suffix">{{ suffix }}</small>
      <span v-if="trend" data-part="trend" :data-trend="trend" :data-tone="trendTone" :data-placement="trendPlacement">
        <ArIcon v-if="trend !== 'flat'" line :name="trend === 'up' ? 'up' : 'down'" size="sm" />
        <span data-ar-visually-hidden>{{ trendLabel ?? (trend === "up" ? "増加" : trend === "down" ? "減少" : "変化なし") }}</span>{{ trendValue }}
      </span>
    </div>
  </div>
</template>
