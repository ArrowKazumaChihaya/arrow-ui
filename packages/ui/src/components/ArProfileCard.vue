<script setup lang="ts">
import { computed } from "vue";
import ArAvatar from "./ArAvatar.vue";
import ArCard from "./ArCard.vue";
import ArDescriptions from "./ArDescriptions.vue";
import ArTag from "./ArTag.vue";
import ArText from "./ArText.vue";
import ArTitle from "./ArTitle.vue";
import ArCluster from "../layout/ArCluster.vue";
import ArStack from "../layout/ArStack.vue";
import type { ArProfileCardProps } from "./ArProfileCard.contract";

const props = withDefaults(defineProps<ArProfileCardProps>(), {
  title: undefined, name: undefined, kana: undefined, code: undefined, image: undefined, tagsLabel: undefined,
  layout: "default", items: () => [], tags: () => [],
  photoEditable: false, photoLabel: "写真を変更",
});
const emit = defineEmits<{ "photo-click": [] }>();
const descriptionItems = computed(() => [
  ...props.items,
  ...(props.tags.length && props.tagsLabel ? [{ key: "profile-tags", label: props.tagsLabel }] : []),
]);
</script>

<template>
  <article data-ar="profile-card" data-part="root" :data-layout="layout">
    <ArCard :variant="title ? 'band' : 'elevated'" :title="title" :icon="title ? 'users' : undefined">
      <ArStack :gap="4" data-part="summary">
        <ArCluster :gap="4" justify="between" align="start" data-part="header">
          <div data-part="identity">
            <div data-part="photo">
              <button v-if="photoEditable" type="button" data-part="photo-button" :aria-label="photoLabel" :title="photoLabel" @click="emit('photo-click')">
                <ArAvatar :src="image" :name="name" :size="layout === 'compact' ? 'lg' : 'xl'" />
              </button>
              <ArAvatar v-else :src="image" :name="name" :size="layout === 'compact' ? 'lg' : 'xl'" />
              <slot name="photo-actions" />
            </div>
            <ArStack :gap="1">
              <ArText v-if="code" type="muted" size="sm">{{ code }}</ArText>
              <ArTitle v-if="name" :level="3" data-part="name">{{ name }}</ArTitle>
              <ArText v-if="kana" type="muted" size="sm">{{ kana }}</ArText>
              <ArCluster v-if="tags.length && !tagsLabel" :gap="1">
                <ArTag v-for="tag in tags" :key="tag.key" :tone="tag.tone ?? 'accent'" :data-ar-palette="tag.palette" size="sm">{{ tag.label }}</ArTag>
              </ArCluster>
            </ArStack>
          </div>
          <ArCluster v-if="$slots.actions" :gap="2" data-part="actions"><slot name="actions" /></ArCluster>
        </ArCluster>
        <ArDescriptions v-if="descriptionItems.length" :items="descriptionItems" :column="Math.min(2, descriptionItems.length)" :variant="layout === 'compact' ? 'plain' : 'bordered'">
          <template #item-profile-tags>
            <ArCluster :gap="1">
              <ArTag v-for="tag in tags" :key="tag.key" :tone="tag.tone ?? 'accent'" :data-ar-palette="tag.palette" size="sm">{{ tag.label }}</ArTag>
            </ArCluster>
          </template>
        </ArDescriptions>
        <ArCluster v-if="$slots.footer" :gap="2" data-part="footer"><slot name="footer" /></ArCluster>
      </ArStack>
    </ArCard>
  </article>
</template>
