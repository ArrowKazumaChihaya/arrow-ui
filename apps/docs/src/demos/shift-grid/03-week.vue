<!-- 週のテーブル（列が広い） | 列が 64px 以上なら時刻の文字（1日に2つのシフトは1行に1つずつ）、提出は「希望 10:00–15:00」。マスが狭いときは文字を出さず吹き出しで見せる（名前　日付／シフト／休憩）。classic は今の ARROW の週の表示（パターン名・シフト・休憩・勤怠の文字）。 -->
<script setup lang="ts">
import { ArShiftGrid } from "@arrow/ui";
import { patterns, TODAY, useShiftGridDemo } from "./_data";

const { members, cells, days, on } = useShiftGridDemo({ from: 18, to: 24 });
</script>

<template>
  <ArShiftGrid
    :members="members"
    :days="days"
    :cells="cells"
    :patterns="patterns"
    :today="TODAY"
    :show="{ code: true }"
    @paste="on.paste"
    @delete="on.delete"
    @undo="on.undo"
    @redo="on.redo"
    @pattern-drop="on.patternDrop"
  />
</template>
