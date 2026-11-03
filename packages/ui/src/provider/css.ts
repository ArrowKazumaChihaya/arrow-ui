import { paletteNames, paletteSlots, tokenNames, toDeclarations } from "@arrow/ui-tokens";
import type { ArDesign } from "../design";

/**
 * デザインのトークンとテーマ色を CSS にする。
 * scope を渡さなければ html 全体（:root）に、渡せばその範囲（[data-ar-scope="…"]）の中だけに効かせる。
 */
export function designCss(design: ArDesign, scope?: string): string {
  const root = scope ? `[data-ar-scope="${scope}"]` : ":root";
  const tokens = `${root}{${toDeclarations(tokenNames, design.tokens)}}`;
  const palettes = paletteNames
    .map((p) => {
      const sel = scope
        ? `[data-ar-scope="${scope}"][data-ar-palette="${p}"],[data-ar-scope="${scope}"] [data-ar-palette="${p}"]`
        : `[data-ar-palette="${p}"]`;
      return `${sel}{${toDeclarations(paletteSlots, design.palettes[p])}}`;
    })
    .join("\n");
  return `${tokens}\n${palettes}`;
}
