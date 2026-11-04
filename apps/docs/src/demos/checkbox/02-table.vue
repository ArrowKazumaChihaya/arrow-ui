<!-- 表の行で使う | 見える名前がないので label（読み上げ）を必ず渡す。見出しのチェックは「見えている行をすべて」、一部だけなら indeterminate。 -->
<script setup lang="ts">
import { ArCheckbox } from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";
const rows = [
  { id: 1, name: "末永 修也", time: "09:00〜18:00" },
  { id: 2, name: "中口 万由香", time: "13:00〜22:00" },
  { id: 3, name: "新里 匠", time: "17:00〜21:00" },
];
const picked = ref<number[]>([2]);
const all = computed(() => picked.value.length === rows.length);
const some = computed(() => picked.value.length > 0 && !all.value);
const toggleAll = (on: boolean) => (picked.value = on ? rows.map((r) => r.id) : []);
const toggle = (id: number, on: boolean) => (picked.value = on ? [...picked.value, id] : picked.value.filter((x) => x !== id));
</script>

<template>
<table class="t">
  <thead>
    <tr>
      <th><ArCheckbox :model-value="all" :indeterminate="some" label="すべての行を選ぶ" @update:model-value="toggleAll" /></th>
      <th>名前</th>
      <th>時間</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="r in rows" :key="r.id" :class="{ on: picked.includes(r.id) }">
      <td><ArCheckbox :model-value="picked.includes(r.id)" :label="`${r.name}を選ぶ`" @update:model-value="(on: boolean) => toggle(r.id, on)" /></td>
      <td>{{ r.name }}</td>
      <td>{{ r.time }}</td>
    </tr>
  </tbody>
</table>
</template>

<style scoped>
.t { border-collapse: collapse; font-size: 13.5px; min-width: 360px; }
.t th { text-align: left; font-size: 12px; color: var(--ar-color-text-muted); background: var(--ar-color-surface-alt); }
.t th, .t td { padding: 0 12px; height: 44px; border-bottom: 1px solid var(--ar-color-border); }
.t th:first-child, .t td:first-child { width: 18px; padding-right: 0; }
.t tr.on td { background: var(--ar-accent-faint); }
</style>
