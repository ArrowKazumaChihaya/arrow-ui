# @s_and_a/arrow-ui-design-classic

## 0.1.11

### Patch Changes

- ArTooltip の1行補足表示に対応。
- Requires @s_and_a/arrow-ui 0.1.20 or a compatible newer version.

## 0.1.9

### Patch Changes

- c09b9cb: ArStack に gap を指定したフォーム行で、ArItem 自身の下余白と二重加算される問題を修正。gap が 0 の既存フォーム配置は従来の行間を維持する。
- Reset modal body scroll when its current step or explicit scrollKey changes, so multi-step forms begin at the top of each screen.

  Keep narrow-screen modal steps in one evenly spaced row with wrapping labels.

- Updated dependencies [2a66110]
- Updated dependencies
  - @s_and_a/arrow-ui@0.1.10

## 0.1.8

### Patch Changes

- フォームの区切り記号と必須記号を読み上げ名から除き、幅やテーマの切り替えで入力欄の名前が変わらないよう修正。表示と必須情報は保持。

## 0.1.7

### Patch Changes

- 本体の互換パッチ版を受け入れるよう peer 依存を修正し、本体 0.1.5 との通常インストールを可能にする。

## 0.1.6

- 折返し指定の表で見出しも列幅に収め、スマホの右端で操作名が欠ける問題を修正。
- 横並びフォームの長い項目名を折り返し、固定ラベル幅で先頭が欠ける問題を修正。狭い配置では縦並びを維持。

## 0.1.5

- 空状態・給与未確定などの説明本文のコントラストと行間を改善。

## 0.1.4

- スマホの年月ナビゲーションで支給日ラベルが一文字だけ折り返す問題を修正。本体 0.1.4 に対応。

## 0.1.3

- スマホ・折りたたみヘッダーの修正を含む本体 0.1.3 に対応。

## 0.1.2

- 人物一覧の氏名・説明を省略せず折り返し、狭い配置では操作を下段へ移して件数や状態を読めるよう修正。

- 項目一覧は配置幅に応じて 1 列へ折り返し、長いラベルでも値の表示領域を確保。

- ArDateRange 1.2: 両端の日付へ入力規則と翻訳を渡し、単独日付からの移行時も未入力・不正日付・更新タイミングを保持。

- ArApprovalFlow 1.2: 承認者不足の停滞を blocked として扱い、否認と区別する警告表示を両テーマに追加。

- ArDateView 1.1: 日付表記・曜日の翻訳と、短い表記の曜日省略をサポート。

- ArTimeChart 1.1: 月別の勤務・休日・残業割増など重なる計算区分を独立した帯で表示し、全目盛りが読める横幅を確保。

- ArApprovalFlow 1.1: 承認者・履歴用の details slot を追加。縦/横の形でも DOM・入力・focus を保持し、狭い画面の長い段名と状態を折り返す。

- 勤怠チャートの長い分類名と横スクロール中の見出しを保持し、時間帯のキーボード操作と淡色帯の文字を改善。

- Organization charts support anchored pan/pinch gestures, async tree data, and non-overlapping mobile controls. Preserve user zoom and pan across design changes.

- Keep authentication page side insets and remove excessive vertical whitespace on mobile.

### Patch Changes

- Add a shared profile card for manager and personal employee information. Wrap breadcrumb actions at narrow widths and prevent responsive grids and page offsets from overflowing or adding duplicate mobile gutters.

- Restore document scrolling outside dialogs. Keep long navigation titles and input fields within their containers, use the reference page gutters, and remove nested decorative frames inside cards and dialogs. Time ranges support overnight starts and independent start/end updates without overwriting the other draft value.
- Updated dependencies
  - @s_and_a/arrow-ui@0.1.2
  - @s_and_a/arrow-ui-tokens@0.1.2
