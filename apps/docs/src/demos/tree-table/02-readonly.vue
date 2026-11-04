<!-- 見るだけの木・閉じた状態から・空 | draggable を付けなければつまみは出ない。default-expand-all を false にすると閉じた状態から始まる（開いている行は v-model:expanded）。行がないときは emptyText。 -->
<script setup lang="ts">
import { ArTreeTable } from "@s_and_a/arrow-ui";
import { ref } from "vue";
type Row = { id: string; name: string; manager: string; children?: Row[] };
const rows: Row[] = [
  { id: "a", name: "東日本エリア", manager: "佐藤", children: [{ id: "a1", name: "東京店", manager: "田中" }, { id: "a2", name: "横浜店", manager: "山本" }] },
  { id: "b", name: "西日本エリア", manager: "鈴木", children: [{ id: "b1", name: "大阪店", manager: "高橋" }] },
];
const expanded = ref<(string | number)[]>([]);
const columns = [{ key: "name", title: "部署" }, { key: "manager", title: "責任者", width: 160 }];
</script>

<template>
  <div style="display: grid; gap: 20px">
    <ArTreeTable v-model:expanded="expanded" :default-expand-all="false" :columns="columns" :rows="rows" row-key="id" caption="部署" />
    <ArTreeTable :columns="columns" :rows="[]" row-key="id" caption="部署（空）" empty-text="部署はまだありません。「部署を追加」から登録できます" />
  </div>
</template>
