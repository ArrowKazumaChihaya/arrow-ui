/** ArDaySummary 1.0 の契約。日の要約の札の並び（シフト画面の日付の下：人件費・勤怠ロック・公開中）。 */
import type { ArIconName } from "../icons";

export interface ArDaySummaryItem {
  /** 見出し（「人件費」）。 */
  label: string;
  /** 値（「¥36,300」）。太字で出す。 */
  value?: string;
  /** neutral（既定）・danger（赤：不足など）・ok（緑）・locked（勤怠ロック中）。 */
  tone?: "neutral" | "danger" | "ok" | "locked";
  icon?: ArIconName;
}

export interface ArDaySummaryProps {
  items?: readonly ArDaySummaryItem[];
  /** 公開の切り替えの札。true＝公開中・false＝非公開。undefined なら出さない。 */
  published?: boolean;
  /** 公開の札を押せないようにする（権限がないときなど）。 */
  publishDisabled?: boolean;
  /** 並びの寄せ方。既定は中央（日付の下に置く）。 */
  align?: "center" | "start";
  labels?: { published: string; unpublished: string; toggleHint: string };
}
export interface ArDaySummaryEmits {
  /** 公開の札を押したとき（次の値）。 */
  "update:published": [value: boolean];
}
export type ArDaySummaryPart = "root" | "item" | "icon" | "label" | "value" | "publish";
