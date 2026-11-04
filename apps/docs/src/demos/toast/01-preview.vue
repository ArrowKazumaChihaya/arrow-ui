<!-- 形 | 操作のあと画面の下に出る黒い帯（.toast）。チェックの印＋言葉＋「閉じる」。元に戻せる操作には undo-text で「元に戻す」を足す。contained で親の下に出せる。 -->
<script setup lang="ts">
import { ArToast } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const a = ref(true);
const b = ref(true);
</script>

<template>
<div style="position: relative; height: 150px; background: #fff">
  <ArToast v-model:open="a" contained :duration="0" :offset="84" message="末永 修也さんの10月21日のシフトを変更しました" @close="a = true" />
  <ArToast v-model:open="b" contained :duration="0" :offset="14" message="3件のシフトを削除しました" undo-text="元に戻す" @close="b = true" />
</div>
</template>
