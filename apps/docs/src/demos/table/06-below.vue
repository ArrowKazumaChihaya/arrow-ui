<!-- 表の下に置く | #below は表の8px下。ページ送り（ArPagination）や「表示内容」のプルダウンを置く。 -->
<script setup lang="ts">
import { ArButton, ArTable, type ArTableColumn } from "@arrow/ui";
import { computed, ref } from "vue";
type Row = { id: number; name: string; code: string };
const all: Row[] = Array.from({ length: 12 }, (_, i) => ({ id: i, name: ["佐藤 美咲", "田中 健", "山本 葵", "鈴木 大地"][i % 4]!, code: `S${1001 + i}` }));
const columns: ArTableColumn<Row>[] = [
  { key: "code", title: "社員コード", width: 120, numeric: true, align: "start" },
  { key: "name", title: "氏名", avatar: (r) => ({ seed: r.id }) },
];
const page = ref(1);
const rows = computed(() => all.slice((page.value - 1) * 4, page.value * 4));
</script>

<template>
<div style="max-width: 520px">
  <ArTable :columns="columns" :rows="rows" row-key="id" caption="社員">
    <template #below>
      <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center">
        <ArButton tone="muted" size="sm" icon="cl" label="前のページ" :disabled="page === 1" @click="page--" />
        <span style="font-size: 13px">{{ page }} / 3</span>
        <ArButton tone="muted" size="sm" icon="cr" label="次のページ" :disabled="page === 3" @click="page++" />
      </div>
    </template>
  </ArTable>
</div>
</template>
