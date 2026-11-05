<script setup lang="ts">
import type { ArPayslipTableProps } from "./ArPayslipTable.contract";
defineProps<ArPayslipTableProps>();
</script>

<template>
  <table data-ar="payslip-table" data-part="section">
    <thead v-if="title"><tr><th data-part="section-title" :colspan="2" scope="colgroup">{{ title }}</th></tr></thead>
    <tbody><slot /></tbody>
  </table>
</template>
