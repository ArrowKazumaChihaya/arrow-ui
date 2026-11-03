/** ArFlagView 1.0 の契約。ビットの合計の数を、立っている項目の名前の並びで見せる（今の ARROW の FlagView）。 */
import type { ArFlagOption } from "./ArFlagGroup.contract";

export interface ArFlagViewProps {
  value: number | null;
  options: readonly ArFlagOption[];
  /** 1つも立っていないときの文字（既定「なし」）。 */
  empty?: string;
}
export type ArFlagViewPart = "root" | "item" | "empty";
