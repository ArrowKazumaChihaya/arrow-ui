import type { ArPlacement } from "../internal/floating";

/** 吹き出しを置く向き（基準の要素から見て）。-start / -end は端をそろえる。 */
export type ArTooltipPlacement = ArPlacement;

/**
 * ArTooltip 1.1 の契約。default slot が基準の要素（ボタンなど）。
 * ライブラリの吹き出しの形はこれ1つ（remix はシフトのキャンバスの .r-tip：#1F2933・11.5px 600・角丸9・余白 7/10・影・矢印なし・基準から4px）。
 * ArShiftGrid のマス・ArEllipsis・ArPopover の cell・ArSlider のつまみの値・ArShiftChart などの「1つだけ動かす吹き出し」も同じ見た目で描く。
 * 1.1：content slot の中で「見出しの行＋ラベルと値の行」を並べるときは data-part="tip-row"（見出しの行は data-head）・"tip-label"・"tip-value" を使う。
 * デザインの形（forms）：ArTooltip.cellTip＝"float"（吹き出し。既定）か "title"（部品の中のマス・帯の説明をブラウザの title で出す。classic の今の ARROW）。
 */
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
  /** 1行で出す（幅を絞らず、折り返さない）。期間（「計算期間 2026/10/21 〜 2026/11/20」）のような短い1行の説明に使う。 */
  wide?: boolean;
  /** 吹き出しが指す要素。省くと default slot の中の最初の操作できる要素。部品の中の一部（期間の文字など）を指すときに使う。 */
  anchor?: HTMLElement | null;
}
export interface ArTooltipEmits {
  "update:open": [open: boolean];
}
export type ArTooltipPart = "trigger" | "root" | "panel" | "arrow" | "body" | "tip-row" | "tip-label" | "tip-value";
