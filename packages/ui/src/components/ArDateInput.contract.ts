/**
 * ArDateInput 1.0 の契約。年はプルダウン、月と日は数字で入れる。
 *
 * デザインが選ぶ形（ArDesign.forms.ArDateInput）。値の受け渡しはどの形でも同じ。
 * - `invalidDate`：`"clamp"`（既定）＝ありえない日（2月31日など）は末日に寄せる。`"message"`＝打った数字のまま月日の枠を赤くし、右に「無効な日付」を出して値は null（今の ARROW）。
 * - `pad`：`"none"`（既定）＝月日をそのまま（3）。`"zero"`＝2桁に詰める（03。今の ARROW）。
 * - `yearOrder`：`"asc"`（既定）＝年のプルダウンは古い年が上。`"desc"`＝新しい年が上（今の ARROW）。
 * - `yearEmpty`：`"none"`（既定）。`"option"`＝年のプルダウンの先頭に「未選択」を出す（今の ARROW）。
 */
export interface ArDateInputProps {
  /** "YYYY-MM-DD"。未入力は null。 */
  modelValue: string | null;
  /** 年のプルダウンの最初の年。既定は今年の5年前。 */
  minYear?: number;
  /** 年のプルダウンの最後の年。既定は今年の5年後。 */
  maxYear?: number;
  /** 年に和暦を添える（「2026(令和8)」。今の ARROW の isNendo）。 */
  era?: boolean;
  /** 右に曜日（（金））を出す。日曜は赤、土曜は青。 */
  showWeekday?: boolean;
  /** 外から渡す間違いの状態（例：終わりの日が始まりの日より前）。 */
  invalid?: boolean;
  disabled?: boolean;
  /** 読み上げ用の名前（例：「契約開始日」）。 */
  label?: string;
  /** 年のボタンの id（ArField の label と結ぶ）。 */
  id?: string;
  labels?: { year: string; month: string; day: string; weekdays: readonly string[]; invalidDate?: string; empty?: string };
}
export interface ArDateInputEmits {
  /** 年を選んだとき、月・日の入力を確定したとき（Enter・フォーカスが外れた・↑↓）に出す。どれかが空なら null。 */
  "update:modelValue": [value: string | null];
}
export type ArDateInputPart = "root" | "year" | "month" | "day" | "unit" | "weekday" | "error";
