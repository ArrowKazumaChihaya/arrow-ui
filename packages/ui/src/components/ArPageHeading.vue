<script setup lang="ts">
/** Page section heading shared by the ARROW product families. */
import type { ArPageHeadingProps } from './ArPageHeading.contract';
withDefaults(defineProps<ArPageHeadingProps>(), { title: undefined, type: 'bar', level: 2 });
</script>
<template>
 <component :is="`h${level}`" data-ar="page-heading" data-part="root" :data-type="type">
  <span data-part="label"><template v-if="title !== undefined">{{ title }}</template><slot v-else /></span><span v-if="title !== undefined && $slots.default" data-part="suffix"><slot /></span>
 </component>
</template>
