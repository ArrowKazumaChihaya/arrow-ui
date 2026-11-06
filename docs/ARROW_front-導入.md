# ARROW_front への導入手順

Frontの導入は実装済みです。以下は今後の更新で守る境界です。

2026-11-07: remixのArDescriptions（bordered/inline）は、項目名の列を最大14remに抑えます。広い社員情報・承認画面で値の領域を確保し、3列/列結合と480px以下の縦配置を維持します。Frontの架空データ画面で1280/375px、1列/3列/狭いコンテナを確認。classicの指定は変更しません。

## 公開パッケージの更新

`@s_and_a` の配布先は公開npm (`https://registry.npmjs.org/`) です。GitHub Packagesの認証やローカルtarballは不要です。既存 `.npmrc` にこのscopeのGitHub registry指定が残っていたら、公開npmへ変更してください。

Frontの `package.json` / `resolutions` / `yarn.lock` を公開済みの版へ揃え、利用者は `yarn install --frozen-lockfile` で取得します。未公開のcheckoutでの確認は検証専用にし、通常のinstallと区別します。

## 責務と切替

- Frontは配置・データ・権限・状態・操作を所有します。色、枠、文字、入力とボタンの外観はライブラリへ置きます。可能な場所はArCard/ArStack/ArDescriptionsなどの公開部品を直接使用します。
- `Component/Design/DesignProvider.vue` が新旧両テーマと選択状態を接続します。既存のデザイン切替を維持し、デザイン変更だけでViewを再マウントしないでください。
- 新規のレイアウトwrapperを機械的に増やさず、Frontの既存 `Component/Layout` とライブラリのlayout部品を使います。
- `yarn format:changed`、`yarn verify`、本番buildに加え、新旧テーマ・375/768/1440pxの画面検証を行います。入力、選択、スクロール、モーダル、権限と空状態も確認します。
- 検証用の架空データは実データの全route確認と区別します。詳細な現在地はFrontの `docs/design-renewal-integration.md` とroute監査表で管理します。

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

この対応はFrontのページテーマ設定が持つ。ライブラリはページ名を知らない。

## ArThumbnail 1.2: 非同期保存と画像処理の寿命

- 確認ダイアログやAPI保存の成功まで開いておく利用側は`closeOnSave=false`と`v-model:open`を併用する。画像/fileイベントは保存要求として扱い、成功時だけopenをfalseにする。既定trueでは従来通り保存イベント後に閉じる。
- 新しいファイル選択、削除、閉じる、アンマウントで以前の画像読取・decode・回転・freeCrop出力を無効にする。未完了のObject URLも破棄し、閉じた後に古い画像やエラーを戻さない。
- 空画像で左右回転は新旧デザインとも無効。ファイル拡張子/サイズ/画素の受付条件と既存のCanvas出力寸法は保持する。Frontの旧Cropperからの全面移行には、既存の切抜き座標・画質回帰との照合を別途必要とする。

### 2026-11-07: 表の行内余白

remixのArTableは通常/boardとも本文セルの上下に4pxを確保する。compactでも36pxの操作ボタンや複数行テキストが隣の行に接しない。行の最小高さと横余白は維持し、classicは変更しない。frontの入社/申請一覧1280pxとスマホカード切替を実ブラウザ確認。
