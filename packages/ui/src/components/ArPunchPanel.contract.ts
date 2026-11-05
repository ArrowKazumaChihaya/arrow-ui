import type { ArIconName } from "../icons";

/** ArPunchPanel 1.1 — GPS / MyPC 共通の打刻画面。時計・状態判断・通信は利用側が所有する。 */
export interface ArPunchPanelProps {
  title: string;
  /** 利用側の時計が整形した日時。そのまま表示し、この部品自身はタイマーを持たない。 */
  timestamp: string;
  /** 日付を時計と分けて表示する場合に指定。省略時は従来の日時表示を維持する。 */
  dateLabel?: string;
  description?: string;
  icon?: ArIconName;
}
/** default：会社/店舗選択や現在の状態。actions：ArPunchButtonを出勤/退勤/休憩開始/休憩終了の順。footer：初期表示設定等。 */
export type ArPunchPanelPart = "root" | "date" | "clock" | "controls" | "actions" | "footer";
