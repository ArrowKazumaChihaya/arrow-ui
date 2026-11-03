import type { ArPlacement } from "../internal/floating";

/** 吹き出しを置く向き（基準の要素から見て）。-start / -end は端をそろえる。 */
export type ArTooltipPlacement = ArPlacement;

/** ArTooltip 1.0 の契約。default slot が基準の要素（ボタンなど）。 */
export interface ArTooltipProps {
  /** 吹き出しの文字（短い説明）。長い中身は content slot。 */
  title?: string;
  /** 置く向き。入らなければ反対へ返す。 */
  placement?: ArTooltipPlacement;
  /** ink：濃い吹き出し（ふつう）。accent：テーマ色の吹き出し（テーマ色の濃い字の色）。 */
  tone?: "ink" | "accent";
  /** 乗せてから出るまでの時間（ミリ秒）。フォーカスのときはすぐ出る。 */
  delay?: number;
  /** 外れてから消えるまでの時間（ミリ秒）。吹き出しへ移る間は消さない。 */
  hideDelay?: number;
  /** 出さない。 */
  disabled?: boolean;
  /** 出ているか（v-model:open）。渡さなければ乗せる・フォーカスで自動。 */
  open?: boolean;
}
export interface ArTooltipEmits {
  "update:open": [open: boolean];
}
export type ArTooltipPart = "trigger" | "root" | "panel" | "arrow" | "body";
