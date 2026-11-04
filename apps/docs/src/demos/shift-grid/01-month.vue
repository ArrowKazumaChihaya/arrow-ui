<!-- 月のテーブル（マス） | シフトキャンバスのテーブルタブ。左にパターンの一覧（検索・マスへドラッグ）、上に列の幅（−／＋）とマス／チャート。マスを押して選び（Shift で範囲・ドラッグで範囲）、⌘C・⌘X・⌘V・⌘Z・⌘⇧Z・Delete、右下の印でオートフィル、右クリックで操作。見出しの日付を押すと day-open、提出（希望）を押すと avail（製品が「提出をシフトにしますか？」を出す）。 -->
<script setup lang="ts">
import { ArShiftGrid } from "@s_and_a/arrow-ui";
import { ref } from "vue";
import { patterns, TODAY, useShiftGridDemo } from "./_data";

const { members, cells, days, log, on } = useShiftGridDemo();
const mode = ref<"cell" | "chart">("cell");
const width = ref<number | null>(null);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <ArShiftGrid
      v-model:mode="mode"
      v-model:column-width="width"
      :members="members"
      :days="days"
      :cells="cells"
      :patterns="patterns"
      :today="TODAY"
      controls
      platform="mac"
      max-height="560px"
      @copy="on.copy"
      @cut="on.cut"
      @paste="on.paste"
      @delete="on.delete"
      @autofill="on.autofill"
      @undo="on.undo"
      @redo="on.redo"
      @pattern-drop="on.patternDrop"
      @chart-move="on.chartMove"
      @chart-change="on.chartChange"
      @chart-create="on.chartCreate"
      @refuse="on.refuse"
      @reorder="on.reorder"
      @avail="(p) => (log = `${p.date} の提出をシフトにしますか？（製品が確認を出す）`)"
      @day-open="(d) => (log = `${d.date} の勤務メンバーを開く`)"
      @open="(s) => (log = `${s.date} を${s.cell ? '編集' : '追加'}`)"
      @pattern-edit="log = 'パターンの編集を開く'"
    />
    <p style="margin: 0; font-size: 12px; color: #66727f">操作：{{ log || "—" }}</p>
  </div>
</template>
