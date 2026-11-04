<!-- 30 人・31 日 | 多い人数・多い日数でも重くならない（マスごとの部品を作らず、イベントと吹き出しは表で1つ）。見出しと名前の列は固定、表は縦にも動く。 -->
<script setup lang="ts">
import { ArShiftGrid } from "@s_and_a/arrow-ui";
import { patterns, TODAY, useShiftGridDemo } from "./_data";

const { members, cells, days, on } = useShiftGridDemo({ crowd: true });
</script>

<template>
  <ArShiftGrid
    :members="members"
    :days="days"
    :cells="cells"
    :patterns="patterns"
    :today="TODAY"
    max-height="520px"
    controls
    @paste="on.paste"
    @delete="on.delete"
    @autofill="on.autofill"
    @undo="on.undo"
    @redo="on.redo"
    @pattern-drop="on.patternDrop"
    @reorder="on.reorder"
  />
</template>
