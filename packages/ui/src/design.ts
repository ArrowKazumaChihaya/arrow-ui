import {
  paletteNames,
  paletteSlots,
  tokenNames,
  type ArPalette,
  type ArPaletteName,
  type ArTokenValues,
} from "@s_and_a/arrow-ui-tokens";
import { designedComponents, type ArComponentName } from "./contracts";
import type { ArIconName } from "./icons";

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
  /**
   * アイコンの絵。ArIcon の名前 → そのときに描く絵（SVG の文字列。`<svg viewBox="…">…</svg>`）。
   * 渡した名前は、ライブラリの線のアイコンの代わりにこの絵を描く（渡さない名前は線のアイコンのまま）。
   * 色の指定がない所は文字の色（currentColor）で塗る。色が決まっている所（白・2色の絵など）はその色のまま。
   * 絵の中に `<style>`・`<script>` は書かない（ページ全体に効いてしまう）。色は属性（fill="…"）で書く。
   */
  icons?: Partial<Record<ArIconName, string>>;
  /**
   * 色合い（利用者が選べる色の強さの段階）。名前 → 上書きするトークンとテーマ色。
   * 選ばれていないとき（または "standard"）は tokens・palettes のまま。部品の形・大きさは変えず、色だけを変える。
   * 例：{ vivid: { label: "あざやか", palettes: { blue: { accent: "#3D83D6", … } } } }。
   */
  tones?: Record<string, ArDesignTone>;
}

/** 色合いの1段階。トークンとテーマ色の一部だけを上書きする（無い名前は元の値のまま）。 */
export interface ArDesignTone {
  label: string;
  tokens?: Partial<ArTokenValues>;
  palettes?: Partial<Record<ArPaletteName, Partial<ArPalette>>>;
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
  for (const [name, svg] of Object.entries(design.icons ?? {})) {
    if (typeof svg !== "string" || !/^<svg\b[^>]*\bviewBox="[^"]+"[^>]*>[\s\S]*<\/svg>$/.test(svg.trim()))
      problems.push(`アイコン「${name}」の絵が <svg viewBox="…">…</svg> の形ではありません`);
    else if (/<(style|script|foreignObject)\b|\son\w+=/i.test(svg)) problems.push(`アイコン「${name}」の絵に <style>・<script>・on… は書けません`);
  }
  for (const [tone, def] of Object.entries(design.tones ?? {})) {
    if (!/^[a-z][a-z0-9-]*$/.test(tone) || tone === "standard") problems.push(`色合い「${tone}」の名前が使えません（英小文字、standard 以外）`);
    if (!def?.label) problems.push(`色合い「${tone}」の label がありません`);
  }
  if (notCovered.length) problems.push(`見た目を用意していない部品があります: ${notCovered.join(", ")}`);
  if (problems.length) throw new ArDesignError(`design「${design.id}」を登録できません。\n- ${problems.join("\n- ")}`);
  return Object.freeze({ ...design });
}
