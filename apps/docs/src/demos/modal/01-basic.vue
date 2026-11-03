<!-- 確かめる | 閉じる・取り消しの操作は #footer に置く。開いている間は後ろを操作できない。 -->
<script setup lang="ts">
import { ArModal, ArButton, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const open = ref(false);
</script>

<template>
<ArButton tone="danger" icon="trash" @click="open = true">シフトを削除…</ArButton>
<ArModal v-model:open="open" title="シフトを削除しますか" description="佐藤 美咲さんの10月24日のシフトを削除します。" size="sm">
  取り消せません。勤怠が付いている場合は先に勤怠を消してください。
  <template #footer>
    <ArCluster justify="end" :gap="2">
      <ArButton tone="secondary" @click="open = false">キャンセル</ArButton>
      <ArButton tone="danger" @click="open = false">削除する</ArButton>
    </ArCluster>
  </template>
</ArModal>
</template>
