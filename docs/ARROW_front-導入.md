# ARROW_front への導入手順

設計書の「移行の進め方」の段階1〜3を、ARROW_front の側で行う手順です。

## 段階1：土台

1. `.npmrc` に `@arrow:registry=https://npm.pkg.github.com` を足し、`@arrow/ui`・`@arrow/ui-skin-remix`・`@arrow/ui-skin-classic`・`@arrow/eslint-plugin-ui` を入れる。
2. `arrow-ui.requires.ts` をリポジトリ直下に置く（README の例）。最初はシフト画面で使う部品だけ。
3. `src/main.ts` で `@arrow/ui/style.css` を読み、`App.vue` を `ArUiProvider` で包む。skin は環境変数 `VITE_ARROW_SKIN` で決める（移行中は classic、全社公開で remix）。
4. 今の切り替えの仕組みを外す：`DesignSwitcher.vue`、`Logic/Design.ts`、`State/DesignState.ts`、localStorage の `arrow.ui-design`。`DesignProvider.vue` は classic の CSS を読むだけにして、`ArUiProvider` の内側に置く。
5. `package.json` の verify に `arrow-ui check` を足す。`.eslintrc` に `plugin:@arrow/ui/recommended` を足す。
6. `check:design` は、View の style・class・生の HTML タグの禁止をそのまま続ける。

## 段階3：シフト画面

1. `src/Layout/` を作る：`ArrowShell`（ヘッダー2段・ページ名からテーマ色を決める）、`ArrowTwoPane`（`ArSplit start="lg"`）、`ArrowBandCard`、`ArrowSection`（ブロックの間 `space.6`）、`ArrowTableBlock`（表の下 `space.2`）、`ArrowFormGrid`、`ArrowModalLayout`。
2. シフト画面の View を、`Ui*` 部品からレイアウト層とライブラリの部品へ置き換える。業務の動き（次の空の行を出すなど）は Logic に残す。
3. classic と remix の両方で、入力・Tab の順・固定列・ポップアップ・スマホを確かめる。

## ページとテーマ色

| ページ | テーマ色の組 |
| --- | --- |
| シフト | blue |
| 勤怠 | green |
| 給与賞与報酬年調 | yellow |
| 集計 | amber（色は仮。設計書の「決めること」） |
| 書類 | pink |
| 通知 | orange |
| 会社情報・社員情報・設定 | teal |

この対応は ARROW_front の `ArrowShell` が持つ。ライブラリはページ名を知らない。
