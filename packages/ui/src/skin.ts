import {
  paletteNames,
  paletteSlots,
  tokenNames,
  type ArPalette,
  type ArPaletteName,
  type ArTokenValues,
} from "@arrow/ui-tokens";
import { skinnedComponents, type ArComponentName } from "./contracts";

/**
 * skin（デザインの実装）。持つのは「トークンの値」「部位に当てる CSS」「対応した部品と契約の版」だけ。
 * 部品の構造と動きはライブラリが持ち、skin ごとに変えない。
 */
export interface ArSkin {
  /** 起動時に選ぶ ID。変えない。 */
  id: string;
  label: string;
  tokens: ArTokenValues;
  palettes: Record<ArPaletteName, ArPalette>;
  /** この skin が見た目を用意した部品と、その契約の版。 */
  covers: Partial<Record<ArComponentName, string>>;
  /** 部位への CSS を読み込む。Node（CI の確認）では呼ばない。 */
  styles?: () => Promise<unknown>;
  /** 移行中だけの skin なら、その旨（起動時に警告を出さない・文書に出すため）。 */
  deprecated?: string;
}

export class ArSkinError extends Error {
  override name = "ArSkinError";
}

/** トークン・テーマ色・対応部品がそろっていない skin は登録できない。 */
export function defineSkin(skin: ArSkin): ArSkin {
  const problems: string[] = [];
  if (!skin.id) problems.push("id がありません");
  const missingTokens = tokenNames.filter((n) => !skin.tokens?.[n]);
  if (missingTokens.length) problems.push(`トークンの値がありません: ${missingTokens.join(", ")}`);
  for (const p of paletteNames) {
    const pal = skin.palettes?.[p];
    const missing = paletteSlots.filter((s) => !pal?.[s]);
    if (missing.length) problems.push(`テーマ色「${p}」の値がありません: ${missing.join(", ")}`);
  }
  const notCovered = skinnedComponents.filter((c) => !skin.covers?.[c]);
  if (notCovered.length) problems.push(`見た目を用意していない部品があります: ${notCovered.join(", ")}`);
  if (problems.length) throw new ArSkinError(`skin「${skin.id}」を登録できません。\n- ${problems.join("\n- ")}`);
  return Object.freeze({ ...skin });
}
