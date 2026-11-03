import type { ArQrLevel } from "../internal/qrcode";

/** ArQRCode 1.0 の契約。打刻用などの QR コード（外の部品を使わずに描く）。 */
export interface ArQRCodeProps {
  /** QR に入れる文字（URL など）。UTF-8 のまま入る。 */
  value: string;
  /** 1辺の大きさ（px、白い余白を除く）。既定 120。 */
  size?: number;
  /** 誤り訂正の強さ。L 7%・M 15%（既定）・Q 25%・H 30%。 */
  level?: ArQrLevel;
  /** active：ふつう。expired：期限切れ（白い幕と作り直すボタン）。loading：作っている途中。scanned：読み取り済み。 */
  status?: "active" | "expired" | "loading" | "scanned";
  /** 枠を付ける。 */
  bordered?: boolean;
  /** 読み上げ用の名前。既定「QRコード」。 */
  label?: string;
  /** 画面の文字。 */
  labels?: { expired: string; refresh: string; loading: string; scanned: string; tooLong: string };
}
export interface ArQRCodeEmits {
  /** 期限切れの「作り直す」を押したとき。 */
  refresh: [];
}
export type ArQRCodePart = "root" | "code" | "overlay" | "message" | "refresh" | "spinner";
