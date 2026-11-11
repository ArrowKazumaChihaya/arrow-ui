<script setup lang="ts">
/**
 * ArPeriodNav 1.1 — 期間（月・日）の切り替え。前へ・今の期間・次へを真ん中にそろえ、右端に「今日」。
 * size="md" は月（「2026年10月 ▾」、押すと pick）、size="lg" は日（「10月21日」と曜日の札）。
 * 今の期間が変わると読み上げる（aria-live）。前へ・次へはアイコンだけのボタンなので labels で名前を付ける。
 * 1.1：date と holidays から曜日の札と色（日曜・祝日は赤、土曜は青）を決め、祝日の名前を札の横に出す。
 */
import { computed, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArTooltip from "./ArTooltip.vue";
import type { ArPeriodNavProps } from "./ArPeriodNav.contract";

const props = withDefaults(defineProps<ArPeriodNavProps>(), {
  weekday: undefined,
  weekdayTone: undefined,
  date: undefined,
  holidays: undefined,
  weekdayNames: () => ["日", "月", "火", "水", "木", "金", "土"],
  size: "md",
  pickable: false,
  todayLabel: undefined,
  todayDisabled: false,
  prevDisabled: false,
  nextDisabled: false,
  arrows: true,
  inverse: false,
  labels: () => ({ prev: "前へ", next: "次へ", pick: "期間を選ぶ" }),
  hint: undefined,
});
/** 真ん中の文字。hint の吹き出しはここを指す（前へのボタンではなく）。 */
const labelEl = ref<HTMLElement | null>(null);
const hintOpen = ref(false);
const showHint = (open: boolean) => {
  if (props.hint) hintOpen.value = open;
};
const emit = defineEmits<{ prev: []; next: []; pick: [event: MouseEvent]; today: [] }>();

/** date の曜日（0＝日）。読めない日付なら null。 */
const dow = computed(() => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(props.date ?? "");
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getDay() : null;
});
/** 祝日の名前（名前のない一覧なら ""）。祝日でなければ null。 */
const holidayName = computed<string | null>(() => {
  const d = props.date?.slice(0, 10);
  const h = props.holidays;
  if (!d || !h) return null;
  if (Array.isArray(h)) return h.includes(d) ? "" : null;
  const map = h as Readonly<Record<string, string>>;
  return d in map ? (map[d] ?? "") : null;
});
const day = computed(() => props.weekday ?? (dow.value === null ? undefined : props.weekdayNames[dow.value]));
const tone = computed(() => props.weekdayTone ?? (holidayName.value !== null || dow.value === 0 ? "sun" : dow.value === 6 ? "sat" : undefined));
const spoken = computed(() => (day.value ? `（${day.value}${holidayName.value !== null ? `・祝日${holidayName.value ? `・${holidayName.value}` : ""}` : ""}）` : ""));
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
        ref="labelEl"
        data-part="label"
        :aria-label="`${label}${spoken}・${labels.pick}`"
        aria-haspopup="dialog"
        @click="emit('pick', $event)"
        @mouseenter="showHint(true)"
        @mouseleave="showHint(false)"
        @focus="showHint(true)"
        @blur="showHint(false)"
      >
        <span data-part="text" aria-live="polite">{{ label }}</span>
        <em v-if="day" data-part="weekday" :data-tone="tone" :data-holiday="holidayName !== null || undefined">{{ day }}</em>
        <small v-if="holidayName" data-part="holiday">{{ holidayName }}</small>
        <ArIcon name="cd" size="sm" data-part="caret" />
      </button>
      <b
        v-else
        ref="labelEl"
        data-part="label"
        aria-live="polite"
        :aria-label="spoken ? `${label}${spoken}` : undefined"
        @mouseenter="showHint(true)"
        @mouseleave="showHint(false)"
      >
        <span data-part="text">{{ label }}</span>
        <em v-if="day" data-part="weekday" :data-tone="tone" :data-holiday="holidayName !== null || undefined">{{ day }}</em>
        <small v-if="holidayName" data-part="holiday">{{ holidayName }}</small>
      </b>
      <button v-if="arrows" type="button" data-part="arrow" data-dir="next" :aria-label="labels.next" :title="labels.next" :disabled="nextDisabled" @click="emit('next')">
        <ArIcon name="cr" size="sm" />
      </button>
    </div>
    <button v-if="todayLabel" type="button" data-part="today" :disabled="todayDisabled" @click="emit('today')">{{ todayLabel }}</button>
    <ArTooltip v-if="hint" :title="hint" :open="hintOpen" :anchor="labelEl" placement="top" wide style="display: none" />
  </div>
</template>
