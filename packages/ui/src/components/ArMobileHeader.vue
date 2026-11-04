<script setup lang="ts">
/**
 * ArMobileHeader 1.1 — スマホの画面の頭。左にロゴ（slot）、右にお知らせのボタンと件数の丸。下端にテーマ色の線。
 * menus を渡すと右端にメニューのボタンを出し、押すと下から一覧（親と子のメニュー）を出す。
 */
import { computed, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArDrawer from "./ArDrawer.vue";
import ArNavSheet from "../internal/ArNavSheet.vue";
import type { ArMobileHeaderProps } from "./ArMobileHeader.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArMobileHeaderProps>(), {
  count: 0,
  noticeLabel: "お知らせ",
  icon: "speaker",
  hideNotice: false,
  menus: undefined,
  current: undefined,
  menuOpen: undefined,
  labels: () => ({ count: "件" }),
});
const emit = defineEmits<{ notice: []; navigate: [key: string, event: MouseEvent]; "update:menuOpen": [open: boolean] }>();
const menuText = computed(() => props.labels.menu ?? "メニュー");
const inner = ref(false);
const isOpen = computed(() => props.menuOpen ?? inner.value);
function setOpen(v: boolean) {
  inner.value = v;
  emit("update:menuOpen", v);
}
function onNav(key: string, e: MouseEvent) {
  setOpen(false);
  emit("navigate", key, e);
}
</script>

<template>
  <header v-bind="$attrs" data-ar="mobile-header" data-part="root" :data-has-menu="menus?.length ? '' : undefined">
    <span data-part="logo"><slot name="logo" /></span>
    <span v-if="$slots.actions" data-part="actions"><slot name="actions" /></span>
    <button
      v-if="!hideNotice"
      type="button"
      data-part="notice"
      :data-state="count ? 'has-count' : 'empty'"
      :aria-label="count ? `${noticeLabel} ${count}${labels.count}` : noticeLabel"
      :title="noticeLabel"
      @click="emit('notice')"
    >
      <ArIcon :name="icon" size="lg" />
      <span v-if="count" data-part="count" aria-hidden="true">{{ count > 99 ? "99+" : count }}</span>
    </button>
    <button
      v-if="menus?.length"
      type="button"
      data-part="menu"
      :data-state="isOpen ? 'open' : undefined"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-label="menuText"
      :title="menuText"
      @click="setOpen(!isOpen)"
    >
      <ArIcon line name="menu" size="lg" />
    </button>
  </header>
  <ArDrawer v-if="menus?.length" :open="isOpen" :title="menuText" placement="bottom" @update:open="setOpen">
    <ArNavSheet :items="menus" :current="current" :label="menuText" @navigate="onNav" />
  </ArDrawer>
</template>
