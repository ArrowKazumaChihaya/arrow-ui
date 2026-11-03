import type { ArIconName } from "../icons";

/** ArModal 1.1 の契約。 */
export interface ArModalProps {
  open: boolean;
  title: string;
  /** 題の下の1行の説明。 */
  description?: string;
  /** 幅。sm 420・md 640・lg 880・xl 1100・full（画面いっぱい）。 */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** 幅を数で決める（px）。size より強い。 */
  width?: number | string;
  /** 手順のあるポップアップ（例：期間と人数 → 日ごとの確認 → 相手 → 確認）。頭の下に並ぶ。 */
  steps?: readonly string[];
  /** 今の手順（0から）。 */
  currentStep?: number;
  /** 終わった手順を押して戻れるようにする（押すと update:currentStep）。 */
  stepsClickable?: boolean;
  /** 右上の × と Esc で閉じられる（confirm は × を出さず Esc だけ）。 */
  closable?: boolean;
  /** 幕を押して閉じる。入力中の内容を失いやすいので既定は false。 */
  closeOnScrim?: boolean;
  /** 出す先。テストなどで null にするとその場に出す。 */
  teleportTo?: string | null;
  /** 画面全体ではなく、親の要素（position:relative）の中に出す。説明の見本や、画面の一部だけを止めるときに使う。 */
  contained?: boolean;
  /** スマホ（幅640px以下）では画面いっぱい（.fsc）にする。 */
  mobileFullscreen?: boolean;
  /** confirm：確かめの小さなポップアップ（左に印・本文なし）。 */
  variant?: "default" | "confirm";
  /** 題の左の印（confirm の既定は alert）。 */
  icon?: ArIconName;
  /** 印の色。warn 橙・danger 赤・info テーマ色・ok 緑。 */
  iconTone?: "warn" | "danger" | "info" | "ok";
  /** 足の左に出す補足の文字（例：「時給・月給の設定から計算した概算です」）。 */
  footerNote?: string;
  /** 補足の文字を左（start）に置くか、主なボタンの左（end）に置くか。 */
  footerNoteAlign?: "start" | "end";
  /** 主なボタンの文字。渡すと足に「キャンセル」と主なボタンを出す（#footer があればそちらが優先）。 */
  okText?: string;
  /** 主なボタンの種類。削除は danger（赤）。 */
  okTone?: "primary" | "danger";
  okIcon?: ArIconName;
  okDisabled?: boolean;
  okLoading?: boolean;
  /** キャンセルの文字。空文字にすると出さない。 */
  cancelText?: string;
  /** 戻るの文字。渡すと足の左に「戻る」を出す。 */
  backText?: string;
  labels?: { close: string; step: string };
}
export interface ArModalEmits {
  "update:open": [open: boolean];
  close: [];
  /** 主なボタン。閉じるかは製品が決める。 */
  ok: [];
  /** キャンセル（閉じる）。 */
  cancel: [];
  back: [];
  "update:currentStep": [step: number];
}
/** slot：default（本文）、footer（足の右：ボタンの並び）、footer-start（足の左：戻る・補足）、toolbar（手順の行の左：切り替えなど）、title（題の差し替え）。 */
export type ArModalPart =
  | "root"
  | "scrim"
  | "panel"
  | "header"
  | "icon"
  | "heading"
  | "title"
  | "description"
  | "close"
  | "nav"
  | "toolbar"
  | "steps"
  | "step"
  | "step-mark"
  | "body"
  | "footer"
  | "footer-start"
  | "footer-end"
  | "note";
