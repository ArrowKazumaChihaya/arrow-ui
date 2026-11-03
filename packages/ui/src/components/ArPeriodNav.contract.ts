/** ArPeriodNav 1.0 の契約。期間（月・日）の切り替え：前へ・今の期間・次へ（シフト画面の「2026年10月」「10月21日 水」）。 */
export interface ArPeriodNavProps {
  /** 真ん中に出す今の期間（「2026年10月」「10月21日」）。変わると読み上げる。 */
  label: string;
  /** 文字の右の曜日の札（「水」）。日の切り替えで使う。 */
  weekday?: string;
  /** 曜日の札の色。sun＝日曜・祝日（赤）、sat＝土曜（青）。 */
  weekdayTone?: "sun" | "sat";
  /** 大きさ。md＝月の切り替え（20px・高さ40）、lg＝日の切り替え（28px・高さ42）。 */
  size?: "md" | "lg";
  /** 真ん中の文字を押せるボタンにし、右に下向きの印を出す（押すと pick。年月の選択を開くなど）。 */
  pickable?: boolean;
  /** 右端の「今日」のボタンの文字。渡したときだけ出す。 */
  todayLabel?: string;
  /** 「今日」のボタンを押せなくする（今の期間に今日が入っているとき）。 */
  todayDisabled?: boolean;
  /** テーマ色の帯の上に置く形（白い文字・枠なし。押せない前へ・次へは出さずに場所だけ空ける）。今の EmployeeChanger（社員の切り替え）。 */
  inverse?: boolean;
  /** 前へ・次へのボタンを出さない（期間を見せるだけ。今の MonthChanger の isPagenation=false・DateChanger の isChange=false）。 */
  arrows?: boolean;
  /** 前へ・次へを押せなくする。 */
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  /** 読み上げの名前。 */
  labels?: { prev: string; next: string; pick: string };
}
export interface ArPeriodNavEmits {
  /** 前の期間へ（← のボタン）。 */
  prev: [];
  /** 次の期間へ（→ のボタン）。 */
  next: [];
  /** 真ん中の文字を押した（pickable のとき）。 */
  pick: [event: MouseEvent];
  /** 「今日」を押した。 */
  today: [];
}
export type ArPeriodNavPart = "root" | "center" | "arrow" | "label" | "text" | "weekday" | "caret" | "today";
