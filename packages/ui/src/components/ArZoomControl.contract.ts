/**
 * ArZoomControl 1.0 の契約。表の列の幅・図の大きさを −／＋ で変える小さな組（ArShiftGrid・ArShiftViewTable・ArOrgChart の拡大縮小）。
 * 値は使う側が持ち、out・in を受けて変える（幅の上限・下限・刻みは使う側が決める）。
 */
export interface ArZoomControlProps {
  /** 真ん中に出す今の値（「64px」「100%」）。読み上げでも伝える（aria-live）。 */
  value: string;
  /** − を押せない（下限）。 */
  outDisabled?: boolean;
  /** ＋ を押せない（上限）。 */
  inDisabled?: boolean;
  /** 全部押せない。 */
  disabled?: boolean;
  /**
   * 形。box＝白い箱に線（シフト表の上の操作の段。キャンバスの .r-zoom）、
   * plain＝箱なし（ArOrgChart の右下の操作の板のように、すでに白い板の中に置くとき）。
   */
  variant?: "box" | "plain";
  /** 大きさの段。md＝ふつう（箱 34）、sm＝密集した所・スマホ（箱 32）。 */
  size?: "sm" | "md";
  /** まとまりの読み上げの名前（「列の幅」）。 */
  label?: string;
  /** − の名前（読み上げ・吹き出し）。 */
  outLabel?: string;
  /** ＋ の名前（読み上げ・吹き出し）。 */
  inLabel?: string;
}
export interface ArZoomControlEmits {
  /** − を押した。 */
  out: [event: MouseEvent];
  /** ＋ を押した。 */
  in: [event: MouseEvent];
}
export type ArZoomControlPart = "root" | "zoom-out" | "zoom-value" | "zoom-in";
