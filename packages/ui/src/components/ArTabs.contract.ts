/** ArTabs 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArTabItem {
  key: string;
  label: string;
  icon?: ArIconName;
  /** 件数の札。 */
  count?: number;
  disabled?: boolean;
}

export interface ArTabsProps {
  modelValue: string;
  items: readonly ArTabItem[];
  variant?: "band" | "line";
  /** 読み上げ用の名前。 */
  label: string;
  /** 1つ1つのタブの id の頭（tabpanel 側の aria-labelledby に使う）。 */
  idPrefix?: string;
}
