import { paletteNames, paletteSlots, tokenNames, toDeclarations } from "@arrow/ui-tokens";
import type { ArSkin } from "../skin";

/** skin のトークンとテーマ色を CSS にする（Provider が html に置く）。 */
export function skinCss(skin: ArSkin): string {
  const root = `:root{${toDeclarations(tokenNames, skin.tokens)}}`;
  const palettes = paletteNames
    .map((p) => `[data-ar-palette="${p}"]{${toDeclarations(paletteSlots, skin.palettes[p])}}`)
    .join("\n");
  return `${root}\n${palettes}`;
}
