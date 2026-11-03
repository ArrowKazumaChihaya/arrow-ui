<!-- アップロード | Excel登録と同じ形。置き場は淡いテーマ色の点線（Enter・Space でも選べる）。済みは緑のチェック、途中はテーマ色の進み具合、失敗は赤と理由。送る処理は親が行い files に状態を入れる。 -->
<script setup lang="ts">
import { ArUpload, type ArUploadFile } from "@arrow/ui";
import { ref } from "vue";
const files = ref<ArUploadFile[]>([
  { id: 1, name: "シフト_2026年10月.xlsx", status: "done" },
  { id: 2, name: "雇用契約書.pdf", status: "uploading", percent: 62 },
  { id: 3, name: "写真.heic", status: "error", error: "形式が違います" },
]);
let seq = 10;
function add(list: File[]) {
  for (const f of list) {
    const item: ArUploadFile = { id: seq++, name: f.name, status: "uploading", percent: 0 };
    files.value = [...files.value, item];
    const timer = setInterval(() => {
      files.value = files.value.map((x) => (x.id === item.id ? { ...x, percent: Math.min(100, (x.percent ?? 0) + 20), status: (x.percent ?? 0) + 20 >= 100 ? "done" : "uploading" } : x));
      if ((files.value.find((x) => x.id === item.id)?.percent ?? 100) >= 100) clearInterval(timer);
    }, 300);
  }
}
function reject(items: { file: File; reason: string }[]) {
  files.value = [...files.value, ...items.map((r) => ({ id: seq++, name: r.file.name, status: "error" as const, error: r.reason }))];
}
</script>

<template>
<ArUpload
  :files="files"
  accept=".xlsx,.pdf"
  :max-size="10 * 1024 * 1024"
  multiple
  hint=".xlsx・10MBまで"
  label="シフトの Excel"
  @select="add"
  @reject="reject"
  @remove="(f) => (files = files.filter((x) => x.id !== f.id))"
/>
</template>
