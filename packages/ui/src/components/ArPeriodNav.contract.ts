/**
 * ArPeriodNav 1.1 の契約。期間（月・日）の切り替え：前へ・今の期間・次へ（シフト画面の「2026年10月」「10月21日 水」）。
 * 1.1：date と holidays を渡すと、曜日の札（weekday を省くと date から）と色（日曜・祝日は赤、土曜は青）を部品が決める。
 * 祝日の一覧は製品が持つ（API の national_holiday_date_array など）。
 */
/** 祝日：日付（"YYYY-MM-DD"）の配列か、日付 → 祝日の名前（「文化の日」）。 */
export type ArHolidays = readonly string[] | Readonly<Record<string, string>>;

export interface ArPeriodNavProps {
  /** 真ん中に出す今の期間（「2026年10月」「10月21日」）。変わると読み上げる。 */
  label: string;
  /** 文字の右の曜日の札（「水」）。日の切り替えで使う。 */
  weekday?: string;
  /** 曜日の札の色。sun＝日曜・祝日（赤）、sat＝土曜（青）。省くと date と holidays から決める。 */
  weekdayTone?: "sun" | "sat";
  /** 日の切り替えで、今の日（"YYYY-MM-DD"）。渡すと曜日の札（weekday を省いたとき）と色を部品が決める。 */
  date?: string;
  /** 祝日（日付の配列か、日付 → 名前）。date が祝日なら札を赤にし、名前があれば札の横に出す（「祝・文化の日」の読み上げ）。 */
  holidays?: ArHolidays;
  /** 曜日の文字（日〜土）。date から札を作るときに使う。 */
  weekdayNames?: readonly string[];
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
  /** 真ん中の文字に乗せたとき、その上に1行で出す説明（「計算期間 2026/10/21 〜 2026/11/20」など）。 */
  hint?: string;
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
export type ArPeriodNavPart = "root" | "center" | "arrow" | "label" | "text" | "weekday" | "holiday" | "caret" | "today";
