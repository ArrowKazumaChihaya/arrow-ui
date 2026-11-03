<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { paletteNames } from "@arrow/ui-tokens";
import { allItems, groups, guides } from "./nav";
import { designs, mode, palette, type ViewMode } from "./state";
import Intro from "./pages/Intro.vue";
import Designs from "./pages/Designs.vue";
import Requires from "./pages/Requires.vue";
import ComponentPage from "./pages/ComponentPage.vue";

const hash = ref(location.hash.slice(1));
const slug = computed(() => hash.value.split("/")[0] || "intro");
const anchor = computed(() => hash.value.split("/")[1] ?? "");
const item = computed(() => allItems.find((i) => i.slug === slug.value) ?? allItems[0]!);
const index = computed(() => allItems.indexOf(item.value));
const prev = computed(() => allItems[index.value - 1]);
const next = computed(() => allItems[index.value + 1]);
const menuOpen = ref(false);
const main = ref<HTMLElement | null>(null);

onMounted(() => window.addEventListener("hashchange", () => (hash.value = location.hash.slice(1))));
watch(slug, async () => {
  menuOpen.value = false;
  await nextTick();
  if (!anchor.value) window.scrollTo({ top: 0 });
});
watch(
  anchor,
  async (a) => {
    if (!a) return;
    await nextTick();
    document.getElementById(a)?.scrollIntoView({ block: "start" });
  },
  { immediate: true },
);

const modes: { value: ViewMode; label: string }[] = [
  { value: "remix", label: "新しい見た目" },
  { value: "classic", label: "今の見た目" },
  { value: "both", label: "並べて比べる" },
];
const paletteJa: Record<string, string> = { blue: "青", green: "緑", yellow: "黄", pink: "桃", orange: "橙", teal: "青緑", amber: "琥珀" };
const accentOf = (p: (typeof paletteNames)[number]) => designs[0].palettes[p].accent;
const query = ref("");
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => `${i.name} ${i.ja}`.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length);
});
</script>

<template>
  <div class="shell" :class="{ 'menu-open': menuOpen }">
    <header class="top">
      <button type="button" class="menu-btn" aria-label="目次" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <a class="brand" href="#intro">
        <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 18L12 5l8 13M8 13h8" /></svg></span>
        <span class="brand-name">ARROW UI</span>
        <span class="brand-ver">部品集</span>
      </a>
      <div class="top-ctrl">
        <div class="seg" role="radiogroup" aria-label="見本の見た目">
          <button
            v-for="m in modes"
            :key="m.value"
            type="button"
            role="radio"
            :aria-checked="mode === m.value"
            :class="{ on: mode === m.value }"
            @click="mode = m.value"
          >{{ m.label }}</button>
        </div>
        <div class="pal" role="radiogroup" aria-label="テーマ色">
          <button
            v-for="p in paletteNames"
            :key="p"
            type="button"
            role="radio"
            :aria-checked="palette === p"
            :aria-label="paletteJa[p]"
            :title="paletteJa[p]"
            :class="{ on: palette === p }"
            :style="{ '--c': accentOf(p) }"
            @click="palette = p"
          />
        </div>
      </div>
    </header>

    <nav class="side" aria-label="目次">
      <input v-model="query" class="side-search" type="search" placeholder="部品を探す（例：ボタン）" aria-label="部品を探す" />
      <div class="side-group">
        <a v-for="g in guides" :key="g.slug" :href="`#${g.slug}`" class="side-link" :class="{ on: item.slug === g.slug }">{{ g.ja }}</a>
      </div>
      <div v-for="g in filtered" :key="g.title" class="side-group">
        <p class="side-title">{{ g.title }}</p>
        <a v-for="i in g.items" :key="i.slug" :href="`#${i.slug}`" class="side-link" :class="{ on: item.slug === i.slug }">
          <span>{{ i.ja }}</span><small>{{ i.name }}</small>
        </a>
      </div>
    </nav>
    <div class="scrim" @click="menuOpen = false" />

    <main ref="main" class="main">
      <Intro v-if="item.slug === 'intro'" />
      <Designs v-else-if="item.slug === 'designs'" />
      <Requires v-else-if="item.slug === 'requires'" />
      <ComponentPage v-else :key="item.slug" :item="item" />

      <nav class="pager" aria-label="前後のページ">
        <a v-if="prev" :href="`#${prev.slug}`" class="pager-link"><small>前へ</small>{{ prev.ja }}</a>
        <span v-else />
        <a v-if="next" :href="`#${next.slug}`" class="pager-link next"><small>次へ</small>{{ next.ja }}</a>
      </nav>
      <footer class="foot">ARROW UI ・ ARROW シリーズ共通の部品と見た目</footer>
    </main>
  </div>
</template>
