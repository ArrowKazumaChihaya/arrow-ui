<!-- 部品の中の印（line） | line を付けると、デザインが絵を持っていてもいつも線で描く。部品の中の開閉の∨・閉じる×・チェックの✓などに使う（classic でもそこは今の ARROW の絵ではないため）。 -->
<script setup lang="ts">
import { ArIcon } from "@arrow/ui";
const names = ["cd", "x", "check", "plus", "lock"] as const;
</script>

<template>
<div class="demo-icons">
  <div v-for="n in names" :key="n" class="demo-icon">
    <span style="display: inline-flex; gap: 10px"><ArIcon :name="n" size="lg" /><ArIcon :name="n" size="lg" line /></span>
    <code>{{ n }}／{{ n }} line</code>
  </div>
</div>
</template>
