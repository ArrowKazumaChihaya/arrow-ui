<!-- 見出しなし・選べない日・前後の月を出さない | showHeader=false で小さなまとまりに。disabledDate で選べない日（締めた日など）。showAdjacent=false で前後の月を空にする。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCalendar } from "@arrow/ui";
const date = ref<string | null>("2026-11-12");
const closed = (d: string) => d < "2026-11-06";
</script>

<template>
<div style="max-width: 460px">
  <ArCalendar v-model="date" month="2026-11" today="2026-11-03" :show-header="false" :show-adjacent="false" :disabled-date="closed" weekend-colors label="2026年11月" />
</div>
</template>
