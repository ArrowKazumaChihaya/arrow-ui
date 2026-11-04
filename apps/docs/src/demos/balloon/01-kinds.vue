<!-- 吹き出し | その場に置く注意や目印。しっぽの向き（上下左右）と色を選ぶ。dot は丸い目印（チャートの人の印など）。 -->
<script setup lang="ts">
import { ArBalloon, ArCluster, ArStack, ArIcon } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="6">
  <ArCluster :gap="5" align="center">
    <ArBalloon>前日の打刻です（押すと当日に）</ArBalloon>
    <ArBalloon tone="accent" tail="top">ここから始めます</ArBalloon>
    <ArBalloon tone="danger" tail="right">人数が足りません</ArBalloon>
    <ArBalloon tone="warn" tail="left">未承認の申請があります</ArBalloon>
  </ArCluster>
  <ArCluster :gap="5" align="center">
    <ArBalloon shape="dot" tail="right" :size="30"><ArIcon name="user" /></ArBalloon>
    <ArBalloon shape="dot" tail="right"><ArIcon name="user" /></ArBalloon>
    <ArBalloon shape="dot" tail="right" tone="accent" :size="24">3</ArBalloon>
    <ArBalloon shape="dot" tail="bottom" tone="danger" :size="24">!</ArBalloon>
  </ArCluster>
</ArStack>
</template>
