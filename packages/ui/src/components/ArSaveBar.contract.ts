/**
 * ArSaveBar 1.0 の契約。保存していない変更があるときに画面の下に出す「保存バー」（設定の .cf-save）。
 * 左に未保存の件数と変えた項目名、直すところがあればその件数とそこへ飛ぶボタン、右に「変更を取り消す」「この内容で保存」。
 * デザインが選べる形（ArDesign.forms.ArSaveBar）：
 * - summary："show"（既定。件数と項目名を出す）／"hidden"（出さない。今の ARROW の設定は「キャンセル」「実行」のボタンだけ。classic）。
 * - buttonText："remix"（既定「変更を取り消す」「この内容で保存」）／"arrow"（「キャンセル」「実行」。classic）。saveText・discardText を渡せばそちらを使う。
 */
export interface ArSaveBarProps {
  /** 保存していない変更の数。 */
  count: number;
  /** 変えた項目の名前（「・」でつないで1行で出す。入らない分は「…」）。 */
  items?: readonly string[];
  /** 直すところ（間違い）の数。1以上で「直すところ N件」のボタンを出し、押すと jump を出す。 */
  errorCount?: number;
  /** 保存中（保存のボタンを回る印にして押せなくする）。 */
  saving?: boolean;
  /** 保存のボタンを押せなくする（errorCount があるときも押せるかは製品が決める）。 */
  saveDisabled?: boolean;
  /** 画面の下に貼りつける（スクロールしても下に残す。position: sticky）。 */
  sticky?: boolean;
  /** 大きさ。md＝PC、sm＝スマホ（「未保存 N件」「取り消す」「保存」の小さなボタン・項目名なし）。 */
  size?: "md" | "sm";
  /** 件数の札の文字。{n} は件数（既定 md「未保存の変更 {n}件」、sm「未保存 {n}件」）。 */
  countText?: string;
  /** 直すところのボタンの文字。{n} は件数（既定「直すところ {n}件」）。 */
  errorText?: string;
  /** 取り消すボタンの文字。 */
  discardText?: string;
  /** 保存のボタンの文字。 */
  saveText?: string;
  /** まとまりの名前（読み上げ）。 */
  label?: string;
}
export interface ArSaveBarEmits {
  /** 保存のボタンを押した。 */
  save: [event: MouseEvent];
  /** 取り消すボタンを押した。 */
  discard: [event: MouseEvent];
  /** 「直すところ」を押した（最初の間違いへ移る）。 */
  jump: [event: MouseEvent];
}
export type ArSaveBarPart = "root" | "count" | "items" | "spacer";
