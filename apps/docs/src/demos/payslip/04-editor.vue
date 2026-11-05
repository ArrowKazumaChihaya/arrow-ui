<script setup lang="ts">
import { ref } from "vue";
import { ArPayslip, ArPayslipTable, ArPayslipLine, ArTextInput } from "@s_and_a/arrow-ui";
const amount = ref("250000");
</script>
<template>
  <ArPayslip title="給与明細書（編集）" period="2026年11月分" :column-count="2">
    <template #column-0>
      <ArPayslipTable title="支給">
        <ArPayslipLine label="基本給" editable>
          <template #default="{ labelId }"><ArTextInput v-model="amount" :aria-labelledby="labelId" block /></template>
        </ArPayslipLine>
        <ArPayslipLine label="通勤手当" :value="8000" />
      </ArPayslipTable>
    </template>
    <template #column-1>
      <ArPayslipTable title="控除"><ArPayslipLine label="社会保険料" :value="35000" /></ArPayslipTable>
    </template>
  </ArPayslip>
</template>
