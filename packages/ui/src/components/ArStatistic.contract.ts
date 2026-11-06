/** ArStatistic 1.0・ArCountdown 1.0 の契約。 */
import type { ArIconName } from "../icons";

export interface ArStatisticProps {
  /** 小さな見出し（「今月の人件費」）。 */
  title?: string;
  /** 見出しの後ろのアイコン（説明があることを示す info など）。 */
  titleIcon?: ArIconName;
  /** 数字。数なら3桁ごとに「,」を入れる。文字ならそのまま出す。 */
  value: number | string;
  /** 小数の桁数（数のとき）。 */
  precision?: number;
  /** 数字の前（「¥」）。 */
  prefix?: string;
  /** 数字の後ろの単位（「名」「/ 9名」）。 */
  suffix?: string;
  /** 増減。flat は変化なし。色の意味は trendTone で指定できる。 */
  trend?: "up" | "down" | "flat";
  /** 増減の値（「3.2%」）。 */
  trendValue?: string;
  /** auto は従来の増＝緑・減＝赤。善悪を表さない比較には neutral を使う。 */
  trendTone?: "auto" | "neutral";
  /** 読み上げる比較の説明。未指定時は「増加」「減少」「変化なし」。 */
  trendLabel?: string;
  /** 増減の配置。狭い集計カードでは below で値の下へ置ける。 */
  trendPlacement?: "inline" | "below";
  /** 数字の色（未提出＝warn、不足＝danger など）。 */
  tone?: "default" | "ok" | "warn" | "danger";
  /** 大きさ。sm は数字の箱の中（18px）。 */
  size?: "md" | "sm";
}

export interface ArCountdownProps {
  /** 小さな見出し（「提出のしめきりまで」）。 */
  title?: string;
  /** しめきり（Date か ms）。 */
  target: Date | number;
  /** 出し方。D＝日、HH・mm・ss。既定は「D日 HH:mm:ss」（1日未満は「HH:mm:ss」）。 */
  format?: string;
  /** 残りがこれ（ms）より少ないと橙にする。既定は3日。 */
  warnWithin?: number;
  /** 大きさ。 */
  size?: "md" | "sm";
}

export interface ArCountdownEmits {
  /** しめきりになったとき。 */
  finish: [];
}

export type ArStatisticPart = "root" | "title" | "title-icon" | "content" | "prefix" | "value" | "suffix" | "trend";
