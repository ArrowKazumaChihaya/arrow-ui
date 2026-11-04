<!-- 今の ARROW の使い方：使えない選択肢 | disabled の選択肢は薄い文字で選べない（今の ARROW の SelectOption）。 -->
<script setup lang="ts">
import { ArSelect } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const v = ref<string | null>("part");
</script>

<template>
<ArSelect v-model="v" :options="[{ value: 'full', label: '正社員' }, { value: 'part', label: 'アルバイト' }, { value: 'exe', label: '役員（無効）', disabled: true }]" label="雇用形態" style="width: 200px" />
</template>
