<!-- 文字の候補・状態 | 文字だけの候補（メールのドメインなど）。empty-text を渡すと、合う候補がないときに知らせる。大きさ・使えない。 -->
<script setup lang="ts">
import { ArAutoComplete, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const v = ref("");
const w = ref("");
const options = ["朝礼", "店長会議", "棚卸し", "清掃", "研修"];
</script>

<template>
<ArCluster :gap="3" align="center" wrap="wrap">
  <ArAutoComplete v-model="v" :options="options" placeholder="イベント名" empty-text="候補がありません" clearable label="イベント名" style="width: 220px" />
  <ArAutoComplete v-model="w" :options="options" size="sm" placeholder="小" label="小" style="width: 160px" />
  <ArAutoComplete model-value="朝礼" :options="options" disabled label="使えない" style="width: 160px" />
</ArCluster>
</template>
