/**
 * ArPeriodBox 1.0 の契約。シフトのポップアップ（募集・一括登録・一括削除・Excel）の「期間の箱」：
 * 1か月／半月（／カスタム）の切り替えと期間、決まり（曜日ごとの時間など。中身は製品が default のスロットに置く）、「適用」。
 *
 * デザインが選ぶ形（ArDesign.forms.ArPeriodBox）。値の受け渡し（v-model・apply）はどの形でも同じ。
 * - `layout`：`"range"`（既定）＝切り替え（ArSegmented）と説明の下に、年・月・日の範囲（ArDateRange）と「30日間」（PopRecruit の「募集する期間」）。
 *   適用は右下の主ボタン（PopBulk の「日付に当てはめる」）。
 *   `"nav"`＝今の ARROW の募集・一括登録のポップアップ：テーマ色の点線の箱の中に、月の切り替え（MonthChanger）・
 *   「月／半月」のボタン型ラジオ・「(前半)／(後半)」のボタン型ラジオ・決まり、箱の下に大きな「適用」と下向きの矢印の絵。カスタムは出さない。
 */
/** month＝1か月、half＝半月（1〜15日／16日〜末日）、custom＝好きな範囲。 */
export type ArPeriodMode = "month" | "half" | "custom";

export interface ArPeriodBoxValue {
  mode: ArPeriodMode;
  /** "YYYY-MM-DD"。 */
  start: string;
  end: string;
}

export interface ArPeriodBoxLabels {
  month: string;
  half: string;
  custom: string;
  /** 半月の前半・後半（今の ARROW は「(前半)」「(後半)」）。 */
  first: string;
  second: string;
  /** 月の切り替えの前へ・次へ（読み上げ）。 */
  prevMonth: string;
  nextMonth: string;
  /** 切り替えのまとまりの名前（読み上げ）。 */
  modes: string;
  halves: string;
}

export interface ArPeriodBoxProps {
  /** 期間（v-model）。 */
  modelValue: ArPeriodBoxValue;
  /** 出す切り替え（既定は 1か月・半月・カスタム。layout="nav" ではカスタムを出さない）。 */
  modes?: readonly ArPeriodMode[];
  /** 「適用」のボタンの文字。渡したときだけ出し、押すと apply。 */
  applyText?: string;
  applyDisabled?: boolean;
  /** 切り替えの右の説明（「日付を変えると、合わなくなったときは『カスタム』に変わります」）。 */
  hint?: string;
  /** 年の選べる範囲（layout="range" の年のプルダウン）。 */
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  /** 読み上げの名前（例：「募集する期間」）。 */
  label: string;
  labels?: Partial<ArPeriodBoxLabels>;
}

export interface ArPeriodBoxEmits {
  "update:modelValue": [value: ArPeriodBoxValue];
  /** 「適用」を押した（今の期間を渡す）。 */
  apply: [value: ArPeriodBoxValue];
}

/** slot：default（箱の中の決まり。曜日の行・時間の表など）、actions（「決まりを追加」など。range は適用の左、nav は箱の中の右下）。 */
export type ArPeriodBoxPart = "root" | "box" | "nav" | "modes" | "hint" | "range" | "body" | "actions" | "apply" | "apply-arrow";
