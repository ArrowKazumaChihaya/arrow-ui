/**
 * ArCalendar 1.3 の契約。月の表示（マスの中身は cell slot）と、年の表示（12か月）。
 * デザインが選べる形（ArDesign.forms.ArCalendar）：
 * - firstDay："inMonth"（既定。board の月の1日だけ「10/1」と月を添える）／"always"（形によらず、前後の月の1日も「12/1」と月を添える。今の ARROW の Calendar。classic）。
 */
export interface ArCalendarProps {
  /**
   * 形。sheet＝線で区切った1枚の表（デザインシステムのカレンダー）。
   * board＝角の丸いマスを並べた形（シフト画面のカレンダー。日付は真ん中の丸、イベントは色の点と名前、cell slot はマスの下の段）。
   */
  variant?: "sheet" | "board";
  /**
   * 大きさ。mini＝小さなカレンダー（設定のシフトテンプレートの「カレンダーで確かめる」）：
   * 見出しはカレンダーの絵と title と extra slot だけ（年の選択・月／年の切り替えはない）、マスは角の丸い淡い地に日付・印（events の札）・小さな文字（events の note）、下に footer slot（凡例）。
   */
  size?: "default" | "mini";
  /** 見出しの文字（省くと「2026年11月」）。 */
  title?: string;
  /** 日ごとの状態の印（ロック中＝斜線と鍵・非公開＝目の印・注意＝赤い枠）。 */
  cellMarks?: (date: string) => ArCalendarCellMarks | undefined;
  /** 選んでいる日（"YYYY-MM-DD"）。選ばないなら null。 */
  modelValue?: string | null;
  /**
   * 締め日で区切った期間（"YYYY-MM-DD"。今の ARROW の Calendar の started_on〜ended_on）。
   * 渡すと、その期間を含む週だけを並べ、期間の外の日は前後の月と同じ扱い（灰色・印なし）にする。月の切り替えは製品が期間を渡し直す。
   */
  range?: { start: string; end: string };
  /** 表示している月（"YYYY-MM"、v-model:month）。渡さなければ選んでいる日の月（なければ今日の月）から始める。 */
  month?: string;
  /** month：月の表示（日のマス）。year：年の表示（12か月のマス）。v-model:mode。 */
  mode?: "month" | "year";
  /** 今日（"YYYY-MM-DD"）。テーマ色の丸を付ける。渡さなければ端末の今日。 */
  today?: string;
  /** 週の始まり。0＝日曜（既定）、1＝月曜。 */
  weekStart?: 0 | 1;
  /** 日曜を赤・土曜を青にする（見出しと日付）。 */
  weekendColors?: boolean;
  /** 上の見出し（年月・年の選択・月／年の切り替え）を出す。 */
  showHeader?: boolean;
  /** 年の選択の範囲（既定は今日の年の前後5年）。 */
  minYear?: number;
  maxYear?: number;
  /** 選べない日。true を返した日は押せない。 */
  disabledDate?: (date: string) => boolean;
  /** 前後の月の日（灰色）を出す。false なら空のマス。 */
  showAdjacent?: boolean;
  /** マスに出す小さな印（朝礼・不足1 など）。マスの下に寄せて並べる。ほかの中身は cell slot。 */
  events?: readonly ArCalendarEvent[];
  /** 日ごとの勤務時間・打刻時刻。狭いマスでも開始・終了を2行で省略せず表示する。値の計算・整形は利用側で行う。 */
  timeRanges?: readonly ArCalendarTimeRange[];
  /** 読み上げ用の名前（例：「シフトのカレンダー」）。 */
  label?: string;
  /** 画面の文字。 */
  labels?: {
    weekdays: readonly string[];
    month: string;
    /** 日付の末尾。英語などで不要な場合は空文字。省略時は「日」。 */
    day?: string;
    year: string;
    yearSelect: string;
    modeSwitch: string;
    /** 印の読み上げ（マスの名前のあとに付ける）。 */
    locked?: string;
    unpublished?: string;
    alert?: string;
  };
}
export interface ArCalendarEmits {
  /** 日を選んだとき（押す・Enter・Space）。 */
  "update:modelValue": [value: string];
  /** 表示する月が変わったとき（"YYYY-MM"）。 */
  "update:month": [value: string];
  /** 月／年の表示を切り替えたとき。 */
  "update:mode": [value: "month" | "year"];
  /** 日を選んだとき（modelValue と同じ）。 */
  select: [value: string];
}
/** マスに出す印。tone：event＝行事（紫・既定）、danger＝不足など、accent＝テーマ色、ok＝済み。 */
export interface ArCalendarEvent {
  date: string;
  label: string;
  tone?: "event" | "danger" | "accent" | "ok";
  /** board の点の色（イベントに登録した色）。省くと tone の色。mini は札の文字の色。 */
  color?: string;
  /** mini の札の地の色（省くと tone の色）。 */
  background?: string;
  /** mini の札の下の小さな文字（「9:00-18:00」「休み」）。 */
  note?: string;
  /** 乗せたときの説明。 */
  title?: string;
}
/** カレンダーで表示する開始・終了。24時以降や前日表記も整形済みの文字列として保持する。 */
export interface ArCalendarTimeRange {
  date: string;
  start: string;
  /** 終了を省くと出勤時刻などの単独の時刻を表示する。 */
  end?: string;
  /** 店舗名などを含む読み上げ・ツールチップ。省略時は開始〜終了、終了がなければ開始だけ。 */
  label?: string;
}
/** 日ごとの状態の印（cellMarks が返す）。 */
export interface ArCalendarCellMarks {
  /** ロック中（斜線の地と右上の鍵）。 */
  locked?: boolean;
  /** 非公開（左上に目に斜線の印）。 */
  unpublished?: boolean;
  /** 注意（人が足りないなど。赤い枠。色だけに頼らず cell slot に「不足1」などの文字を添える）。 */
  alert?: boolean;
  /** 祝日（日付を日曜と同じ赤にする。weekendColors のとき）。 */
  holiday?: boolean;
}
/** cell slot が受け取る値。 */
export interface ArCalendarCell {
  date: string;
  year: number;
  month: number;
  day: number;
  /** 0＝日曜。 */
  weekday: number;
  /** 表示している月の日か（false は前後の月）。 */
  inMonth: boolean;
  isToday: boolean;
  selected: boolean;
  disabled: boolean;
}
export type ArCalendarPart =
  | "root"
  | "header"
  | "title"
  | "extra"
  | "year"
  | "modes"
  | "mode"
  | "grid"
  | "weekday"
  | "cell"
  | "day"
  | "row"
  | "content"
  | "event"
  | "dot"
  | "times"
  | "time-range"
  | "time-start"
  | "time-end"
  | "foot"
  | "lock"
  | "unpublished"
  | "heading-icon"
  | "note"
  | "footer";
