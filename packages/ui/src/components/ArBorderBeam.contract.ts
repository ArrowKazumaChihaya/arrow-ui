/** ArBorderBeam 1.0 の契約。 */
export interface ArBorderBeamProps {
  /** 光がふちを1周する秒数。 */
  duration?: number;
  /** 光を回す。false で止めて、ふちの線だけにする（動きを減らす設定でも止まる）。 */
  active?: boolean;
}
/** slot：default（新しい機能の案内など）。 */
export type ArBorderBeamPart = "root" | "beam" | "content";
