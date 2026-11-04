<script setup lang="ts">
import CodeBlock from "../CodeBlock.vue";
import * as s from "../snippets";
</script>

<template>
  <article class="page">
    <p class="eyebrow">ガイド</p>
    <h1 class="page-title">部品の宣言</h1>
    <p class="lede">
      製品は、使う部品と契約の版を <code>arrow-ui.requires.ts</code> に宣言します。
      宣言した部品の見た目を持っていないデザインのライブラリは、その製品では使えません。
      ARROW 特有の部品（前日をまたぐ時刻・手順のあるポップアップ など）も同じしくみで扱います。
    </p>
    <CodeBlock :code="s.requiresTs" file="arrow-ui.requires.ts" />

    <h2 id="checks">確かめる3か所</h2>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>いつ</th><th>何を確かめるか</th><th>足りないと</th></tr></thead>
        <tbody>
          <tr><td>コードを書くとき<br /><code>@s_and_a/eslint-plugin-arrow-ui</code></td><td>宣言にない <code>Ar*</code> 部品を使っていないか</td><td>エラー</td></tr>
          <tr><td>CI<br /><code>npx arrow-ui check</code></td><td>部品のライブラリと、並べたデザインのライブラリが、宣言した部品と版を満たすか</td><td>1 で終わり、足りない部品を一覧で出す</td></tr>
          <tr><td>起動時<br /><code>ArUiProvider</code> の <code>requires</code></td><td>当てているデザインで同じ確認</td><td>画面を出さない</td></tr>
        </tbody>
      </table>
    </div>
    <CodeBlock :code="s.eslintrc" file=".eslintrc.cjs" />
    <CodeBlock :code="s.cliOut" file="CI の出力の例" />

    <h2 id="add">部品が足りないとき</h2>
    <ol class="plain-steps">
      <li>部品のライブラリに部品か契約を足す（マイナー版を上げる）。</li>
      <li><strong>すべてのデザインのライブラリで見た目を作る</strong>（<code>covers</code> に版を書く）。</li>
      <li>製品の宣言を上げる。</li>
    </ol>
    <p>製品の中で代わりの部品を作ってごまかしません。</p>

    <h2 id="new-design">デザインのライブラリを作る</h2>
    <p><code>defineDesign</code> は、トークン・7つのテーマ色・見た目を作った部品がそろっていないと例外を出します。</p>
    <CodeBlock :code="s.defineDesignTs" file="packages/ui-design-next/src/index.ts" />
    <CodeBlock :code="s.designCssExample" file="styles.css" />
  </article>
</template>
