<!-- 期間 | 2つの日付を「〜」でつなぎ、右に日数。1か月・半月・カスタムのボタンとは親がつなぐ（日付を変えて合わなくなったら「カスタム」）。 -->
<script setup lang="ts">
import { ArDateRange, ArRadioGroup, ArStack, type ArDateRangeValue } from "@arrow/ui";
import { ref } from "vue";
const kind = ref("month");
const range = ref<ArDateRangeValue>({ start: "2026-11-01", end: "2026-11-30" });
function preset(k: string | number | boolean) {
  kind.value = String(k);
  if (k === "month") range.value = { start: "2026-11-01", end: "2026-11-30" };
  if (k === "half") range.value = { start: "2026-11-01", end: "2026-11-15" };
}
function edit(v: ArDateRangeValue) {
  range.value = v;
  kind.value = "custom";
}
</script>

<template>
<ArStack :gap="2" align="start">
  <ArRadioGroup
    :model-value="kind"
    type="button"
    label="期間の長さ"
    :options="[
      { value: 'month', label: '1か月' },
      { value: 'half', label: '半月' },
      { value: 'custom', label: 'カスタム' },
    ]"
    @update:model-value="preset"
  />
  <ArDateRange :model-value="range" label="募集する期間" @update:model-value="edit" />
</ArStack>
</template>
