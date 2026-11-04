<!-- 列の幅・図の大きさ | −／＋ で値を変え、真ん中に今の値を出す。シフト表（ArShiftGrid・ArShiftViewTable）と組織図（ArOrgChart）の拡大縮小はこの部品1つ。下限・上限では押せない。md＝ふつう（箱 34）、sm＝密集した所・スマホ（箱 32）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArZoomControl } from "@arrow/ui";

const w = ref(64);
const s = ref(48);
const step = 8;
</script>

<template>
<div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
  <ArZoomControl
    :value="`${w}px`"
    :out-disabled="w <= 28"
    :in-disabled="w >= 140"
    label="列の幅"
    out-label="列を狭く"
    in-label="列を広く"
    @out="w = Math.max(28, w - step)"
    @in="w = Math.min(140, w + step)"
  />
  <ArZoomControl
    size="sm"
    :value="`${s}px`"
    :out-disabled="s <= 28"
    :in-disabled="s >= 140"
    label="列の幅"
    out-label="列を狭く"
    in-label="列を広く"
    @out="s = Math.max(28, s - step)"
    @in="s = Math.min(140, s + step)"
  />
  <ArZoomControl value="28px" out-disabled label="列の幅（下限）" />
  <ArZoomControl value="64px" disabled label="押せない" />
</div>
</template>
