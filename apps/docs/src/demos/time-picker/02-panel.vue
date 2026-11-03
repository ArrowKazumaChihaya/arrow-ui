<!-- パネルだけ | inline でパネルをその場に出す。↑↓で動かし、←→で時と分を行き来、Enter で決める。 -->
<script setup lang="ts">
import { ArTimePicker, ArCluster } from "@arrow/ui";
import { ref } from "vue";
const a = ref<string | null>("09:00");
</script>

<template>
<ArCluster :gap="6" align="start">
  <ArTimePicker v-model="a" inline label="時刻" />
  <ArTimePicker v-model="a" inline :minute-step="5" :confirm="false" label="押したら決まる" />
  <span class="demo-note">値：{{ a ?? "—" }}</span>
</ArCluster>
</template>
