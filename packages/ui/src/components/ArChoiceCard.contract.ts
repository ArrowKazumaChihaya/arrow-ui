/** ArChoiceCard 1.0 の契約。選ぶカード（大きな選択のカード・ラジオカード・選ぶタイル・やり方を選ぶカード）。 */
import type { ArIconName } from "../icons";

export type ArChoiceValue = string | number | boolean;

export interface ArChoiceCardProps {
  /** 名前（「Cプラン」「口座振替」「なし」「入社メールを送信」）。 */
  title: string;
  /** 名前の下の説明。 */
  description?: string;
  /** アイコン。card は名前の上、option はテーマ色の四角、tile は淡い四角。radio は使わない。 */
  icon?: ArIconName;
  /**
   * 形。
   * card＝大きな選択のカード（プラン・支払い方法。右上に丸いチェック、選ぶとテーマ色の枠と淡い地）。
   * option＝やり方を選ぶカード（社員を追加の4択。左にテーマ色の四角のアイコン。押すと次へ進む）。
   * tile＝選ぶタイル（書類の種類・書類。選ぶとテーマ色の面）。
   * radio＝ラジオカード（年末調整の なし／あり。左にラジオの丸）。
   */
  variant?: "card" | "option" | "tile" | "radio";
  /** 1つを選ぶ組で使うときの、この札の値。v-model（modelValue）と同じなら選ばれている。渡すと role="radio"。 */
  value?: ArChoiceValue;
  /** 組の今の値（v-model）。 */
  modelValue?: ArChoiceValue | null;
  /** 組を使わずに選ばれているか（aria-pressed）。 */
  selected?: boolean;
  /** 名前の横の札（「推奨」「ご利用中のプラン」「7種類」）。 */
  tag?: string;
  /** 札の色。ok＝緑（推奨）・accent＝テーマ色（ご利用中）・neutral＝灰。 */
  tagTone?: "ok" | "accent" | "neutral";
  /** 選べないときの理由（鍵の印と一緒に下に出す）。 */
  reason?: string;
  disabled?: boolean;
}
export interface ArChoiceCardEmits {
  "update:modelValue": [value: ArChoiceValue];
  /** 押したとき（option はこれで次へ進む）。 */
  select: [value: ArChoiceValue | undefined];
}
/** slot：default（説明の下に足す中身）。 */
export type ArChoiceCardPart = "root" | "check" | "icon" | "body" | "title" | "tag" | "description" | "reason";
