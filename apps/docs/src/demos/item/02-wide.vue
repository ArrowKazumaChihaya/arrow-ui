<!-- 項目名の幅・改行・ArSubItem との組み合わせ | title-width で項目名の幅を変える。項目名の改行（\n）はそのまま。中に ArSubItem を横に並べると、名前つきの入力を並べられる。 -->
<script setup lang="ts">
import { ArItem, ArSubItem, ArTimeInput, ArTextarea, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const s = ref<ArTimeValue>({ time: "09:00", day: "same" });
const e = ref<ArTimeValue>({ time: "18:00", day: "same" });
const memo = ref("");
</script>

<template>
<div style="width: 900px; max-width: 100%">
  <ArItem title="所定の勤務時間" title-width="160px" required>
    <div style="display: flex; gap: 24px">
      <div><ArSubItem title="開始時刻"><template #default="c"><ArTimeInput :id="c.id" v-model="s" label="開始時刻" /></template></ArSubItem></div>
      <div><ArSubItem title="終了時刻" required><template #default="c"><ArTimeInput :id="c.id" v-model="e" label="終了時刻" /></template></ArSubItem></div>
    </div>
  </ArItem>
  <ArItem :title="'備考\n（社内向け）'" title-width="160px" info="ここに書いた内容は従業員には見えません">
    <template #default="c"><ArTextarea v-bind="c" v-model="memo" :rows="3" style="width: 400px; max-width: 100%" /></template>
  </ArItem>
</div>
</template>
