<!-- 月と日の切り替え | size="md" は月（真ん中を押すと pick、右端に「今日」）、size="lg" は日（曜日の札。日曜は赤・土曜は青）。前へ・次へはアイコンだけなので labels で読み上げの名前を付ける。 -->
<script setup lang="ts">
import { ArPeriodNav, ArStack } from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";
const m = ref(10);
const d = ref(21);
const picked = ref(0);
const WD = ["日", "月", "火", "水", "木", "金", "土"];
const wd = computed(() => new Date(2026, 9, d.value).getDay());
</script>

<template>
<ArStack :gap="5" style="max-width: 520px">
  <ArPeriodNav
    :label="`2026年${m}月`"
    pickable
    today-label="今日"
    :today-disabled="m === 10"
    :labels="{ prev: '前の月', next: '次の月', pick: '年月を選ぶ' }"
    @prev="m = Math.max(1, m - 1)"
    @next="m = Math.min(12, m + 1)"
    @today="m = 10"
    @pick="picked++"
  />
  <ArPeriodNav
    :label="`10月${d}日`"
    :weekday="WD[wd]"
    :weekday-tone="wd === 0 ? 'sun' : wd === 6 ? 'sat' : undefined"
    size="lg"
    :prev-disabled="d === 1"
    :next-disabled="d === 31"
    :labels="{ prev: '前の日', next: '次の日', pick: '日を選ぶ' }"
    @prev="d--"
    @next="d++"
  />
  <p style="margin: 0; font-size: 12px">年月を押した回数：{{ picked }}（製品は年月の選択を開く）</p>
</ArStack>
</template>
