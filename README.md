# arrow-ui

ARROW シリーズで共通に使う Vue 3 のデザインライブラリです。各製品は、このライブラリの部品だけで画面を組み立てます。

- **デザインの着せ替え**：見た目はデザインのライブラリ（`@s_and_a/arrow-ui-design-*`）だけが持ちます。当てるデザインのライブラリを替えると、配置と動きはそのままで見た目だけが替わります。
- **組み立てルールは製品の中**：余白・配置・ページごとのテーマ色の当て方は、各製品の `src/Layout` に書きます。ライブラリには入れません。
- **足りないライブラリは使えない**：製品は使う部品とその契約の版を宣言します。部品のライブラリとデザインのライブラリが満たさなければ、ビルドも起動もできません。

設計の全体は「ARROW UI ライブラリ 設計書（インタフェース仕様）」にまとめています。

## 3つに分けているもの

| 何 | どこ | 例 |
| --- | --- | --- |
| 動き・構造・読み上げ | 部品のライブラリ `@s_and_a/arrow-ui` | 時刻の確定、Tab の順、表の固定列、ポップアップのフォーカス |
| 見た目 | デザインのライブラリ `@s_and_a/arrow-ui-design-*` | 色・角丸・文字・枠・影・帯 |
| 配置と余白 | 製品のレイアウト層 `src/Layout` | ヘッダー2段、左にカレンダー右に詳細、ブロックの間24 |

## パッケージ

| パッケージ | 中身 |
| --- | --- |
| `@s_and_a/arrow-ui-tokens` | トークンの名前と型、テーマ色の組の名前。値は持たない |
| `@s_and_a/arrow-ui` | 部品の構造と動き・契約・`ArUiProvider`・並べるための基礎・構造の CSS・`arrow-ui check`。**見た目は持たない** |
| `@s_and_a/arrow-ui-design-remix` | デザインのライブラリ：ARROW リミックス |
| `@s_and_a/arrow-ui-design-classic` | デザインのライブラリ：今の ARROW（ant-design-vue 4 の既定＋ARROW の上書き）。今の画面にない部品も同じ雰囲気で作ってある。**全画面の移行と remix の全社公開のあとに廃止する** |
| `@s_and_a/eslint-plugin-arrow-ui` | 宣言していない部品を使わせない・View で並べる基礎を使わせない |
| `apps/catalog` | 部品をデザインとテーマ色を替えて確かめる画面（公開しない） |

## 既存 Front からの利用

入力・ボタン・カード・表などは `@s_and_a/arrow-ui` の公開部品を直接 import します。既存画面の ARROW 固有の表示パーツは `@s_and_a/arrow-ui/product` に集約しました。Front は配置、権限、状態、API 接続、保存値と入力値の変換を担当します。

- 共通部品の外観は各デザインの `src/parts/Ar*.css`、製品固有の外観は `src/parts/_product.css` とその参照先を変更します。
- `product` のレイアウト用 CSS と装飾は分離しています。classic の装飾は `arrow-product-classic` レイヤー内に限定し、remix の公開部品へ旧 CSS が混ざらないようにしています。
- `vUi` の公開部品への適用は幅・位置などの配置情報に限定します。ページから入力欄やボタンの色・枠・書体を上書きしません。固定書式の帳票は `UiDocument` の境界で扱います。
- 部品の選択値は公開契約に合わせます。Front の従来の ID 型や nullable 値は利用側の変換で維持し、ライブラリに業務処理を持ち込みません。
- デザインは `ArUiProvider` で切り替えます。画面の再マウントを必要としないため、入力中の値や表の操作状態を保持できます。

Front は公開 npm の通常のバージョン依存と lockfile を使用します。インストールに GitHub/npm 認証やローカル tarball は不要です。各パッケージは変更内容に応じて個別にバージョンを進めます。

デザイン刷新の開発中は、Frontの`feature/design-renewal-prep`からこのリポジトリのソースを直接読み込みます。**全体の修正と検証が完了するまでnpm公開・認証依頼は停止します。** Frontとこのcheckoutを同じ親ディレクトリへ置き、ライブラリ側で`npm ci`、Front側で`yarn install --frozen-lockfile`と`yarn dev`を実行してください（このディレクトリ名は`arrow-ui`）。Frontの起動ログに`arrow-ui: local source (...)`が出れば、部品・トークン・新旧テーマの`src`を使用しています。通常の部品やCSSの編集はビルド・pack・公開なしで反映されます。部品の追加や契約変更では従来どおり`npm run gen`で登録を更新します。

別配置ならFrontで`ARROW_UI_CHECKOUT=/absolute/path/to/arrow-ui yarn dev`を指定します。Frontの型検査・単体テスト・ブラウザ検証・buildも同じソースを使用します。公開成果物を検証するときだけ`ARROW_UI_CHECKOUT=npm`を指定し、npm公開後にはそのモードでも確認します。Frontに隣接checkoutがない通常のインストールはlockfileの公開版を使用します。

## 今ある部品（115）

Ant Design の全種類と、ARROW 特有の部品です。どの部品も remix と classic の両方の見た目があります。
見本・コード・指定できることは説明のサイト（https://arrowkazumachihaya.github.io/arrow-ui/）で見られます。
この一覧は `scripts/gen-registry.mjs` が作る目次と同じです。

| 分類 | 部品 |
| --- | --- |
| しくみ | `ArThemeScope`（ページの色を替える枠）・`ArUiProvider`（デザインを当てる枠） |
| 並べる | `ArCluster`（横に並べる）・`ArCompact`（つなげる（Compact））・`ArDivider`（区切り線）・`ArGrid`（格子に並べる）・`ArLayout`（画面の枠（レイアウト））・`ArMasonry`（メイソンリー）・`ArSplit`（左右に分ける）・`ArSplitter`（分割パネル）・`ArStack`（縦に並べる） |
| 基本 | `ArButton`（ボタン）・`ArFloatButton`（浮かぶボタン）・`ArIcon`（アイコン）・`ArLink`（リンク）・`ArParagraph`（段落）・`ArSegmented`（切り替え（セグメント））・`ArText`（文字）・`ArTitle`（見出し） |
| 移動 | `ArAffix`（固定（Affix））・`ArAnchor`（目次（アンカー））・`ArBreadcrumb`（パンくず）・`ArDropdown`（ドロップダウン）・`ArMenu`（メニュー）・`ArPagination`（ページ送り）・`ArSteps`（手順（ステップ））・`ArTabs`（タブ） |
| 入力 | `ArAutoComplete`（入力の候補）・`ArCascader`（階層の選択）・`ArCheckbox`（チェック）・`ArCheckboxGroup`（チェックのまとまり）・`ArColorPicker`（色の選択）・`ArColorSwatches`（色の丸）・`ArDateInput`（日付の入力）・`ArDatePicker`（日付の選択）・`ArDateRange`（日付の範囲）・`ArField`（入力の項目）・`ArForm`（フォーム）・`ArInputNumber`（数の入力）・`ArMentions`（メンション）・`ArPills`（選ぶ札）・`ArRadioGroup`（ラジオ）・`ArRate`（評価）・`ArSelect`（セレクト）・`ArSlider`（スライダー）・`ArStepper`（数の増減）・`ArSwitch`（スイッチ）・`ArTextarea`（複数行の入力）・`ArTextInput`（文字の入力）・`ArTimeInput`（時刻の入力）・`ArTimePicker`（時刻の選択）・`ArTimeRange`（時刻の範囲）・`ArTransfer`（トランスファー）・`ArTreeSelect`（ツリーセレクト）・`ArUpload`（アップロード）・`ArWeekdayPicker`（曜日の選択） |
| 表示 | `ArAvatar`（アバター（頭文字の丸））・`ArAvatarGroup`（アバターを重ねる）・`ArBadge`（バッジ（件数・点））・`ArCalendar`（カレンダー）・`ArCard`（カード）・`ArCarousel`（カルーセル）・`ArCollapse`（折りたたみ）・`ArCountdown`（しめきりまでの残り）・`ArDescriptions`（説明リスト）・`ArEmpty`（空の状態）・`ArImage`（画像）・`ArList`（リスト）・`ArPopover`（ポップオーバー）・`ArQRCode`（QRコード）・`ArRibbon`（リボン）・`ArStatistic`（統計（大きな数字））・`ArTable`（表）・`ArTag`（札（タグ））・`ArTimeline`（タイムライン）・`ArTooltip`（ツールチップ）・`ArTour`（ツアー）・`ArTree`（ツリー） |
| 知らせる | `ArAlert`（お知らせ）・`ArBorderBeam`（ボーダービーム）・`ArDrawer`（ドロワー）・`ArMessage`（メッセージ）・`ArMessageHost`（メッセージの入れ物）・`ArModal`（ポップアップ）・`ArNotification`（通知）・`ArNotificationHost`（通知の入れ物）・`ArPopconfirm`（その場の確認）・`ArProgress`（プログレス）・`ArResult`（結果）・`ArSkeleton`（スケルトン）・`ArSpin`（スピン）・`ArToast`（トースト）・`ArWatermark`（透かし） |
| ARROW | `ArAppFooter`（画面の足（PC））・`ArAppHeader`（画面の頭（PC））・`ArBalloon`（吹き出し）・`ArBottomNav`（下のメニュー（スマホ））・`ArChangedValue`（変更前→変更後）・`ArChip`（小さな札（チップ））・`ArDaySummary`（日の要約）・`ArEllipsis`（切り詰め（…））・`ArFlagGroup`（ビットのチェック）・`ArFlagView`（ビットの表示）・`ArInfo`（説明・注意）・`ArKanaInput`（氏名とフリガナの入力）・`ArKanaText`（フリガナつきの氏名）・`ArMobileHeader`（画面の頭（スマホ））・`ArMonthDayInput`（月日の入力）・`ArPeriodNav`（期間の切り替え）・`ArSectionHead`（まとまりの見出し）・`ArThumbnail`（顔写真（サムネイル））・`ArViewOptions`（表示内容の選択）・`ArYearInput`（年の入力）・`ArYearMonthInput`（年月の入力）・`ArZipInput`（郵便番号の入力） |

`ArStack`・`ArCluster`・`ArGrid`・`ArSplit`・`ArMasonry` は並べるための基礎です。**製品のレイアウト層で使い、View では使いません。**
部品を足すときは、すべてのデザインのライブラリで見た目も作ります（`parts/<部品>.css` の1行目に `/* @covers <部品> <版> */`）。

## 使い方（製品の側）

```ts
// main.ts
import "@s_and_a/arrow-ui/style.css";
```

### デザインのライブラリを切り替える

製品のコードは `@s_and_a/arrow-ui-design` という1つの名前だけを読み、どのデザインのライブラリを当てるかはビルドの設定で決めます。切り替えはこの1か所だけで、画面のコードは変わりません（選ばなかったデザインはビルドに入りません）。

```ts
// vite.config.ts
const design = process.env.ARROW_DESIGN === "classic" ? "@s_and_a/arrow-ui-design-classic" : "@s_and_a/arrow-ui-design-remix";
export default defineConfig({
  resolve: { alias: [{ find: /^@s_and_a\/arrow-ui-design$/, replacement: design }] },
});
```

```vue
<!-- App.vue（利用者が選ぶ仕組みは持たない） -->
<script setup lang="ts">
import { ArUiProvider } from "@s_and_a/arrow-ui";
import design from "@s_and_a/arrow-ui-design";
import requires from "../arrow-ui.requires";
</script>

<template>
  <ArUiProvider :design="design" :requires="requires"><RouterView /></ArUiProvider>
</template>
```

### 使う部品の宣言

製品のリポジトリ直下に `arrow-ui.requires.ts` を置きます。

```ts
import { defineRequirements } from "@s_and_a/arrow-ui/requirements";
import { remixDesign } from "@s_and_a/arrow-ui-design-remix";
import { classicDesign } from "@s_and_a/arrow-ui-design-classic";

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
| コードを書くとき（`@s_and_a/eslint-plugin-arrow-ui`） | 宣言にない `Ar*` 部品を使っていないか | エラー |
| CI（`npx arrow-ui check`） | 部品のライブラリと、並べたデザインのライブラリが、宣言した部品と版を満たすか | 1 で終わり、足りない部品を一覧で出す |
| 起動時（`ArUiProvider` の `requires`） | 当てているデザインのライブラリで同じ確認 | 画面を出さない |

部品が足りないときは、部品のライブラリに部品か契約を足し（マイナー版）、**すべてのデザインのライブラリで見た目を作ってから**、製品の宣言を上げます。製品の中で代わりの部品を作ってごまかしません。

### ESLint（eslint 8 の .eslintrc）

```js
module.exports = {
  plugins: ["@s_and_a/arrow-ui"],
  extends: ["plugin:@s_and_a/arrow-ui/recommended"],
};
```

`recommended` は、宣言していない部品を使わせず、`src/View/**/*.vue` で `ArStack`・`ArCluster`・`ArGrid`・`ArSplit` を使わせません（配置は `src/Layout` の部品で行う）。

## 部品の契約と版

- 部品ごとに `*.contract.ts` に props・emits・部位（`data-part`）の型があり、`src/contracts.ts` に契約の版があります。
- props・slot・emits・部位を足したらマイナー版、変えた・消したらメジャー版を上げます。見た目だけの直しはパッチ版です。
- 部品の外側の余白は0です。部品は自分の外に margin を持ちません。

## デザインのライブラリの作り方

```ts
import { defineDesign } from "@s_and_a/arrow-ui/design";
export const nextDesign = defineDesign({
  id: "next",
  label: "…",
  tokens: { /* すべてのトークンの値 */ },
  palettes: { /* 7つのテーマ色の組 */ },
  covers: { ArButton: "1.0.0" /* …見た目を作ったすべての部品と契約の版 */ },
  styles: () => import("@s_and_a/arrow-ui-design-next/styles.css"),
});
export default nextDesign;
```

- トークン・7つのテーマ色・見た目を持つ全部品の `covers` がそろわないと、`defineDesign` が例外を出します。
- CSS は `[data-ar-design="next"] [data-ar="button"][data-tone="primary"]` のように、デザイン・部品・部位・状態の属性だけを使います。画面のクラス名や URL は使いません。
- 入れ物の部品（ArField・ArCard・ArModal など）の部位は子の結合子（`>`）で書き、中に入れた別の部品に効かないようにします（`packages/ui/test/css.test.ts` で確かめます）。
- 構造（固定・重なり・スクロール・並べ方）は `@s_and_a/arrow-ui/style.css` が持ちます。デザインのライブラリは見た目だけを持ちます。
- classic は、ARROW_front の実際の部品を描いた `docs/reference/current-*.png` に合わせています。

## 開発

```sh
npm install
npm test            # 部品の契約・CSS の決まりのテスト
npm run typecheck
npm run build
npm run catalog     # http://127.0.0.1:5190/ でカタログ（?design=classic&palette=green）
npm run test:visual # カタログをデザインごとに撮る（apps/catalog/shots）
npm run docs        # http://127.0.0.1:5191/ で説明のサイト（AntD の説明のような、見本・コード・API の一覧）
npm run docs:build  # 説明のサイトを1枚の HTML にする（apps/docs/dist/arrow-ui-docs.html）
npm run changeset   # 変更の記録（版を上げる）
```

説明のサイトの API の表は `scripts/gen-meta.mjs` が部品のソース（props の型・JSDoc・既定値・events・slots・data-part）から作ります。見本は `apps/docs/src/demos/<部品>/*.vue` に1つずつ置きます（1行目のコメントが題と説明）。

## npm への公開

公開先は `https://registry.npmjs.org/`、アクセスは `public` です。利用者の install に npm/GitHub の認証は必要ありません。公開には npm のアカウント、メール認証、`s_and_a` Organization の公開権限が必要です。メインパッケージは `@s_and_a/arrow-ui` です。

公開するのは次の5パッケージです。アプリ用 workspace は private のままです。

- `@s_and_a/arrow-ui-tokens`
- `@s_and_a/arrow-ui`
- `@s_and_a/arrow-ui-design-remix`
- `@s_and_a/arrow-ui-design-classic`
- `@s_and_a/eslint-plugin-arrow-ui`

```sh
npm ci
npm run check
npm run release:preview  # 実際に含まれるファイルを確認。公開しない
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
npm run release         # Changesets が未公開バージョンを公開
```

パスワード、トークン、ワンタイムコードはリポジトリへ保存しません。公開したバージョン番号は再利用せず、次の変更では `npm run changeset` と `npx changeset version` で版を進めます。

5 パッケージは公開済みです。新しく導入するときは、以下で現在の公開版を取得し、実際に解決されたバージョンを package.json と yarn.lock に固定します。既存Frontでは、更新済みのlockfileを使って `yarn install --frozen-lockfile` を実行してください。

```sh
yarn add --exact @s_and_a/arrow-ui @s_and_a/arrow-ui-tokens @s_and_a/arrow-ui-design-remix @s_and_a/arrow-ui-design-classic
yarn add --dev --exact @s_and_a/eslint-plugin-arrow-ui
```

Front の `feature/design-renewal-prep` は通常の npm 依存へ移行済みです。`resolutions` と `yarn.lock` も公開版を参照し、旧 `vendor/arrow-ui` は削除しました。別環境では `yarn install --frozen-lockfile` だけで同じ公開版を取得できます。
