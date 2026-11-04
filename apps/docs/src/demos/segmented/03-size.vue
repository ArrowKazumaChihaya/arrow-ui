<!-- 大きさ（sm・md・lg） | 外側の高さ sm 30・md 36・lg 42（角丸 9・10・11）。ほかの入力・ボタンの同じ段と高さがそろう。使い分け：sm＝表の上・設定の行、md＝ふつうの切り替え、lg＝スマホ・年末調整。ArRadioGroup の type="button" も同じ形・同じ段。 -->
<script setup lang="ts">
import { ArSegmented, ArRadioGroup, ArSelect } from "@arrow/ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const v = ref<string | number>("day");
const r = ref<string | number | boolean | null>("w");
const s = ref<string | number | null>("shibuya");
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <ArSegmented v-model="v" :size="z" :options="[{ value: 'day', label: '日' }, { value: 'week', label: '週' }, { value: 'month', label: '月' }]" label="期間" />
      <ArRadioGroup v-model="r" type="button" :size="z" :options="[{ value: 'w', label: '週' }, { value: 'h', label: '半月' }, { value: 'm', label: '月' }]" label="期間（ラジオのボタン型）" />
      <ArSelect v-model="s" :size="z" :options="[{ value: 'shibuya', label: '渋谷店' }]" label="店舗" style="width: 130px" />
    </div>
  </template>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 40px 1fr; gap: 14px 12px; align-items: center; }
.r { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
