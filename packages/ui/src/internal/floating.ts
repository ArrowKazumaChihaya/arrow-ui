/**
 * 浮かぶもの（プルダウン・吹き出し・メニュー・日付のパネル…）を置く場所を計算する。
 * 部品はこれを直接使わず、ArFloat.vue を通す。
 */
export type ArPlacement =
  | "bottom-start"
  | "bottom"
  | "bottom-end"
  | "top-start"
  | "top"
  | "top-end"
  | "right-start"
  | "right"
  | "left-start"
  | "left";

export interface FloatPosition {
  top: number;
  left: number;
  placement: ArPlacement;
  /** 矢印を置く位置（吹き出し用）。基準の要素の中央。 */
  arrow: number;
}

/** 画面の中に収まるように置く。足りない側なら反対へ返す。 */
export function computePosition(
  anchor: DOMRect,
  panel: { width: number; height: number },
  placement: ArPlacement,
  offset: number,
  viewport = { width: window.innerWidth, height: window.innerHeight },
  margin = 8,
): FloatPosition {
  const [side, align = "center"] = placement.split("-") as [string, string | undefined];
  let s = side;
  if (s === "bottom" && anchor.bottom + offset + panel.height > viewport.height - margin && anchor.top - offset - panel.height >= margin) s = "top";
  else if (s === "top" && anchor.top - offset - panel.height < margin && anchor.bottom + offset + panel.height <= viewport.height - margin) s = "bottom";
  else if (s === "right" && anchor.right + offset + panel.width > viewport.width - margin) s = "left";
  else if (s === "left" && anchor.left - offset - panel.width < margin) s = "right";

  let top = 0;
  let left = 0;
  if (s === "bottom" || s === "top") {
    top = s === "bottom" ? anchor.bottom + offset : anchor.top - offset - panel.height;
    left = align === "start" ? anchor.left : align === "end" ? anchor.right - panel.width : anchor.left + anchor.width / 2 - panel.width / 2;
    left = Math.min(Math.max(margin, left), Math.max(margin, viewport.width - margin - panel.width));
  } else {
    left = s === "right" ? anchor.right + offset : anchor.left - offset - panel.width;
    top = align === "start" ? anchor.top : anchor.top + anchor.height / 2 - panel.height / 2;
    top = Math.min(Math.max(margin, top), Math.max(margin, viewport.height - margin - panel.height));
  }
  const arrow = s === "bottom" || s === "top" ? anchor.left + anchor.width / 2 - left : anchor.top + anchor.height / 2 - top;
  const out = (align === "center" ? s : `${s}-${align}`) as ArPlacement;
  return { top: Math.round(top), left: Math.round(left), placement: out, arrow: Math.round(arrow) };
}
