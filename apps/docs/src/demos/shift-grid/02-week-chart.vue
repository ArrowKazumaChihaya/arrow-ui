<!-- 週のチャート | mode="chart"。日ごとに 6時〜24時の帯。帯をドラッグで移動、両端で開始・終了、ほかの人・日へドラッグで移す（移せないマスは赤い枠）、空いたマスをドラッグで追加（15分きざみ）。提出は緑の点線の帯。 -->
<script setup lang="ts">
import { ArShiftGrid } from "@arrow/ui";
import { patterns, TODAY, useShiftGridDemo } from "./_data";

const { members, cells, days, log, on } = useShiftGridDemo({ from: 18, to: 24 });
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <ArShiftGrid
      mode="chart"
      :members="members"
      :days="days"
      :cells="cells"
      :patterns="patterns"
      :today="TODAY"
      controls
      @chart-move="on.chartMove"
      @chart-change="on.chartChange"
      @chart-create="on.chartCreate"
      @refuse="on.refuse"
      @pattern-drop="on.patternDrop"
      @avail="(p) => (log = `${p.date} の提出をシフトにしますか？`)"
    />
    <p style="margin: 0; font-size: 12px; color: #66727f">操作：{{ log || "—" }}</p>
  </div>
</template>
