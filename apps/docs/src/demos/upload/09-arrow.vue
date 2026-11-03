<!-- 今の ARROW の使い方 | classic は今の ARROW の Upload と同じく「ファイルを選択」のボタンと、その下のファイル名（remix は置き場）。button-tone・button-size でボタンを選ぶ。 -->
<script setup lang="ts">
import { ArUpload, type ArUploadFile } from "@arrow/ui";
import { ref } from "vue";
const files = ref<ArUploadFile[]>([]);
function onSelect(fs: File[]) {
  files.value = fs.map((f, i) => ({ id: i, name: f.name, status: "done" as const }));
}
</script>

<template>
<div class="g">
  <div style="width: 200px"><small>add empty</small><ArUpload :files="files" label="ファイル" style="width: 200px" @select="onSelect" @remove="files = []" /></div>
  <div style="width: 200px"><small>cancel</small><ArUpload button-tone="muted" label="ファイル" style="width: 200px" /></div>
  <div style="width: 200px"><small>disabled</small><ArUpload disabled label="ファイル" style="width: 200px" /></div>
  <div style="width: 260px"><small>xlarge</small><ArUpload button-size="xl" label="ファイル" style="width: 260px" /></div>
</div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 20px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
