<script setup lang="ts">
/**
 * ArPeriodNav 1.0 — 期間（月・日）の切り替え。前へ・今の期間・次へを真ん中にそろえ、右端に「今日」。
 * size="md" は月（「2026年10月 ▾」、押すと pick）、size="lg" は日（「10月21日」と曜日の札）。
 * 今の期間が変わると読み上げる（aria-live）。前へ・次へはアイコンだけのボタンなので labels で名前を付ける。
 */
import ArIcon from "./ArIcon.vue";
import type { ArPeriodNavProps } from "./ArPeriodNav.contract";

withDefaults(defineProps<ArPeriodNavProps>(), {
  weekday: undefined,
  weekdayTone: undefined,
  size: "md",
  pickable: false,
  todayLabel: undefined,
  todayDisabled: false,
  prevDisabled: false,
  nextDisabled: false,
  arrows: true,
  inverse: false,
  labels: () => ({ prev: "前へ", next: "次へ", pick: "期間を選ぶ" }),
});
const emit = defineEmits<{ prev: []; next: []; pick: [event: MouseEvent]; today: [] }>();
</script>

<template>
  <div data-ar="period-nav" data-part="root" :data-size="size" :data-arrows="arrows ? undefined : 'none'" :data-inverse="inverse || undefined">
    <div data-part="center">
      <button v-if="arrows" type="button" data-part="arrow" data-dir="prev" :aria-label="labels.prev" :title="labels.prev" :disabled="prevDisabled" @click="emit('prev')">
        <ArIcon name="cl" size="sm" />
      </button>
      <button
        v-if="pickable"
        type="button"
        data-part="label"
        :aria-label="`${label}${weekday ? `（${weekday}）` : ''}・${labels.pick}`"
        aria-haspopup="dialog"
        @click="emit('pick', $event)"
      >
        <span data-part="text" aria-live="polite">{{ label }}</span>
        <em v-if="weekday" data-part="weekday" :data-tone="weekdayTone">{{ weekday }}</em>
        <ArIcon name="cd" size="sm" data-part="caret" />
      </button>
      <b v-else data-part="label" aria-live="polite">
        <span data-part="text">{{ label }}</span>
        <em v-if="weekday" data-part="weekday" :data-tone="weekdayTone">{{ weekday }}</em>
      </b>
      <button v-if="arrows" type="button" data-part="arrow" data-dir="next" :aria-label="labels.next" :title="labels.next" :disabled="nextDisabled" @click="emit('next')">
        <ArIcon name="cr" size="sm" />
      </button>
    </div>
    <button v-if="todayLabel" type="button" data-part="today" :disabled="todayDisabled" @click="emit('today')">{{ todayLabel }}</button>
  </div>
</template>
