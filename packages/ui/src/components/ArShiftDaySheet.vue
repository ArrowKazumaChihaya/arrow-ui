<script setup lang="ts">
/**
 * ArShiftDaySheet 1.0 — スマホで日の詳細を下から出す画面（シート）。
 * ArDrawer の placement="bottom" の中に、右上の ×、前の日・日付と曜日・次の日（ArPeriodNav）、要約の札（ArDaySummary）、中身を
 * シフトのキャンバスの RxSpDay の並びで置く。ArDrawer の頭の題は読み上げだけに使い、見た目は日付の段が担う。
 */
import { computed } from "vue";
import ArDaySummary from "./ArDaySummary.vue";
import ArDrawer from "./ArDrawer.vue";
import ArPeriodNav from "./ArPeriodNav.vue";
import type { ArShiftDaySheetProps } from "./ArShiftDaySheet.contract";

const props = withDefaults(defineProps<ArShiftDaySheetProps>(), {
  weekday: undefined,
  weekdayTone: undefined,
  summary: () => [],
  published: undefined,
  publishDisabled: false,
  prevDisabled: false,
  nextDisabled: false,
  height: "calc(100% - 60px)",
  contained: false,
  teleportTo: "body",
  zIndex: undefined,
  labels: () => ({}),
});
const emit = defineEmits<{
  "update:open": [open: boolean];
  close: [];
  prev: [];
  next: [];
  "update:published": [value: boolean];
}>();

const title = computed(() => props.labels.title ?? "シフト詳細");
const hasSummary = computed(() => props.summary.length > 0 || props.published !== undefined);
</script>

<template>
  <ArDrawer
    :open="open"
    placement="bottom"
    :title="title"
    :height="height"
    :contained="contained"
    :teleport-to="teleportTo"
    :z-index="zIndex"
    :labels="{ close: labels.close ?? '閉じる' }"
    data-sheet="shift-day"
    @update:open="emit('update:open', $event)"
    @close="emit('close')"
  >
    <div data-ar="shift-day-sheet" data-part="root">
      <ArPeriodNav
        size="lg"
        :label="label"
        :weekday="weekday"
        :weekday-tone="weekdayTone"
        :prev-disabled="prevDisabled"
        :next-disabled="nextDisabled"
        :labels="{ prev: labels.prev ?? '前の日', next: labels.next ?? '次の日', pick: '' }"
        @prev="emit('prev')"
        @next="emit('next')"
      />
      <ArDaySummary
        v-if="hasSummary"
        :items="summary"
        :published="published"
        :publish-disabled="publishDisabled"
        @update:published="emit('update:published', $event)"
      />
      <div data-part="body"><slot /></div>
    </div>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </ArDrawer>
</template>
