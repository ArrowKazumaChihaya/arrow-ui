/** ArRadioGroup 1.2 の契約。 */
export type ArRadioValue = string | number | boolean;

/**
 * 選ぶ部品（ラジオ・チェック・スイッチ・選ぶカード・切り替え・曜日）の大きさの段。同じ段なら ArSelect・ArTextInput・ArTimeInput・ArButton と高さ・角丸がそろう。
 * sm＝設定の行など密集した所（高さ30・角丸9）。md＝ふつう（36・角丸10）。lg＝年末調整・スマホなど、大きく押しやすくしたい所（42・角丸11。説明の文も入れられる）。ボタン（.btn・.btn.sm・.btn.lg）・時刻の入力（.tin）と同じ値。
 */
export type ArChoiceSize = "sm" | "md" | "lg";

/**
 * ラジオ・チェックの形。
 * card＝選ぶカード（年末調整の なし／あり の形。白い面に細い線、選ぶとテーマ色の2pxの枠と淡い地）。
 * plain＝丸・四角と文字だけ（設定の行・表の中など、密集した所）。
 */
export type ArChoiceVariant = "card" | "plain";

export interface ArRadioOption {
  value: ArRadioValue;
  label: string;
  /** 名前の下の説明（card で使う。plain でも名前の下に小さく出る）。 */
  description?: string;
  disabled?: boolean;
}

export interface ArRadioGroupProps {
  modelValue: ArRadioValue | null;
  options: readonly ArRadioOption[];
  /** radio：丸の印のラジオ（形は variant）。button：ボタン型（ArSegmented と同じ形。日・週・月の切り替えなど）。 */
  type?: "radio" | "button";
  /**
   * 1.2：type="radio" の形。省くとデザインの既定（remix は card、classic は今の ARROW と同じ plain）。
   * card＝選ぶカード（年末調整の なし／あり。ArChoiceCard の variant="radio" と同じもの）。
   * plain＝丸と文字だけ（設定の行・表の中など密集した所）。
   */
  variant?: ArChoiceVariant;
  /**
   * 1.2：大きさ。sm＝設定の行（カードは高さ30・丸16・13px）。md＝ふつう（カード36・丸18・13.5px）。
   * lg＝年末調整・スマホ（カード42・丸18・14px、説明の文を入れても押しやすい）。type="button" のときは ArSegmented の sm・md・lg と同じ。
   */
  size?: ArChoiceSize;
  /** 丸のときの並び。button は常に横。 */
  direction?: "horizontal" | "vertical";
  /** 1.2：card のとき、この数の等しい幅の列に並べる（年末調整の なし／あり は 2）。 */
  columns?: number;
  /** button のとき親の幅いっぱいに広げ、等分する。 */
  block?: boolean;
  disabled?: boolean;
  /** まとまりの名前（読み上げ）。 */
  label: string;
}
export interface ArRadioGroupEmits {
  "update:modelValue": [value: ArRadioValue];
}
/**
 * slot：label（{ option, checked }：名前の所に任意の部品。押すとラジオも選ぶ）、
 * extra（{ option, checked }：選択肢の下に置く表や入力。ラジオの外なので押しても切り替わらない。type="radio" のときだけ）。
 * 1つだけ離れた所に置くラジオは ArRadio を使う（各選択肢も ArRadio で描く。見た目は1つ）。
 */
export type ArRadioGroupPart = "root" | "item" | "control" | "input" | "mark" | "label" | "description" | "extra";
