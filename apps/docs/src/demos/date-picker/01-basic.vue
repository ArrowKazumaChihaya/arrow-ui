<!-- カレンダーから選ぶ | ARROW では日付は ArDateInput が基本。カレンダーから選ぶときだけ右のボタンでパネルを開く。←→↑↓で日、PageUp/PageDown で月、Enter で選び「決める」。 -->
<script setup lang="ts">
import { ArDatePicker, ArStack } from "@arrow/ui";
import { ref } from "vue";
const day = ref<string | null>("2026-10-21");
const quick = ref<string | null>(null);
</script>

<template>
<ArStack :gap="4" align="start">
  <ArDatePicker v-model="day" label="イベントの日付" />
  <ArDatePicker v-model="quick" :confirm="false" label="押したら決まる" />
  <span class="demo-note">値：{{ day ?? "—" }}</span>
</ArStack>
</template>
