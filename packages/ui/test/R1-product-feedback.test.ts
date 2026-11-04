import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import fs from "node:fs";
import path from "node:path";
import ArAlert from "../src/components/ArAlert.vue";
import ArToast from "../src/components/ArToast.vue";
import ArModal from "../src/components/ArModal.vue";
import ArDrawer from "../src/components/ArDrawer.vue";

const root = path.resolve(__dirname, "../../..");
afterEach(() => vi.restoreAllMocks());

describe("製品からの指摘（シフトページの突き合わせ）", () => {
  it("ArAlert・ArToast の icon にアイコン名を渡しても警告が出ず、印が出る", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const a = mount(ArAlert, { props: { icon: "lock" }, slots: { default: "ロック中" } });
    mount(ArToast, { props: { open: true, icon: "lock" } });
    expect(a.find('[data-part="icon"]').exists()).toBe(true);
    expect(mount(ArAlert, { props: { icon: false } }).find('[data-part="icon"]').exists()).toBe(false);
    expect(warn.mock.calls.map((c) => String(c[0])).filter((m) => m.includes("Invalid prop"))).toEqual([]);
  });
  it("ArModal・ArDrawer は zIndex を受け取り、ほかの属性も外側の要素に渡る（警告なし）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const m = mount(ArModal, { props: { open: true, title: "題", zIndex: 2000, teleportTo: null }, attrs: { class: "k", "data-test": "m" } });
    const d = mount(ArDrawer, { props: { open: true, title: "題", zIndex: 1500, teleportTo: null }, attrs: { class: "k" } });
    await new Promise((r) => setTimeout(r, 0));
    const mr = m.find('[data-ar="modal"]');
    expect(mr.attributes("style")).toContain("z-index: 2000");
    expect(mr.classes()).toContain("k");
    expect(mr.attributes("data-test")).toBe("m");
    expect(d.find('[data-ar="drawer"]').attributes("style")).toContain("z-index: 1500");
    expect(warn.mock.calls.map((c) => String(c[0])).filter((s) => s.includes("Extraneous"))).toEqual([]);
  });
  it("design のパッケージの相対 import は拡張子つき（Node の ESM で読める）", () => {
    for (const d of ["remix", "classic"]) {
      const src = fs.readFileSync(path.join(root, `packages/ui-design-${d}/src/index.ts`), "utf8");
      const rel = [...src.matchAll(/from "(\.\.?\/[^"]+)"/g)].map((m) => m[1]!);
      expect(rel.filter((r) => !r.endsWith(".js") && !r.endsWith(".css"))).toEqual([]);
    }
  });
  it("パッケージは exports のほかに main・types も持つ（moduleResolution: node でも型が読める）", () => {
    for (const p of ["ui", "ui-tokens", "ui-design-remix", "ui-design-classic"]) {
      const j = JSON.parse(fs.readFileSync(path.join(root, `packages/${p}/package.json`), "utf8"));
      expect(j.main).toBeTruthy();
      expect(j.types).toBeTruthy();
    }
    const ui = JSON.parse(fs.readFileSync(path.join(root, "packages/ui/package.json"), "utf8"));
    expect(Object.keys(ui.typesVersions["*"])).toEqual(["design", "requirements"]);
  });
});
