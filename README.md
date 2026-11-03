# arrow-ui

ARROW シリーズで共通に使う Vue 3 のデザインライブラリです。各製品は、このライブラリの部品だけで画面を組み立てます。

- **見た目の入れ替え**：部品のインタフェース（props・slot・emits・部位）は変えずに、skin（見た目の実装）を差し替えられます。
- **組み立てルールは製品の中**：余白・配置・ページごとのテーマ色の当て方は、各製品の `src/Layout` に書きます。ライブラリには入れません。
- **足りないライブラリは使えない**：製品は使う部品とその契約の版を宣言します。ライブラリと skin が満たさなければ、ビルドも起動もできません。

設計の全体は「ARROW UI ライブラリ 設計書（インタフェース仕様）」にまとめています。

## パッケージ

| パッケージ | 中身 |
| --- | --- |
| `@arrow/ui-tokens` | トークンの名前と型、テーマ色の組の名前。値は持たない |
| `@arrow/ui` | 部品・契約・`ArUiProvider`・並べるための基礎・構造の CSS・`arrow-ui check` |
| `@arrow/ui-skin-remix` | ARROW リミックスの見た目 |
| `@arrow/ui-skin-classic` | これまでの ARROW の見た目。**移行中だけ使い、全画面の移行と remix の全社公開のあとに廃止する** |
| `@arrow/eslint-plugin-ui` | 宣言していない部品を使わせない・View で並べる基礎を使わせない |
| `apps/catalog` | 部品を skin とテーマ色を替えて確かめる画面（公開しない） |

## 今ある部品（契約 1.0.0）

| 部品 | 役目 |
| --- | --- |
| `ArUiProvider` | skin のトークンとテーマ色を配り、宣言した部品がそろっているか確かめる |
| `ArThemeScope` | 中の部品のテーマ色（accent 系）を切り替える |
| `ArStack`・`ArCluster`・`ArGrid`・`ArSplit` | 並べるための基礎。間は余白トークンの段階（0〜8）だけ。**製品のレイアウト層で使い、View では使わない** |
| `ArIcon` | ARROW の線のアイコン（64個） |
| `ArButton` | ボタン。tone は primary / secondary / subtle / ghost / danger / danger-subtle / dashed |
| `ArField` | ラベル・必須・説明・間違いをまとめ、中の入力と id で結ぶ |
| `ArTimeInput` | 時刻。キー入力が基本（「930」→ 09:30）。`day-shift` で枠と一体の［当日⇄前日］ |
| `ArDateInput` | 日付。年はセレクト、月日は数字、曜日は自動 |
| `ArTable` | 表。見出しと左の列の固定、選択、展開、合計の行。並べ替えは update:sort を出すだけ |
| `ArModal` | ポップアップ。手順、フォーカスの閉じ込め、Esc で閉じる |

この先、設計書の一覧（`ArSelect`・`ArCalendarGrid`・`ArTimeGrid`・`ArTimeChart` など）を順に足します。

## 使い方（製品の側）

```ts
// main.ts
import "@arrow/ui/style.css";
```

```vue
<!-- App.vue：skin は起動時に1つ決める（利用者が選ぶ仕組みは持たない） -->
<script setup lang="ts">
import { ArUiProvider } from "@arrow/ui";
import { remixSkin } from "@arrow/ui-skin-remix";
import { classicSkin } from "@arrow/ui-skin-classic";
import requires from "../arrow-ui.requires";
const skin = import.meta.env.VITE_ARROW_SKIN === "classic" ? classicSkin : remixSkin;
</script>

<template>
  <ArUiProvider :skin="skin" :requires="requires"><RouterView /></ArUiProvider>
</template>
```

### 使う部品の宣言

製品のリポジトリ直下に `arrow-ui.requires.ts` を置きます。

```ts
import { defineRequirements } from "@arrow/ui/requirements";
import { remixSkin } from "@arrow/ui-skin-remix";
import { classicSkin } from "@arrow/ui-skin-classic";

export default defineRequirements({
  components: {
    ArButton: "^1.0",
    ArTimeInput: "^1.0", // 前日の切り替え（dayShift）を使う
    ArTable: "^1.0",
  },
  skins: [remixSkin, classicSkin],
});
```

確かめるのは3か所です。

| いつ | 何を確かめるか | 足りないと |
| --- | --- | --- |
| コードを書くとき（`@arrow/eslint-plugin-ui`） | 宣言にない `Ar*` 部品を使っていないか | エラー |
| CI（`npx arrow-ui check`） | ライブラリと宣言した skin が、宣言した部品と版を満たすか | 1 で終わり、足りない部品を一覧で出す |
| 起動時（`ArUiProvider` の `requires`） | 使っている skin で同じ確認 | 画面を出さない |

部品が足りないときは、このライブラリに部品か契約を足し（マイナー版）、skin も対応させてから、製品の宣言を上げます。製品の中で代わりの部品を作ってごまかしません。

### ESLint（eslint 8 の .eslintrc）

```js
module.exports = {
  plugins: ["@arrow/ui"],
  extends: ["plugin:@arrow/ui/recommended"],
};
```

`recommended` は、宣言していない部品を使わせず、`src/View/**/*.vue` で `ArStack`・`ArCluster`・`ArGrid`・`ArSplit` を使わせません（配置は `src/Layout` の部品で行う）。

## 部品の契約と版

- 部品ごとに `*.contract.ts` に props・emits・部位（`data-part`）の型があり、`src/contracts.ts` に契約の版があります。
- props・slot・emits・部位を足したらマイナー版、変えた・消したらメジャー版を上げます。見た目だけの直しはパッチ版です。
- 部品の外側の余白は0です。部品は自分の外に margin を持ちません。

## skin の作り方

```ts
import { defineSkin } from "@arrow/ui/skin";
export const nextSkin = defineSkin({ id: "next", label: "…", tokens: { … }, palettes: { … }, covers: { ArButton: "1.0.0", … }, styles: () => import("…/styles.css") });
```

- トークンの値・7つのテーマ色・見た目を持つ全部品の `covers` がそろわないと、`defineSkin` が例外を出します。
- CSS は `[data-ar-skin="next"] [data-ar="button"][data-tone="primary"]` のように、skin・部品・部位・状態の属性だけを使います。画面のクラス名や URL は使いません。
- 構造（固定・重なり・スクロール）は `@arrow/ui/style.css` が持ちます。skin は見た目だけを持ちます。

## 開発

```sh
npm install
npm test            # 部品の契約のテスト
npm run typecheck
npm run build
npm run catalog     # http://127.0.0.1:5190/ でカタログ（?skin=classic&palette=green）
npm run test:visual # カタログを skin ごとに撮る（apps/catalog/shots）
npm run changeset   # 変更の記録（版を上げる）
```

公開先は GitHub Packages（`@arrow` スコープ）です。製品の `.npmrc` に `@arrow:registry=https://npm.pkg.github.com` と読み取りのトークンを置きます。
