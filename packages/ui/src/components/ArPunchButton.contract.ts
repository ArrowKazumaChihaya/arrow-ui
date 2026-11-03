/** ArPunchButton 1.0 の契約。打刻の大きいボタン（出勤・退勤・休憩開始・休憩終了）。 */
import type { ArPaletteName } from "@arrow/ui-tokens";
import type { ArIconName } from "../icons";

export interface ArPunchButtonProps {
  /** どの打刻か。in＝出勤・out＝退勤・break-in＝休憩開始・break-out＝休憩終了。名前・アイコン・色・大きさの既定が決まる。 */
  kind: "in" | "out" | "break-in" | "break-out";
  /** ボタンの名前。省くと kind の名前（出勤・退勤・休憩開始・休憩終了）。 */
  label?: string;
  /** アイコン。省くと kind のアイコン（remix：出勤＝walk・退勤＝out・休憩開始＝coffee・休憩終了＝check）。 */
  icon?: ArIconName;
  /** 色。省くと 出勤・休憩開始＝blue、退勤・休憩終了＝green（今の ARROW の MyPC 打刻と同じ）。 */
  palette?: ArPaletteName;
  /** 大きさ。lg＝高さ170（PC の出勤・退勤）・md＝136（スマホの出勤・退勤）・sm＝56（休憩）。省くと 出勤・退勤＝lg、休憩＝sm。 */
  size?: "lg" | "md" | "sm";
  /** 押せない（今の状態では打刻できない）。 */
  disabled?: boolean;
  /** ボタンの下の一言。押せない理由（「出勤してから押せます」）や今の状態（「出勤済み（13:02）」「休憩中（17:00〜）」）。読み上げはボタンの説明になる。 */
  reason?: string;
  /** 記録している途中（押せない・aria-busy）。 */
  loading?: boolean;
}
export interface ArPunchButtonEmits {
  punch: [kind: ArPunchButtonProps["kind"]];
}
/**
 * デザインが選ぶ形（ArDesign.forms.ArPunchButton）。
 * icons：line（既定。remix の線のアイコン：歩く人・出口・カップ・チェック）／ punch（今の ARROW：出勤・退勤は人の大きな絵、休憩は絵なし）。
 */
export type ArPunchButtonPart = "root" | "button" | "icon" | "label" | "reason";
