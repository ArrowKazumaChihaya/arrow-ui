<script setup lang="ts">
/**
 * ArBreadcrumb 1.0 — パンくず。区切りは「/」か「›」、今のページは太字（aria-current="page"）。メニュー付きの項目は cd のアイコン。
 */
import ArIcon from "./ArIcon.vue";
import ArDropdown from "./ArDropdown.vue";
import type { ArBreadcrumbProps } from "./ArBreadcrumb.contract";

withDefaults(defineProps<ArBreadcrumbProps>(), { separator: "/", label: "パンくず" });
const emit = defineEmits<{ click: [index: number, event: MouseEvent]; select: [index: number, key: string] }>();
</script>

<template>
  <nav data-ar="breadcrumb" data-part="root" :aria-label="label">
    <ol data-part="list">
      <template v-for="(it, i) in items" :key="i">
        <li v-if="i > 0" data-part="separator" aria-hidden="true">{{ separator }}</li>
        <li data-part="item">
          <span v-if="i === items.length - 1" data-part="current" aria-current="page">
            <ArIcon v-if="it.icon" :name="it.icon" data-part="icon" size="sm" />
            <template v-if="!it.iconOnly">{{ it.label }}</template>
          </span>
          <ArDropdown v-else-if="it.menu" :items="it.menu" @select="(k) => emit('select', i, k)">
            <template #default="{ attrs }">
              <button type="button" data-part="link" v-bind="attrs" :aria-label="it.iconOnly ? it.label : undefined">
                <ArIcon v-if="it.icon" :name="it.icon" data-part="icon" size="sm" />
                <template v-if="!it.iconOnly">{{ it.label }}</template>
                <ArIcon line name="cd" data-part="icon" size="sm" />
              </button>
            </template>
          </ArDropdown>
          <a
            v-else
            data-part="link"
            :href="it.href"
            :aria-label="it.iconOnly ? it.label : undefined"
            :title="it.iconOnly ? it.label : undefined"
            @click="emit('click', i, $event)"
          >
            <ArIcon v-if="it.icon" :name="it.icon" data-part="icon" size="sm" />
            <template v-if="!it.iconOnly">{{ it.label }}</template>
          </a>
        </li>
      </template>
    </ol>
  </nav>
</template>
