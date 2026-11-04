<script setup lang="ts">
import type { ArPointerBadgeProps } from './ArPointerBadge.contract';
withDefaults(defineProps<ArPointerBadgeProps>(), { side: 'right', size: 20, tone: 'attention' });
</script>
<template><span data-ar="pointer-badge" data-part="root" :data-side="side" :data-tone="tone" :style="{ '--ar-pointer-size': `${size}px` }"><slot /></span></template>
