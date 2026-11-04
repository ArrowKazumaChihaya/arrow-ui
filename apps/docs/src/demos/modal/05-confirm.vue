<!-- 確かめ（confirm） | useArConfirm() で小さな確かめを出し、答えを Promise で受け取る。左に印、ボタンは何が起きるかを書く。削除は tone="danger"（赤）。 -->
<script setup lang="ts">
import { ArButton, ArCluster, ArModal, useArConfirm } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const confirm = useArConfirm();
const result = ref("");
const preview = ref(true);
async function remove() {
  const ok = await confirm({
    tone: "danger",
    title: "シフトを削除しますか？",
    description: "佐藤 美咲さんの10月21日のシフトを削除します。元に戻せません。",
    okText: "削除する",
  });
  result.value = ok ? "削除しました" : "やめました";
}
async function hide() {
  const ok = await confirm({ title: "この人を一覧から隠しますか？", description: "「隠した人を表示」からいつでも戻せます。", okText: "隠す" });
  result.value = ok ? "隠しました" : "やめました";
}
</script>

<template>
<ArCluster :gap="2" align="center">
  <ArButton tone="danger" icon="trash" @click="remove">シフトを削除…</ArButton>
  <ArButton icon="eyeoff" @click="hide">一覧から隠す…</ArButton>
  <span v-if="result" style="font-size: 13px">{{ result }}</span>
</ArCluster>
<div style="position: relative; height: 230px; margin-top: 16px; border-radius: 12px; overflow: hidden; background: #EEF2F6">
  <ArModal
    v-model:open="preview"
    contained
    variant="confirm"
    :width="380"
    title="シフトを削除しますか？"
    description="佐藤 美咲さんの10月21日のシフトを削除します。元に戻せません。"
    ok-text="削除する"
    ok-tone="danger"
    cancel-text="やめる"
    @close="preview = true"
    @ok="preview = true"
  />
</div>
</template>
