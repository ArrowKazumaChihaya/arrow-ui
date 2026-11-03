import {
  paletteNames,
  paletteSlots,
  tokenNames,
  type ArPalette,
  type ArPaletteName,
  type ArTokenValues,
} from "@arrow/ui-tokens";
import { designedComponents, type ArComponentName } from "./contracts";

/**
 * デザインのライブラリ（見た目の実装）。持つのは「トークンの値」「部位に当てる CSS」「対応した部品と契約の版」だけ。
 * 部品の構造と動きはライブラリが持ち、デザインごとに変えない。
 */
export interface ArDesign {
  /** 起動時に選ぶ ID。変えない。 */
  id: string;
  label: string;
  tokens: ArTokenValues;
  palettes: Record<ArPaletteName, ArPalette>;
  /** このデザインが見た目を用意した部品と、その契約の版。 */
  covers: Partial<Record<ArComponentName, string>>;
  /** 部位への CSS を読み込む。Node（CI の確認）では呼ばない。 */
  styles?: () => Promise<unknown>;
  /** 移行中だけのデザインなら、その旨（起動時に警告を出さない・文書に出すため）。 */
  deprecated?: string;
  /**
   * 部品の「形の違い」。見た目だけでは表せない違い（例：今の ARROW の時刻は「時」と「分」が別々の箱）を、
   * 部品が用意した選択肢の中から選ぶ。値の受け渡しと動き（props・events）はどの形でも同じ。
   * 例：{ ArTimeInput: { fields: "split" } }。選べる名前と値は各部品の契約（contract.ts）に書く。
   */
  forms?: Partial<Record<ArComponentName, Record<string, string>>>;
}

export class ArDesignError extends Error {
  override name = "ArDesignError";
}

/** トークン・テーマ色・対応部品がそろっていないデザインは登録できない。 */
export function defineDesign(design: ArDesign): ArDesign {
  const problems: string[] = [];
  if (!design.id) problems.push("id がありません");
  const missingTokens = tokenNames.filter((n) => !design.tokens?.[n]);
  if (missingTokens.length) problems.push(`トークンの値がありません: ${missingTokens.join(", ")}`);
  for (const p of paletteNames) {
    const pal = design.palettes?.[p];
    const missing = paletteSlots.filter((s) => !pal?.[s]);
    if (missing.length) problems.push(`テーマ色「${p}」の値がありません: ${missing.join(", ")}`);
  }
  const notCovered = designedComponents.filter((c) => !design.covers?.[c]);
  if (notCovered.length) problems.push(`見た目を用意していない部品があります: ${notCovered.join(", ")}`);
  if (problems.length) throw new ArDesignError(`design「${design.id}」を登録できません。\n- ${problems.join("\n- ")}`);
  return Object.freeze({ ...design });
}
