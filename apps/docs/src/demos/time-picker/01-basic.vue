<!-- 時刻の選択 | ARROW の時刻はキー入力が基本なので、ふだんは ArTimeInput を使う。これは「選ぶ方が早い」画面の補助で、右の時計のボタンで時・分の列のパネルを開く。分の刻みは設定に合わせる。 -->
<script setup lang="ts">
import { ArTimePicker, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref<string | null>("09:00");
const b = ref<string | null>(null);
</script>

<template>
<ArCluster :gap="4">
  <ArTimePicker v-model="a" label="開始" />
  <ArTimePicker v-model="b" :minute-step="15" label="終了（15分刻み）" />
  <ArTimePicker model-value="10:00" disabled label="使えない" />
  <span class="demo-note">値：{{ a ?? "—" }}</span>
</ArCluster>
</template>
