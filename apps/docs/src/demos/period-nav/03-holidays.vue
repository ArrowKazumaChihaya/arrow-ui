<!-- 祝日を渡す（日の切り替え） | date（"YYYY-MM-DD"）と holidays（日付の配列か、日付 → 名前）を渡すと、曜日の札と色を部品が決める。日曜・祝日は赤、土曜は青。名前を渡すと remix は札の横に「文化の日」、classic は今の DateChanger と同じく色だけ。weekday・weekdayTone は渡さなくてよい。 -->
<script setup lang="ts">
import { ArPeriodNav, ArStack } from "@arrow/ui";
import { computed, ref } from "vue";
/** 製品は API の祝日（national_holiday_date_array など）をそのまま渡す。 */
const holidays = { "2026-11-03": "文化の日", "2026-11-23": "勤労感謝の日" };
const d = ref(3);
const date = computed(() => `2026-11-${String(d.value).padStart(2, "0")}`);
</script>

<template>
  <ArStack :gap="5" style="max-width: 520px">
    <ArPeriodNav
      :label="`11月${d}日`"
      :date="date"
      :holidays="holidays"
      size="lg"
      today-label="今日"
      :prev-disabled="d === 1"
      :next-disabled="d === 30"
      :labels="{ prev: '前の日', next: '次の日', pick: '日を選ぶ' }"
      @prev="d--"
      @next="d++"
      @today="d = 4"
    />
    <ArPeriodNav label="11月23日" date="2026-11-23" :holidays="['2026-11-23']" size="lg" :labels="{ prev: '前の日', next: '次の日', pick: '日を選ぶ' }" />
    <ArPeriodNav label="11月7日" date="2026-11-07" :holidays="holidays" size="lg" :labels="{ prev: '前の日', next: '次の日', pick: '日を選ぶ' }" />
  </ArStack>
</template>
