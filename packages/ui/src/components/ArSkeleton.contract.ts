/** ArSkeleton 1.0 の契約。 */
export interface ArSkeletonProps {
  /** text：見出しと文の行。button・input・avatar・block：その形を1つ。 */
  shape?: "text" | "button" | "input" | "avatar" | "block";
  /** 左に丸（顔）を出す（shape="text"）。 */
  avatar?: boolean;
  /** 行の数（shape="text"）。 */
  rows?: number;
  /** 各行の幅（"40%" や 120）。足りない行は 100%、最後の行は 70%。 */
  widths?: readonly (string | number)[];
  /** 形の幅・高さ（shape が text 以外のとき）。 */
  width?: string | number;
  height?: string | number;
  /** 淡い光を流す。 */
  active?: boolean;
  /** false にすると形の代わりに default slot を出す。 */
  loading?: boolean;
}
export type ArSkeletonPart = "root" | "avatar" | "lines" | "line" | "block";
