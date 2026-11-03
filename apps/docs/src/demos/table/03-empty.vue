<!-- データがないとき | #empty で中身を差し替えられる。 -->
<script setup lang="ts">
import { ArTable } from "@arrow/ui";
const columns = [{ key: "name", title: "氏名" }, { key: "store", title: "所属" }];
</script>

<template>
<ArTable :columns="columns" :rows="[]" row-key="name" caption="空の表" />
</template>
