<script setup lang="ts">
import { computed } from "vue";
import { paletteNames, paletteSlots, tokenNames, cssVar } from "@s_and_a/arrow-ui-tokens";
import { designs, palette } from "../state";
import DemoBox from "../DemoBox.vue";
import { demosOf } from "../demos";

const groups = [
  { title: "色", prefix: "color." },
  { title: "文字", prefix: "font." },
  { title: "余白の段階", prefix: "space." },
  { title: "角の丸み・影・大きさ・動きの速さ", prefix: "" },
];
const tokensOf = (prefix: string) =>
  tokenNames.filter((t) => (prefix ? t.startsWith(prefix) : !/^(color|font|space)\./.test(t)));
const isColor = (v: string) => /^(#|rgb|hsl)/i.test(v.trim());
const shownSlots = ["accent", "accent-strong", "accent-ink", "accent-muted", "accent-subtle"] as const;
const slotCount = computed(() => paletteSlots.length);
const paletteJa: Record<string, string> = { blue: "青", green: "緑", yellow: "黄", pink: "桃", orange: "橙", teal: "青緑", amber: "琥珀" };
const pick = (p: (typeof paletteNames)[number]) => (palette.value = p);
const sizeDemos = demosOf("designs");
const sizeSteps = [
  { step: "sm", remix: "30px・角丸 9", classic: "24px・角丸 4（antd の small）", use: "設定・表の上の操作の段・ポップアップの中など、密集した所" },
  { step: "md（既定）", remix: "36px・角丸 10", classic: "32px・角丸 6（antd の middle）", use: "ふつうの入力の画面。size を書かなければこれ" },
  { step: "lg", remix: "42px・角丸 11", classic: "40px・角丸 8（antd の large）", use: "年末調整・スマホなど、大きく押しやすくしたい所" },
];
</script>

<template>
  <article class="page">
    <p class="eyebrow">ガイド</p>
    <h1 class="page-title">デザイン</h1>
    <p class="lede">
      色・文字の大きさ・余白などの<strong>名前</strong>は部品のライブラリが決め、<strong>実際の値</strong>は見た目のライブラリが決めます。
      部品と製品の画面は名前（<code>--ar-…</code>）だけを使うので、見た目のライブラリを入れ替えると全部が一度に替わります。下は「新しい見た目」と「今の見た目」の値です。
    </p>

    <div class="design-cards">
      <div v-for="d in designs" :key="d.id" class="design-card">
        <div class="design-card-head">
          <code>{{ d.id }}</code>
          <span v-if="d.deprecated" class="badge warn">移行中だけ使う</span>
          <span v-else class="badge ok">これから使う</span>
        </div>
        <h3>{{ d.label }}</h3>
        <p v-if="d.deprecated" class="mute">{{ d.deprecated }}</p>
        <p v-else class="mute">ARROW リミックスの見た目。全社に一度に出す。</p>
        <p class="covers">見た目を用意した部品の数 <strong>{{ Object.keys(d.covers).length }}</strong></p>
      </div>
    </div>

    <h2 id="palettes">ページの色</h2>
    <p>
      ページ（機能）ごとの色の組です。どのページにどの色を当てるかは製品が決めます（<code>ArThemeScope</code>）。
      1つの組は {{ slotCount }} の値を持ち、部品は accent 系の名前だけを使います。押すと、このページの見本の色が替わります。
    </p>
    <div class="tbl-wrap">
      <table class="tbl paltbl">
        <thead>
          <tr><th>名前</th><th v-for="d in designs" :key="d.id">{{ d.id === "remix" ? "新しい見た目" : "今の見た目" }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in paletteNames" :key="p" :class="{ on: palette === p }" @click="pick(p)">
            <td class="nm">{{ paletteJa[p] }} <code>{{ p }}</code></td>
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

    <h2 id="sizes">大きさの段（sm・md・lg）と使い分け</h2>
    <p>
      入力・セレクト・時刻・日付・ボタンなど、高さを持つ部品はどれも <code>size</code> に同じ3つの段（<code>sm</code>・<code>md</code>・<code>lg</code>）を持ちます。
      同じ段なら部品が違っても高さと角丸がそろうので、1行に並べても上下がずれません。文字の大きさは部品の役目ごとに決めています（ボタンは 12.5・13・14px、入力は 13・14・15px）。
    </p>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr><th>段</th><th>新しい見た目</th><th>今の見た目</th><th>使う所</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in sizeSteps" :key="r.step">
            <td class="nm"><code>{{ r.step }}</code></td>
            <td>{{ r.remix }}</td>
            <td>{{ r.classic }}</td>
            <td>{{ r.use }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="demos">
      <DemoBox v-for="d in sizeDemos" :key="d.id" :demo="d" />
    </div>

    <h2 id="tokens">色・文字・余白の値</h2>
    <template v-for="g in groups" :key="g.title">
      <h3>{{ g.title }}</h3>
      <div class="tbl-wrap">
        <table class="tbl tok">
          <thead>
            <tr><th>名前（CSS 変数）</th><th v-for="d in designs" :key="d.id">{{ d.id === "remix" ? "新しい見た目" : "今の見た目" }}</th></tr>
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
