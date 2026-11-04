<script setup lang="ts">
import ArIcon from './ArIcon.vue';
import type {ArTableHeaderProps,ArTableHeaderEmits} from './ArTableHeader.contract';
defineProps<ArTableHeaderProps>();
const emit=defineEmits<ArTableHeaderEmits>();
</script>
<template>
 <th data-ar="table-header" data-part="root" scope="col" :aria-sort="sortable ? sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : 'none' : undefined" :style="{width:width ? `${width}px`:undefined,minWidth:width ? `${width}px`:undefined,maxWidth:maxWidth ? `${maxWidth}px`:undefined}">
  <button v-if="sortable || toggle" data-part="button" type="button" :aria-label="label" @click="emit('activate')">
   <ArIcon v-if="toggle" name="menu" size="sm" /><span data-part="label"><slot /></span>
   <span v-if="sortable" data-part="sort" :data-sort="sort || undefined"><ArIcon name="cd" style="transform:rotate(180deg)" size="sm"/><ArIcon name="cd" size="sm"/></span>
  </button>
  <slot v-else />
 </th>
</template>
