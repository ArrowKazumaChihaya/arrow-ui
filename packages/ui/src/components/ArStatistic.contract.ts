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
  /** 増減。up＝増えた（緑）、down＝減った（赤）。 */
  trend?: "up" | "down";
  /** 増減の値（「3.2%」）。 */
  trendValue?: string;
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
