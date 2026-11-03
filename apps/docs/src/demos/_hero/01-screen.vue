<!-- 画面の例（シフト詳細） | 配置は製品のレイアウト層、見た目はデザインのライブラリが持つ。デザインを替えても並びと動きは同じ。 -->
<script setup lang="ts">
import { ArCard, ArButton, ArCluster, ArStack, ArTabs, ArTag, ArSwitch, ArTable, ArAlert, type ArTableColumn } from "@arrow/ui";
import { ref } from "vue";
const tab = ref("member");
const published = ref(true);
const items = [{ key: "member", label: "勤務メンバー", icon: "users" as const, count: 3 }, { key: "available", label: "勤務可能な人" }];
type Row = { id: number; name: string; time: string; cost: string };
const rows: Row[] = [
  { id: 1, name: "佐藤 美咲", time: "09:00〜18:00", cost: "¥9,600" },
  { id: 2, name: "田中 健", time: "13:00〜22:00", cost: "¥10,400" },
  { id: 3, name: "山本 葵", time: "17:00〜22:00", cost: "¥6,000" },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 120 },
  { key: "time", title: "時間", width: 130 },
  { key: "cost", title: "人件費", align: "end", width: 90 },
];
</script>

<template>
  <ArCard title="シフト詳細" icon="users" variant="band">
    <ArStack :gap="4">
      <ArCluster :gap="2">
        <ArTag tone="accent">人件費 ¥26,000</ArTag>
        <ArTag tone="danger">不足1</ArTag>
        <ArSwitch v-model="published" label="公開" on-text="公開" off-text="非公開" size="sm" />
      </ArCluster>
      <ArTabs v-model="tab" :items="items" label="詳細" />
      <ArCluster :gap="2">
        <ArButton tone="primary" icon="plus">シフト追加</ArButton>
        <ArButton tone="subtle" icon="yen">日毎人件費</ArButton>
      </ArCluster>
      <ArTable :columns="columns" :rows="rows" row-key="id" caption="勤務メンバー" density="compact" />
      <ArAlert tone="warn">10月20日までの勤怠はロックされています。</ArAlert>
    </ArStack>
  </ArCard>
</template>
