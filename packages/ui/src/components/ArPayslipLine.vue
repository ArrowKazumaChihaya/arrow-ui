<script setup lang="ts">
import { computed, useId } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArPayslipLineProps } from "./ArPayslipLine.contract";
import { formatPayslipValue, isNegativePayslipValue, payslipDifference } from "../internal/payslip";
const props = withDefaults(defineProps<ArPayslipLineProps>(), {
  label: "", value: "", compare: "off", zeroDiff: "±0", prevLabel: "前",
});
const labelId = useId();
const difference = computed(() => props.compare === "off" ? null : payslipDifference(props, props.zeroDiff));
</script>

<template>
  <tr data-ar="payslip-line" data-part="row" :data-editable="editable || undefined" :data-state="[total && 'total', big && 'big'].filter(Boolean).join(' ') || undefined">
    <th :id="labelId" data-part="label" scope="row"><slot name="label">{{ label }}</slot></th>
    <td data-part="value" :data-negative="isNegativePayslipValue(value) || undefined">
      <div data-part="amount"><slot :label-id="labelId">{{ formatPayslipValue(value) }}</slot><ArIcon v-if="edited" name="pen" line data-part="edited" label="手で直した金額" /></div>
      <span v-if="difference" data-part="diff" :data-sign="difference.sign">
        <span v-if="compare === 'prev' && typeof value === 'number' && prev != null" data-part="prev">{{ prevLabel }} {{ formatPayslipValue(prev) }}</span>
        <b>{{ difference.text }}</b>
      </span>
    </td>
  </tr>
</template>
