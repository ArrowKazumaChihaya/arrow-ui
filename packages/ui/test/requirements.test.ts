import { mount } from "@vue/test-utils";
import { h } from "vue";
import { checkRequirements, defineRequirements, formatProblems, satisfies } from "../src/requirements";
import { defineDesign, ArDesignError, type ArDesign } from "../src/design";
import ArUiProvider from "../src/provider/ArUiProvider.vue";
import { remixDesign } from "@arrow/ui-design-remix";
import { classicDesign } from "@arrow/ui-design-classic";

describe("satisfies", () => {
  it.each([
    ["1.2.0", "^1.2", true],
    ["1.9.3", "^1.2", true],
    ["2.0.0", "^1.2", false],
    ["1.1.9", "^1.2", false],
    ["1.2.5", "~1.2", true],
    ["1.3.0", "~1.2", false],
    ["3.0.0", ">=2", true],
    ["1.0.0", "1.0.0", true],
    ["1.0.0", "*", true],
  ])("%s は %s を満たす：%s", (v, r, ok) => expect(satisfies(v, r)).toBe(ok));
});

describe("必要な部品の宣言", () => {
  it("部品のライブラリとデザインのライブラリが満たせば ok", () => {
    const r = defineRequirements({ components: { ArButton: "^1.0", ArTimeInput: "^1.0", ArStack: "^1.0" }, designs: [remixDesign, classicDesign] });
    expect(checkRequirements(r).ok).toBe(true);
  });

  it("ライブラリにない部品・足りない版は止める", () => {
    const r = defineRequirements({ components: { ArButton: "^2.0", ArTimeChart: "^1.0" } as never });
    const res = checkRequirements(r);
    expect(res.ok).toBe(false);
    expect(res.problems.map((p) => `${p.component}@${p.where}`)).toEqual(["ArButton@library", "ArTimeChart@library"]);
    expect(formatProblems(res)).toContain("ArTimeChart：^1.0 が必要 → ライブラリ は なし");
  });

  it("design が対応していない部品も止める（並べる基礎は design を問わない）", () => {
    const partial = { id: "half", covers: { ArButton: "1.0.0" } };
    const r = defineRequirements({ components: { ArButton: "^1.0", ArTable: "^1.0", ArStack: "^1.0" } });
    const res = checkRequirements(r, { designs: [partial] });
    expect(res.problems).toEqual([{ component: "ArTable", need: "^1.0", where: "design:half", have: null }]);
  });

  it("Provider は足りなければ画面を出さない", () => {
    const r = defineRequirements({ components: { ArButton: "^9.0" } });
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const w = mount(ArUiProvider, { props: { design: remixDesign, requires: r }, slots: { default: () => h("p", "画面") } });
    expect(w.find("p").exists()).toBe(false);
    expect(w.get('[data-ar="requirements-error"]').text()).toContain("ArButton");
    expect(err).toHaveBeenCalled();
    err.mockRestore();
    w.unmount();
  });

  it("Provider は design のトークンを html に置く", () => {
    const w = mount(ArUiProvider, { props: { design: remixDesign, palette: "green" }, slots: { default: () => h("p", "画面") } });
    expect(w.text()).toBe("画面");
    expect(document.documentElement.getAttribute("data-ar-design")).toBe("remix");
    expect(document.documentElement.getAttribute("data-ar-palette")).toBe("green");
    const css = document.querySelector("style[data-ar-tokens]")?.textContent ?? "";
    expect(css).toContain("--ar-color-text:#1F2933");
    expect(css).toContain('[data-ar-palette="green"]{--ar-accent:#4EB187');
    w.unmount();
    expect(document.querySelector("style[data-ar-tokens]")).toBeNull();
  });
});

describe("defineDesign", () => {
  it("トークン・テーマ色・部品が欠けた design は登録できない", () => {
    const broken = { ...remixDesign, id: "broken", tokens: { ...remixDesign.tokens, "color.text": "" }, covers: { ArButton: "1.0.0" } } as ArDesign;
    expect(() => defineDesign(broken)).toThrow(ArDesignError);
    try {
      defineDesign(broken);
    } catch (e) {
      expect(String(e)).toContain("color.text");
      expect(String(e)).toContain("ArTable");
    }
  });
  it("remix と classic はどちらもそろっている", () => {
    expect(remixDesign.id).toBe("remix");
    expect(classicDesign.deprecated).toBeTruthy();
  });
});

describe("ArUiProvider scope=self", () => {
  it("html ではなく自分の中だけにデザインを当て、2つのデザインを並べられる", () => {
    document.documentElement.removeAttribute("data-ar-design");
    const a = mount(ArUiProvider, { props: { design: remixDesign, scope: "self" }, slots: { default: () => h("p", "A") } });
    const b = mount(ArUiProvider, { props: { design: classicDesign, scope: "self", palette: "green" }, slots: { default: () => h("p", "B") } });
    expect(document.documentElement.hasAttribute("data-ar-design")).toBe(false);
    const wa = a.get('[data-ar="ui-scope"]');
    const wb = b.get('[data-ar="ui-scope"]');
    expect(wa.attributes("data-ar-design")).toBe("remix");
    expect(wb.attributes("data-ar-design")).toBe("classic");
    expect(wb.attributes("data-ar-palette")).toBe("green");
    const css = [...document.querySelectorAll("style[data-ar-tokens]")].map((s) => s.textContent).join("\n");
    expect(css).toContain(`[data-ar-scope="${wa.attributes("data-ar-scope")}"]{--ar-color-text:#1F2933`);
    expect(css).toContain(`[data-ar-scope="${wb.attributes("data-ar-scope")}"]{--ar-color-text:rgba(0,0,0,.88)`);
    a.unmount();
    b.unmount();
  });
});
