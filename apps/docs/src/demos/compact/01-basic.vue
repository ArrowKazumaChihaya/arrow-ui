<!-- つなげる | 入力＋ボタン、ボタンの組を角丸を外側だけ残してつなげる。中の secondary ボタンの枠は入力と同じ色になる。表示の切り替えには ArSegmented を優先する。 -->
<script setup lang="ts">
import { ArCompact, ArButton, ArTextInput, ArStack, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const q = ref("");
const span = ref("month");
</script>

<template>
<ArStack :gap="4" align="start">
  <ArCluster :gap="2"><ArButton>戻る</ArButton><ArButton tone="primary">次へ</ArButton></ArCluster>
  <ArCompact>
    <ArTextInput v-model="q" label="名前で探す" placeholder="名前で探す" style="width: 200px" />
    <ArButton icon="search" label="探す" />
  </ArCompact>
  <ArCompact label="期間">
    <ArButton v-for="[k, l] in [['day', '日'], ['week', '週'], ['month', '月']]" :key="k" size="sm" :tone="span === k ? 'subtle' : 'secondary'" :aria-pressed="span === k" @click="span = k">{{ l }}</ArButton>
  </ArCompact>
  <ArCompact label="保存">
    <ArButton tone="primary">保存</ArButton>
    <ArButton tone="primary" icon="cd" label="ほかの保存" />
  </ArCompact>
  <ArCompact direction="vertical" label="並べ替え">
    <ArButton icon="up" label="上へ" />
    <ArButton icon="down" label="下へ" />
  </ArCompact>
</ArStack>
</template>
