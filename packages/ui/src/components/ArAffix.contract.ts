/** ArAffix 1.0 の契約。 */
export interface ArAffixProps {
  /** 上に残すときの、スクロールする箱の上端からの距離（px）。 */
  offsetTop?: number;
  /** 渡すと下に残す（下端からの距離 px）。 */
  offsetBottom?: number;
  /** 残っているときだけ帯の見た目（半透明の白・ぼかし・下の線）にする。false なら常に帯の見た目。 */
  bandWhenStuck?: boolean;
}
export interface ArAffixEmits {
  /** 上（下）に張り付いた・はがれた。 */
  change: [affixed: boolean];
}
export type ArAffixPart = "root";
