<!-- 表の行の頭で1人を選ぶ | 今の ARROW の SelectTd（isRadio）と同じ使い方：行ごとに ArRadio を置き、value に行の id。表の cell-<key> の slot に置く。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArRadio, ArTable } from "@s_and_a/arrow-ui";
const picked = ref<number | null>(12);
const rows = [
  { id: 11, code: "A0011", name: "佐藤 花子", branch: "渋谷店" },
  { id: 12, code: "A0012", name: "末永 修也", branch: "新宿店" },
  { id: 13, code: "A0013", name: "田中 太郎", branch: "渋谷店", disabled: true },
];
</script>

<template>
<div style="max-width: 520px">
  <ArTable
    caption="担当者を1人選ぶ"
    row-key="id"
    :rows="rows"
    :columns="[{ key: 'pick', title: '', width: 48, align: 'center' }, { key: 'code', title: '社員コード', width: 110 }, { key: 'name', title: '名前' }, { key: 'branch', title: '店舗' }]"
  >
    <template #cell-pick="{ row }">
      <ArRadio v-model="picked" :value="row.id" name="person" :disabled="row.disabled" :label="`${row.name}を選ぶ`" />
    </template>
  </ArTable>
  <p style="margin: 8px 0 0; font-size: 12px">選んだ id：{{ picked }}</p>
</div>
</template>
