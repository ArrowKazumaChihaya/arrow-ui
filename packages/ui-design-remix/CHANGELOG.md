# @s_and_a/arrow-ui-design-remix

## Unreleased

- Align business band headings to the leading edge, independent of header actions. Keep card and page-heading insets consistent; authentication panels retain their centered composition.
- Keep compact, full-width segmented filters readable with count badges. Allow wrapped labels to increase the control height instead of overflowing a fixed small-size row.

- Allow card footer notices and forms to take their natural height; only direct action buttons use the compact segmented footer styling.

- Keep mobile band-card actions at the trailing edge, with long titles wrapping beside or above them consistently.

## 0.1.10

### Patch Changes

- c09b9cb: ArStack に gap を指定したフォーム行で、ArItem 自身の下余白と二重加算される問題を修正。gap が 0 の既存フォーム配置は従来の行間を維持する。
- Reset modal body scroll when its current step or explicit scrollKey changes, so multi-step forms begin at the top of each screen.

  Keep narrow-screen modal steps in one evenly spaced row with wrapping labels.

- Updated dependencies [2a66110]
- Updated dependencies
  - @s_and_a/arrow-ui@0.1.10

## 0.1.9

### Patch Changes

- 詳細を持つ承認フローの横配置で、固定の 32px 高から本文と操作ボタンがはみ出す問題を修正。スマホでは段階と矢印を縦に並べる。

- 3553f28: 帯・影・枠付きカード内の目次がページスクロールに追従するよう、角丸のクリッピングでスクロールコンテナーを作らない。

## 0.1.8

### Patch Changes

- 本体の互換パッチ版を受け入れるよう peer 依存を修正し、本体 0.1.5 との通常インストールを可能にする。

## 0.1.7

- 折返し指定の表で見出しも列幅に収め、スマホの右端で操作名が欠ける問題を修正。
- 横並びフォームの長い項目名を折り返し、固定ラベル幅で先頭が欠ける問題を修正。狭い配置では縦並びを維持。

## 0.1.6

- スマホのプロフィール上部を、原稿に合わせた小さな写真と折り返す属性ラベルへ変更。説明一覧の DOM・操作・旧テーマは維持。

## 0.1.5

- スマホの年月ナビゲーションで支給日ラベルが一文字だけ折り返す問題を修正。本体 0.1.4 に対応。

## 0.1.4

- AI チャットのパネルが透明になって背面のページと重なる問題を修正。背景、本文、入力、確認内容の表示を新テーマの共通トークンへ接続する。

## 0.1.3

- 共通ヘッダーの修正を含む本体 0.1.3 に対応。

## 0.1.2

- 人物一覧の氏名・説明を省略せず折り返し、狭い配置では操作を下段へ移して件数や状態を読めるよう修正。

- 項目一覧は配置幅に応じて 1 列へ折り返し、長いラベルでも値の表示領域を確保。

- ArDateRange 1.2: 両端の日付へ入力規則と翻訳を渡し、単独日付からの移行時も未入力・不正日付・更新タイミングを保持。

- ArApprovalFlow 1.2: 承認者不足の停滞を blocked として扱い、否認と区別する警告表示を両テーマに追加。

- ArDateView 1.1: 日付表記・曜日の翻訳と、短い表記の曜日省略をサポート。

- ArTimeChart 1.1: 月別の勤務・休日・残業割増など重なる計算区分を独立した帯で表示し、全目盛りが読める横幅を確保。

- ArApprovalFlow 1.1: 承認者・履歴用の details slot を追加。縦/横の形でも DOM・入力・focus を保持し、狭い画面の長い段名と状態を折り返す。

- 勤怠チャートの長い分類名と横スクロール中の見出しを保持し、時間帯のキーボード操作と淡色帯の文字を改善。

- Keep modal descriptions, long titles and footer notes readable on mobile instead of hiding or truncating them.

- Organization charts support anchored pan/pinch gestures, async tree data, and non-overlapping mobile controls. Preserve user zoom and pan across design changes.

- Remove excessive vertical whitespace above mobile authentication forms.

### Patch Changes

- Add a shared profile card for manager and personal employee information. Wrap breadcrumb actions at narrow widths and prevent responsive grids and page offsets from overflowing or adding duplicate mobile gutters.

- Restore document scrolling outside dialogs. Keep long navigation titles and input fields within their containers, use the reference page gutters, and remove nested decorative frames inside cards and dialogs. Time ranges support overnight starts and independent start/end updates without overwriting the other draft value.
- Updated dependencies
  - @s_and_a/arrow-ui@0.1.2
  - @s_and_a/arrow-ui-tokens@0.1.2
