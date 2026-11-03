/** ArModal 1.0 の契約。 */
export interface ArModalProps {
  open: boolean;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "full";
  /** 手順のあるポップアップ（例：期間と人数 → 日ごとの確認 → 相手 → 確認）。 */
  steps?: readonly string[];
  /** 今の手順（0から）。 */
  currentStep?: number;
  /** 右上の × と Esc で閉じられる。 */
  closable?: boolean;
  /** 幕を押して閉じる。入力中の内容を失いやすいので既定は false。 */
  closeOnScrim?: boolean;
  /** 出す先。テストなどで null にするとその場に出す。 */
  teleportTo?: string | null;
  labels?: { close: string; step: string };
}
export interface ArModalEmits {
  "update:open": [open: boolean];
  close: [];
}
/** slot：default（本文）、footer（ボタンの並び）。 */
export type ArModalPart = "root" | "scrim" | "panel" | "header" | "title" | "description" | "close" | "steps" | "step" | "body" | "footer";
