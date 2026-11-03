/** ArCalendar 1.0 の契約。月の表示（マスの中身は cell slot）と、年の表示（12か月）。 */
export interface ArCalendarProps {
  /** 選んでいる日（"YYYY-MM-DD"）。選ばないなら null。 */
  modelValue?: string | null;
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
  /** 読み上げ用の名前（例：「シフトのカレンダー」）。 */
  label?: string;
  /** 画面の文字。 */
  labels?: { weekdays: readonly string[]; month: string; year: string; yearSelect: string; modeSwitch: string };
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
  | "event";
