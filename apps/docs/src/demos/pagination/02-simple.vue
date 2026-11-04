<!-- 簡単な形 | simple は「‹ [3] ／ 12 ›」。入力欄にページを打って Enter で移る（カードの中・小さな一覧）。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArPagination } from "@s_and_a/arrow-ui";
const page = ref(3);
</script>

<template>
<ArPagination v-model:page="page" :total="120" :page-size="10" simple />
</template>
