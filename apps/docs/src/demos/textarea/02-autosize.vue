<!-- 自動で高さ | autosize は打った量に合わせて高さを変える。{ minRows, maxRows } で上限・下限（超えたら中でスクロール）。 -->
<script setup lang="ts">
import { ArTextarea, ArStack } from "@arrow/ui";
import { ref } from "vue";
const a = ref("改行すると\n高さが\n伸びます");
const b = ref("");
</script>

<template>
<ArStack :gap="3">
  <ArTextarea v-model="a" autosize label="自動（下限なし）" />
  <ArTextarea v-model="b" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="2〜5行" label="2〜5行" />
</ArStack>
</template>
