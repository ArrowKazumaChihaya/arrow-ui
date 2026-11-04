<!-- 開く・閉じる | 幕を押す・Esc・× で閉じる。開くと中の最初の入力にフォーカスし、閉じると押したボタンに戻る。placement="left" で左から。width で幅を変える。 -->
<script setup lang="ts">
import { ArDrawer, ArButton, ArCluster, ArField, ArTextInput } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const open = ref(false);
const side = ref<"right" | "left">("right");
const name = ref("佐藤 美咲");
function show(s: "right" | "left") {
  side.value = s;
  open.value = true;
}
</script>

<template>
<ArCluster :gap="2">
  <ArButton @click="show('right')">右から開く</ArButton>
  <ArButton @click="show('left')">左から開く</ArButton>
</ArCluster>
<ArDrawer v-model:open="open" :placement="side" title="表示の設定" icon="gear" :width="400">
  <ArField label="表示名" v-slot="f"><ArTextInput v-model="name" :id="f.id" block /></ArField>
  <template #footer>
    <ArButton @click="open = false">キャンセル</ArButton>
    <ArButton tone="primary" @click="open = false">保存する</ArButton>
  </template>
</ArDrawer>
</template>
