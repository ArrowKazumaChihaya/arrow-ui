<script setup lang="ts">
/** ArAppFooter 1.0 — PC の画面の足。左にリンク、右に問い合わせのボタン、下に著作権。項目は props で渡す。 */
import ArIcon from "./ArIcon.vue";
import type { ArAppFooterProps } from "./ArAppFooter.contract";

withDefaults(defineProps<ArAppFooterProps>(), { links: () => [], supports: () => [], copyright: undefined });
const emit = defineEmits<{ select: [key: string, event: MouseEvent] }>();
</script>

<template>
  <footer data-ar="app-footer" data-part="root">
    <div data-part="row">
      <div data-part="links">
        <component
          :is="l.href ? 'a' : 'button'"
          v-for="l in links"
          :key="l.key"
          data-part="link"
          :href="l.href"
          :target="l.href ? '_blank' : undefined"
          :rel="l.href ? 'noopener noreferrer' : undefined"
          :type="l.href ? undefined : 'button'"
          @click="emit('select', l.key, $event)"
        >{{ l.label }}</component>
      </div>
      <div data-part="supports">
        <component
          :is="s.href ? 'a' : 'button'"
          v-for="s in supports"
          :key="s.key"
          data-part="support"
          :href="s.href"
          :type="s.href ? undefined : 'button'"
          @click="emit('select', s.key, $event)"
        >
          <ArIcon v-if="s.icon" :name="s.icon" data-part="support-icon" />
          <span data-part="support-label">{{ s.label }}</span>
        </component>
      </div>
    </div>
    <p v-if="copyright" data-part="copyright">{{ copyright }}</p>
  </footer>
</template>
