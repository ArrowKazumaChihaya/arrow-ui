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
  domains: () => [],
  domain: undefined,
  collapsible: false,
  collapsed: false,
  labels: () => ({ nav: "メインメニュー", count: "件" }),
});
const emit = defineEmits<{
  navigate: [key: string, event: MouseEvent];
  pill: [key: string];
  account: [key: string];
  domain: [key: string];
  "update:collapsed": [collapsed: boolean];
  "pill-item": [pill: string, item: string];
}>();
const L = computed(() => ({ collapse: "ヘッダーを閉じる", expand: "ヘッダーを開く", domains: "領域", ...props.labels }));
/** 指している・フォーカスしているピル（一覧を出す）とメニュー（子のメニューを出す）。出すものはその真下に同じ幅で置く。 */
const pillEls = new Map<string, HTMLElement>();
const itemEls = new Map<string, HTMLElement>();
function setRef(map: Map<string, HTMLElement>, key: string, el: unknown) {
  const node = (el as { $el?: unknown } | null)?.$el ?? el;
  if (node instanceof HTMLElement) map.set(key, node);
  else map.delete(key);
}
const open = ref<{ kind: "pill" | "item"; key: string } | null>(null);
const openStyle = ref<Record<string, string>>({});
let timer: ReturnType<typeof setTimeout> | undefined;
function show(kind: "pill" | "item", key: string, has: boolean) {
  clearTimeout(timer);
  if (!has) {
    open.value = null;
    return;
  }
  const el = (kind === "pill" ? pillEls : itemEls).get(key);
  if (el) openStyle.value = { left: `${el.offsetLeft}px`, top: `${el.offsetTop + el.offsetHeight}px`, width: `${el.offsetWidth}px` };
  open.value = { kind, key };
}
function keep() {
  clearTimeout(timer);
}
function hideSoon() {
  clearTimeout(timer);
  timer = setTimeout(() => (open.value = null), 120);
}
const openPill = computed(() => (open.value?.kind === "pill" ? props.pills.find((p) => p.key === open.value!.key) : undefined));
const openItem = computed(() => (open.value?.kind === "item" ? [...props.menus, ...props.menusEnd].find((m) => m.key === open.value!.key) : undefined));

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
        :ref="(el) => setRef(pillEls, p.key, el)"
        type="button"
        data-part="pill"
        :data-tone="p.tone ?? 'notice'"
        :data-state="[p.count ? 'has-count' : 'empty', open?.kind === 'pill' && open.key === p.key && 'open'].filter(Boolean).join(' ')"
        :aria-expanded="p.items?.length ? open?.kind === 'pill' && open.key === p.key : undefined"
        @click="emit('pill', p.key)"
        @pointerenter="show('pill', p.key, !!p.items?.length)"
        @pointerleave="hideSoon"
        @focus="show('pill', p.key, !!p.items?.length)"
        @blur="hideSoon"
      >
        <ArIcon v-if="p.icon" :name="p.icon" size="sm" data-part="pill-icon" :data-icon="p.icon" />
        <span data-part="pill-label">{{ p.label }}</span>
        <span v-if="p.count" data-part="count"><span aria-hidden="true">{{ countText(p.count) }}</span><span data-ar-visually-hidden>{{ p.count }}{{ labels.count }}</span></span>
      </button>
      <ul
        v-if="openPill?.items?.length"
        data-part="pill-list"
        :data-tone="openPill.tone ?? 'notice'"
        :style="openStyle"
        @pointerenter="keep"
        @pointerleave="hideSoon"
        @focusin="keep"
        @focusout="hideSoon"
      >
        <li v-for="it in openPill.items" :key="it.key"><button type="button" data-part="pill-item" @click="emit('pill-item', openPill.key, it.key)">{{ it.label }}</button></li>
      </ul>
      <div v-if="$slots.top" data-part="top-extra"><slot name="top" /></div>
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
      <button v-if="collapsible && collapsed" type="button" data-part="expand" :aria-label="L.expand" :title="L.expand" @click="emit('update:collapsed', false)">
        <ArIcon name="plus" size="sm" />
      </button>
    </div>
    <div v-if="(domains.length || collapsible) && !collapsed" data-part="domains">
      <div data-part="domain-list" role="tablist" :aria-label="L.domains">
        <button
          v-for="d in domains"
          :key="d.key"
          type="button"
          role="tab"
          data-part="domain"
          :data-state="d.key === domain ? 'on' : undefined"
          :aria-selected="d.key === domain"
          @click="emit('domain', d.key)"
        >
          <span v-if="d.icon" data-part="domain-icon" :data-icon="d.icon"><ArIcon :name="d.icon" /></span>
          <span>{{ d.label }}</span>
        </button>
      </div>
      <button v-if="collapsible" type="button" data-part="toggle" @click="emit('update:collapsed', true)">
        <ArIcon name="minus" size="sm" /><span>{{ L.collapse }}</span>
      </button>
    </div>
    <nav v-if="menus.length || menusEnd.length" data-part="nav" :aria-label="labels.nav">
      <template v-for="(group, gi) in [menus, menusEnd]" :key="gi">
        <span v-if="gi === 1" data-part="spacer" />
        <component
          :is="it.href ? 'a' : 'button'"
          v-for="it in group"
          :key="it.key"
          :ref="(el: unknown) => setRef(itemEls, it.key, el)"
          data-part="item"
          :data-side="gi === 0 ? 'start' : 'end'"
          :data-state="[it.key === current && 'on', open?.kind === 'item' && open.key === it.key && 'open'].filter(Boolean).join(' ') || undefined"
          :data-ar-palette="it.palette"
          :href="it.href"
          :type="it.href ? undefined : 'button'"
          :aria-current="it.key === current ? 'page' : undefined"
          :aria-expanded="it.children?.length ? open?.kind === 'item' && open.key === it.key : undefined"
          @click="onNav(it, $event)"
          @pointerenter="show('item', it.key, !!it.children?.length)"
          @pointerleave="hideSoon"
          @focus="show('item', it.key, !!it.children?.length)"
          @blur="hideSoon"
        >
          <span v-if="it.icon" data-part="item-icon" :data-icon="it.icon"><ArIcon :name="it.icon" /></span>
          <span data-part="item-label">{{ it.label }}</span>
        </component>
      </template>
      <div
        v-if="openItem?.children?.length"
        data-part="submenu"
        :data-ar-palette="openItem.palette"
        :style="openStyle"
        @pointerenter="keep"
        @pointerleave="hideSoon"
        @focusin="keep"
        @focusout="hideSoon"
      >
        <component
          :is="c.href ? 'a' : 'button'"
          v-for="c in openItem.children"
          :key="c.key"
          data-part="submenu-item"
          :href="c.href"
          :type="c.href ? undefined : 'button'"
          @click="onNav(c, $event)"
        >{{ c.label }}</component>
      </div>
    </nav>
  </header>
</template>
