<!-- ページ送り | 今のページはテーマ色。件数の選択はセレクト、右に全件数。表の下・右寄せに置く。size="sm" は枠のない小さなページ送り。 -->
<script setup lang="ts">
import { ArPagination, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const page = ref(5);
const size = ref(20);
const p2 = ref(1);
</script>

<template>
<ArStack :gap="4">
  <ArPagination v-model:page="page" v-model:page-size="size" :total="386" show-size-changer show-total />
  <ArPagination v-model:page="p2" :total="60" :page-size="20" size="sm" />
  <ArPagination :page="1" :total="120" disabled />
</ArStack>
</template>
