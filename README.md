# arrow-ui

ARROW シリーズで共通に使う Vue 3 のデザインライブラリです。各製品は、このライブラリの部品だけで画面を組み立てます。

- **デザインの着せ替え**：見た目はデザインのライブラリ（`@arrow/ui-design-*`）だけが持ちます。当てるデザインのライブラリを替えると、配置と動きはそのままで見た目だけが替わります。
- **組み立てルールは製品の中**：余白・配置・ページごとのテーマ色の当て方は、各製品の `src/Layout` に書きます。ライブラリには入れません。
- **足りないライブラリは使えない**：製品は使う部品とその契約の版を宣言します。部品のライブラリとデザインのライブラリが満たさなければ、ビルドも起動もできません。

設計の全体は「ARROW UI ライブラリ 設計書（インタフェース仕様）」にまとめています。

## 3つに分けているもの

| 何 | どこ | 例 |
| --- | --- | --- |
| 動き・構造・読み上げ | 部品のライブラリ `@arrow/ui` | 時刻の確定、Tab の順、表の固定列、ポップアップのフォーカス |
| 見た目 | デザインのライブラリ `@arrow/ui-design-*` | 色・角丸・文字・枠・影・帯 |
| 配置と余白 | 製品のレイアウト層 `src/Layout` | ヘッダー2段、左にカレンダー右に詳細、ブロックの間24 |

## パッケージ

| パッケージ | 中身 |
| --- | --- |
| `@arrow/ui-tokens` | トークンの名前と型、テーマ色の組の名前。値は持たない |
| `@arrow/ui` | 部品の構造と動き・契約・`ArUiProvider`・並べるための基礎・構造の CSS・`arrow-ui check`。**見た目は持たない** |
| `@arrow/ui-design-remix` | デザインのライブラリ：ARROW リミックス |
| `@arrow/ui-design-classic` | デザインのライブラリ：今の ARROW（ant-design-vue 4 の既定＋ARROW の上書き）。今の画面にない部品も同じ雰囲気で作ってある。**全画面の移行と remix の全社公開のあとに廃止する** |
| `@arrow/eslint-plugin-ui` | 宣言していない部品を使わせない・View で並べる基礎を使わせない |
| `apps/catalog` | 部品をデザインとテーマ色を替えて確かめる画面（公開しない） |

## 今ある部品（契約 1.0.0）

| 部品 | 役目 |
| --- | --- |
| `ArUiProvider` | デザインのトークンとテーマ色を配り、宣言した部品がそろっているか確かめる |
| `ArThemeScope` | 中の部品のテーマ色（accent 系）を切り替える |
| `ArStack`・`ArCluster`・`ArGrid`・`ArSplit` | 並べるための基礎。間は余白トークンの段階（0〜8）だけ。**製品のレイアウト層で使い、View では使わない** |
| `ArIcon` | ARROW の線のアイコン（64個） |
| `ArButton` | ボタン。tone は primary / secondary / subtle / ghost / danger / danger-subtle / dashed |
| `ArField` | ラベル・必須・説明・間違いをまとめ、中の入力と id で結ぶ |
| `ArTextInput`・`ArSelect` | 1行の文字・選択肢から1つ |
| `ArTimeInput` | 時刻。キー入力が基本（「930」→ 09:30）。`day-shift` で枠と一体の［当日⇄前日］ |
| `ArDateInput` | 日付。年はセレクト、月日は数字、曜日は自動 |
| `ArCheckbox`・`ArRadioGroup`・`ArSwitch` | チェック・ラジオ・すぐ効く切り替え |
| `ArTabs` | タブ（band：カードの頭／line：カードの中）。←→で移る |
| `ArCard` | まとまり（band：テーマ色の帯の見出し／plain） |
| `ArTable` | 表。見出しと左の列の固定、選択、展開、合計の行。並べ替えは update:sort を出すだけ |
| `ArModal` | ポップアップ。手順、フォーカスの閉じ込め、Esc で閉じる |
| `ArAlert`・`ArTag` | お知らせ・状態の札 |

この先、設計書の一覧（`ArCalendarGrid`・`ArTimeGrid`・`ArTimeChart` など）を順に足します。足すときは、すべてのデザインのライブラリで見た目も作ります。

## 使い方（製品の側）

```ts
// main.ts
import "@arrow/ui/style.css";
```

### デザインのライブラリを切り替える

製品のコードは `@arrow/ui-design` という1つの名前だけを読み、どのデザインのライブラリを当てるかはビルドの設定で決めます。切り替えはこの1か所だけで、画面のコードは変わりません（選ばなかったデザインはビルドに入りません）。

```ts
// vite.config.ts
const design = process.env.ARROW_DESIGN === "classic" ? "@arrow/ui-design-classic" : "@arrow/ui-design-remix";
export default defineConfig({
  resolve: { alias: [{ find: /^@arrow\/ui-design$/, replacement: design }] },
});
```

```vue
<!-- App.vue（利用者が選ぶ仕組みは持たない） -->
<script setup lang="ts">
import { ArUiProvider } from "@arrow/ui";
import design from "@arrow/ui-design";
import requires from "../arrow-ui.requires";
</script>

<template>
  <ArUiProvider :design="design" :requires="requires"><RouterView /></ArUiProvider>
</template>
```

### 使う部品の宣言

製品のリポジトリ直下に `arrow-ui.requires.ts` を置きます。

```ts
import { defineRequirements } from "@arrow/ui/requirements";
import { remixDesign } from "@arrow/ui-design-remix";
import { classicDesign } from "@arrow/ui-design-classic";

export default defineRequirements({
  components: {
    ArButton: "^1.0",
    ArTimeInput: "^1.0", // 前日の切り替え（dayShift）を使う
    ArTable: "^1.0",
  },
  // 切り替える可能性のあるデザインのライブラリはすべて並べる（どれも宣言を満たすことを CI で確かめる）
  designs: [remixDesign, classicDesign],
});
```

確かめるのは3か所です。

| いつ | 何を確かめるか | 足りないと |
| --- | --- | --- |
| コードを書くとき（`@arrow/eslint-plugin-ui`） | 宣言にない `Ar*` 部品を使っていないか | エラー |
| CI（`npx arrow-ui check`） | 部品のライブラリと、並べたデザインのライブラリが、宣言した部品と版を満たすか | 1 で終わり、足りない部品を一覧で出す |
| 起動時（`ArUiProvider` の `requires`） | 当てているデザインのライブラリで同じ確認 | 画面を出さない |

部品が足りないときは、部品のライブラリに部品か契約を足し（マイナー版）、**すべてのデザインのライブラリで見た目を作ってから**、製品の宣言を上げます。製品の中で代わりの部品を作ってごまかしません。

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

## デザインのライブラリの作り方

```ts
import { defineDesign } from "@arrow/ui/design";
export const nextDesign = defineDesign({
  id: "next",
  label: "…",
  tokens: { /* すべてのトークンの値 */ },
  palettes: { /* 7つのテーマ色の組 */ },
  covers: { ArButton: "1.0.0" /* …見た目を作ったすべての部品と契約の版 */ },
  styles: () => import("@arrow/ui-design-next/styles.css"),
});
export default nextDesign;
```

- トークン・7つのテーマ色・見た目を持つ全部品の `covers` がそろわないと、`defineDesign` が例外を出します。
- CSS は `[data-ar-design="next"] [data-ar="button"][data-tone="primary"]` のように、デザイン・部品・部位・状態の属性だけを使います。画面のクラス名や URL は使いません。
- 入れ物の部品（ArField・ArCard・ArModal など）の部位は子の結合子（`>`）で書き、中に入れた別の部品に効かないようにします（`packages/ui/test/css.test.ts` で確かめます）。
- 構造（固定・重なり・スクロール・並べ方）は `@arrow/ui/style.css` が持ちます。デザインのライブラリは見た目だけを持ちます。
- classic は、ARROW_front の実際の部品を描いた `docs/reference/current-*.png` に合わせています。

## 開発

```sh
npm install
npm test            # 部品の契約・CSS の決まりのテスト
npm run typecheck
npm run build
npm run catalog     # http://127.0.0.1:5190/ でカタログ（?design=classic&palette=green）
npm run test:visual # カタログをデザインごとに撮る（apps/catalog/shots）
npm run changeset   # 変更の記録（版を上げる）
```

公開先は GitHub Packages（`@arrow` スコープ）です。製品の `.npmrc` に `@arrow:registry=https://npm.pkg.github.com` と読み取りのトークンを置きます。
