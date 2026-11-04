/** ArSwitch 1.1 の契約。 */
export interface ArSwitchProps {
  modelValue: boolean;
  /** 読み上げ用の名前（例：「この日を公開する」）。 */
  label: string;
  /** 入っているときにつまみの左に出す文字（例：「公開」）。offText と一緒に渡す。 */
  onText?: string;
  /** 切れているときにつまみの右に出す文字（例：「非公開」）。 */
  offText?: string;
  /**
   * 大きさ（ラジオ・チェックと同じ段）。sm：28×16（設定の行など密集した所。文字は出さない）。md：36×20（文字ありは高さ22）。
   * 1.1：lg：44×24（年末調整・スマホ。文字ありは高さ26）。
   */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /**
   * 入っているときの色。default：部品の既定の色（classic は antd の青 #1677FF＝今の ARROW の Toggle、remix はテーマ色）。
   * accent：ページのテーマ色（今の ARROW の theme を付けた Toggle）。
   */
  tone?: "default" | "accent";
  /**
   * 2択の切り替え（今の ARROW の alwaysValid）。切れているときも色を付け、どちらの側も「選んでいる」ように見せる（一覧／カレンダーなど）。
   * 両側の意味は before・after スロット（アイコンなど）で示す。
   */
  twoWay?: boolean;
  /** 保存中。つまみの中で回る印を出し、押せなくする。 */
  loading?: boolean;
  id?: string;
}
export interface ArSwitchEmits {
  "update:modelValue": [value: boolean];
}
/** スロット：before＝左（切れている側の印）、after＝右（入っている側の印）、default＝右の文字（例：「有効」）。 */
export type ArSwitchPart = "root" | "before" | "track" | "text" | "on" | "off" | "thumb" | "spinner" | "after" | "caption";
