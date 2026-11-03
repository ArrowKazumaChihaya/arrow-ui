<script setup lang="ts">
import { computed } from "vue";
import { paletteNames, paletteSlots, tokenNames, cssVar } from "@arrow/ui-tokens";
import { designs, palette } from "../state";

const groups = [
  { title: "色", prefix: "color." },
  { title: "文字", prefix: "font." },
  { title: "余白の段階", prefix: "space." },
  { title: "角丸・影・大きさ・動き", prefix: "" },
];
const tokensOf = (prefix: string) =>
  tokenNames.filter((t) => (prefix ? t.startsWith(prefix) : !/^(color|font|space)\./.test(t)));
const isColor = (v: string) => /^(#|rgb|hsl)/i.test(v.trim());
const shownSlots = ["accent", "accent-strong", "accent-ink", "accent-muted", "accent-subtle"] as const;
const slotCount = computed(() => paletteSlots.length);
const pick = (p: (typeof paletteNames)[number]) => (palette.value = p);
</script>

<template>
  <article class="page">
    <p class="eyebrow">ガイド</p>
    <h1 class="page-title">デザイン</h1>
    <p class="lede">
      トークンの<strong>名前</strong>は部品のライブラリが決め、<strong>値</strong>はデザインのライブラリが決めます。
      部品の CSS と製品のレイアウト層は名前（<code>--ar-…</code>）だけを使います。下は2つのデザインの値です。
    </p>

    <div class="design-cards">
      <div v-for="d in designs" :key="d.id" class="design-card">
        <div class="design-card-head">
          <code>{{ d.id }}</code>
          <span v-if="d.deprecated" class="badge warn">移行中だけ</span>
          <span v-else class="badge ok">これから使う</span>
        </div>
        <h3>{{ d.label }}</h3>
        <p v-if="d.deprecated" class="mute">{{ d.deprecated }}</p>
        <p v-else class="mute">ARROW リミックスの見た目。全社に一度に出す。</p>
        <p class="covers">見た目を用意した部品 <strong>{{ Object.keys(d.covers).length }}</strong></p>
      </div>
    </div>

    <h2 id="palettes">テーマ色</h2>
    <p>
      ページ（機能）ごとの色の組です。どのページにどの色を当てるかは製品が決めます（<code>ArThemeScope</code>）。
      1つの組は {{ slotCount }} の値を持ち、部品は accent 系の名前だけを使います。押すと、このページの見本の色が替わります。
    </p>
    <div class="tbl-wrap">
      <table class="tbl paltbl">
        <thead>
          <tr><th>名前</th><th v-for="d in designs" :key="d.id">{{ d.id }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in paletteNames" :key="p" :class="{ on: palette === p }" @click="pick(p)">
            <td class="nm"><code>{{ p }}</code></td>
            <td v-for="d in designs" :key="d.id">
              <div class="swatches">
                <span
                  v-for="sl in shownSlots"
                  :key="sl"
                  class="sw"
                  :style="{ background: d.palettes[p][sl] }"
                  :title="`${sl} ${d.palettes[p][sl]}`"
                />
                <code class="hex">{{ d.palettes[p].accent }}</code>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 id="tokens">トークン</h2>
    <template v-for="g in groups" :key="g.title">
      <h3>{{ g.title }}</h3>
      <div class="tbl-wrap">
        <table class="tbl tok">
          <thead>
            <tr><th>CSS 変数</th><th v-for="d in designs" :key="d.id">{{ d.id }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in tokensOf(g.prefix)" :key="t">
              <td class="nm"><code>{{ cssVar(t) }}</code></td>
              <td v-for="d in designs" :key="d.id">
                <span class="tokval">
                  <span v-if="isColor(d.tokens[t])" class="sw sm" :style="{ background: d.tokens[t] }" />
                  <code>{{ d.tokens[t] }}</code>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </article>
</template>
