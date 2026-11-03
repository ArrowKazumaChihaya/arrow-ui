<!-- 区切りの線つきの行（設定・会社情報・社員情報） | variant="row"。項目名の幅は長い名前に合わせて 236px など。直すと「変更あり」と「元に戻す」（changed・revert）、間違いはその場で直し方まで（error）、説明は「詳細」。 -->
<script setup lang="ts">
import { ArItem, ArRadioGroup, ArTextInput } from "@arrow/ui";
import { computed, reactive } from "vue";

const base = { over: "25", inner: "0", over60: "25", holiday: "35", sum: "pay" };
const v = reactive({ over: "20", inner: "0", over60: "25", holiday: "30", sum: "pay" });
const min: Record<string, number> = { over: 25, over60: 25, holiday: 35 };
const err = (k: keyof typeof base) => (min[k] !== undefined && Number(v[k]) < min[k]! ? `${min[k]}%以上の設定が義務付けられています。${min[k]}以上の数字にしてください` : undefined);
const changed = (k: keyof typeof base) => v[k] !== base[k];
const sums = [
  { value: "month", label: "月単位" },
  { value: "pay", label: "給与計算期間" },
];
const opened = reactive({ n: 0 });
const dirty = computed(() => (Object.keys(base) as (keyof typeof base)[]).filter(changed).length);
</script>

<template>
<div style="width: 1080px; max-width: 100%; box-sizing: border-box; padding: 8px 24px; border-radius: 18px; background: #fff">
  <ArItem variant="row" title="シフトサマリー計算期間" title-width="236px" info="シフトサマリーの計算期間を変更できます" detail :changed="changed('sum')" @revert="v.sum = base.sum" @detail="opened.n++">
    <template #default="c"><ArRadioGroup v-bind="c" v-model="v.sum" :options="sums" label="シフトサマリー計算期間" /></template>
  </ArItem>
  <ArItem variant="row" title="法定外残業" title-width="236px" info="25%以上の設定が義務付けられています" detail :error="err('over')" :changed="changed('over')" @revert="v.over = base.over">
    <template #default="c"><ArTextInput v-bind="c" v-model="v.over" align="right" suffix="%" :invalid="!!err('over')" style="width: 110px" /></template>
  </ArItem>
  <ArItem variant="row" title="法定内残業" title-width="236px" info="割増賃金の支払い義務はなく、基本的には0%です" detail :changed="changed('inner')" @revert="v.inner = base.inner">
    <template #default="c"><ArTextInput v-bind="c" v-model="v.inner" align="right" suffix="%" style="width: 110px" /></template>
  </ArItem>
  <ArItem variant="row" title="法定休日" title-width="236px" info="35%以上の設定が義務付けられています" detail :error="err('holiday')" :changed="changed('holiday')" @revert="v.holiday = base.holiday">
    <template #default="c"><ArTextInput v-bind="c" v-model="v.holiday" align="right" suffix="%" :invalid="!!err('holiday')" style="width: 110px" /></template>
  </ArItem>
  <ArItem variant="row" title="シフトテーブルに勤務時間と日数を表示" title-width="236px" highlight info="探して移ってきた行は淡く光る（highlight）">
    表示する
  </ArItem>
</div>
<p class="demo-note">変更あり：{{ dirty }}件・「詳細」を押した回数：{{ opened.n }}</p>
</template>
