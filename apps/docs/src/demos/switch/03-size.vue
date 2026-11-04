<!-- 大きさ（sm・md・lg） | sm 28×16（設定の行など密集した所。文字は出さない）、md 36×20（ふつう）、lg 44×24（年末調整・スマホ。文字ありは高さ26）。ラジオ・チェックと同じ段で並べる。 -->
<script setup lang="ts">
import { ArSwitch, ArRadioGroup } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const on = ref(true);
const off = ref(false);
const pub = ref(true);
const r = ref<string | number | boolean | null>("a");
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <ArSwitch v-model="on" :size="z" :label="`有効（${z}）`" />
      <ArSwitch v-model="off" :size="z" :label="`無効（${z}）`" />
      <ArSwitch v-model="pub" :size="z" on-text="公開" off-text="非公開" :label="`公開（${z}）`" />
      <ArSwitch v-model="on" :size="z" :label="`打刻の追加を許す（${z}）`">打刻の追加を許す</ArSwitch>
      <ArRadioGroup v-model="r" variant="plain" :size="z" :options="[{ value: 'a', label: '全員' }, { value: 'b', label: '自分のみ' }]" label="範囲" />
    </div>
  </template>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 40px 1fr; gap: 14px 12px; align-items: center; }
.r { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
