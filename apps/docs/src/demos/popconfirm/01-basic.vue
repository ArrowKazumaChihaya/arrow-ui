<!-- その場の確認 | 中のボタンを押すと、そばに問いと「やめる／主なボタン」が出る。消すときは ok-tone="danger"。外を押す・Esc でやめる。 -->
<script setup lang="ts">
import { ArPopconfirm, ArButton, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const open = ref(true);
const last = ref("");
</script>

<template>
<div style="padding-top: 150px">
  <ArCluster :gap="4" align="center">
    <ArPopconfirm
      v-model:open="open"
      title="この人を一覧から隠しますか？"
      description="「隠した人を表示」からいつでも戻せます。"
      ok-text="隠す"
      @confirm="last = '隠しました'"
      @cancel="last = 'やめました'"
    >
      <ArButton icon="eyeoff">一覧から隠す</ArButton>
    </ArPopconfirm>
    <ArPopconfirm title="このパターンを削除しますか？" ok-text="削除する" ok-tone="danger" placement="bottom-start" @confirm="last = '削除しました'">
      <ArButton tone="danger-subtle" icon="trash">削除</ArButton>
    </ArPopconfirm>
    <span v-if="last" style="font-size: 13px">{{ last }}</span>
  </ArCluster>
</div>
</template>
