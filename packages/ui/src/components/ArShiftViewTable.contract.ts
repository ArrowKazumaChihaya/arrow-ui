/**
 * ArShiftViewTable 1.0 の契約。シフトの閲覧タブの表（人×日）。
 * 1日に複数のシフトの札を早い時刻から縦に並べ、札の2行目に店舗名を出す（全店舗の表示：API の is_all_branches）。
 * まわりに、凡例（この店舗／ほかの店舗・部署／有給／パターンの色）・今日の列（テーマ色の丸と淡い地）・日ごとの人数と時間の合計の行・
 * 名前の列と見出しの固定・従業員の検索（多い店舗）・列の幅（−／＋）・週／半月／月の切り替え・今日の勤怠の印（勤務中／未打刻）を持つ。
 * 部品はデータを並べるだけで、API は呼ばない。期間の切り替えなどは update:* で知らせ、データは製品が渡し直す。
 *
 * デザインが選べる形（ArDesign.forms.ArShiftViewTable）：
 * - chip："card"（既定。1行目に時刻の太字、2行目に店舗名。この店舗はパターンの色の淡い地と左の線、ほかの店舗は点線の白）／
 *   "labeled"（今の ARROW の閲覧タブ：灰色の札の右上に小さく店舗名、「シフト」の小見出し、時刻を1行ずつ）。
 * - time："short"（既定。「9:00–18:00」）／"padded"（「09:00〜18:00」。今の ARROW の time フィルター）。
 * - dayHead："stack"（既定。日の数字の下に曜日）／"inline"（「16 (金)」の1行。今の ARROW）。
 * - summary："hours"（既定。名前の下に「104時間・14日（他2）」）／"days"（「勤務 14日」。今の ARROW）。
 * - fill："stretch"（既定。日の列は columnWidth を最小にして表の幅いっぱいに広げる）／"fixed"（日の列は columnWidth ちょうど。今の ARROW の 136px）。
 * - columnWidth：日の列の幅の既定（remix 120・classic 136）。
 * - nameWidth：名前の列の幅の既定（remix は md 188・sm 132、classic 136）。
 */
import type { ArSegmentedOption } from "./ArSegmented.contract";

export type ArShiftViewKey = string | number;

/** 1つの時間帯（分。0＝0:00。負の数は前日、1440 以上は翌日にまたがる時刻）。製品の shift_shift の started_at・ended_at。 */
export interface ArShiftViewTime {
  start: number;
  end: number;
}

/** 表の1行（従業員）。 */
export interface ArShiftViewRow {
  /** 行を見分ける値（employee_id）。シフトの rowKey と同じ値。 */
  key: ArShiftViewKey;
  /** 名前。 */
  name: string;
  /** 名前の下の小さな文字。省くと表示中の期間のシフトから作る（remix「104時間・14日（他2）」・classic「勤務 14日」）。空の文字なら出さない。 */
  sub?: string;
  /** 頭文字の丸。false で出さない。文字を渡すとその文字（省くと名前の1文字目）。 */
  avatar?: boolean | string;
  /** 頭文字の丸の色を人ごとに選ぶ元（社員の番号など）。省くと key。 */
  avatarSeed?: string | number;
  /** 今日の勤怠の印（名前の前の丸）。working＝勤務中（緑の点）、absent＝まだ打刻がない（白抜き）。省くと出さない。データは製品が渡す。 */
  live?: "working" | "absent";
  /** 従業員の検索で名前のほかに当てる文字（かな・社員番号など）。 */
  keywords?: string;
}

/** 1つのシフト（札）。製品の ShiftViewShift を写したもの。 */
export interface ArShiftViewShift {
  /** シフトを見分ける値（shift.id）。 */
  id: ArShiftViewKey;
  /** どの行のシフトか（employee_id）。 */
  rowKey: ArShiftViewKey;
  /** 日付（yyyy-MM-dd）。 */
  date: string;
  /** 時間帯（shift_shift）。1つのシフトに複数あれば1行ずつ出す。 */
  times?: readonly ArShiftViewTime[];
  /** 店舗（branch_id）。ownBranchIds に入っていればこの店舗、入っていなければほかの店舗・部署の札。 */
  branchId?: ArShiftViewKey;
  /** 札の2行目の店舗名。省くと branches から branchId で引く。 */
  branchName?: string;
  /** shift＝シフト（既定）、leave＝有給などの休み（灰色の斜線。文字は text か labels.leave）。 */
  kind?: "shift" | "leave";
  /** 札の1行目の文字を差し替える（「有給」「研修」など）。省くと時刻。 */
  text?: string;
  /** パターンの色（#RRGGBB）。この店舗の札の地（11%）・左の線・文字の色になる。省くとパターンなしの灰色。 */
  color?: string;
  /** 合計に足す実働の分（休憩を引いた分）。省くと時間帯の長さの合計。 */
  minutes?: number;
  /** 札にかざしたときの説明。省くと「店舗名　9:00〜18:00」。 */
  tip?: string;
}

/** 店舗・部署（branches）。 */
export interface ArShiftViewBranch {
  id: ArShiftViewKey;
  name: string;
}

/** 日ごとの合計（製品の ShiftViewDaySummary：summarizeShiftViewDays の値をそのまま渡せる）。 */
export interface ArShiftViewDayTotal {
  /** 出勤する人数。 */
  workers: number;
  /** 予定の時間（分）。 */
  minutes: number;
}

/** 凡例の1つ。 */
export interface ArShiftViewLegendItem {
  /** own＝この店舗（淡い地と左の線）、other＝ほかの店舗・部署（点線）、leave＝有給（斜線）、pattern＝パターンの色（color の四角）。 */
  kind: "own" | "other" | "leave" | "pattern";
  label: string;
  /** own・pattern の色。省くとテーマ色。 */
  color?: string;
}

/** 名前の下の文字を作るときの材料（表示中の期間）。 */
export interface ArShiftViewRowSummary {
  /** 予定の時間（分）。 */
  minutes: number;
  /** 勤務する日数（同じ日に2つの店舗で働いても1日。今の ARROW の「勤務 n日」）。 */
  days: number;
  /** この店舗で勤務する日数。 */
  ownDays: number;
  /** ほかの店舗・部署で勤務する日数（キャンバスの「14日（他2）」は ownDays＋others を日数に、others を括弧に出す）。 */
  others: number;
}

export interface ArShiftViewTableLabels {
  /** 名前の列の見出し。 */
  employee: string;
  /** 合計の行の見出し。 */
  totals: string;
  /** 合計の行の人数（「4人」）。 */
  workers: (n: number) => string;
  /** 合計の行の時間（「32時間」）。 */
  hours: (minutes: number) => string;
  /** 名前の下の文字（summary="hours"）。 */
  summaryHours: (s: ArShiftViewRowSummary) => string;
  /** 名前の下の文字（summary="days"）。 */
  summaryDays: (s: ArShiftViewRowSummary) => string;
  /** 曜日（日曜から）。 */
  weekdays: readonly string[];
  /** 札の小見出し（chip="labeled"）。 */
  shift: string;
  /** 有給の札の文字。 */
  leave: string;
  /** 前日の時刻の頭（「前日」）。 */
  prevDay: string;
  /** 凡例：この店舗（{name} は店舗名）。 */
  legendOwn: (name: string) => string;
  /** 凡例：ほかの店舗・部署。 */
  legendOther: string;
  /** 凡例：有給。 */
  legendLeave: string;
  /** 検索の欄の文字と読み上げ。 */
  search: string;
  /** 列の幅のまとまりの読み上げ。 */
  zoom: string;
  zoomIn: string;
  zoomOut: string;
  /** 期間の切り替えの読み上げ。 */
  period: string;
  /** 勤怠の印の読み上げ。 */
  working: string;
  absent: string;
  /** 今日の列の読み上げ。 */
  today: string;
  /** シフトがないとき。 */
  empty: string;
  emptyDescription: string;
  /** 検索に当てはまる人がいないとき（{q} は検索の文字）。 */
  noMatch: (q: string) => string;
}

export interface ArShiftViewTableProps {
  /** 表示する日（yyyy-MM-dd の並び）。製品の useShiftViewDates の値。 */
  dates: readonly string[];
  /** 行（従業員）。並びはこの順（製品が kana の順に並べて渡す）。 */
  rows: readonly ArShiftViewRow[];
  /** シフト。1つのマスに複数あれば早い時刻から縦に並べる（時刻のないものは後ろ）。 */
  shifts: readonly ArShiftViewShift[];
  /** 店舗・部署（branchId から名前を引く）。 */
  branches?: readonly ArShiftViewBranch[];
  /** 「この店舗」として扱う店舗。省くとすべてのシフトをこの店舗の札で出す。 */
  ownBranchIds?: readonly ArShiftViewKey[];
  /** 今日（yyyy-MM-dd）。その列の日付にテーマ色の丸と下線、マスにごく淡い地。 */
  today?: string;
  /** 祝日（yyyy-MM-dd）。日曜と同じ赤にする。 */
  holidays?: readonly string[];
  /** 日ごとの合計。省くとシフトから数える（人数＝その日にシフトがある人、時間＝minutes か時間帯の長さ）。 */
  totals?: Readonly<Record<string, ArShiftViewDayTotal>>;
  /** いちばん下に日ごとの出勤人数と予定時間の行を出す。 */
  showTotals?: boolean;
  /** 凡例。true＝シフトから作る（この店舗・ほかの店舗・有給のうち表にあるもの＋patterns）、false＝出さない、配列＝そのまま出す。 */
  legend?: boolean | readonly ArShiftViewLegendItem[];
  /** 凡例に足すパターンの色（「通常勤務1」など）。 */
  patterns?: readonly { label: string; color: string }[];
  /** 表の上の左の説明（「すべての店舗・部署のシフトを表示しています」）。省くと出さない。 */
  note?: string;
  /** 従業員の検索の欄。true＝いつも、数＝行がその数以上のときだけ（多い店舗：30）、false＝出さない。 */
  search?: boolean | number;
  /** 検索の文字（v-model:query）。部品が名前（と keywords）で行を絞る。 */
  query?: string;
  /** 列の幅の −／＋ を出す。 */
  zoom?: boolean;
  /** 日の列の幅（px。v-model:columnWidth）。省くとデザインの既定（remix 120・classic 136）。 */
  columnWidth?: number;
  /** 列の幅の下限・上限・刻み。 */
  minColumnWidth?: number;
  maxColumnWidth?: number;
  columnStep?: number;
  /** 期間の切り替え（週・半月・月）の今の値（v-model:period）。periodOptions を渡したときだけ出す。 */
  period?: string;
  periodOptions?: readonly ArSegmentedOption[];
  /** 表の高さの上限（px か CSS の長さ）。越えると表の中でスクロールし、見出しと名前の列は止まる。 */
  maxHeight?: number | string;
  /** 大きさ。md＝PC、sm＝スマホのカード（名前の列が細く、頭文字の丸なし、操作が縦に並ぶ）、auto＝部品の幅が 600px 未満なら sm。 */
  size?: "auto" | "md" | "sm";
  /** 名前の列の幅（px）。省くと md 188・sm 132（classic は 136）。 */
  nameWidth?: number;
  /** 日付の見出しと札を押せるようにする（day-click・shift-click）。 */
  clickable?: boolean;
  /** 表の上の操作の段を出す。false にすると表・合計・凡例だけ。 */
  toolbar?: boolean;
  /** 読み上げの名前（表の caption）。 */
  label?: string;
  labels?: Partial<ArShiftViewTableLabels>;
}

export interface ArShiftViewTableEmits {
  "update:query": [query: string];
  "update:columnWidth": [width: number];
  "update:period": [period: string];
  /** 日付の見出しを押した（clickable のとき。日の詳細を開くなど）。 */
  "day-click": [date: string];
  /** 札を押した（clickable のとき）。 */
  "shift-click": [shift: ArShiftViewShift, row: ArShiftViewRow];
}

/**
 * slot：chip（{ shift, row, date, branch, time }：札の中身を差し替える）、name（{ row, sub }：名前のセルの中身）、
 * toolbar（操作の段の右端に足す）、legend（凡例の後ろに足す）、empty（行がないときの中身）。
 */
export type ArShiftViewTablePart =
  | "root"
  | "toolbar"
  | "note"
  | "search"
  | "search-icon"
  | "search-input"
  | "zoom"
  | "zoom-button"
  | "zoom-value"
  | "scroll"
  | "table"
  | "caption"
  | "corner"
  | "col-name"
  | "day"
  | "day-label"
  | "day-num"
  | "weekday"
  | "name"
  | "name-box"
  | "live"
  | "avatar"
  | "name-text"
  | "name-label"
  | "name-sub"
  | "cell"
  | "chip"
  | "chip-branch"
  | "chip-subject"
  | "chip-time"
  | "foot-label"
  | "foot"
  | "foot-workers"
  | "foot-hours"
  | "empty"
  | "legend"
  | "legend-item"
  | "swatch";
