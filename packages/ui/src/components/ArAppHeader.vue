<script setup lang="ts">
/**
 * ArAppHeader 1.0 — PC の画面の頭（2段）。
 * 1段目：ロゴ（slot）・お知らせとやることのピル（件数の丸）・右端に管理ページ（押すとメニュー）。
 * 2段目：メニュー（今いるものをテーマ色で塗る）。下端にページのテーマ色の線。項目はすべて props で渡す。
 */
import { computed, nextTick, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArFloat from "../internal/ArFloat.vue";
import { useId } from "../provider/context";
import type { ArAppHeaderProps, ArAppNavItem } from "./ArAppHeader.contract";

const props = withDefaults(defineProps<ArAppHeaderProps>(), {
  menusEnd: () => [],
  current: undefined,
  pills: () => [],
  account: undefined,
  accountMenu: undefined,
  labels: () => ({ nav: "メインメニュー", count: "件" }),
});
const emit = defineEmits<{ navigate: [key: string, event: MouseEvent]; pill: [key: string]; account: [key: string] }>();

const menuId = useId("ar-account-menu");
const accountBtn = ref<HTMLButtonElement | null>(null);
const menuOpen = ref(false);
const active = ref(0);
const hasMenu = computed(() => !!props.accountMenu?.length);
const countText = (n: number) => (n > 99 ? "99+" : String(n));

function onAccount() {
  if (!hasMenu.value) return emit("account", "");
  menuOpen.value ? closeMenu() : openMenu(0);
}
async function openMenu(at: number) {
  active.value = at;
  menuOpen.value = true;
  await nextTick();
  await nextTick();
  focusItem();
}
function focusItem() {
  document.getElementById(`${menuId}-${active.value}`)?.focus();
}
function closeMenu(refocus = true) {
  menuOpen.value = false;
  if (refocus) accountBtn.value?.focus();
}
function choose(key: string) {
  closeMenu();
  emit("account", key);
}
function onAccountKey(e: KeyboardEvent) {
  if (!hasMenu.value) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    void openMenu(e.key === "ArrowDown" ? 0 : props.accountMenu!.length - 1);
  }
}
function onMenuKey(e: KeyboardEvent) {
  const n = props.accountMenu?.length ?? 0;
  const moves: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
  if (e.key in moves) {
    e.preventDefault();
    active.value = (active.value + moves[e.key]! + n) % n;
    focusItem();
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    active.value = e.key === "Home" ? 0 : n - 1;
    focusItem();
  } else if (e.key === "Tab") {
    closeMenu(false);
  }
}
function onNav(item: ArAppNavItem, e: MouseEvent) {
  emit("navigate", item.key, e);
}
</script>

<template>
  <header data-ar="app-header" data-part="root">
    <div data-part="top">
      <span data-part="logo"><slot name="logo" /></span>
      <button
        v-for="p in pills"
        :key="p.key"
        type="button"
        data-part="pill"
        :data-tone="p.tone ?? 'notice'"
        :data-state="p.count ? 'has-count' : 'empty'"
        @click="emit('pill', p.key)"
      >
        <ArIcon v-if="p.icon" :name="p.icon" size="sm" data-part="pill-icon" />
        <span data-part="pill-label">{{ p.label }}</span>
        <span v-if="p.count" data-part="count"><span aria-hidden="true">{{ countText(p.count) }}</span><span data-ar-visually-hidden>{{ p.count }}{{ labels.count }}</span></span>
      </button>
      <button
        v-if="account"
        ref="accountBtn"
        type="button"
        data-part="account"
        :data-state="menuOpen ? 'open' : undefined"
        :aria-haspopup="hasMenu ? 'menu' : undefined"
        :aria-expanded="hasMenu ? (menuOpen ? 'true' : 'false') : undefined"
        :aria-controls="hasMenu ? menuId : undefined"
        @click="onAccount"
        @keydown="onAccountKey"
      >
        <span v-if="account.initial" data-part="avatar" aria-hidden="true">{{ account.initial }}</span>
        <ArIcon name="bld" data-part="account-icon" />
        <span data-part="account-label">{{ account.label }}</span>
        <ArIcon v-if="hasMenu" name="cd" size="sm" data-part="account-arrow" />
      </button>
      <ArFloat :id="menuId" :open="menuOpen" :anchor="accountBtn" ar="app-account-menu" placement="bottom-end" role="menu" :label="account?.label" @close="(r) => closeMenu(r === 'escape')">
        <button
          v-for="(a, i) in accountMenu"
          :id="`${menuId}-${i}`"
          :key="a.key"
          type="button"
          role="menuitem"
          data-part="menu-item"
          :tabindex="i === active ? 0 : -1"
          @click="choose(a.key)"
          @keydown="onMenuKey"
        >
          <span>{{ a.label }}</span><ArIcon name="cr" size="sm" data-part="menu-arrow" />
        </button>
      </ArFloat>
    </div>
    <nav data-part="nav" :aria-label="labels.nav">
      <template v-for="(group, gi) in [menus, menusEnd]" :key="gi">
        <span v-if="gi === 1" data-part="spacer" />
        <component
          :is="it.href ? 'a' : 'button'"
          v-for="it in group"
          :key="it.key"
          data-part="item"
          :data-side="gi === 0 ? 'start' : 'end'"
          :data-state="it.key === current ? 'on' : undefined"
          :data-ar-palette="it.palette"
          :href="it.href"
          :type="it.href ? undefined : 'button'"
          :aria-current="it.key === current ? 'page' : undefined"
          @click="onNav(it, $event)"
        >
          <span v-if="it.icon" data-part="item-icon"><ArIcon :name="it.icon" /></span>
          <span data-part="item-label">{{ it.label }}</span>
        </component>
      </template>
    </nav>
  </header>
</template>
