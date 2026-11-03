<!-- 小さな項目 | 上に項目名、下に入力。必須の印（required）。show-title を false にすると入力だけ。 -->
<script setup lang="ts">
import { ArSubItem, ArTimeInput, ArTextInput, type ArTimeValue } from "@arrow/ui";
import { ref } from "vue";
const s = ref<ArTimeValue>({ time: "09:00", day: "same" });
const e = ref<ArTimeValue>({ time: "18:00", day: "same" });
const n = ref("");
</script>

<template>
<div class="grid">
  <ArSubItem title="開始時刻"><template #default="c"><ArTimeInput :id="c.id" v-model="s" label="開始時刻" /></template></ArSubItem>
  <ArSubItem title="終了時刻" required><template #default="c"><ArTimeInput :id="c.id" v-model="e" label="終了時刻" /></template></ArSubItem>
  <ArSubItem title="メモ" :show-title="false"><template #default="c"><ArTextInput v-bind="c" v-model="n" label="メモ" placeholder="項目名なし" style="width: 200px" /></template></ArSubItem>
</div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, 500px); max-width: 100%; }
.grid > * { margin-bottom: 0 !important; }
</style>
