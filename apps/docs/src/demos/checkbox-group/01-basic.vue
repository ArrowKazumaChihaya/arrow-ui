<!-- 横に並べる・上に「すべて」 | checkAll で上に「すべて」。一部だけ選んでいるときは indeterminate。押せない選択肢は「すべて」でも変わらない。 -->
<script setup lang="ts">
import { ArCheckboxGroup, ArStack } from "@arrow/ui";
import { ref } from "vue";
const who = ref<string[]>(["manager"]);
const stores = ref<number[]>([1, 3]);
</script>

<template>
<ArStack :gap="6">
  <ArCheckboxGroup
    v-model="who"
    label="見せる相手"
    :options="[
      { value: 'manager', label: '店舗管理者' },
      { value: 'staff', label: '一般の従業員' },
      { value: 'part', label: 'アルバイト' },
    ]"
  />
  <ArCheckboxGroup
    v-model="stores"
    label="店舗"
    check-all
    :options="[
      { value: 1, label: '渋谷店' },
      { value: 2, label: '新宿店' },
      { value: 3, label: '梅田店' },
      { value: 4, label: '池袋店（閉店）', disabled: true },
    ]"
  />
</ArStack>
</template>
