<script setup lang="ts">
/** Page section heading shared by the ARROW product families. */
import type { ArPageHeadingProps } from './ArPageHeading.contract';
withDefaults(defineProps<ArPageHeadingProps>(), { title: undefined, type: 'bar', level: 2 });
</script>
<template>
 <component :is="`h${level}`" data-ar="page-heading" data-part="root" :data-type="type">
  <span data-part="label">{{ title }}</span><span v-if="$slots.default" data-part="suffix"><slot /></span>
 </component>
</template>
