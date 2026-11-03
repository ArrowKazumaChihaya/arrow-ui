<!-- 出す・元に戻す | v-model:open で出す。duration 秒で消え（既定6）、マウスが乗っている間は止まる。「元に戻す」を押すと undo が出て閉じる。 -->
<script setup lang="ts">
import { ArButton, ArToast } from "@arrow/ui";
import { ref } from "vue";
const open = ref(false);
const done = ref("");
</script>

<template>
<ArButton tone="danger" icon="trash" @click="(open = true), (done = '')">シフトを削除</ArButton>
<span v-if="done" style="margin-left: 12px; font-size: 13px">{{ done }}</span>
<ArToast v-model:open="open" message="佐藤 美咲さんの10月21日のシフトを削除しました" undo-text="元に戻す" @undo="done = '元に戻しました'" />
</template>
