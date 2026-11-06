/** ArFloatButton 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArFloatButtonItem {
  /** 押したときに select で届く値。 */
  key: string;
  /** アイコン。 */
  icon: ArIconName;
  /** 読み上げ・ツールチップの名前。 */
  label: string;
  /** 件数の丸。 */
  badge?: number | string;
}

export interface ArFloatButtonProps {
  /** アイコン（backTop のときは up を使う）。 */
  icon?: ArIconName;
  /** 読み上げ・ツールチップの名前。 */
  label?: string;
  /** default：白い丸。primary：テーマ色の丸（主なものだけ。スマホの「シフト追加」など）。 */
  tone?: "default" | "primary";
  /** 件数の丸（赤）。0 や空なら出さない。 */
  badge?: number | string;
  /** 縦につないだボタンの並び（グループ）。渡すと1つのボタンではなくグループになる。 */
  items?: readonly ArFloatButtonItem[];
  /** ページの上へ戻るボタンにする。visibilityHeight より下へスクロールしたときだけ出る。 */
  backTop?: boolean;
  /** backTop のとき、これより下へスクロールしたら出す（px）。 */
  visibilityHeight?: number;
  /** 画面の右下に固定する（スマホの「シフト追加」など）。false なら置いた場所に出す。
   * 配置先の固定メニューを避けるときは --ar-float-button-right / --ar-float-button-bottom で位置を指定する。
   */
  fixed?: boolean;
  /** 渡すとリンク（a 要素）にする。 */
  href?: string;
}
export interface ArFloatButtonEmits {
  click: [event: MouseEvent];
  /** グループの中のボタンを押した。 */
  select: [key: string];
}
export type ArFloatButtonPart = "root" | "item" | "icon" | "badge";
