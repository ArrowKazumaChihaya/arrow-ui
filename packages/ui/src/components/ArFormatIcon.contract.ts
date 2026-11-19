/** ArFormatIcon 1.0 の契約。書類の形式（PDF・CSV・Excel）の色つきファイルのアイコン。書類の一覧・説明・出力の画面で同じ印を使う。 */
export type ArFormatIconFormat = "PDF" | "CSV" | "Excel";

export interface ArFormatIconProps {
  /** 形式。 */
  format: ArFormatIconFormat;
  /** 大きさ（px。既定 24）。 */
  size?: number;
  /** 読み上げる名前。省くと飾り（aria-hidden）。 */
  label?: string;
}
export type ArFormatIconPart = "root";
