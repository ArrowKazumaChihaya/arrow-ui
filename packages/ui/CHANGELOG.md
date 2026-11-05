# @s_and_a/arrow-ui

## 0.1.7

### Patch Changes

- ArTextarea に block を追加し、メモや経路欄を親の幅まで広げられるようにする。省略時の幅と入力イベントは維持する。

## 0.1.6

### Patch Changes

- 横スクロール表の比較表示で、読み上げ用ラベルがページ全体の幅を広げる問題を修正。

## 0.1.4

- 画面幅に応じて文字が消えるボタンでも、同じ DOM を保ちながらアイコン用の形状・読み上げ名・ツールチップを更新する。

## 0.1.3

- 旧テーマのスマホ・折りたたみヘッダーで操作ラベルがボタン外へはみ出す問題を修正。公開 ArButton の part を使い、読み上げ名を残して視覚的に隠す。

## 0.1.2

- 人物一覧の氏名・説明を省略せず折り返し、狭い配置では操作を下段へ移して件数や状態を読めるよう修正。

- 項目一覧は配置幅に応じて列数と結合を調整し、狭いカード・確認画面でもラベルと値を最後まで読めるよう修正。

- 日付表示は不正な日付から NaN や存在しない月日を表示せず、入力契約違反を明示する。

- 日時入力は狭いフォームで日付と時刻を折り返し、通知等のスマホ画面で時・分が見切れないよう修正。

- ArDateRange 1.2: 両端の日付へ入力規則と翻訳を渡し、単独日付からの移行時も未入力・不正日付・更新タイミングを保持。

- ArApprovalFlow 1.2: 承認者不足の停滞を blocked として扱い、否認と区別する警告表示を両テーマに追加。

- ArDateView 1.1: 日付表記・曜日の翻訳と、短い表記の曜日省略をサポート。

- ArTimeChart 1.1: 月別の勤務・休日・残業割増など重なる計算区分を独立した帯で表示し、全目盛りが読める横幅を確保。

- ArApprovalFlow 1.1: 承認者・履歴用の details slot を追加。縦/横の形でも DOM・入力・focus を保持し、狭い画面の長い段名と状態を折り返す。

- 長時間の勤怠チャートは目盛りに必要な幅を確保し、最初と最後の時刻が見切れないよう修正。

- 勤怠チャートの長い分類名と横スクロール中の見出しを保持し、時間帯のキーボード操作と淡色帯の文字を改善。

- Keep keyboard focus inside the PDF preview when switching to a design that hides the focused zoom control, without losing page or zoom state.

- Show full department/store names and long codes in organization chart cards by wrapping text.

- Organization charts support anchored pan/pinch gestures, async tree data, and non-overlapping mobile controls. Preserve user zoom and pan across design changes.

- OTP digits shrink to fit narrow forms and forward field required/help/label attributes to native controls.

- Keep the OTP draft and corresponding digit focus when switching between classic single-field and remix split-field designs.

### Patch Changes

- Add a shared profile card for manager and personal employee information. Wrap breadcrumb actions at narrow widths and prevent responsive grids and page offsets from overflowing or adding duplicate mobile gutters.

- Restore document scrolling outside dialogs. Keep long navigation titles and input fields within their containers, use the reference page gutters, and remove nested decorative frames inside cards and dialogs. Time ranges support overnight starts and independent start/end updates without overwriting the other draft value.
  - @s_and_a/arrow-ui-tokens@0.1.2
