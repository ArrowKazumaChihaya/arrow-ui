import type { ArIconName } from "../icons";

/** ArPunchPanel 1.0 — GPS / MyPC 共通の打刻画面。時計・状態判断・通信は利用側が所有する。 */
export interface ArPunchPanelProps {
  title: string;
  /** 利用側の時計が整形した日時。そのまま表示し、この部品自身はタイマーを持たない。 */
  timestamp: string;
  description?: string;
  icon?: ArIconName;
}
/** default：会社/店舗選択や現在の状態。actions：ArPunchButtonを出勤/退勤/休憩開始/休憩終了の順。footer：初期表示設定等。 */
export type ArPunchPanelPart = "root" | "clock" | "controls" | "actions" | "footer";
