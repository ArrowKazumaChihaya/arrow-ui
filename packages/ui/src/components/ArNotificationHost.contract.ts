/**
 * ArNotificationHost 1.0 の契約。useArNotification() で出した通知を、画面の右上に並べる入れ物。
 *
 * デザインが選ぶ形（ArDesign.forms.ArNotificationHost）。
 * - `order`：`"newest-first"`（既定）＝新しい通知を上に出す。`"newest-last"`＝新しい通知を下に足す（antd の notification と同じ）。
 */
export interface ArNotificationHostProps {
  /** 上からの距離（px）。 */
  top?: number;
}
