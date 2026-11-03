<!-- 置き方 | ArUiProvider の中（テーマ色の効く場所）に1つだけ置く。useArMessage() で出した言葉を画面の上の真ん中に並べる。 -->
<script setup lang="ts">
import { ArButton, ArMessageHost, useArMessage } from "@arrow/ui";
const message = useArMessage();
</script>

<template>
<ArButton tone="primary" @click="message.success('シフトを保存しました')">言葉を出す</ArButton>
<ArMessageHost />
</template>
