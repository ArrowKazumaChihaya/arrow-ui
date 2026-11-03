/** ArSectionHead 1.0 の契約。カードの中のまとまりの見出しの段（シフト画面の「勤務メンバー 4名 ［日毎人件費］」）。 */
import type { ArIconName } from "../icons";

export interface ArSectionHeadProps {
  /** 見出しの文字。 */
  title: string;
  /** 見出しの前の四角い箱のアイコン（淡いテーマ色の地）。 */
  icon?: ArIconName;
  /** 見出しの右の件数の札（「4名」「0件」）。 */
  count?: string | number;
  /** 見出しの段階（読み上げの見出しの深さ）。 */
  headingLevel?: 2 | 3 | 4;
  /** 見出しを押して下の中身を開け閉めできるようにする（右に下向きの印）。 */
  collapsible?: boolean;
  /** 開いているか（v-model:open。collapsible のとき）。 */
  open?: boolean;
  /** 開け閉めする中身の id（aria-controls）。 */
  controls?: string;
}
export interface ArSectionHeadEmits {
  /** 開け閉めした（collapsible のとき）。 */
  "update:open": [open: boolean];
}
/** slot：actions（件数のすぐ右の操作。「日毎人件費」など）、end（右端。「表示モード」の切り替えなど）。 */
export type ArSectionHeadPart = "root" | "toggle" | "icon" | "title" | "count" | "caret" | "actions" | "end";
