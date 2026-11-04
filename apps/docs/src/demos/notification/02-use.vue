<!-- useArNotification() | 関数で出す。ArUiProvider の中に ArNotificationHost を1つ置いておく。duration 秒で消え、マウスが乗っている間は止まる（0 で消えない）。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArNotificationHost, useArNotification } from "@s_and_a/arrow-ui";
const notification = useArNotification();
function submitted() {
  notification.info({
    icon: "bell",
    title: "シフトの提出がありました",
    description: "田中 健さんが11月の希望を出しました。",
    duration: 0,
    actions: [{ label: "あとで", tone: "plain" }, { label: "見る" }],
  });
}
</script>

<template>
<ArCluster :gap="2">
  <ArButton @click="notification.success({ title: 'シフトを公開しました', description: '11月分のシフトを従業員24名に知らせました。' })">公開した</ArButton>
  <ArButton @click="submitted">提出があった</ArButton>
  <ArButton @click="notification.error({ title: '送れませんでした', description: '通信を確かめて、もう一度送ってください。' })">送れなかった</ArButton>
</ArCluster>
<ArNotificationHost />
</template>
