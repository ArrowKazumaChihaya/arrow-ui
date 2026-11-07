import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import ArDrawer from "../src/components/ArDrawer.vue";
import ArModal from "../src/components/ArModal.vue";
import ArFloat from "../src/internal/ArFloat.vue";
import { acquireOverlayLayer, releaseOverlayLayer } from "../src/internal/overlay";

// Teleports may be mounted before their parent sheet. Their DOM order must not own stacking.
describe("overlay opening order", () => {
  it("a pre-mounted modal opens above a later-mounted drawer; its floating picker stays above it", async () => {
    const modal = mount(ArModal, { props: { open: false, title: "Event", teleportTo: null }, attachTo: document.body });
    const drawer = mount(ArDrawer, { props: { open: true, title: "Day", teleportTo: null }, attachTo: document.body });
    const anchor = document.createElement("button");
    document.body.append(anchor);
    const picker = mount(ArFloat, { props: { open: false, anchor, ar: "test-picker" }, attachTo: document.body });
    try {
      await nextTick();
      await modal.setProps({ open: true });
      const modalLayer = Number(modal.get<HTMLElement>('[data-ar="modal"]').element.style.zIndex);
      expect(modalLayer).toBeGreaterThan(Number(drawer.get<HTMLElement>('[data-ar="drawer"]').element.style.zIndex));
      await picker.setProps({ open: true });
      await nextTick();
      expect(Number(document.querySelector<HTMLElement>('[data-ar="test-picker"]')?.style.zIndex)).toBeGreaterThan(modalLayer);
      await picker.setProps({ open: false });
      await modal.setProps({ open: false });
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(true);
      await drawer.setProps({ open: false });
      expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(false);
    } finally {
      picker.unmount(); modal.unmount(); drawer.unmount(); anchor.remove();
    }
  });

  it("reuses released space and respects explicit host layers", () => {
    const first = Symbol(), second = Symbol(), third = Symbol();
    try {
      expect(acquireOverlayLayer(first, 1000, 5000)).toBe(5000);
      expect(acquireOverlayLayer(second)).toBe(5001);
      releaseOverlayLayer(second);
      expect(acquireOverlayLayer(third)).toBe(5001);
    } finally {
      [first, second, third].forEach(releaseOverlayLayer);
    }
  });
});
