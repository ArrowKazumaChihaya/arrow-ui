/** ArMasonry 1.0 の契約。 */
import type { ArSpace } from "../layout/types";

export interface ArMasonryProps {
  /** 列の数。 */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 列の最小の幅（px）。渡すと幅に合わせて列の数が変わる（columns は上限になる）。 */
  minColumnWidth?: number;
  /** カードの間（余白トークンの段階）。 */
  gap?: ArSpace;
}
export type ArMasonryPart = "root";
