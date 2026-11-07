# @s_and_a/arrow-ui

## 0.1.11

### Patch Changes

- Add rich before/after slots to ArChangedValue for structured custom fields and image previews. Section navigation now keeps destination headings below the sticky mobile picker and tracks the same scroll offset.

- RemixのARROWページで固定保存バーをスマホ下部メニューの上に配置し、フロートするチャット/ページ上部ボタンが保存操作を覆わないようにする。

## 0.1.10

### Patch Changes

- 2a66110: 旧ヘッダーのリスト・段落にブラウザー既定の余白が入り、通知とナビゲーションが現行 ARROW より大きくずれる問題を修正。デザイン切替の領域を通知の右側に確保し、狭い PC 幅でも重ならないようにする。
- Reset modal body scroll when its current step or explicit scrollKey changes, so multi-step forms begin at the top of each screen.

  Keep narrow-screen modal steps in one evenly spaced row with wrapping labels.

## 0.1.9

### Patch Changes

- 14e8891: 承認フローで明示的に空文字を指定した状態文には札を描画しない。状態文を省略した場合の既定表示は維持する。
- 変更前後の値が同じ行に収まらない場合、番号を途中で分断せず値単位で折り返す。長い住所は欄内に収める。

## 0.1.8

### Patch Changes

- 7eebac0: 固定目次を本文より手前に表示し、長い節の途中で次の節が選択表示になる問題を修正する。

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
