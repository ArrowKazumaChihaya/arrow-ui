<!-- シフトのマス | variant="cell" はマスに乗せたときの時間の表示。濃い地・矢印なし・マスの左下に出し、右の端の列は右にそろえる（placement="bottom-end"）。中身は行ごとに改行（\n）。吹き出しは押せず、下のマスの邪魔をしない。 -->
<script setup lang="ts">
import { ArPopover } from "@s_and_a/arrow-ui";
const days = [
  { d: 14, w: "水", s: "09:00〜18:00", b: "12:00〜13:00", tone: "#4F5BD5" },
  { d: 15, w: "木", s: "13:00〜22:00", b: "17:00〜18:00", tone: "#D4483F", lock: true },
  { d: 16, w: "金", s: "", b: "", tone: "" },
  { d: 17, w: "土", s: "07:00〜16:00", b: "11:00〜12:00", tone: "#4F5BD5" },
];
const tip = (x: (typeof days)[number]) =>
  `千速 一真　10月${x.d}日（${x.w}）\n` + (x.s ? `シフト　${x.s}\n休憩　${x.b}` : "休み") + (x.lock ? "\n勤怠ロック中" : "");
</script>

<template>
<div style="display: flex; gap: 0; padding-bottom: 96px">
  <ArPopover v-for="(x, i) in days" :key="x.d" variant="cell" :content="tip(x)" :placement="i >= days.length - 1 ? 'bottom-end' : 'bottom-start'">
    <span
      tabindex="0"
      :aria-label="`10月${x.d}日`"
      style="display: block; width: 32px; height: 60px; padding: 4px 3px; box-sizing: border-box; border-right: 1px solid #F0F3F6"
    >
      <span
        v-if="x.s"
        :style="{ display: 'block', height: '100%', borderRadius: '8px', background: x.tone === '#4F5BD5' ? '#E5E7FA' : '#F8E1DF', boxShadow: `inset 3px 0 0 ${x.tone}` }"
      />
    </span>
  </ArPopover>
</div>
</template>
