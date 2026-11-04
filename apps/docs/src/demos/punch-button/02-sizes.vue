<!-- 大きさ・色・記録中 | スマホは size="md"（高さ136）。色は palette で変えられる（既定は出勤・休憩開始＝blue、退勤・休憩終了＝green）。loading は記録している途中（押せない）。名前とアイコンは label・icon で変えられる（シフト外出勤など）。 -->
<script setup lang="ts">
import { ArPunchButton } from "@s_and_a/arrow-ui";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; padding: 18px; border-radius: 18px; background: #fff">
    <div style="width: 342px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
      <ArPunchButton kind="in" size="md" />
      <ArPunchButton kind="out" size="md" disabled reason="出勤してから押せます" />
      <ArPunchButton kind="break-in" disabled reason="出勤してから押せます" />
      <ArPunchButton kind="break-out" disabled reason="休憩を始めてから押せます" />
    </div>
    <div style="width: 342px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
      <ArPunchButton kind="in" size="md" label="シフト外出勤" palette="orange" />
      <ArPunchButton kind="out" size="md" loading reason="記録しています…" />
    </div>
  </div>
</template>
