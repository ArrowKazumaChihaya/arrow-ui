<script setup lang="ts">
import { ArPunchPanel, ArPunchButton, ArAlert } from "@s_and_a/arrow-ui";
</script>
<template>
  <ArPunchPanel title="GPS打刻" timestamp="2026/11/5 09:00:00" description="出勤または退勤ボタンを押してください">
    <ArAlert tone="info">今日のシフト：09:00〜18:00</ArAlert>
    <template #actions>
      <ArPunchButton kind="in" />
      <ArPunchButton kind="out" disabled reason="出勤してから押せます" />
      <ArPunchButton kind="break-in" disabled reason="出勤してから押せます" />
      <ArPunchButton kind="break-out" disabled reason="休憩を開始してから押せます" />
    </template>
  </ArPunchPanel>
</template>
