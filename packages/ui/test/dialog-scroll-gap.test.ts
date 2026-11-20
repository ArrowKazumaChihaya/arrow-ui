import { afterEach, expect, it } from "vitest";
import { lockPageScroll } from "../src/internal/dialog";

afterEach(() => {
  lockPageScroll(false);
});

it("後ろを止めるときはスクロールバーの幅を覚えて右の余白で補い、外したら消す", () => {
  const root = document.documentElement;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1534 });
  Object.defineProperty(root, "clientWidth", { configurable: true, value: 1526 });
  lockPageScroll(true);
  expect(root.hasAttribute("data-ar-modal-open")).toBe(true);
  expect(root.style.getPropertyValue("--ar-scrollbar-gap")).toBe("8px");
  lockPageScroll(false);
  expect(root.hasAttribute("data-ar-modal-open")).toBe(false);
  expect(root.style.getPropertyValue("--ar-scrollbar-gap")).toBe("");
});
