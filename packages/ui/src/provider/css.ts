import { cssVar, paletteNames, paletteSlots, tokenNames, toDeclarations } from "@s_and_a/arrow-ui-tokens";
import type { ArDesign } from "../design";

/**
 * デザインのトークンとテーマ色を CSS にする。
 * scope を渡さなければ html 全体（:root）に、渡せばその範囲（[data-ar-scope="…"]）の中だけに効かせる。
 */
export function designCss(design: ArDesign, scope?: string): string {
  const root = scope ? `[data-ar-scope="${scope}"]` : ":root";
  const tokens = `${root}{${toDeclarations(tokenNames, scaleFontTokens(design.tokens))}}`;
  const palettes = paletteNames
    .map((p) => {
      const sel = scope
        ? `[data-ar-scope="${scope}"][data-ar-palette="${p}"],[data-ar-scope="${scope}"] [data-ar-palette="${p}"]`
        : `[data-ar-palette="${p}"]`;
      return `${sel}{${toDeclarations(paletteSlots, design.palettes[p])}}`;
    })
    .join("\n");
  return `${tokens}\n${palettes}\n${toneCss(design, scope)}`;
}

/** 文字の大きさのトークンは、利用者が選んだ倍率（--ar-font-scale、既定1）を掛ける。 */
function scaleFontTokens<T extends Record<string, string>>(tokens: T): T {
  const scaled: Record<string, string> = { ...tokens };
  for (const [name, value] of Object.entries(tokens)) {
    if (name.startsWith("font.size-") && /^\d+(\.\d+)?px$/.test(value)) scaled[name] = `calc(${value} * var(--ar-font-scale, 1))`;
  }
  return scaled as T;
}

/** 色合い（data-ar-tone）ごとの上書き。テーマ色は、色合いとテーマ色の組み合わせで上書きする。 */
function toneCss(design: ArDesign, scope?: string): string {
  const rules: string[] = [];
  for (const [tone, def] of Object.entries(design.tones ?? {})) {
    const base = scope ? `[data-ar-scope="${scope}"][data-ar-tone="${tone}"]` : `[data-ar-tone="${tone}"]`;
    const tokenNamesToSet = tokenNames.filter((n) => typeof def.tokens?.[n] === "string");
    if (tokenNamesToSet.length) {
      rules.push(`${base}{${tokenNamesToSet.map((n) => `${cssVar(n)}:${def.tokens?.[n]}`).join(";")}}`);
    }
    for (const p of paletteNames) {
      const pal = def.palettes?.[p];
      const slots = paletteSlots.filter((s) => typeof pal?.[s] === "string");
      if (!slots.length) continue;
      // 同じ要素に色合いとテーマ色がある場合（html）と、色合いの中でテーマ色を変えた場合（ArThemeScope）。
      const sel = `${base}[data-ar-palette="${p}"],${base} [data-ar-palette="${p}"]`;
      rules.push(`${sel}{${slots.map((s) => `${cssVar(s)}:${pal?.[s]}`).join(";")}}`);
    }
  }
  return rules.join("\n");
}
