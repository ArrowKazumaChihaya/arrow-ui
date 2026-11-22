<script setup lang="ts">
/**
 * ArCatalog 1.0 — 書類などを分類・検索・よく使うで探し、選んだ項目の説明を右に出す画面（書類・集計のページ）。
 * 選ぶ・よく使うの出し入れはイベントで知らせる（保存は製品がする）。説明の中身は detail スロット。
 */
import { computed, ref } from "vue";
import ArIcon from "./ArIcon.vue";
import type { ArIconName } from "../icons";
import type { ArCatalogFormat, ArCatalogGroup, ArCatalogItem, ArCatalogLabels, ArCatalogProps } from "./ArCatalog.contract";

const props = withDefaults(defineProps<ArCatalogProps>(), { icon: "files", selected: null, favorites: () => [], labels: () => ({}) });
const emit = defineEmits<{ "update:selected": [key: string | null]; "update:favorites": [keys: string[]] }>();

const L = computed<ArCatalogLabels>(() => ({
  search: "すべてから探す",
  all: "すべて",
  favorites: "よく使う",
  categories: "分類",
  favoritesHint: "一覧の ☆ を押すとここに並びます",
  allTitle: "すべて",
  searchTitle: "「{q}」の検索結果",
  count: "{n}件",
  clearSearch: "検索をやめる",
  empty: "「{q}」に当てはまるものはありません。言葉を短くするか、分類から探してください。",
  favoritesEmpty: "まだありません。一覧の ☆ を押すと、ここに並びます。",
  external: "別のページで作る",
  addFavorite: "{title}をよく使うに入れる",
  removeFavorite: "{title}をよく使うから外す",
  placeholder: "一覧から選ぶと、説明と出力ボタンがここに出ます。",
  close: "説明を閉じる",
  legend: "印の見方",
  ...props.labels,
}));
const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const FORMAT_COLOR: Record<ArCatalogFormat, string> = { PDF: "#C0322B", CSV: "#1E7A4C", Excel: "#2C6AA6" };
const FORMAT_TEXT: Record<ArCatalogFormat, string> = { PDF: "PDF", CSV: "CSV", Excel: "XLS" };

const view = ref<string>("all");
const query = ref("");
const q = computed(() => query.value.trim());
const groupOf = (key: string) => props.groups.find((g) => g.items.some((i) => i.key === key));
const itemOf = (key: string) => props.groups.flatMap((g) => g.items).find((i) => i.key === key);
/** 同じ項目を複数の分類に置くことがあるので、件数は key の重なりを除いて数える（「すべて」が実際の種類より多く見えないように）。 */
const distinctCount = (lists: readonly { items: readonly { key: string | number }[] }[]): number =>
  new Set(lists.flatMap((list) => list.items.map((item) => item.key))).size;
const allCount = computed(() => distinctCount(props.groups));
const isFav = (key: string) => props.favorites.includes(key);
const favItems = computed(() => props.favorites.map(itemOf).filter((i): i is ArCatalogItem => !!i));
const usedFormats = computed(() => {
  const set = new Set(props.groups.flatMap((g) => g.items.flatMap((i) => i.formats ?? [])));
  return (["PDF", "CSV", "Excel"] as ArCatalogFormat[]).filter((f) => set.has(f));
});
const anyExternal = computed(() => props.groups.some((g) => g.items.some((i) => i.external)));

interface Shown { group: ArCatalogGroup | null; items: readonly ArCatalogItem[]; head: boolean; showGroupName: boolean }
const shown = computed<Shown[]>(() => {
  if (q.value) {
    const low = q.value.toLowerCase();
    return props.groups
      .map((g) => ({ group: g, items: g.items.filter((i) => `${i.title} ${i.keywords ?? ""} ${g.title}`.toLowerCase().includes(low)), head: true, showGroupName: false }))
      .filter((s) => s.items.length > 0);
  }
  if (view.value === "fav") return [{ group: null, items: favItems.value, head: false, showGroupName: true }];
  if (view.value === "all") return props.groups.map((g) => ({ group: g, items: g.items, head: true, showGroupName: false }));
  const g = props.groups.find((x) => x.key === view.value);
  return g ? [{ group: g, items: g.items, head: false, showGroupName: false }] : [];
});
const shownCount = computed(() => distinctCount(shown.value));
const heading = computed(() => {
  if (q.value) return fmt(L.value.searchTitle, { q: q.value });
  if (view.value === "fav") return L.value.favorites;
  if (view.value === "all") return L.value.allTitle;
  return props.groups.find((g) => g.key === view.value)?.title ?? "";
});
const current = computed(() => (q.value ? "" : view.value));

function go(v: string) {
  view.value = v;
  query.value = "";
}
function pick(key: string) {
  emit("update:selected", key);
}
function close() {
  emit("update:selected", null);
}
function toggleFav(key: string) {
  emit("update:favorites", isFav(key) ? props.favorites.filter((k) => k !== key) : [...props.favorites, key]);
}
const selectedItem = computed(() => (props.selected ? itemOf(props.selected) ?? null : null));
const selectedGroup = computed(() => (props.selected ? groupOf(props.selected) ?? null : null));
const iconOf = (name: string | undefined) => (name ?? "file") as ArIconName;
</script>

<template>
  <section data-ar="catalog" data-part="root" :aria-label="title">
    <div data-part="band">
      <ArIcon :name="iconOf(icon)" />
      <span data-part="band-title">{{ title }}</span>
      <span data-part="band-end"><slot name="band-end" /></span>
    </div>
    <div data-part="body">
      <nav data-part="nav" :aria-label="L.categories">
        <label data-part="search">
          <ArIcon name="search" size="sm" />
          <input v-model="query" type="search" :aria-label="L.search" :placeholder="L.search" />
        </label>
        <div data-part="nav-list">
          <button type="button" data-part="nav-item" :aria-current="current === 'all' ? 'page' : undefined" @click="go('all')">
            <ArIcon name="grid" size="sm" /><span>{{ L.all }}</span><span data-part="nav-count">{{ allCount }}</span>
          </button>
          <button type="button" data-part="nav-item" :aria-current="current === 'fav' ? 'page' : undefined" @click="go('fav')">
            <ArIcon name="star" size="sm" /><span>{{ L.favorites }}</span><span data-part="nav-count">{{ favItems.length }}</span>
          </button>
          <div data-part="nav-head">{{ L.categories }}</div>
          <button
            v-for="g in groups"
            :key="g.key"
            type="button"
            data-part="nav-item"
            :aria-current="current === g.key ? 'page' : undefined"
            @click="go(g.key)"
          >
            <ArIcon :name="iconOf(g.icon)" size="sm" /><span>{{ g.title }}</span><span data-part="nav-count">{{ g.items.length }}</span>
          </button>
        </div>
      </nav>

      <div data-part="main">
        <div data-part="favorites">
          <div data-part="favorites-head">
            <ArIcon name="star" size="sm" data-part="favorites-star" /><b>{{ L.favorites }}</b><span>{{ L.favoritesHint }}</span>
          </div>
          <div data-part="chips">
            <button v-for="it in favItems" :key="it.key" type="button" data-part="chip" @click="pick(it.key)">
              <ArIcon :name="iconOf(groupOf(it.key)?.icon)" size="sm" />{{ it.title }}
            </button>
          </div>
        </div>

        <div data-part="heading">
          <h2>{{ heading }}</h2>
          <span data-part="heading-count">{{ fmt(L.count, { n: shownCount }) }}</span>
          <button v-if="q" type="button" data-part="clear" @click="query = ''"><ArIcon name="x" size="sm" />{{ L.clearSearch }}</button>
          <div data-part="legend" :aria-label="L.legend">
            <span v-for="f in usedFormats" :key="f" data-part="legend-item">
              <svg data-part="format" viewBox="0 0 24 24" :style="{ color: FORMAT_COLOR[f] }">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                <rect x="1" y="11.5" width="17.5" height="8.5" rx="1.6" /><text x="9.75" y="18.1" text-anchor="middle" font-size="6.3" font-weight="700" font-family="sans-serif">{{ FORMAT_TEXT[f] }}</text>
              </svg>{{ f }}
            </span>
            <span v-if="anyExternal" data-part="legend-item"><ArIcon name="out" size="sm" />{{ L.external }}</span>
          </div>
        </div>

        <div v-if="q && shownCount === 0" data-part="empty" role="status">{{ fmt(L.empty, { q }) }}</div>
        <div v-else-if="view === 'fav' && !q && favItems.length === 0" data-part="empty" role="status">{{ L.favoritesEmpty }}</div>

        <section v-for="(s, si) in shown" :key="s.group?.key ?? `s${si}`" data-part="group" :aria-label="s.group?.title ?? heading">
          <div v-if="s.head && s.group" data-part="group-head">
            <span data-part="group-icon"><ArIcon :name="iconOf(s.group.icon)" size="sm" /></span>
            <h3>{{ s.group.title }}</h3>
            <span data-part="group-count">{{ s.items.length }}</span>
          </div>
          <div v-if="s.items.length" data-part="list">
            <div v-for="it in s.items" :key="it.key" data-part="row" :data-state="selected === it.key ? 'selected' : undefined">
              <button
                type="button"
                data-part="star"
                :aria-pressed="isFav(it.key)"
                :aria-label="fmt(isFav(it.key) ? L.removeFavorite : L.addFavorite, { title: it.title })"
                :data-on="isFav(it.key) ? '' : undefined"
                @click="toggleFav(it.key)"
              >
                <ArIcon name="star" />
              </button>
              <button type="button" data-part="pick" :aria-current="selected === it.key ? 'true' : undefined" @click="pick(it.key)">
                <span data-part="row-title">{{ it.title }}</span>
                <span v-if="s.showGroupName" data-part="row-group">{{ groupOf(it.key)?.title }}</span>
                <span v-if="it.warning" data-part="warning">{{ it.warning }}</span>
                <span data-part="formats">
                  <svg v-for="f in it.formats ?? []" :key="f" data-part="format" viewBox="0 0 24 24" role="img" :aria-label="f" :style="{ color: FORMAT_COLOR[f] }">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                    <rect x="1" y="11.5" width="17.5" height="8.5" rx="1.6" /><text x="9.75" y="18.1" text-anchor="middle" font-size="6.3" font-weight="700" font-family="sans-serif">{{ FORMAT_TEXT[f] }}</text>
                  </svg>
                </span>
                <span data-part="end" :data-external="it.external ? '' : undefined">
                  <ArIcon :name="it.external ? 'out' : 'cr'" size="sm" :label="it.external ? L.external : undefined" />
                </span>
              </button>
            </div>
          </div>
          <slot v-if="s.group" name="group-end" :group="s.group" />
        </section>
      </div>

      <aside data-part="aside" :data-open="selectedItem ? '' : undefined" :aria-label="selectedItem?.title ?? L.placeholder">
        <div data-part="aside-inner">
          <div v-if="!selectedItem" data-part="placeholder">
            <ArIcon name="info" />
            <span>{{ L.placeholder }}</span>
          </div>
          <template v-else>
            <div data-part="aside-head">
              <span data-part="aside-tag">{{ selectedGroup?.title }}</span>
              <button type="button" data-part="aside-close" :aria-label="L.close" @click="close"><ArIcon name="x" /></button>
            </div>
            <h3 data-part="aside-title">{{ selectedItem.title }}</h3>
            <slot name="detail" :item="selectedItem" :group="selectedGroup" />
          </template>
        </div>
      </aside>
      <button v-if="selectedItem" type="button" data-part="scrim" tabindex="-1" :aria-label="L.close" @click="close" />
    </div>
  </section>
</template>
