<!-- 縦の手順・小さな手順 | 承認の流れは縦。ポップアップの上は size="mini"（今はテーマ色の丸、済みは緑の丸にチェック）。clickable なら済んだ手順を押して戻れる。 -->
<script setup lang="ts">
import { ArSteps, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const step = ref(1);
</script>

<template>
<ArCluster :gap="7" align="center">
  <div style="width: 220px">
    <ArSteps direction="vertical" :current="1" :items="[{ title: '申請', description: '10/20 佐藤 美咲' }, { title: '店長の承認', description: '待っています' }, { title: '人事の確認' }]" label="承認の流れ" />
  </div>
  <ArSteps v-model:current="step" size="mini" clickable :items="[{ title: '期間' }, { title: '確認' }, { title: '送る' }]" />
</ArCluster>
</template>
