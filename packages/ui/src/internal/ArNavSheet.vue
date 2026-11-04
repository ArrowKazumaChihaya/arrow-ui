<script setup lang="ts">
/**
 * メニューの一覧（ライブラリの中だけで使う）。ArBottomNav の「メニュー（その他）」と ArMobileHeader のメニューの、
 * 下から出る板（ArDrawer）の中身。今の ARROW のメニューのページ（MenuLayout/Menu の app-grid）と同じく、
 * 親の項目と、その子の項目を順にタイルで並べる。押すと navigate。
 */
import ArIcon from "../components/ArIcon.vue";
import type { ArAppNavItem } from "../components/ArAppHeader.contract";

defineProps<{ items: readonly ArAppNavItem[]; current?: string; label: string }>();
const emit = defineEmits<{ navigate: [key: string, event: MouseEvent] }>();
</script>

<template>
  <nav data-ar="nav-sheet" data-part="root" :aria-label="label">
    <template v-for="it in items" :key="it.key">
      <component
        :is="it.href ? 'a' : 'button'"
        data-part="tile"
        :data-state="it.key === current ? 'on' : undefined"
        :data-ar-palette="it.palette"
        :href="it.href"
        :type="it.href ? undefined : 'button'"
        :aria-current="it.key === current ? 'page' : undefined"
        @click="emit('navigate', it.key, $event)"
      >
        <span data-part="tile-icon" :data-icon="it.icon"><ArIcon v-if="it.icon" :name="it.icon" /></span>
        <span data-part="tile-label">{{ it.label }}</span>
      </component>
      <component
        :is="c.href ? 'a' : 'button'"
        v-for="c in it.children ?? []"
        :key="`${it.key}/${c.key}`"
        data-part="tile"
        data-kind="child"
        :data-state="c.key === current ? 'on' : undefined"
        :data-ar-palette="c.palette ?? it.palette"
        :href="c.href"
        :type="c.href ? undefined : 'button'"
        :aria-current="c.key === current ? 'page' : undefined"
        @click="emit('navigate', c.key, $event)"
      >
        <span data-part="tile-icon" :data-icon="c.icon ?? it.icon"><ArIcon v-if="c.icon ?? it.icon" :name="(c.icon ?? it.icon)!" /></span>
        <span data-part="tile-label">{{ c.label }}</span>
      </component>
    </template>
  </nav>
</template>
