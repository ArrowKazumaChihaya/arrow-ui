/** ArAvatar 1.0 の契約。 */
import type { ArIconName } from "../icons";

/**
 * 頭文字の丸の色。
 * accent＝淡いテーマ色（既定）、neutral＝灰色（「+5」や人の印）、
 * blue・orange・green・purple・yellow＝人ごとの色（シフト画面で人を見分ける）、
 * ok・warn・danger・event＝意味の色。
 */
export type ArAvatarTone =
  | "accent"
  | "neutral"
  | "blue"
  | "orange"
  | "green"
  | "purple"
  | "yellow"
  | "ok"
  | "warn"
  | "danger"
  | "event";

export interface ArAvatarProps {
  /** 人の名前。頭文字（1文字目）を出し、読み上げの名前にする。 */
  name?: string;
  /** 丸に出す文字（name の頭文字の代わり。「+5」など）。 */
  text?: string;
  /** 文字の代わりのアイコン（人の印など）。 */
  icon?: ArIconName;
  /** 色。省くと seed から人ごとの色、seed もなければ accent。 */
  tone?: ArAvatarTone;
  /** 人ごとの色を選ぶ元（並び順や社員の番号）。数は 0→blue, 1→orange… の順に回る。 */
  seed?: string | number;
  /** 大きさ。xs＝24・sm＝26（表の中）・md＝32・lg＝44・xl＝60。 */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** 形。square は角丸10の四角。 */
  shape?: "circle" | "square";
  /** 読み上げの名前（name がないとき）。どちらもなければ飾りとして読まない。 */
  label?: string;
}

export interface ArAvatarGroupProps {
  /** ここまで並べ、残りは「+N」にまとめる。 */
  max?: number;
  /** 並べる丸の大きさ（中の ArAvatar に size を渡さないときの既定）。 */
  size?: ArAvatarProps["size"];
  /** まとまりの読み上げの名前（「勤務中の人」など）。 */
  label?: string;
}

export type ArAvatarPart = "root" | "text" | "icon";
export type ArAvatarGroupPart = "root" | "rest";
