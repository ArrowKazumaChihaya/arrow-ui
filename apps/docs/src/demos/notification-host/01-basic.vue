<!-- 置き方 | ArUiProvider の中（テーマ色の効く場所）に1つだけ置く。useArNotification() で出した通知を右上に並べる。 -->
<script setup lang="ts">
import { ArButton, ArNotificationHost, useArNotification } from "@arrow/ui";
const notification = useArNotification();
</script>

<template>
<ArButton tone="primary" @click="notification.success({ title: 'シフトを公開しました', description: '11月分のシフトを従業員24名に知らせました。' })">通知を出す</ArButton>
<ArNotificationHost />
</template>
