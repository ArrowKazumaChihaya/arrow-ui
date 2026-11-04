<!-- 写真・使えない | listType="picture" は 96px の四角（点線の「＋ 写真」）。disabled は置き場も押せない。 -->
<script setup lang="ts">
import { ArUpload, ArStack, type ArUploadFile } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const photos = ref<ArUploadFile[]>([{ id: 1, name: "店舗の写真.jpg", status: "done" }]);
</script>

<template>
<ArStack :gap="5" align="start">
  <ArUpload :files="photos" list-type="picture" accept="image/*" label="写真" @remove="(f) => (photos = photos.filter((x) => x.id !== f.id))" />
  <ArUpload disabled hint=".xlsx・10MBまで" label="使えない" />
</ArStack>
</template>
