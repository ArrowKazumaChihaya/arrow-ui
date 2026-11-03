import type { ArIconName } from "../icons";
import type { ArPlacement } from "../internal/floating";

/** ArPopconfirm 1.0 の契約。 */
export interface ArPopconfirmProps {
  /** 問い（「この人を一覧から隠しますか？」）。 */
  title: string;
  /** 問いの下の説明（戻し方など）。 */
  description?: string;
  /** 主なボタンの文字。何が起きるかを書く（「隠す」「削除する」）。 */
  okText?: string;
  cancelText?: string;
  /** 主なボタンの種類。消すときは danger（赤）。 */
  okTone?: "primary" | "danger";
  /** 問いの左の印。 */
  icon?: ArIconName;
  /** 印の色。 */
  iconTone?: "warn" | "danger" | "info";
  /** 出す向き（入らなければ反対へ返す）。 */
  placement?: ArPlacement;
  /** 開いているか（v-model:open。渡さなければ中で持つ）。 */
  open?: boolean;
  /** 押しても開かない。 */
  disabled?: boolean;
}
export interface ArPopconfirmEmits {
  "update:open": [open: boolean];
  confirm: [];
  cancel: [];
}
/** slot：default（開くきっかけ：ボタンなど）。 */
export type ArPopconfirmPart = "root" | "arrow" | "question" | "icon" | "title" | "description" | "footer";
