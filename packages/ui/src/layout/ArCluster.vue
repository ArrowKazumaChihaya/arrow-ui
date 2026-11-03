<script setup lang="ts">
/** ArCluster 1.0 — 横に並べる（はみ出したら折り返す）。 */
import type { ArAlign, ArJustify, ArSpace } from "./types";
withDefaults(
  defineProps<{ gap?: ArSpace; align?: ArAlign; justify?: ArJustify; wrap?: boolean; as?: string }>(),
  { gap: 2, align: "center", justify: "start", wrap: true, as: "div" },
);
</script>

<template>
  <component
    :is="as"
    data-ar="cluster"
    :data-gap="gap"
    :data-align="align"
    :data-justify="justify"
    :data-wrap="wrap ? 'wrap' : 'nowrap'"
    ><slot
  /></component>
</template>
