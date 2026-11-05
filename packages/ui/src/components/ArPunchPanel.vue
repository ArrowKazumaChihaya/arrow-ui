<script setup lang="ts">
import ArCard from "./ArCard.vue";
import ArParagraph from "./ArParagraph.vue";
import ArStack from "../layout/ArStack.vue";
import ArGrid from "../layout/ArGrid.vue";
import type { ArPunchPanelProps } from "./ArPunchPanel.contract";
withDefaults(defineProps<ArPunchPanelProps>(), { description: undefined, icon: "clock" });
</script>

<template>
  <section data-ar="punch-panel" data-part="root" :data-date-separated="dateLabel ? 'true' : undefined">
    <ArCard :title="title" :icon="icon" variant="band">
      <ArStack :gap="5">
        <ArStack :gap="2" align="center">
          <div v-if="dateLabel" data-part="date">{{ dateLabel }}</div>
          <div data-part="clock">{{ timestamp }}</div>
          <ArParagraph v-if="description" type="secondary" size="sm">{{ description }}</ArParagraph>
        </ArStack>
        <ArStack v-if="$slots.default" :gap="4" data-part="controls"><slot /></ArStack>
        <ArGrid v-if="$slots.actions" :columns="2" :gap="4" data-part="actions"><slot name="actions" /></ArGrid>
        <ArStack v-if="$slots.footer" :gap="2" data-part="footer"><slot name="footer" /></ArStack>
      </ArStack>
    </ArCard>
  </section>
</template>
