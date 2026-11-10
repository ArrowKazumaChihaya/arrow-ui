<script setup lang="ts">
/**
 * ArBottomNav 1.1 — スマホの下に固定するメニュー。アイコンと小さな名前を等分に並べ、今いるものをテーマ色で示す。
 * 子のある項目を押すと、メニューの上に子の段を出す（今の ARROW のスマホのフッター）。↑ キーで子の段へ、Escape で閉じる。
 * 並べきれない項目は右端の「メニュー」に入れ、押すと下から一覧（ArDrawer placement="bottom"）を出す。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import ArDrawer from "./ArDrawer.vue";
import ArNavSheet from "../internal/ArNavSheet.vue";
import { useId } from "../provider/context";
import type { ArAppNavItem } from "./ArAppHeader.contract";
import type { ArBottomNavProps } from "./ArBottomNav.contract";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ArBottomNavProps>(), {
  current: undefined,
  max: 5,
  more: true,
  moreSheet: true,
  moreIcon: "menu",
  moreOpen: undefined,
  fixed: true,
  labels: () => ({ nav: "メインメニュー" }),
});
const emit = defineEmits<{ navigate: [key: string, event: MouseEvent]; more: []; "update:moreOpen": [open: boolean] }>();
const L = computed(() => ({ more: "メニュー", sub: "サブメニュー", ...props.labels }));
const uid = useId("ar-bottom-nav");

const showMore = computed(() => props.more === "always" || (props.more !== false && props.items.length > props.max));
const shown = computed(() => (showMore.value ? props.items.slice(0, Math.max(0, props.max - 1)) : props.items));
const rest = computed(() => (props.more === "always" ? props.items : props.items.slice(shown.value.length)));
const count = computed(() => shown.value.length + (showMore.value ? 1 : 0));
const has = (it: ArAppNavItem, key?: string) => key !== undefined && (it.key === key || !!it.children?.some((c) => c.key === key));
const moreOn = computed(() => showMore.value && rest.value.some((it) => has(it, props.current)) && !shown.value.some((it) => has(it, props.current)));

/* 子の段 */
const rootEl = ref<HTMLElement | null>(null);
const subEl = ref<HTMLElement | null>(null);
const openKey = ref<string | null>(null);
const openItem = computed(() => shown.value.find((it) => it.key === openKey.value));
const openIndex = computed(() => shown.value.findIndex((it) => it.key === openKey.value));
const itemEls = new Map<string, HTMLElement>();
function setRef(key: string, el: unknown) {
  const node = (el as { $el?: unknown } | null)?.$el ?? el;
  if (node instanceof HTMLElement) itemEls.set(key, node);
  else itemEls.delete(key);
}
function onItem(it: ArAppNavItem, e: MouseEvent) {
  if (it.children?.length) openKey.value = openKey.value === it.key ? null : it.key;
  else openKey.value = null;
  emit("navigate", it.key, e);
}
function onSub(c: ArAppNavItem, e: MouseEvent) {
  openKey.value = null;
  emit("navigate", c.key, e);
}
function closeSub(refocus: boolean) {
  const k = openKey.value;
  openKey.value = null;
  if (refocus && k) itemEls.get(k)?.focus();
}
async function onItemKey(e: KeyboardEvent, it: ArAppNavItem) {
  if (e.key === "ArrowUp" && it.children?.length) {
    e.preventDefault();
    openKey.value = it.key;
    await nextTick();
    subEl.value?.querySelector<HTMLElement>("button,a[href]")?.focus();
  } else if (e.key === "Escape" && openKey.value) {
    e.preventDefault();
    closeSub(true);
  }
}
function onSubKey(e: KeyboardEvent) {
  const list = [...(subEl.value?.querySelectorAll<HTMLElement>("button,a[href]") ?? [])];
  const i = list.indexOf(document.activeElement as HTMLElement);
  const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
  if (e.key in moves) {
    e.preventDefault();
    list[(i + moves[e.key]! + list.length) % list.length]?.focus();
  } else if (e.key === "Escape" || e.key === "ArrowDown") {
    e.preventDefault();
    closeSub(true);
  }
}
function onDoc(e: PointerEvent) {
  if (openKey.value && !rootEl.value?.contains(e.target as Node)) openKey.value = null;
}
onMounted(() => document.addEventListener("pointerdown", onDoc, true));
onBeforeUnmount(() => document.removeEventListener("pointerdown", onDoc, true));

/* 「メニュー」の一覧 */
const innerOpen = ref(false);
const sheetOpen = computed(() => props.moreOpen ?? innerOpen.value);
function setSheet(v: boolean) {
  innerOpen.value = v;
  emit("update:moreOpen", v);
}
function onMore() {
  openKey.value = null;
  emit("more");
  if (props.moreSheet) setSheet(!sheetOpen.value);
}
function onSheetNav(key: string, e: MouseEvent) {
  setSheet(false);
  emit("navigate", key, e);
}
</script>

<template>
  <nav
    v-bind="$attrs"
    ref="rootEl"
    data-ar="bottom-nav"
    data-part="root"
    :data-fixed="fixed || undefined"
    :aria-label="labels.nav"
    :style="{ '--ar-bottom-nav-count': String(count) }"
  >
    <component
      :is="it.href ? 'a' : 'button'"
      v-for="it in shown"
      :key="it.key"
      :ref="(el: unknown) => setRef(it.key, el)"
      data-part="item"
      :data-state="[has(it, current) && 'on', openKey === it.key && 'open'].filter(Boolean).join(' ') || undefined"
      :data-ar-palette="it.palette"
      :href="it.href"
      :type="it.href ? undefined : 'button'"
      :aria-current="it.key === current ? 'page' : undefined"
      :aria-expanded="it.children?.length ? openKey === it.key : undefined"
      :aria-controls="it.children?.length && openKey === it.key ? `${uid}-sub` : undefined"
      @click="onItem(it, $event)"
      @keydown="onItemKey($event, it)"
    >
      <ArIcon v-if="it.icon" :name="it.icon" data-part="icon" />
      <span data-part="label">{{ it.label }}</span>
    </component>
    <button
      v-if="showMore"
      type="button"
      data-part="item"
      data-kind="more"
      :data-state="[moreOn && 'on', sheetOpen && 'open'].filter(Boolean).join(' ') || undefined"
      :aria-haspopup="moreSheet ? 'dialog' : undefined"
      :aria-expanded="moreSheet ? sheetOpen : undefined"
      @click="onMore"
    >
      <ArIcon :name="moreIcon" data-part="icon" />
      <span data-part="label">{{ L.more }}</span>
    </button>
    <div
      v-if="openItem?.children?.length"
      :id="`${uid}-sub`"
      ref="subEl"
      data-part="submenu"
      role="group"
      :aria-label="`${openItem.label} ${L.sub}`"
      :data-align="openIndex >= count / 2 ? 'end' : 'start'"
      :data-ar-palette="openItem.palette"
      :data-rich="openItem.children.some((c) => c.description) || undefined"
      :style="{ '--ar-sub-idx': String(openIndex) }"
      @keydown="onSubKey"
    >
      <component
        :is="c.href ? 'a' : 'button'"
        v-for="c in openItem.children"
        :key="c.key"
        data-part="submenu-item"
        :data-state="c.key === current ? 'on' : undefined"
        :aria-current="c.key === current ? 'page' : undefined"
        :href="c.href"
        :type="c.href ? undefined : 'button'"
        @click="onSub(c, $event)"
      >
        <template v-if="c.description">
          <span data-part="submenu-icon"><ArIcon v-if="c.icon ?? openItem.icon" :name="(c.icon ?? openItem.icon)!" /></span>
          <span data-part="submenu-text"><span data-part="label">{{ c.label }}</span><span data-part="submenu-desc">{{ c.description }}</span></span>
          <ArIcon line name="cr" size="sm" data-part="submenu-arrow" />
        </template>
        <template v-else>
          <ArIcon v-if="c.icon ?? openItem.icon" :name="(c.icon ?? openItem.icon)!" data-part="icon" />
          <span data-part="label">{{ c.label }}</span>
        </template>
      </component>
    </div>
  </nav>
  <ArDrawer v-if="showMore && moreSheet" :open="sheetOpen" :title="L.more" placement="bottom" @update:open="setSheet">
    <ArNavSheet :items="rest" :current="current" :label="L.more" @navigate="onSheetNav" />
  </ArDrawer>
</template>
