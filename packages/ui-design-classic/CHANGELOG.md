# @s_and_a/arrow-ui-design-classic

## 0.1.2

- ArDateView 1.1: 日付表記・曜日の翻訳と、短い表記の曜日省略をサポート。

- ArTimeChart 1.1: 月別の勤務・休日・残業割増など重なる計算区分を独立した帯で表示し、全目盛りが読める横幅を確保。

- ArApprovalFlow 1.1: 承認者・履歴用のdetails slotを追加。縦/横の形でもDOM・入力・focusを保持し、狭い画面の長い段名と状態を折り返す。

- 勤怠チャートの長い分類名と横スクロール中の見出しを保持し、時間帯のキーボード操作と淡色帯の文字を改善。

- Organization charts support anchored pan/pinch gestures, async tree data, and non-overlapping mobile controls. Preserve user zoom and pan across design changes.

- Keep authentication page side insets and remove excessive vertical whitespace on mobile.

### Patch Changes

- Add a shared profile card for manager and personal employee information. Wrap breadcrumb actions at narrow widths and prevent responsive grids and page offsets from overflowing or adding duplicate mobile gutters.

- Restore document scrolling outside dialogs. Keep long navigation titles and input fields within their containers, use the reference page gutters, and remove nested decorative frames inside cards and dialogs. Time ranges support overnight starts and independent start/end updates without overwriting the other draft value.
- Updated dependencies
  - @s_and_a/arrow-ui@0.1.2
  - @s_and_a/arrow-ui-tokens@0.1.2
