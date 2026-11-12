import type { ArMascotArtwork } from "./ArMascot.contract";

let instances = 0;

/** 画面に入れてはいけない内容（script・イベント属性・javascript:・外部の参照）。 */
const unsafe = /<script|<foreignObject|<iframe|<object|<embed|\son[a-z]+\s*=|javascript:|(?:href|src)\s*=\s*["'](?!#)/i;

/**
 * 絵の SVG を、この部品の1つ分として画面に入れられる形にする。
 * id に部品ごとの接頭辞を付ける（同じ絵を2か所に出しても、グラデーションなどの参照が混ざらない）。
 * 危ない内容を含む絵は空にする。
 */
export function scopeMascotSvg(artwork: ArMascotArtwork): string {
  const svg = artwork.svg.trim();
  if (!/^<svg[\s>]/i.test(svg) || unsafe.test(svg)) return "";
  const prefix = `ar-mascot-${artwork.id}-${++instances}-`;
  let out = svg;
  for (const id of new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1] as string)))
    out = out
      .split(`id="${id}"`)
      .join(`id="${prefix}${id}"`)
      .split(`url(#${id})`)
      .join(`url(#${prefix}${id})`)
      .split(`href="#${id}"`)
      .join(`href="#${prefix}${id}"`);
  return out;
}

/** 絵の動きの CSS を、絵の名前ごとに1回だけ文書へ入れる。内容が変わっていれば入れ替える。 */
export function mountMascotCss(artwork: ArMascotArtwork): void {
  if (typeof document === "undefined" || !/^[a-z0-9-]+$/.test(artwork.id)) return;
  const found = document.head.querySelector<HTMLStyleElement>(`style[data-ar-mascot-css="${artwork.id}"]`);
  if (found) {
    if (found.textContent !== artwork.css) found.textContent = artwork.css;
    return;
  }
  const style = document.createElement("style");
  style.setAttribute("data-ar-mascot-css", artwork.id);
  style.textContent = artwork.css;
  document.head.append(style);
}
