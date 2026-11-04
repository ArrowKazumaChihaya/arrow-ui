<!-- 形と大きさ（card・plain ／ sm・md・lg） | 形を省くとカード（remix。classic は今の ARROW と同じ四角と文字）。variant="plain" は設定の行など密集した所。columns でカードを等しい幅の列に並べる。大きさはラジオと同じ段。 -->
<script setup lang="ts">
import { ArCheckboxGroup, type ArCheckboxValue } from "@arrow/ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const kinds = ref<ArCheckboxValue[]>(["part", "staff"]);
const docs = ref<ArCheckboxValue[]>(["ins"]);
const opts = [
  { value: "part", label: "パート・アルバイト" },
  { value: "staff", label: "社員" },
  { value: "exec", label: "役員" },
];
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <ArCheckboxGroup v-model="kinds" :size="z" :options="opts" :label="`対象（${z}）`" />
    <small>{{ z }} plain</small>
    <ArCheckboxGroup v-model="kinds" variant="plain" :size="z" :options="opts" :label="`対象（${z}・plain）`" />
  </template>
  <small>lg 2列・説明</small>
  <ArCheckboxGroup
    v-model="docs"
    size="lg"
    :columns="2"
    style="max-width: 576px"
    :options="[
      { value: 'ins', label: '保険料控除申告書', description: '生命保険料・地震保険料など' },
      { value: 'loan', label: '住宅ローン控除', description: '2年目以降の人だけ' },
      { value: 'prev', label: '前職の源泉徴収票', description: '今年入社した人' },
      { value: 'dep', label: '扶養控除等申告書', description: '必須', disabled: true },
    ]"
    label="集める書類"
  />
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 90px 1fr; gap: 14px 12px; align-items: center; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
