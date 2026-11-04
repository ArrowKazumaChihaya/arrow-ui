<!-- 曜日 | いくつでも選ぶ。選んだ曜日はテーマ色の塗り、選んでいない日・祝は赤、土は青。xs は表の行の中（シフト募集。1.0 の sm）。 -->
<script setup lang="ts">
import { ArWeekdayPicker, ArStack, type ArWeekday } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const days = ref<ArWeekday[]>([1, 2, 3, 4, 5]);
const weekend = ref<ArWeekday[]>([0, 6, "holiday"]);
</script>

<template>
<ArStack :gap="4" align="start">
  <ArWeekdayPicker v-model="days" label="繰り返す曜日" />
  <ArWeekdayPicker v-model="weekend" size="xs" label="募集する曜日" />
  <ArWeekdayPicker v-model="days" start-on-monday :holiday="false" label="月曜から" />
  <ArWeekdayPicker :model-value="[1, 3]" disabled label="使えない" />
</ArStack>
</template>
