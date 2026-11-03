<script setup lang="ts">
import DemoBox from "../DemoBox.vue";
import CodeBlock from "../CodeBlock.vue";
import { demosOf } from "../demos";
import * as s from "../snippets";
const hero = demosOf("_hero")[0]!;
</script>

<template>
  <article class="page">
    <p class="eyebrow">@arrow/ui</p>
    <h1 class="page-title">ARROW UI</h1>
    <p class="lede">
      ARROW シリーズの製品が共通で使う Vue 3 の部品と、着せ替えられる<strong>デザインのライブラリ</strong>です。
      部品の構造と動きは <code>@arrow/ui</code> が持ち、見た目は <code>@arrow/ui-design-remix</code>（新しい見た目）と
      <code>@arrow/ui-design-classic</code>（今の見た目）が持ちます。同じ画面のコードに、どちらのデザインでも当てられます。
    </p>

    <DemoBox :demo="hero" both />

    <h2 id="layers">3つに分けているもの</h2>
    <div class="layers">
      <div class="layer">
        <span class="layer-tag">製品</span>
        <h3>レイアウト層</h3>
        <p>余白・配置・ページごとの並び。<code>src/Layout</code> に書き、ライブラリには入れない。</p>
      </div>
      <div class="layer">
        <span class="layer-tag">@arrow/ui</span>
        <h3>部品のライブラリ</h3>
        <p>部品の構造・動き・読み上げ・契約（props・events・slots・部位）。見た目は持たない。</p>
      </div>
      <div class="layer">
        <span class="layer-tag">@arrow/ui-design-*</span>
        <h3>デザインのライブラリ</h3>
        <p>トークンの値・テーマ色・部位に当てる CSS・対応した部品と版。入れ替えられる。</p>
      </div>
    </div>

    <h2 id="start">使い方</h2>
    <ol class="steps">
      <li>
        <h3>入れる</h3>
        <CodeBlock :code="s.install" file="ターミナル" />
      </li>
      <li>
        <h3>デザインを1か所で決める</h3>
        <p>製品のコードは <code>@arrow/ui-design</code> という名前だけを読みます。どのデザインにするかはビルドの設定で決め、画面のコードは変わりません。</p>
        <CodeBlock :code="s.viteAlias" file="vite.config.ts" />
      </li>
      <li>
        <h3>アプリを ArUiProvider で包む</h3>
        <CodeBlock :code="s.mainTs" file="main.ts" />
        <CodeBlock :code="s.appVue" file="App.vue" />
      </li>
      <li>
        <h3>配置は製品のレイアウト層で</h3>
        <p>画面（<code>src/View</code>）では並べる部品を使わず、レイアウト層の部品にまとめます。ESLint の <code>recommended</code> がこれを確かめます。</p>
        <CodeBlock :code="s.layoutVue" />
      </li>
    </ol>
  </article>
</template>
