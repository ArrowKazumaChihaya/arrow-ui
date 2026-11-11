import { reactive } from "vue";

/**
 * Bare ArSpin marks that are on screen right now. Spinners in one region (the nearest dialog or the
 * page) are drawn once: the earliest in reading order keeps turning, the others hide until it ends.
 */
const marks = reactive(new Map<symbol, HTMLElement>());

export function registerBlockSpin(id: symbol, element: HTMLElement): void {
  marks.set(id, element);
}
export function unregisterBlockSpin(id: symbol): void {
  marks.delete(id);
}
function region(element: HTMLElement): Element | Document {
  return element.closest('[role="dialog"], [aria-modal="true"], [data-ar="dialog"], [data-ar="drawer"]') ?? document;
}
/** The spinner that is drawn in the same region as `id` (the first one in reading order). */
export function blockSpinOwner(id: symbol): symbol {
  const self = marks.get(id);
  if (!self) return id;
  let owner = id;
  let ownerElement = self;
  for (const [other, element] of marks) {
    if (other === id || region(element) !== region(self) || !element.isConnected) continue;
    if (ownerElement.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_PRECEDING) {
      owner = other;
      ownerElement = element;
    }
  }
  return owner;
}
