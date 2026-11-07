/** Shared opening order for dialogs, drawers, previews and their floating inputs. */
const layers = new Map<symbol, number>();

export function acquireOverlayLayer(id: symbol, base = 1000, explicit?: number): number {
  const layer = explicit ?? Math.max(base, ...Array.from(layers.values(), (value) => value + 1));
  layers.set(id, layer);
  return layer;
}

export function releaseOverlayLayer(id: symbol): void {
  layers.delete(id);
}
