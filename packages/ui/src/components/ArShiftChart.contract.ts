/**
 * ArShiftChart 1.0 の契約。シフトのチャート（シフト詳細の「チャート」表示・「募集人数・他店舗のチャートを表示」の読み取り専用のチャート・印刷用のチャート）。
 * 1行＝1人。バーはパターンの色（省くと灰色）、休憩は白い斜線。時刻はすべて「その日の 0:00 からの分」（翌日の 3:00 は 1620。製品の started_at・ended_at と同じ）。
 *
 * 操作（readonly でないとき）：
 * - バーのドラッグで移動、両端のつまみで開始・終了、休憩（斜線）のドラッグで移動、休憩の両端で長さ。どれも step（ドラッグの間隔）の目盛りに乗る。
 *   離すと change（その人の時間をまるごと）を出す。保存は製品がする。
 * - シフトのない行をドラッグすると add。提出（緑の点線の枠）を押すと take（枠の時間）、枠の上でドラッグすると take（ドラッグした時間）。確認は製品が出す。
 * - キーボード：バー・休憩に Tab で移り、← → で移動、Shift＋← → で終わり、Alt＋← → で始まりを1目盛りずつ。Enter・Tab で確定（change）、Escape で戻す。
 *   シフトのない行は Enter で add（提出があればその時間）。提出の枠は Enter で take。
 * - 読み上げ：バーは「名前 9:00〜18:00」、動かすと新しい時間を読み上げる。
 *
 * デザインが選べる形（ArDesign.forms.ArShiftChart）：
 * - counts："hourly"（既定。人数の行に1時間ごとの「上：シフト　下：募集」の札、不足の行）／"spans"（今の ARROW の Daily：必要人数・不足人数の横長の帯の行。classic）
 * - bar："time"（既定。バーの中に「09:00–18:00」）／"icon"（バーの真ん中に人の絵。classic）
 * - avatar："initial"（既定。頭文字の丸）／"balloon"（右向きの吹き出しの丸に人の絵。classic）
 * - axis："hour"（既定。見出しの行に「10時」「翌1時」。広いときは2時間ごと）／"number"（下の行に「9」「10」…を1時間ごと。classic）
 * - summary："status"（既定。「募集より少ない時間 4時間」と「出勤 4名　シフト合計 31時間00分」）／"count"（右に「当店舗のシフト人数 5人」。classic）
 * - legend："always"（既定）／"editing"（読み取り専用のときは出さない。classic）
 */
import type { ArIconName } from "../icons";

/** 時間帯。id は製品のデータの id（イベントでそのまま返す）。 */
export interface ArShiftChartSpan {
  /** 始まり（0:00 からの分）。 */
  start: number;
  /** 終わり（0:00 からの分。翌日は 1440 を足す）。 */
  end: number;
  /** 製品の id（shift_shift.id・shift_plan_break.id など）。 */
  id?: string | number;
}

/** ほかの店舗・部署のシフト。 */
export interface ArShiftChartOther {
  start: number;
  end: number;
  /** 店舗・部署の名前（「渋谷店」）。 */
  label: string;
}

/** 1行（1人）。 */
export interface ArShiftChartRow {
  /** 行の鍵（社員の id など）。 */
  key: string | number;
  /** 名前。 */
  name: string;
  /** 名前の下の小さな文字。省くと時間帯（「13:00〜22:00」）・「提出あり」・ほかの店舗の名前・「シフトなし」。 */
  sub?: string;
  /** 顔写真の URL（省くと頭文字・人の絵）。 */
  image?: string;
  /** 頭文字の丸の色を人ごとに分ける種（省くと key）。 */
  seed?: string | number;
  /** シフトの時間帯（1日に複数あってよい。9:00〜12:00 と 17:00〜21:00 など）。 */
  shifts?: readonly ArShiftChartSpan[];
  /** 休憩（予定の休憩）。バーの上の白い斜線。 */
  breaks?: readonly ArShiftChartSpan[];
  /** バーの色（パターンの色。#D2483F など）。省くと「パターンなし」の灰色。 */
  color?: string;
  /** パターンの名前（吹き出しと読み上げ）。 */
  pattern?: string;
  /** false で動かせない（ほかの店舗のシフト・権限・ロック）。読み取り専用の行は少し淡くなる。 */
  editable?: boolean;
  /** 勤怠（打刻）の時間帯。バーの下の黒い線。 */
  punches?: readonly ArShiftChartSpan[];
  /** 打刻が勤務中（終わりが今）のとき true。線の右端がうすくなる。 */
  punchOpen?: boolean;
  /** 提出（勤務可能）の時間帯。緑の点線の枠。シフトのない行では押すと take。 */
  available?: readonly ArShiftChartSpan[];
  /** 提出の備考（吹き出しに添える）。 */
  availableNote?: string;
  /** ほかの店舗・部署のシフト（点線の灰色の枠。classic は灰色の帯）。 */
  others?: readonly ArShiftChartOther[];
  /** 全日の休み（「有給全日」）。行いっぱいの斜線の帯に文字。 */
  leave?: string;
  /** 製品のデータ（イベントでそのまま返す。Shift・Able など）。 */
  data?: unknown;
}

/** 募集の人数（その時間帯に何人ほしいか）。 */
export interface ArShiftChartNeed {
  start: number;
  end: number;
  count: number;
}

export interface ArShiftChartProps {
  /** 行（1行＝1人）。 */
  rows: readonly ArShiftChartRow[];
  /** 表示する時間 [始まり, 終わり]（分。v-model:range）。省くとシフトに合わせる（前後1時間、6時間以上）。 */
  range?: readonly [number, number];
  /** ドラッグの間隔（分。v-model:step）。 */
  step?: number;
  /** ドラッグの間隔の選択肢（分）。 */
  stepOptions?: readonly number[];
  /** 表示する時間で選べる範囲と、ドラッグで動かせる範囲 [0:00, 翌12:00]（分）。 */
  limit?: readonly [number, number];
  /** 募集の人数。人数の行の「下：募集」と、不足の計算に使う。 */
  needs?: readonly ArShiftChartNeed[];
  /** 不足を製品が数えたもの（API の errors）。省くと needs とシフトから数える。 */
  shortages?: readonly ArShiftChartNeed[];
  /** 読み取り専用（ドラッグ・追加・提出の取り込みをしない。つまみも出さない）。 */
  readonly?: boolean;
  /** 動かせない日（ロック・権限）。true か理由の文。バーは淡くなり、案内の文に理由を出す。 */
  locked?: boolean | string;
  /** board＝シフト詳細の中（既定）、mobile＝スマホの日の詳細（名前の列が細く、横にすべらせる）、print＝印刷用（白地・影なし・行の途中で改ページしない・見出しの行を毎ページに）。 */
  variant?: "board" | "mobile" | "print";
  /** 上の操作の行（表示する時間・シフトに合わせる・ドラッグの間隔・印刷）。省くと readonly でないとき出す。 */
  toolbar?: boolean;
  /** 操作の行に「印刷」を出す（押すと print）。 */
  printable?: boolean;
  /** 人数の行（1時間ごとのシフトの人数。募集があれば下に募集）。 */
  countRow?: boolean;
  /** 不足の行（募集より少ない時間を赤で「2人」）。needs か shortages があるときだけ出る。 */
  shortRow?: boolean;
  /** 凡例（シフト・休憩・勤怠・提出・ほかの店舗）。 */
  legend?: boolean;
  /** いちばん下のまとめ（募集より少ない時間・出勤・シフト合計）。 */
  summary?: boolean;
  /** ほかの店舗・部署のシフトを出す（v-model:others）。 */
  others?: boolean;
  /** 右上に「ほかの店舗のシフトも表示」の切り替えを出す（今の ARROW の Daily の切り替え）。 */
  othersToggle?: boolean;
  /** 案内の文（省くと、動かせるときは操作の説明、ロック中は理由）。空の文字で消す。 */
  hint?: string;
  /** 印刷用の見出し（「10月21日(水) のシフトチャート」）。 */
  title?: string;
  /** 印刷用の見出しの右（店舗の名前）。 */
  subtitle?: string;
  /** 行がないときの文。 */
  emptyText?: string;
  /** 読み上げの名前（「10月21日のシフトチャート」）。 */
  label?: string;
  /** 画面の文字。 */
  labels?: Partial<ArShiftChartLabels>;
}

export interface ArShiftChartLabels {
  range: string;
  rangeFrom: string;
  rangeTo: string;
  fit: string;
  step: string;
  /** 「{m}分」 */
  stepMinutes: string;
  print: string;
  /** 「{h}時」 */
  hour: string;
  /** 「翌{h}時」 */
  nextHour: string;
  name: string;
  count: string;
  countSub: string;
  need: string;
  short: string;
  /** 「{n}人」 */
  people: string;
  /** 「{h}時台　シフト {n}人／募集 {need}人」 */
  hourTip: string;
  /** 「（{n}人不足）」 */
  shortTip: string;
  legendShift: string;
  legendBreak: string;
  legendPunch: string;
  legendAvailable: string;
  legendOther: string;
  legendShort: string;
  hint: string;
  hintLocked: string;
  readonlyHint: string;
  /** 「募集より少ない時間 {t}」 */
  shortTime: string;
  enough: string;
  /** 「出勤 {n}」 */
  members: string;
  /** 「{n}名」 */
  membersUnit: string;
  /** 「シフト合計 {t}」 */
  total: string;
  /** 「当店舗のシフト人数 {n}人」 */
  countSummary: string;
  /** 「{h}時間{mm}分」 */
  duration: string;
  /** 「{h}時間」（ちょうどのとき） */
  durationHours: string;
  noShift: string;
  availableSub: string;
  /** 「提出 {t}」 */
  available: string;
  /** 「押すと {t} でシフトに入れます」 */
  availableTip: string;
  /** 「{name}にシフトを追加」 */
  addRow: string;
  addTip: string;
  /** 「休憩 {t}」 */
  breakLabel: string;
  startHandle: string;
  endHandle: string;
  /** 「{label}での勤務　{t}」 */
  otherTip: string;
  othersOn: string;
  othersOff: string;
  /** 「勤怠（打刻） {t}」 */
  punch: string;
  working: string;
  /** キーボードの説明（読み上げ）。 */
  keys: string;
  /** 「{name} {t} に変えました」 */
  changed: string;
  bar: string;
  empty: string;
}

export interface ArShiftChartChange {
  /** 変えた行。 */
  row: ArShiftChartRow;
  /** 新しいシフトの時間帯（行の shifts と同じ順・同じ id）。 */
  shifts: ArShiftChartSpan[];
  /** 新しい休憩（行の breaks と同じ順・同じ id）。 */
  breaks: ArShiftChartSpan[];
  /** 何を動かしたか。 */
  part: "shift" | "break";
  action: "move" | "start" | "end";
  /** 動かしたシフト・休憩の番号。 */
  index: number;
  /** キーボードでの変更か。 */
  keyboard: boolean;
}

export interface ArShiftChartEmits {
  "update:range": [range: [number, number]];
  "update:step": [step: number];
  "update:others": [value: boolean];
  /** バー・休憩を動かして離したとき（変わったときだけ）。 */
  change: [payload: ArShiftChartChange];
  /** シフトのない行をドラッグして離したとき（Enter でも）。 */
  add: [payload: { row: ArShiftChartRow; span: ArShiftChartSpan }];
  /** 提出の枠を押した・枠の上でドラッグしたとき。製品は確認を出してからシフトにする。 */
  take: [payload: { row: ArShiftChartRow; span: ArShiftChartSpan; available: ArShiftChartSpan }];
  /** 操作の行の「印刷」。 */
  print: [];
}

export interface ArShiftChartSlots {
  /** 操作の行と表のあいだ（「シフト追加」のボタンなど）。 */
  actions?: () => unknown;
  /** 凡例の左（ArViewOptions の「表示内容」など）。 */
  options?: () => unknown;
  /** 名前のセルの中身を差し替える。 */
  name?: (p: { row: ArShiftChartRow }) => unknown;
}

/** 部位の名前（見た目の CSS が当てる data-part）。 */
export type ArShiftChartPart =
  | "root"
  | "print-head"
  | "toggle"
  | "toolbar"
  | "toolbar-label"
  | "toolbar-sep"
  | "actions"
  | "grid"
  | "head"
  | "head-name"
  | "axis"
  | "tick"
  | "row"
  | "name"
  | "avatar"
  | "name-text"
  | "name-main"
  | "name-sub"
  | "track"
  | "bar"
  | "bar-text"
  | "bar-icon"
  | "handle"
  | "break"
  | "break-handle"
  | "draft"
  | "available"
  | "other"
  | "punch"
  | "leave"
  | "counts"
  | "count-name"
  | "count-track"
  | "cell"
  | "span"
  | "foot-axis"
  | "legend"
  | "legend-item"
  | "swatch"
  | "hint"
  | "summary"
  | "summary-status"
  | "summary-total"
  | "empty"
  | "live";

/** ArShiftChart で使うアイコン。 */
export type ArShiftChartIcon = Extract<ArIconName, "print" | "plus" | "hand" | "alert" | "check" | "user" | "info">;
