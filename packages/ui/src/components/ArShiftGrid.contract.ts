/**
 * ArShiftGrid 1.0 の契約。シフトのテーブル（日×人の格子）。シフトのテーブルタブの週・半月・月の表。
 * 1行＝1人、1列＝1日。マス（パターン色の淡い面と左の線）とチャート（6時〜24時の帯）の2つの表示を持つ。
 * 部品はデータを書き換えない。選ぶ・コピー・貼り付け・削除・元に戻す・ドラッグでの移動や伸縮は、すべてイベントで知らせる（保存は製品がする）。
 * 時刻は 0:00 からの分（翌日の 3:00 は 1620、前日の 23:00 は -60）。今の ARROW の shift_shift・shift_break の started_at／ended_at と同じ。
 *
 * デザインが選べる形（ArDesign.forms.ArShiftGrid）：
 * - head："date"（既定。1段目に「名前」と日付、2段目に鍵・目の印）／"button"（今の ARROW：1段目は日付だけ、2段目に「名前」と日ごとのシフトチャートのボタン）。
 * - fit："scroll"（既定。はみ出したら横に動かす）／"scale"（今の ARROW の週・月：表を枠の幅まで縮める。半月と、列の幅を変えたときは横に動かす）。
 * - cell："tint"（既定。パターン色の淡い面と左の線・角丸のマス）／"fill"（今の ARROW：マスをパターン色で塗り、列が広いとパターン名・シフト・休憩・勤怠の文字）。
 * - tip："line"（既定。「シフト　09:00〜18:00」の1行ずつ）／"section"（今の ARROW：見出しの行の下に時刻の行）。
 * - summary："dots"（既定。「184時間・23日勤務・8日休み」）／"paren"（今の ARROW：「184時間0分 23日勤務（8日休み）」）。
 * - hint："kbd"（既定。表の下に「コピー ⌘C」の札）／"text"（今の ARROW：「コピー: ⌘+C」の文字）。
 */
export type ArShiftGridKey = string | number;

/** 時間帯（0:00 からの分）。 */
export interface ArShiftGridTime {
  start: number;
  end: number;
}

/** シフトのパターン（色と名前。表の左の一覧にも出す）。 */
export interface ArShiftGridPattern {
  key: ArShiftGridKey;
  /** 名前（「通常勤務1」「早番」）。 */
  name: string;
  /** 色（#4C5FC4 など）。 */
  color: string;
  /** シフトの時間帯（一覧に「09:00〜18:00」と出す。マスへ置いたときの時間は製品が決める）。 */
  times?: readonly ArShiftGridTime[];
  /** 休憩（一覧の吹き出しに出す）。 */
  breaks?: readonly ArShiftGridTime[];
}

/** 1人の1日のマスの中身。 */
export interface ArShiftGridCell {
  /** シフトの id（製品が持つ。イベントにそのまま返す）。 */
  id?: ArShiftGridKey;
  /** シフトの時間帯。1日に2つあれば2つ（マスでは1行に1つずつ、チャートでは2本の帯）。 */
  times?: readonly ArShiftGridTime[];
  /** 休憩（チャートの帯の斜線・吹き出し）。 */
  breaks?: readonly ArShiftGridTime[];
  /** 打刻（勤怠）。吹き出しと、classic の広い列の文字に出す。 */
  punches?: readonly ArShiftGridTime[];
  /** 当てはまるパターンの key（色と名前）。無いとパターンなし（remix は点線の白いマス、classic は灰色）。 */
  pattern?: ArShiftGridKey | null;
  /** 有給。true＝全日。時間で取ったときは time を渡す。 */
  leave?: boolean | { label?: string; time?: ArShiftGridTime };
  /** 提出（勤務可能）。シフトがない日に緑の点線の「希望」で出し、押すと avail イベント。 */
  avail?: { times: readonly ArShiftGridTime[]; note?: string } | null;
  /** このマスは変えられない（権限など）。ロックの日は ArShiftGridDay.locked。 */
  readonly?: boolean;
  /** 吹き出しの文字を自分で作る（改行は \n）。 */
  tip?: string;
}

/** 1人（1行）。 */
export interface ArShiftGridMember {
  key: ArShiftGridKey;
  name: string;
  /** 社員コード（show.code のとき名前の上に小さく）。 */
  code?: string;
  /** 写真の URL（show.avatar のとき。無ければ頭文字の丸）。 */
  avatar?: string;
  /** 頭文字（省くと名前の1文字目）。 */
  initial?: string;
  /** 頭文字の丸の色 [地, 文字]。省くと順番に5色。 */
  avatarTone?: readonly [string, string];
  /** 表示している期間の勤務時間（分）。show.hours のとき。 */
  minutes?: number;
  /** 勤務日数。show.days のとき。 */
  workDays?: number;
  /** 休み日数。show.off のとき。 */
  offDays?: number;
  /** 名前の下の文字を自分で作る（minutes などより優先）。 */
  summary?: string;
}

/** 1日（1列）。 */
export interface ArShiftGridDay {
  /** 日付（YYYY-MM-DD）。 */
  date: string;
  /** 曜日（0＝日〜6＝土）。省くと date から。 */
  weekday?: number;
  /** 祝日（日付を赤に）。 */
  holiday?: boolean;
  /** 勤怠ロック中（見出しに鍵、マスは斜線。マスは変えられない）。 */
  locked?: boolean;
  /** 非公開（見出しに目の印、日付を薄く）。 */
  unpublished?: boolean;
  /** 表示している月の外（今の ARROW の週の表示で月をまたぐ日）。マスは灰色で押せない（押すと day-outside）。 */
  outside?: boolean;
  /** イベント（見出しの下の行：色の点と名前）。 */
  events?: readonly { name: string; color?: string; time?: string }[];
  /** シフトの人数（省くとマスから数える）。 */
  count?: number;
  /** 募集人数。 */
  need?: number;
  /** 募集に対して足りない人数（省くと need − count。0 なら「—」）。 */
  shortage?: number;
}

/** 表に出すもの（ArViewOptions の「表示内容」と同じ項目）。 */
export interface ArShiftGridShow {
  /** サムネ（頭文字の丸・写真）。 */
  avatar: boolean;
  /** 社員コード。 */
  code: boolean;
  /** 勤務時間。 */
  hours: boolean;
  /** 勤務日数。 */
  days: boolean;
  /** 休み日数。 */
  off: boolean;
  /** 下の行：シフト人数。 */
  count: boolean;
  /** 下の行：募集に対して不足。 */
  shortage: boolean;
  /** 見出しの下の行：イベント。 */
  events: boolean;
  /** ロック中（見出しの鍵・マスの斜線）。 */
  locked: boolean;
  /** 非公開（見出しの目の印）。 */
  unpublished: boolean;
  /** 有給のマス。 */
  leave: boolean;
  /** 勤務可能な人（提出）。 */
  avail: boolean;
  /** 表の下のショートカットキー・チャートの操作の案内。 */
  hints: boolean;
}

/** 選んだ範囲（行・列の番号は表示している順。members・dates はその範囲の人と日）。 */
export interface ArShiftGridRange {
  r0: number;
  r1: number;
  c0: number;
  c1: number;
  members: ArShiftGridKey[];
  dates: string[];
}

/** 1つのマスの場所。 */
export interface ArShiftGridSpot {
  member: ArShiftGridKey;
  date: string;
  /** 表示している順の行・列の番号。 */
  row: number;
  col: number;
}

export interface ArShiftGridZoom {
  min: number;
  max: number;
  step: number;
}

export interface ArShiftGridProps {
  /** 人（行）。並びはこの順。 */
  members: readonly ArShiftGridMember[];
  /** 日（列）。週は7日、半月は15日前後、月は28〜31日。 */
  days: readonly ArShiftGridDay[];
  /** マスの中身。cells[人の key][日付]。今の ARROW の shift_list[employee_id][date] と同じ形。 */
  cells: Readonly<Record<string, Readonly<Record<string, ArShiftGridCell | undefined>> | undefined>>;
  /** パターン（マスの色と名前、左の一覧）。 */
  patterns?: readonly ArShiftGridPattern[];
  /** 表示（v-model:mode）。cell＝マス、chart＝チャート（週の表示で、6時〜24時の帯）。 */
  mode?: "cell" | "chart";
  /** 列の幅（v-model:column-width。px）。null は枠の幅に合わせる。マスとチャートで別の範囲（zoom）。 */
  columnWidth?: number | null;
  /** 列の幅の範囲と −／＋ の幅。既定はマス 28〜140（8ずつ）、チャート 80〜280（20ずつ）。 */
  zoom?: { cell?: Partial<ArShiftGridZoom>; chart?: Partial<ArShiftGridZoom> };
  /** 今日（YYYY-MM-DD）。見出しにテーマ色の丸と下の2pxの線、列はごく淡いテーマ色。 */
  today?: string;
  /** 表に出すもの。 */
  show?: Partial<ArShiftGridShow>;
  /** 変えられる（選ぶ・コピー・貼り付け・ドラッグ）。false は見るだけ（吹き出しと見出しの日付は押せる）。 */
  editable?: boolean;
  /** チャートの帯の範囲（分）。既定は [360, 1440]（6時〜24時）。 */
  chartRange?: readonly [number, number];
  /** チャートのドラッグのきざみ（分）。既定 15。 */
  snap?: number;
  /** 左のパターンの一覧（検索つき）を出す。省くと patterns があれば出す。 */
  patternPanel?: boolean;
  /** 一覧の上の「パターンを編集」を出す（押すと pattern-edit）。 */
  patternEdit?: boolean;
  /** 表の上に列の幅（−／＋）とマス／チャートの切り替えを出す。製品の帯に置くときは false にして、zoomIn などを使う。 */
  controls?: boolean;
  /** マスを右クリックしたときの操作の一覧（追加・編集・コピー・切り取り・貼り付け・削除）。 */
  contextMenu?: boolean;
  /** 表の高さの上限（"640px" など。はみ出すと縦に動き、見出しは上に固定）。 */
  maxHeight?: string;
  /** はみ出したときの扱い。省くとデザインの形（forms.ArShiftGrid.fit）。 */
  fit?: "scroll" | "scale";
  /** スマホの表示（名前の列を細く、パターンの一覧は横に並べる、案内は出さない）。 */
  compact?: boolean;
  /** ショートカットキーの表記。省くと端末から（Mac は ⌘、ほかは Ctrl）。 */
  platform?: "mac" | "windows";
  /** 読み上げ用の名前。 */
  label?: string;
  /** 画面の文字。 */
  labels?: Partial<ArShiftGridLabels>;
}

export interface ArShiftGridLabels {
  name: string;
  events: string;
  count: string;
  shortage: string;
  /** {n} 人。 */
  countCell: string;
  /** 不足{n}。 */
  shortageCell: string;
  /** 募集 {need}名に対して {count}名 */
  shortageTip: string;
  none: string;
  locked: string;
  unpublished: string;
  leave: string;
  leaveAll: string;
  avail: string;
  availShort: string;
  /** 希望 {t} */
  availWide: string;
  availHint: string;
  shift: string;
  break: string;
  punch: string;
  noShift: string;
  noPattern: string;
  weekdays: readonly string[];
  /** {m}月{d}日 */
  date: string;
  /** {m}月{d}日の勤務メンバーを見る */
  dayOpen: string;
  dayChart: string;
  /** 勤務時間の書き方。{h} 時間・{m} 分（0 分は省く）。 */
  hours: string;
  hoursMin: string;
  workDays: string;
  offDays: string;
  shortcutTitle: string;
  copy: string;
  cut: string;
  paste: string;
  undo: string;
  redo: string;
  delete: string;
  selectHint: string;
  /** {n}マスを選択中 */
  selected: string;
  chartTitle: string;
  chartHints: readonly string[];
  patternSearch: string;
  patternEdit: string;
  /** 「{q}」に合うパターンはありません */
  patternNone: string;
  patternHint: string;
  patternDrag: string;
  zoom: string;
  zoomOut: string;
  zoomIn: string;
  modeLabel: string;
  modeCell: string;
  modeChart: string;
  add: string;
  edit: string;
  reorder: string;
  /** 開始時刻を変える */
  resizeStart: string;
  resizeEnd: string;
}

export interface ArShiftGridEmits {
  "update:mode": [mode: "cell" | "chart"];
  "update:columnWidth": [width: number | null];
  /** 選んだ範囲が変わった（null は選んでいない）。 */
  select: [range: ArShiftGridRange | null];
  /** ⌘C／Ctrl+C。範囲を覚え、点線の枠で示す。 */
  copy: [range: ArShiftGridRange];
  /** ⌘X／Ctrl+X。貼り付けたときに元を消す（cut の範囲は paste の source）。 */
  cut: [range: ArShiftGridRange];
  /** ⌘V／Ctrl+V。source をコピー（mode=copy）または切り取り（mode=cut）した範囲、target は貼る先（左上から source と同じ大きさ。選んだ範囲が広ければ繰り返す）。 */
  paste: [payload: { mode: "copy" | "cut"; source: ArShiftGridRange; target: ArShiftGridRange }];
  /** Delete／Backspace。 */
  delete: [range: ArShiftGridRange];
  /** ⌘Z／Ctrl+Z。 */
  undo: [];
  /** ⌘⇧Z／Ctrl+Shift+Z。 */
  redo: [];
  /** 選んだ範囲の右下の印をドラッグした（オートフィル）。source を target へ繰り返して広げる。 */
  autofill: [payload: { source: ArShiftGridRange; target: ArShiftGridRange }];
  /** マスを開く（ダブルクリック・Enter・右クリックの「追加」「編集」）。cell が無ければ追加。 */
  open: [spot: ArShiftGridSpot & { cell?: ArShiftGridCell }];
  /** パターンをマスへ置いた（一覧からドラッグ、または一覧で Enter：選んでいるマスすべて）。 */
  "pattern-drop": [payload: { pattern: ArShiftGridPattern; targets: ArShiftGridSpot[] }];
  /** 「パターンを編集」。 */
  "pattern-edit": [];
  /** 提出（希望）を押した。製品は「提出をシフトにしますか？」の確認を出す。 */
  avail: [payload: ArShiftGridSpot & { avail: NonNullable<ArShiftGridCell["avail"]> }];
  /** 見出しの日付を押した（その日の勤務メンバー）。 */
  "day-open": [day: ArShiftGridDay];
  /** 見出しのシフトチャートのボタン（forms.head="button"）。 */
  "day-chart": [day: ArShiftGridDay];
  /** 表示している月の外のマスを押した（今の ARROW はその週へ移る）。 */
  "day-outside": [day: ArShiftGridDay];
  /** チャート：帯をほかの人・ほかの日へ移した。 */
  "chart-move": [payload: { from: ArShiftGridSpot; to: ArShiftGridSpot; cell: ArShiftGridCell }];
  /** チャート：帯を動かした・両端で伸び縮みさせた（times・breaks は新しい時間）。 */
  "chart-change": [payload: ArShiftGridSpot & { cell: ArShiftGridCell; times: ArShiftGridTime[]; breaks: ArShiftGridTime[] }];
  /** チャート：空いたマスをドラッグして追加した。 */
  "chart-create": [payload: ArShiftGridSpot & { time: ArShiftGridTime }];
  /** できなかった操作（ロック中の日・すでにシフトがある・変えられないマス）。製品が知らせる。 */
  refuse: [payload: { reason: "locked" | "occupied" | "readonly"; spot: ArShiftGridSpot }];
  /** 名前の列の ⠿ をドラッグして並べ替えた（keys は新しい順）。 */
  reorder: [payload: { from: number; to: number; keys: ArShiftGridKey[] }];
}

export type ArShiftGridPart =
  | "root"
  | "toolbar"
  | "zoom"
  | "zoom-out"
  | "zoom-value"
  | "zoom-in"
  | "layout"
  | "patterns"
  | "pattern-edit"
  | "pattern-search"
  | "pattern"
  | "pattern-swatch"
  | "pattern-name"
  | "pattern-time"
  | "pattern-none"
  | "pattern-hint"
  | "main"
  | "viewport"
  | "scaler"
  | "grid"
  | "head-date"
  | "head-sub"
  | "head-event"
  | "name-head"
  | "date"
  | "date-num"
  | "date-week"
  | "date-icons"
  | "status"
  | "axis"
  | "chart-button"
  | "event"
  | "event-dot"
  | "name"
  | "grip"
  | "avatar"
  | "member"
  | "code"
  | "member-name"
  | "summary"
  | "cell"
  | "shift"
  | "line"
  | "detail"
  | "detail-label"
  | "avail"
  | "track"
  | "bar-track"
  | "bar"
  | "break"
  | "handle"
  | "avail-bar"
  | "bar-label"
  | "fill-handle"
  | "foot"
  | "foot-name"
  | "foot-cell"
  | "hints"
  | "hint-title"
  | "hint"
  | "kbd"
  | "hint-status"
  | "tip"
  | "tip-row"
  | "tip-label"
  | "tip-value"
  | "menu"
  | "menu-item";
