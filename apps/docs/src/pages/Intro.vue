<script setup lang="ts">
import DemoBox from "../DemoBox.vue";
import CodeBlock from "../CodeBlock.vue";
import { demosOf } from "../demos";
import * as s from "../snippets";
const screen = demosOf("_screen")[0]!;
</script>

<template>
  <article class="page">
    <p class="eyebrow">ARROW シリーズ共通の部品集</p>
    <h1 class="page-title">ARROW UI へようこそ</h1>
    <p class="lede">
      ARROW シリーズの製品が共通で使う部品（ボタン・表・入力など）と、その<strong>見た目</strong>をまとめたものです。
      部品の形と動きは「部品のライブラリ」が持ち、見た目は「新しい見た目（remix）」と「今の見た目（classic）」の2つのライブラリが持ちます。
      同じ画面に、どちらの見た目でも着せ替えられます。右上で切り替えて見比べられます。
    </p>

    <DemoBox :demo="screen" screen />

    <h2 id="layers">3つに分けているもの</h2>
    <div class="layers">
      <div class="layer">
        <span class="layer-tag">製品</span>
        <h3>レイアウト層</h3>
        <p>余白・配置・ページごとの並び。<code>src/Layout</code> に書き、ライブラリには入れない。</p>
      </div>
      <div class="layer">
        <span class="layer-tag">@s_and_a/arrow-ui</span>
        <h3>部品のライブラリ</h3>
        <p>部品の構造・動き・読み上げ・契約（props・events・slots・部位）。見た目は持たない。</p>
      </div>
      <div class="layer">
        <span class="layer-tag">@s_and_a/arrow-ui-design-*</span>
        <h3>見た目のライブラリ</h3>
        <p>トークンの値・テーマ色・部位に当てる CSS・対応した部品と版。入れ替えられる。</p>
      </div>
    </div>

    <h2 id="start">製品で使う手順（開発する人向け）</h2>
    <ol class="steps">
      <li>
        <h3>入れる</h3>
        <CodeBlock :code="s.install" file="ターミナル" />
      </li>
      <li>
        <h3>デザインを1か所で決める</h3>
        <p>製品のコードは <code>@s_and_a/arrow-ui-design</code> という名前だけを読みます。どのデザインにするかはビルドの設定で決め、画面のコードは変わりません。</p>
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
