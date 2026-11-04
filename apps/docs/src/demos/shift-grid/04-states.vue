<!-- 状態と表示内容 | 見るだけ（editable=false：吹き出しと日付だけ押せる）、表に出すもの（show）を減らした形、パターンの一覧なし。ロックの日は見出しに鍵とマスの斜線、非公開は目の印と薄い日付、有給は斜線、パターンなしは点線。 -->
<script setup lang="ts">
import { ArShiftGrid } from "@arrow/ui";
import { patterns, TODAY, useShiftGridDemo } from "./_data";

const a = useShiftGridDemo({ from: 12, to: 18 });
const b = useShiftGridDemo({ from: 20, to: 31 });
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <ArShiftGrid :members="a.members.value" :days="a.days.value" :cells="a.cells.value" :patterns="patterns" :today="TODAY" :editable="false" :pattern-panel="false" />
    <ArShiftGrid
      :members="b.members.value"
      :days="b.days.value"
      :cells="b.cells.value"
      :patterns="patterns"
      :today="TODAY"
      :pattern-panel="false"
      :column-width="64"
      :show="{ avatar: false, hours: false, events: false, shortage: false, hints: false }"
    />
  </div>
</template>
