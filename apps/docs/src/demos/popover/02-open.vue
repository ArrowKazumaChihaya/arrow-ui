<!-- 開いたまま | v-model:open で開け閉めを持てる。見本の形：基準の下に出し、矢印は基準の要素の中央を指す。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArPopover, ArStack } from "@s_and_a/arrow-ui";
const open = ref(true);
</script>

<template>
<ArStack :gap="2" style="min-height: 190px">
  <ArPopover v-model:open="open" title="10月21日（水）の不足" content="13:00〜17:00 に1名足りません。">
    <ArButton tone="secondary" size="sm">{{ open ? "開いている" : "閉じている" }}</ArButton>
    <template #footer>
      <ArButton tone="subtle" size="sm">勤務可能な人を見る</ArButton>
    </template>
  </ArPopover>
</ArStack>
</template>
