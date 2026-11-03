/**
 * ArMapPreview 1.0 の契約。地図の見本：真ん中のピンと、打刻できる範囲の円（会社情報の店舗の GPS）。
 * 地図そのものは製品が default slot で渡す（Google マップの埋め込み・静止画像など）。渡さなければ見本の地の絵（道と区画）。
 * 円の大きさ（px）は radiusPx で渡す。省くと半径（m）から見本の大きさを決める（10m→約102px … 9999m→210px）。
 */
export interface ArMapPreviewProps {
  /** 打刻範囲の半径（m）。10〜9999 の外なら円を出さず、caption に案内を出す。 */
  radius?: number | null;
  /** 円の直径（px）。地図の縮尺に合わせるときに製品が渡す。 */
  radiusPx?: number;
  /** 範囲の強さ。strict＝範囲内でのみ打刻できる（テーマ色の実線）、warn＝勤怠エラーのみ（橙の点線）、none＝制限なし（円を出さない）。 */
  restriction?: "strict" | "warn" | "none";
  /** 緯度・経度（読み上げと title に使う）。 */
  latitude?: number | null;
  longitude?: number | null;
  /** 住所（読み上げに使う）。 */
  address?: string;
  /** 左下の札。省くと「半径 {r}m の打刻範囲」（範囲外なら「打刻範囲を入れると円が出ます」）。空文字で出さない。 */
  caption?: string;
  /** 右上の出典の札（「地図（Google マップ）」）。空文字で出さない。 */
  source?: string;
  /** 幅（既定 560px。親より広くはならない）。 */
  width?: string;
  /** 高さ（既定 250px）。 */
  height?: string;
  /** 画面の文字。 */
  labels?: Partial<ArMapPreviewLabels>;
}
export interface ArMapPreviewLabels {
  /** {r} を半径に置き換える。 */
  caption: string;
  captionEmpty: string;
  /** 読み上げ。{place} {r} を置き換える。 */
  aria: string;
  ariaNoRange: string;
  place: string;
}
export type ArMapPreviewPart = "root" | "map" | "sample" | "block" | "road" | "range" | "pin" | "caption" | "source";
