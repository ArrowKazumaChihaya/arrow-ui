# @s_and_a/arrow-ui

## 0.1.18

### Patch Changes

- 時刻入力で空欄からBackspaceした際に前の入力へ戻れるようにし、シフトグリッドのオートフィルを縦横同時の斜め方向へ対応する。上書き対象セルもドロップ前に判別できるようにする。

## 0.1.17

### Patch Changes

- 同一領域のロード表示を1つに整理し、時刻入力の4桁確定後・Tab操作による移動順を行単位で安定させる。タッチ端末のヘッダーメニュー開閉と、横長給与明細のスマホ縮小表示も改善する。

## 0.1.16

### Patch Changes

- ヘッダーの領域切替アイコンと配置、入力表の操作列、時刻入力の自動確定、候補表示、給与明細の横長表示などを改善し、各画面の操作性と表示の一貫性を高める。

## 0.1.15

### Patch Changes

- ArAppHeader に domain-style="menu" を追加。領域（人事・労務／経費精算）の切り替えを、1段目のロゴの右のボタンから開くメニューにする（段を増やさない。畳むボタンはメニューの段の右端）。既定の "tabs" は従来どおり。remix のヘッダーを新デザインにする（1段目 60px・ロゴ 30px・右にお知らせ／やること／アカウント、2段目はアイコン付きのメニューで今いる項目は淡いテーマ色、下端にテーマ色の 3px の線）。
  スマホ幅（959px 以下）では、領域の切り替えを階層のアイコンだけのボタンにし、ロゴ・お知らせ・やること・領域・アカウントを1段に並べる。

## 0.1.13

### Patch Changes

- Add character-based input widths and field control widths; show the selected tree label without its ancestor path by default. Postal-code address lookup is automatic, with retry only after failure.
- Keep full-row actions inside horizontally scrollable tables. Allow each shift interval and its handles to move independently; cancel interrupted gestures and show chart times on keyboard focus. Choose black or white text by actual contrast.
- Add a compact split sidebar size for searchable document catalogs.
- Preserve selected images when a preview fails and prevent removal while uploads are disabled. Bound ellipsis text inside auto-sized tables while keeping the full text available in a tooltip.

## 0.1.12

### Patch Changes

- Preserve live day/month drafts while typing dates and advance to the day only when the month is complete. Improve native tree drag handles, repeated dragover performance and nested product-cell indentation.
- Support editable profile photos, feature palette tags, event colors, fixed-width status tags, configurable table action-column width and disabled wizard progression.
- Include responsive PDF canvas sizing, initial dialog focus, final-section tracking and loading-overlay focus restoration accumulated since 0.1.11.

## 0.1.11

### Patch Changes

- Stack dialogs, drawers, image previews and floating inputs in opening order so a pre-mounted child popup cannot appear behind a mobile day sheet. Preserve explicit layers, contained previews and scroll locks when closing nested overlays.

- Close a header notice/to-do list when selecting its item, returning focus to the trigger before opening a detail dialog so the floating list cannot cover it.

- Keep long floating menus inside the viewport and scroll their natural-height rows without squeezing multiline descriptions, and separate operation descriptions from disabled reasons. Add optional edit tone to menu items. Group phone page-size/detail-search controls above a full-width search field.

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
