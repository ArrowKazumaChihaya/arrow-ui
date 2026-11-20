import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import ArIcon from "../src/components/ArIcon.vue";
import { icons } from "../src/icons";
import { loadIconSet, registerIconSet } from "../src/iconSets";

describe("ArIcon の追加の組（registerIconSet）", () => {
  it("組をそのまま渡すと、組の名前:アイコンの名前で線の絵を描く", () => {
    registerIconSet("test-now", { star: '<path d="M12 2l3 7h7l-6 5 2 8-6-4-6 4 2-8-6-5h7z"></path>' });
    const w = mount(ArIcon, { props: { name: "test-now:star" } });
    expect(w.attributes("stroke")).toBe("currentColor");
    expect(w.html()).toContain('d="M12 2l3 7');
  });

  it("読む関数を渡すと、初めて描くときに1回だけ読み、読み終わると描き直る", async () => {
    let calls = 0;
    registerIconSet("test-lazy", async () => {
      calls++;
      return { dot: '<circle cx="12" cy="12" r="3"></circle>' };
    });
    const a = mount(ArIcon, { props: { name: "test-lazy:dot" } });
    const b = mount(ArIcon, { props: { name: "test-lazy:dot" } });
    expect(a.find("circle").exists()).toBe(false);
    await flushPromises();
    expect(a.find("circle").exists()).toBe(true);
    expect(b.find("circle").exists()).toBe(true);
    expect(calls).toBe(1);
    expect(Object.keys(await loadIconSet("test-lazy"))).toEqual(["dot"]);
  });

  it("組にない名前・足していない組は空、ARROW のアイコンは今までどおり", async () => {
    registerIconSet("test-empty", {});
    expect(mount(ArIcon, { props: { name: "test-empty:none" } }).html()).not.toContain("<path");
    expect(await loadIconSet("unknown")).toEqual({});
    expect(mount(ArIcon, { props: { name: "check" } }).html()).toContain(icons.check.slice(0, 20));
  });

  it("使えない組の名前と、script などを含む絵は登録できない", async () => {
    expect(() => registerIconSet("Bad Name", {})).toThrow();
    expect(() => registerIconSet("test-bad", { x: "<script>alert(1)</script>" })).toThrow();
    registerIconSet("test-bad-lazy", async () => ({ x: '<path onclick="x()"></path>' }));
    await expect(loadIconSet("test-bad-lazy")).rejects.toThrow();
  });
});
