<!-- useArMessage() | 関数で出す。ArUiProvider の中に ArMessageHost を1つ置いておく。同じ key で出し直すと中身が入れ替わる（送っています… → 送りました）。元に戻せる操作には ArToast を使う。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArMessageHost, useArMessage } from "@s_and_a/arrow-ui";
const message = useArMessage();
function send() {
  message.open({ key: "send", tone: "loading", content: "送っています…" });
  setTimeout(() => message.open({ key: "send", tone: "ok", content: "5名に送りました" }), 1200);
}
</script>

<template>
<ArCluster :gap="2">
  <ArButton @click="message.success('シフトを保存しました')">success</ArButton>
  <ArButton @click="message.info('公開期間設定を開きます')">info</ArButton>
  <ArButton @click="message.warning('ロック中の日は変更できません')">warning</ArButton>
  <ArButton @click="message.error('保存できませんでした')">error</ArButton>
  <ArButton tone="primary" icon="send" @click="send">送る</ArButton>
</ArCluster>
<!-- 製品ではアプリの外側（ArUiProvider の中）に1つだけ置く -->
<ArMessageHost />
</template>
