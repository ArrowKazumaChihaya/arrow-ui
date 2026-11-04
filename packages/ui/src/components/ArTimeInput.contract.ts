/** ArTimeInput 1.1 の契約。 */
export interface ArTimeValue {
  /** "HH:mm"。未入力は null。overnight のときは 24:00 以降（例 "29:00"）もある。 */
  time: string | null;
  /** same：当日、prev：前日。前日の切り替えを出さない時刻では常に same。 */
  day: "same" | "prev";
}
export interface ArTimeInputLabels {
  /** 前日の切り替えの文字（button の形）。 */
  same: string;
  prev: string;
  /** 前日の切り替えの短い文字（link の形。今の ARROW の「当」「前」）。省くと same・prev の頭の1文字。 */
  sameShort?: string;
  prevShort?: string;
  /** 切り替えの説明（読み上げ・title）。 */
  toggleHint: string;
  /** 時・分の箱の読み上げの名前（split の形・select のとき）。 */
  hour?: string;
  minute?: string;
}
/**
 * ArTimeInput 1.0 の契約。
 *
 * デザインが選ぶ形（ArDesign.forms.ArTimeInput）。値の受け渡し（v-model・commit・invalid）はどの形でも同じ。
 * - `fields`：`"single"`（既定）＝「09:30」を1つの箱に打つ。`"split"`＝時と分が別々の箱（今の ARROW：27×30 の箱が2つと「:」）。
 *   split では、時を2桁（または十の位に来ない数）打つと分へ、分を打ち終えると次の時刻の入力へ移る。
 *   空の分で Backspace・箱の端で ←→ を押すと隣の箱へ。時が「00」のときは時の箱を空で見せる（今の ARROW と同じ）。
 * - `dayToggle`：`"button"`（既定）＝枠と一体の［当日］［前日］のボタン。`"link"`＝左に1文字の文字のリンク（「当」「前」）。
 */
export interface ArTimeInputProps {
  modelValue: ArTimeValue;
  /** 前日をまたぐ切り替え（［当日⇄前日］）を出す（出勤・退勤・休始・休終）。シフトの開始・終了は false。今の ARROW の isYesterday。 */
  dayShift?: boolean;
  /** 24:00 以降（47:59 まで）を受ける。夜勤のシフトの終わり（22:00〜29:00）など。 */
  overnight?: boolean;
  /** ↑↓キーで動かす分。 */
  step?: 1 | 5 | 10 | 15 | 30;
  /**
   * 時と分をプルダウンで選ぶ（今の ARROW の isSelect。日時の入力で使う）。どのデザインでも時と分の2つのプルダウンと「:」になる。
   * 先頭に「未選択」（値を消す）が付く。
   */
  select?: boolean;
  /** select のときの分の刻み（今の ARROW の minuteUnit）。 */
  minuteStep?: number;
  /** 大きさの段。`sm`＝設定など密集した所、`md`＝ふつう（既定）、`lg`＝年末調整・スマホなど大きく押しやすくしたい所。同じ段なら入力・セレクト・時刻・日付・ボタンの高さがそろう（新しい見た目 30／36／42・角丸 9／10／11、今の見た目 antd の 24／32／40）。sm は表の中・範囲、lg はスマホのシートにも。select の形では時と分のプルダウンも同じ段になる。 */
  size?: "sm" | "md" | "lg";
  /** 親の幅いっぱい（時間の表の列など）。fields が single のときだけ効く。 */
  block?: boolean;
  /** 入力の代わりに出す説明の文字（点線の枠。例：「打刻と同じ」）。渡している間は入力できない。 */
  note?: string;
  /** 外から渡す間違いの状態（例：終了が開始より前）。 */
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** 読み上げ用の名前（例：「1行目の出勤」）。ArField の中なら id で結ぶので不要。 */
  label?: string;
  id?: string;
  labels?: ArTimeInputLabels;
}
export interface ArTimeInputEmits {
  /** 確定したとき（Enter・箱からフォーカスが外れた・切り替えを押した・プルダウンで選んだ）だけ出す。入力中には出さない。 */
  "update:modelValue": [value: ArTimeValue];
  commit: [value: ArTimeValue];
  /** 読めない文字で確定しようとした。値は変えない。 */
  invalid: [text: string];
}
export type ArTimeInputPart = "root" | "day-toggle" | "input" | "hour" | "separator" | "minute" | "note";
