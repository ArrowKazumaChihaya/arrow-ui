<script setup lang="ts">
/**
 * ArAppHeader 1.1 — PC の画面の頭（2段）。
 * 1段目：ロゴ（slot）・お知らせとやることのピル（件数の丸。押す・指すと下に一覧）・右端に管理ページ（押すとメニュー）。
 * 2段目：メニュー（今いるものをテーマ色で塗る。子のメニューは真下に出す）。下端にページのテーマ色の線。項目はすべて props で渡す。
 * ピルの一覧と子のメニューは、指す・フォーカス・押す・↓ キーで開き、↑↓ Home End で移り、Escape で閉じて元へ戻る。
 * ピルの一覧（お知らせ・やること）は ArFloat に載せる（Provider の出す先に出し、画面からはみ出さないよう置く。data-ar="app-pill-list"）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArBadge from "./ArBadge.vue";
import ArAvatar from "./ArAvatar.vue";
import ArButton from "./ArButton.vue";
import ArEmpty from "./ArEmpty.vue";
import ArFloat from "../internal/ArFloat.vue";
import { useId } from "../provider/context";
import type { ArAppHeaderPill, ArAppHeaderProps, ArAppNavItem } from "./ArAppHeader.contract";

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
  domainStyle: "tabs",
  help: undefined,
  labels: () => ({ nav: "メインメニュー", count: "件" }),
});
const emit = defineEmits<{
  navigate: [key: string, event: MouseEvent];
  pill: [key: string];
  account: [key: string];
  help: [];
  domain: [key: string];
  "update:collapsed": [collapsed: boolean];
  "pill-item": [pill: string, item: string];
  "pill-item-delete": [pill: string, item: string];
  "pill-restore": [pill: string];
}>();
const L = computed(() => ({
  collapse: "ヘッダーを閉じる",
  expand: "ヘッダーを開く",
  domains: "領域",
  delete: "削除",
  restore: "すべて表示する",
  close: "閉じる",
  ...props.labels,
}));
const uid = useId("ar-app-header");
const rootEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const subEl = ref<HTMLElement | null>(null);

/** 一覧を出すピルか（items を渡し、行・空の文字・「すべて表示する」のどれかがある）。 */
const hasList = (p: ArAppHeaderPill) => p.items !== undefined && (p.items.length > 0 || !!p.emptyText || (p.hiddenCount ?? 0) > 0);
const hasChildren = (it: ArAppNavItem) => !!it.children?.length;

/** 指している・フォーカスしているピル（一覧を出す）とメニュー（子のメニューを出す）。出すものはその真下に同じ幅で置く。 */
const pillEls = new Map<string, HTMLElement>();
const itemEls = new Map<string, HTMLElement>();
function setRef(map: Map<string, HTMLElement>, key: string, el: unknown) {
  const node = (el as { $el?: unknown } | null)?.$el ?? el;
  if (node instanceof HTMLElement) map.set(key, node);
  else map.delete(key);
}
type Kind = "pill" | "item";
const open = ref<{ kind: Kind; key: string } | null>(null);
/** 押して開いた（指を離しても閉じない。外を押す・Escape・もう一度押すと閉じる）。 */
const pinned = ref(false);
const openStyle = ref<Record<string, string>>({});
let timer: ReturnType<typeof setTimeout> | undefined;
const isOpen = (kind: Kind, key: string) => open.value?.kind === kind && open.value.key === key;
/** Escape で閉じて元の項目へフォーカスを戻すとき、そのフォーカスで開き直さない。 */
let refocusing = false;
function show(kind: Kind, key: string, has: boolean) {
  if (refocusing) return;
  clearTimeout(timer);
  if (!has) {
    if (!pinned.value) open.value = null;
    return;
  }
  if (pinned.value && !isOpen(kind, key)) pinned.value = false;
  const el = (kind === "pill" ? pillEls : itemEls).get(key);
  if (el) openStyle.value = { left: `${el.offsetLeft}px`, top: `${el.offsetTop + el.offsetHeight}px`, width: `${el.offsetWidth}px` };
  open.value = { kind, key };
  if (kind === "item") void nextTick(() => {
    const menu = subEl.value;
    if (!menu || !isOpen(kind, key)) return;
    const box = menu.getBoundingClientRect();
    const overflow = box.right - (document.documentElement.clientWidth - 12);
    if (overflow > 0) openStyle.value = { ...openStyle.value, left: `${Math.max(12, (el?.offsetLeft ?? 12) - overflow)}px` };
  });
}
function keep() {
  clearTimeout(timer);
}
function hideSoon() {
  clearTimeout(timer);
  if (pinned.value) return;
  timer = setTimeout(() => (open.value = null), 120);
}
function hide(refocus: boolean) {
  const was = open.value;
  clearTimeout(timer);
  open.value = null;
  pinned.value = false;
  if (refocus && was) {
    refocusing = true;
    (was.kind === "pill" ? pillEls : itemEls).get(was.key)?.focus();
    refocusing = false;
  }
}
const openPill = computed(() => (open.value?.kind === "pill" ? props.pills.find((p) => p.key === open.value!.key) : undefined));
const openItem = computed(() => (open.value?.kind === "item" ? [...props.menus, ...props.menusEnd].find((m) => m.key === open.value!.key) : undefined));

/** 一覧・子のメニューの中で動ける所（ボタンとリンク）。 */
function focusables(box: HTMLElement | null): HTMLElement[] {
  return [...(box?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href]") ?? [])];
}
async function openAndFocus(kind: Kind, key: string, has: boolean) {
  show(kind, key, has);
  await nextTick();
  focusables(kind === "pill" ? listEl.value : subEl.value)[0]?.focus();
}
function onPopKey(e: KeyboardEvent, box: HTMLElement | null) {
  const list = focusables(box);
  const i = list.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    list[(i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    (e.key === "Home" ? list[0] : list.at(-1))?.focus();
  } else if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    hide(true);
  }
}

/* ピル：押すと一覧を出したままにする（もう一度押すと閉じる）。↓ で一覧の最初へ。Escape で閉じる。 */
function onPillClick(p: ArAppHeaderPill) {
  emit("pill", p.key);
  if (!hasList(p)) return;
  if (pinned.value && isOpen("pill", p.key)) return hide(false);
  show("pill", p.key, true);
  pinned.value = true;
}
function onPillKey(e: KeyboardEvent, p: ArAppHeaderPill) {
  if (!hasList(p)) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    void openAndFocus("pill", p.key, true);
  } else if (e.key === "Escape" && open.value) {
    e.preventDefault();
    hide(true);
  }
}
function onPillItem(pill: string, item: string) {
  hide(true);
  emit("pill-item", pill, item);
}
async function onDelete(pill: string, item: string) {
  emit("pill-item-delete", pill, item);
  await nextTick();
  const first = focusables(listEl.value)[0];
  if (first) first.focus();
  else hide(true);
}

/* メニュー：指で押すと子のメニューを出したままにする（navigate も出す）。↓ で子の最初へ。 */
let lastPointer = "mouse";
function onNav(item: ArAppNavItem, e: MouseEvent) {
  emit("navigate", item.key, e);
}
function onItemClick(item: ArAppNavItem, e: MouseEvent) {
  onNav(item, e);
  if (hasChildren(item) && lastPointer !== "mouse") {
    show("item", item.key, true);
    pinned.value = true;
  }
  lastPointer = "mouse";
}
function onItemKey(e: KeyboardEvent, item: ArAppNavItem) {
  if (!hasChildren(item)) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    void openAndFocus("item", item.key, true);
  } else if (e.key === "Escape" && open.value) {
    e.preventDefault();
    hide(true);
  }
}
function onSubClick(c: ArAppNavItem, e: MouseEvent) {
  onNav(c, e);
  hide(false);
}

/** 押して出したままの一覧は、外を押すと閉じる。 */
function onDocPointer(e: PointerEvent) {
  if (!open.value || !pinned.value) return;
  if (rootEl.value?.contains(e.target as Node) || listEl.value?.contains(e.target as Node)) return;
  hide(false);
}
onMounted(() => document.addEventListener("pointerdown", onDocPointer, true));
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocPointer, true);
  clearTimeout(timer);
});

const menuId = useId("ar-account-menu");
const accountBtn = ref<HTMLButtonElement | null>(null);
const menuOpen = ref(false);
const active = ref(0);
const hasMenu = computed(() => !!props.accountMenu?.length);

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

/** 領域の切り替えをメニューにしたとき（domain-style="menu"）の開閉。 */
const menuStyle = computed(() => props.domainStyle === "menu");
const hasDomainSwitch = computed(() => menuStyle.value && props.domains.length > 0);
const currentDomain = computed(() => props.domains.find((d) => d.key === props.domain) ?? props.domains[0]);
const domainMenuId = useId("ar-domain-menu");
const domainBtn = ref<HTMLButtonElement | null>(null);
const domainOpen = ref(false);
const domainActive = ref(0);
function focusDomain() {
  document.getElementById(`${domainMenuId}-${domainActive.value}`)?.focus();
}
async function openDomain(at: number) {
  domainActive.value = at;
  domainOpen.value = true;
  await nextTick();
  await nextTick();
  focusDomain();
}
function closeDomain(refocus = true) {
  domainOpen.value = false;
  if (refocus) domainBtn.value?.focus();
}
function chooseDomain(key: string) {
  closeDomain();
  emit("domain", key);
}
function onDomainBtnKey(e: KeyboardEvent) {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const n = props.domains.length;
    const cur = Math.max(0, props.domains.findIndex((d) => d.key === currentDomain.value?.key));
    void openDomain(e.key === "ArrowDown" ? cur : (cur + n - 1) % n);
  }
}
function onDomainMenuKey(e: KeyboardEvent) {
  const n = props.domains.length;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    domainActive.value = (domainActive.value + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
    focusDomain();
  } else if (e.key === "Home" || e.key === "End") {
    e.preventDefault();
    domainActive.value = e.key === "Home" ? 0 : n - 1;
    focusDomain();
  } else if (e.key === "Tab") {
    closeDomain(false);
  }
}
</script>

<template>
  <header ref="rootEl" data-ar="app-header" data-part="root">
    <div data-part="top">
      <span data-part="logo"><slot name="logo" /></span>
      <template v-if="menuStyle">
        <template v-if="hasDomainSwitch">
        <span data-part="top-divider" aria-hidden="true" />
        <button
          ref="domainBtn"
          type="button"
          data-part="domain-switch"
          :data-state="domainOpen ? 'open' : undefined"
          aria-haspopup="menu"
          :aria-expanded="domainOpen ? 'true' : 'false'"
          :aria-controls="domainOpen ? domainMenuId : undefined"
          @click="domainOpen ? closeDomain() : openDomain(Math.max(0, domains.findIndex((d) => d.key === currentDomain?.key)))"
          @keydown="onDomainBtnKey"
        >
          <ArIcon line name="hierarchy" data-part="domain-switch-icon" aria-hidden="true" />
          <span data-part="domain-switch-label">{{ currentDomain?.label }}</span>
          <ArIcon line name="cd" size="sm" data-part="domain-switch-arrow" />
        </button>
        <ArFloat :id="domainMenuId" :open="domainOpen" :anchor="domainBtn" ar="app-domain-menu" placement="bottom-start" :offset="12" role="menu" :label="L.domains" @close="(r) => closeDomain(r === 'escape')">
          <div data-part="domain-menu-title" aria-hidden="true">{{ L.domains }}</div>
          <button
            v-for="(d, i) in domains"
            :id="`${domainMenuId}-${i}`"
            :key="d.key"
            type="button"
            role="menuitemradio"
            data-part="domain-menu-item"
            :aria-checked="d.key === currentDomain?.key ? 'true' : 'false'"
            :tabindex="i === domainActive ? 0 : -1"
            @click="chooseDomain(d.key)"
            @keydown="onDomainMenuKey"
          >
            <span v-if="d.icon" data-part="domain-menu-icon"><ArIcon :name="d.icon" /></span>
            <span data-part="domain-menu-label">{{ d.label }}</span>
            <small v-if="d.note" data-part="domain-note">{{ d.note }}</small>
            <ArIcon v-else-if="d.key === currentDomain?.key" line name="check" size="sm" data-part="domain-menu-check" />
          </button>
        </ArFloat>
        </template>
        <span data-part="top-spacer" aria-hidden="true" />
      </template>
      <button
        v-for="p in pills"
        :key="p.key"
        :ref="(el) => setRef(pillEls, p.key, el)"
        type="button"
        data-part="pill"
        :data-tone="p.tone ?? 'notice'"
        :aria-label="p.count ? `${p.label} ${p.count}${labels.count}` : p.label"
        :data-state="[p.count ? 'has-count' : 'empty', isOpen('pill', p.key) && 'open'].filter(Boolean).join(' ')"
        :aria-expanded="hasList(p) ? isOpen('pill', p.key) : undefined"
        :aria-controls="hasList(p) && isOpen('pill', p.key) ? `${uid}-list` : undefined"
        @click="onPillClick(p)"
        @keydown="onPillKey($event, p)"
        @pointerenter="show('pill', p.key, hasList(p))"
        @pointerleave="hideSoon"
        @focus="show('pill', p.key, hasList(p))"
        @blur="hideSoon"
      >
        <ArIcon v-if="p.icon" :name="p.icon" size="sm" data-part="pill-icon" :data-icon="p.icon" />
        <span data-part="pill-label">{{ p.label }}</span>
        <ArBadge v-if="p.count" data-part="count" :count="p.count" :label="`${p.count}${labels.count}`" />
      </button>
      <ArFloat
        :open="!!openPill && hasList(openPill)"
        :anchor="openPill ? (pillEls.get(openPill.key) ?? null) : null"
        :placement="menuStyle ? 'bottom-end' : 'bottom-start'"
        :offset="menuStyle ? 12 : 0"
        :match-width="!menuStyle"
        :close-on-outside="false"
        ar="app-pill-list"
        @close="(r) => hide(r === 'escape')"
      >
      <div
        v-if="openPill && hasList(openPill)"
        :id="`${uid}-list`"
        ref="listEl"
        data-part="pill-list"
        :data-tone="openPill.tone ?? 'notice'"
        role="group"
        :aria-label="openPill.label"
        @pointerenter="keep"
        @pointerleave="hideSoon"
        @focusin="keep"
        @focusout="hideSoon"
        @keydown="onPopKey($event, listEl)"
      >
        <div data-part="pill-head">
          <span>{{ openPill.label }}</span>
          <ArButton data-part="pill-close" tone="muted" icon="x" size="sm" :label="L.close" @click="hide(true)" />
        </div>
        <ul v-if="openPill.items?.length" data-part="pill-rows">
          <li v-for="it in openPill.items" :key="it.key" data-part="pill-row" :data-deletable="it.deletable || undefined">
            <button type="button" data-part="pill-item" @click="onPillItem(openPill.key, it.key)">{{ it.label }}</button>
            <ArButton
              v-if="it.deletable"
              data-part="pill-delete"
              tone="muted"
              icon="x"
              size="sm"
              :label="`${L.delete}：${it.label}`"
              @click="onDelete(openPill.key, it.key)"
            />
          </li>
        </ul>
        <ArEmpty v-else-if="openPill.emptyText" data-part="pill-empty" size="sm" icon="inbox" :text="openPill.emptyText" />
        <button v-if="(openPill.hiddenCount ?? 0) > 0" type="button" data-part="pill-restore" @click="emit('pill-restore', openPill.key)">{{ L.restore }}</button>
      </div>
      </ArFloat>
      <div v-if="$slots.top" data-part="top-extra"><slot name="top" /></div>
      <button v-if="help" type="button" data-part="help" :aria-label="help.label" :title="help.label" @click="emit('help')">
        <ArIcon line :name="help.icon ?? 'help'" size="sm" data-part="help-icon" />
        <span data-part="help-label">{{ help.label }}</span>
      </button>
      <span v-if="account && menuStyle" data-part="top-divider" aria-hidden="true" />
      <button
        v-if="account"
        ref="accountBtn"
        type="button"
        data-part="account"
        :data-state="menuOpen ? 'open' : undefined"
        :aria-label="account.label"
        :aria-haspopup="hasMenu ? 'menu' : undefined"
        :aria-expanded="hasMenu ? (menuOpen ? 'true' : 'false') : undefined"
        :aria-controls="hasMenu ? menuId : undefined"
        @click="onAccount"
        @keydown="onAccountKey"
      >
        <ArAvatar v-if="account.initial" data-part="avatar" size="sm" tone="neutral" :text="account.initial" />
        <ArIcon line name="bld" data-part="account-icon" />
        <span data-part="account-label">{{ account.label }}</span>
        <ArIcon line v-if="hasMenu" name="cd" size="sm" data-part="account-arrow" />
      </button>
      <ArFloat :id="menuId" :open="menuOpen" :anchor="accountBtn" ar="app-account-menu" placement="bottom-end" :offset="menuStyle ? 12 : 4" role="menu" :label="account?.label" @close="(r) => closeMenu(r === 'escape')">
        <div v-if="account" data-part="menu-head">
          <ArAvatar v-if="account.initial" size="sm" tone="neutral" :text="account.initial" data-part="avatar" />
          <span>{{ account.label }}</span>
        </div>
        <template v-for="(a, i) in accountMenu" :key="a.key">
          <div v-if="a.separator && i > 0" data-part="menu-divider" aria-hidden="true" />
          <button
            :id="`${menuId}-${i}`"
            type="button"
            role="menuitem"
            data-part="menu-item"
            :tabindex="i === active ? 0 : -1"
            @click="choose(a.key)"
            @keydown="onMenuKey"
          >
            <span data-part="menu-label">{{ a.label }}</span>
            <ArIcon line :name="a.icon ?? 'cr'" size="sm" :data-part="a.icon ? 'menu-icon' : 'menu-arrow'" />
          </button>
        </template>
      </ArFloat>
      <button v-if="collapsible && collapsed" type="button" data-part="expand" :aria-label="L.expand" :title="L.expand" :aria-expanded="false" @click="emit('update:collapsed', false)">
        <ArIcon line name="plus" size="sm" />
      </button>
    </div>
    <div v-if="!menuStyle && (domains.length || collapsible) && !collapsed" data-part="domains">
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
          <small v-if="d.note" data-part="domain-note">{{ d.note }}</small>
        </button>
      </div>
      <button v-if="collapsible" type="button" data-part="toggle" :aria-expanded="true" @click="emit('update:collapsed', true)">
        <ArIcon line name="minus" size="sm" /><span>{{ L.collapse }}</span>
      </button>
    </div>
    <nav v-if="(menus.length || menusEnd.length) && !(menuStyle && collapsed)" data-part="nav" :aria-label="labels.nav">
      <template v-for="(group, gi) in [menus, menusEnd]" :key="gi">
        <span v-if="gi === 1" data-part="spacer" />
        <component
          :is="it.href ? 'a' : 'button'"
          v-for="it in group"
          :key="it.key"
          :ref="(el: unknown) => setRef(itemEls, it.key, el)"
          data-part="item"
          :data-side="gi === 0 ? 'start' : 'end'"
          :data-state="[it.key === current && 'on', isOpen('item', it.key) && 'open'].filter(Boolean).join(' ') || undefined"
          :data-ar-palette="it.palette"
          :href="it.href"
          :type="it.href ? undefined : 'button'"
          :aria-current="it.key === current ? 'page' : undefined"
          :aria-expanded="hasChildren(it) ? isOpen('item', it.key) : undefined"
          :aria-controls="hasChildren(it) && isOpen('item', it.key) ? `${uid}-sub` : undefined"
          @pointerdown="lastPointer = $event.pointerType || 'mouse'"
          @click="onItemClick(it, $event)"
          @keydown="onItemKey($event, it)"
          @pointerenter="show('item', it.key, hasChildren(it))"
          @pointerleave="hideSoon"
          @focus="show('item', it.key, hasChildren(it))"
          @blur="hideSoon"
        >
          <span v-if="it.icon" data-part="item-icon" :data-icon="it.icon"><ArIcon :name="it.icon" /></span>
          <span data-part="item-label" :data-label="it.label">{{ it.label }}</span>
        </component>
      </template>
      <button v-if="menuStyle && collapsible" type="button" data-part="toggle" :aria-expanded="true" @click="emit('update:collapsed', true)">
        <ArIcon line name="minus" size="sm" /><span>{{ L.collapse }}</span>
      </button>
      <div
        v-if="openItem?.children?.length"
        :id="`${uid}-sub`"
        ref="subEl"
        data-part="submenu"
        :data-ar-palette="openItem.palette"
        :style="openStyle"
        role="group"
        :aria-label="openItem.label"
        @pointerenter="keep"
        @pointerleave="hideSoon"
        @focusin="keep"
        @focusout="hideSoon"
        @keydown="onPopKey($event, subEl)"
      >
        <template v-for="(c, ci) in openItem.children" :key="c.key">
          <template v-if="c.group && c.group !== openItem.children[ci - 1]?.group">
            <div v-if="ci > 0" data-part="submenu-divider" aria-hidden="true" />
            <div data-part="submenu-group" aria-hidden="true">{{ c.group }}</div>
          </template>
          <component
            :is="c.href ? 'a' : 'button'"
            data-part="submenu-item"
            :data-rich="c.icon || c.description ? '' : undefined"
            :data-state="c.key === current ? 'on' : undefined"
            :aria-current="c.key === current ? 'page' : undefined"
            :href="c.href"
            :type="c.href ? undefined : 'button'"
            @click="onSubClick(c, $event)"
          >
            <span v-if="c.icon" data-part="submenu-icon"><ArIcon :name="c.icon" /></span>
            <span v-if="c.description" data-part="submenu-text"><span data-part="submenu-label">{{ c.label }}</span><span data-part="submenu-desc">{{ c.description }}</span></span>
            <template v-else>{{ c.label }}</template>
          </component>
        </template>
      </div>
    </nav>
  </header>
</template>
