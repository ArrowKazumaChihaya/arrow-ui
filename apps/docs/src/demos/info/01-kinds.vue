<!-- 種類 | note は入力の下の小さな説明、attention は画面の頭の注意。mark（？）と detail（詳細）は押すと説明を開く。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArInfo, ArStack, ArCluster, ArTextInput } from "@s_and_a/arrow-ui";
const opened = ref(0);
const v = ref("");
</script>

<template>
<ArStack :gap="5">
  <ArInfo kind="attention" :text="'給与の計算に使う設定です。変えると、今月の給与にもすぐ反映されます。\n保存する前に、締め日と支給日を確かめてください。'" />
  <ArStack :gap="1">
    <ArTextInput v-model="v" label="ニックネーム" placeholder="例：さとちゃん" />
    <ArInfo kind="note">シフト表で名前の代わりに出します。従業員にも見えます。</ArInfo>
  </ArStack>
  <ArCluster :gap="3" align="center">
    <span>休憩の自動計算</span>
    <ArInfo kind="mark" text="休憩の自動計算とは" @open="opened++" />
    <ArInfo kind="detail" @open="opened++" />
    <ArInfo kind="detail" href="https://helpcenter.arrow-payment.com" text="ヘルプを見る" />
    <span style="font-size: 12px">開いた回数：{{ opened }}</span>
  </ArCluster>
</ArStack>
</template>
