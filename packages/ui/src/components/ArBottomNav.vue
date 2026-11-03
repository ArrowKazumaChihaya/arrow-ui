<script setup lang="ts">
/** ArBottomNav 1.0 — スマホの下に固定するメニュー。アイコンと小さな名前を5つ等分に並べ、今いるものをテーマ色で示す。 */
import ArIcon from "./ArIcon.vue";
import type { ArBottomNavProps } from "./ArBottomNav.contract";

withDefaults(defineProps<ArBottomNavProps>(), { current: undefined, fixed: true, labels: () => ({ nav: "メインメニュー" }) });
const emit = defineEmits<{ navigate: [key: string, event: MouseEvent] }>();
</script>

<template>
  <nav data-ar="bottom-nav" data-part="root" :data-fixed="fixed || undefined" :aria-label="labels.nav" :style="{ '--ar-bottom-nav-count': String(items.length) }">
    <component
      :is="it.href ? 'a' : 'button'"
      v-for="it in items"
      :key="it.key"
      data-part="item"
      :data-state="it.key === current ? 'on' : undefined"
      :data-ar-palette="it.palette"
      :href="it.href"
      :type="it.href ? undefined : 'button'"
      :aria-current="it.key === current ? 'page' : undefined"
      @click="emit('navigate', it.key, $event)"
    >
      <ArIcon v-if="it.icon" :name="it.icon" data-part="icon" />
      <span data-part="label">{{ it.label }}</span>
    </component>
  </nav>
</template>
