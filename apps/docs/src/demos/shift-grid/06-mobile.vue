<!-- スマホ（RxSpTable） | compact。名前の列を細く（サムネと⠿なし）、パターンの一覧は横に並べ、案内は出さない。列は 50px から。 -->
<script setup lang="ts">
import { ArShiftGrid } from "@arrow/ui";
import { patterns, TODAY, useShiftGridDemo } from "./_data";

const { members, cells, days, on } = useShiftGridDemo({ from: 18, to: 24 });
</script>

<template>
  <div style="width: 366px; padding: 12px; background: #f4f6f8; border-radius: 16px">
    <ArShiftGrid
      compact
      controls
      :members="members"
      :days="days"
      :cells="cells"
      :patterns="patterns"
      :today="TODAY"
      max-height="420px"
      @pattern-drop="on.patternDrop"
      @paste="on.paste"
      @delete="on.delete"
    />
  </div>
</template>
