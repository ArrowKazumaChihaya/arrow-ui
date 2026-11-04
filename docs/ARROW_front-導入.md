# ARROW_front への導入手順

設計書の「移行の進め方」の段階1〜3を、ARROW_front の側で行う手順です。

## 段階1：土台

1. `.npmrc` に `@s_and_a:registry=https://npm.pkg.github.com` を足し、`@s_and_a/arrow-ui`・`@s_and_a/arrow-ui-design-remix`・`@s_and_a/arrow-ui-design-classic`・`@s_and_a/eslint-plugin-arrow-ui` を入れる。
2. `arrow-ui.requires.ts` をリポジトリ直下に置く（README の例）。最初はシフト画面で使う部品だけ。
3. `src/main.ts` で `@s_and_a/arrow-ui/style.css` を読み、`App.vue` を `ArUiProvider` で包む。デザインのライブラリは `vite.config.ts` の `@s_and_a/arrow-ui-design` の行き先で決める（移行中は classic、全画面を移したら remix に替えて全社に一度に出す）。
4. 今の切り替えの仕組みを外す（使わない）：`DesignSwitcher.vue`、`Logic/Design.ts`、`State/DesignState.ts`、localStorage の `arrow.ui-design`。`DesignProvider.vue` は classic の CSS を読むだけにして、`ArUiProvider` の内側に置く。
5. `package.json` の verify に `arrow-ui check` を足す。`.eslintrc` に `plugin:@s_and_a/arrow-ui/recommended` を足す。
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

## ArThumbnail 1.2: 非同期保存と画像処理の寿命

- 確認ダイアログやAPI保存の成功まで開いておく利用側は`closeOnSave=false`と`v-model:open`を併用する。画像/fileイベントは保存要求として扱い、成功時だけopenをfalseにする。既定trueでは従来通り保存イベント後に閉じる。
- 新しいファイル選択、削除、閉じる、アンマウントで以前の画像読取・decode・回転・freeCrop出力を無効にする。未完了のObject URLも破棄し、閉じた後に古い画像やエラーを戻さない。
- 空画像で左右回転は新旧デザインとも無効。ファイル拡張子/サイズ/画素の受付条件と既存のCanvas出力寸法は保持する。Frontの旧Cropperからの全面移行には、既存の切抜き座標・画質回帰との照合を別途必要とする。
