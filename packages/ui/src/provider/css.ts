import { paletteNames, paletteSlots, tokenNames, toDeclarations } from "@arrow/ui-tokens";
import type { ArDesign } from "../design";

/** デザイン のトークンとテーマ色を CSS にする（Provider が html に置く）。 */
export function designCss(design: ArDesign): string {
  const root = `:root{${toDeclarations(tokenNames, design.tokens)}}`;
  const palettes = paletteNames
    .map((p) => `[data-ar-palette="${p}"]{${toDeclarations(paletteSlots, design.palettes[p])}}`)
    .join("\n");
  return `${root}\n${palettes}`;
}
