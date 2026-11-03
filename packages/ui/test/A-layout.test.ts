import { mount } from "@vue/test-utils";
import ArLayout from "../src/components/ArLayout.vue";
import ArSplitter from "../src/components/ArSplitter.vue";
import ArMasonry from "../src/components/ArMasonry.vue";
import ArCompact from "../src/components/ArCompact.vue";
import ArAffix from "../src/components/ArAffix.vue";

describe("ArLayout", () => {
  it("あるスロットだけ部位を出し、Sider の幅を変数で渡す", () => {
    const w = mount(ArLayout, { props: { siderWidth: 150 }, slots: { header: "頭", sider: "横", default: "中身" } });
    expect(w.attributes("data-has-sider")).toBe("start");
    expect(w.find('[data-part="footer"]').exists()).toBe(false);
    expect(w.get('[data-part="content"]').element.tagName).toBe("MAIN");
    expect((w.element as HTMLElement).style.getPropertyValue("--ar-layout-sider")).toBe("150px");
  });
});

describe("ArSplitter", () => {
  it("つまみは separator。←→で大きさを変え、Home で最小、Enter で元に戻す", async () => {
    const w = mount(ArSplitter, { props: { defaultSize: 200, min: 100, max: 400, step: 10 }, slots: { start: "左", end: "右" } });
    const bar = w.get('[data-part="bar"]');
    expect(bar.attributes("role")).toBe("separator");
    expect(bar.attributes("aria-orientation")).toBe("vertical");
    await bar.trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:size")?.[0]).toEqual([210]);
    await bar.trigger("keydown", { key: "ArrowLeft", shiftKey: true });
    expect(w.emitted("update:size")?.[1]).toEqual([160]);
    await bar.trigger("keydown", { key: "Home" });
    expect(w.emitted("update:size")?.[2]).toEqual([100]);
    await bar.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:size")?.[3]).toEqual([200]);
    expect(w.emitted("resizeEnd")?.[0]).toEqual([200]);
  });
});

describe("ArMasonry・ArCompact", () => {
  it("Masonry は列の数を style で、間を data-gap で渡す", () => {
    const w = mount(ArMasonry, { props: { columns: 3, gap: 2 }, slots: { default: "<div>a</div>" } });
    expect((w.element as HTMLElement).style.columns).toBe("3");
    expect(w.attributes("data-gap")).toBe("2");
  });
  it("Compact は label があれば group", () => {
    const w = mount(ArCompact, { props: { label: "期間" } });
    expect(w.attributes("role")).toBe("group");
    expect(w.attributes("data-direction")).toBe("horizontal");
  });
});

describe("ArAffix", () => {
  it("上からの距離を top で渡す（下に残すなら bottom）", () => {
    const w = mount(ArAffix, { props: { offsetTop: 8 }, slots: { default: "帯" } });
    expect((w.element as HTMLElement).style.top).toBe("8px");
    const b = mount(ArAffix, { props: { offsetBottom: 0 } });
    expect(b.attributes("data-position")).toBe("bottom");
  });
});
