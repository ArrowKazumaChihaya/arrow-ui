<!-- 今の ARROW の使い方 | 今の ARROW の Colorpicker・Colorviewer と同じ：30×30 の見本。classic は押すと「色選択」のダイアログ（12色×濃さ4段、group-size=4）。readonly は見るだけ（Colorviewer）。 -->
<script setup lang="ts">
import { ArColorPicker } from "@arrow/ui";
import { ref } from "vue";
const families = [
  ["#E03838", "#E66464", "#ED9090", "#F4BCBC"],
  ["#FF6666", "#FF7F7F", "#FF9999", "#FFB2B2"],
  ["#E91E63", "#ED4A83", "#F178A2", "#F6A6C2"],
  ["#BA37D1", "#C861DB", "#D78AE4", "#E5B4EE"],
  ["#7146C3", "#8F6CCF", "#AC93DC", "#CAB9E8"],
  ["#495DBF", "#6F7FCC", "#95A0D9", "#BBC2E7"],
  ["#2196F3", "#51AEF4", "#81C4F7", "#B1DBFA"],
  ["#449B47", "#5BB75F", "#7FC781", "#A2D6A4"],
  ["#B0BD22", "#CDDC39", "#D7E263", "#E2EA8E"],
  ["#E5CE00", "#FFE819", "#FFED4C", "#FFF27F"],
  ["#E58500", "#FF9F19", "#FFB44C", "#FFC97F"],
  ["#A1582A", "#C96E35", "#D48B5D", "#DEA886"],
];
const colors = families.flat().map((v) => ({ value: v, label: v }));
const c = ref<string | null>("#2196F3");
</script>

<template>
<div class="g">
  <div><small>value</small><ArColorPicker v-model="c" :colors="colors" :group-size="4" :custom="false" label="色" /></div>
</div>
<div class="g" style="margin-top: 16px">
  <div><small>#E03838</small><ArColorPicker model-value="#E03838" readonly label="色" /></div>
  <div><small>#2196F3</small><ArColorPicker model-value="#2196F3" readonly label="色" /></div>
  <div><small>#449B47</small><ArColorPicker model-value="#449B47" readonly label="色" /></div>
  <div><small>(empty=white)</small><ArColorPicker :model-value="null" readonly label="色" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
