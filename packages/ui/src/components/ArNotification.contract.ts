import type { ArIconName } from "../icons";

/** 通知の右下の操作。 */
export interface ArNotificationActionItem {
  label: string;
  /** primary：塗り。subtle：テーマ色の淡い面（既定）。plain：文字だけ（「あとで」など）。 */
  tone?: "primary" | "subtle" | "plain";
}

/** ArNotification 1.0 の契約。 */
export interface ArNotificationProps {
  /** 見出し（太字・14px）。 */
  title: string;
  /** 見出しの下の説明（default slot でもよい）。 */
  description?: string;
  /** 印の色。info はテーマ色、ok 緑、warn 橙、danger 赤。 */
  tone?: "info" | "ok" | "warn" | "danger";
  /** 印。既定は種類ごと（info・ok は info・check、warn・danger は alert）。提出などのお知らせは bell。 */
  icon?: ArIconName;
  /** 右上の ×。 */
  closable?: boolean;
  closeLabel?: string;
  /** 残り時間の線を動かす秒数（0 なら線を動かさない）。ArNotificationHost が渡す。 */
  duration?: number;
  /** 残り時間の線を止める（マウスが乗っている間など）。 */
  paused?: boolean;
  /** 残り時間の線を決まった長さで出す（0〜1）。見本や、自分で時間を数えるとき。 */
  progress?: number;
  /** 右下の操作（押すと action）。自由に並べるときは #actions。 */
  actions?: readonly ArNotificationActionItem[];
}
export interface ArNotificationEmits {
  close: [];
  /** actions のどれかを押した（何番目か）。 */
  action: [index: number];
}
/** slot：default（説明）、actions（右下の操作：「あとで」「見る」など）。 */
export type ArNotificationPart = "root" | "icon" | "content" | "title" | "description" | "close" | "actions" | "action" | "progress";
