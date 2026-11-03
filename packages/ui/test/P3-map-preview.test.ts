import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArMapPreview from "../src/components/ArMapPreview.vue";

describe("ArMapPreview", () => {
  it("半径と強さで円と札が変わる", async () => {
    const w = mount(ArMapPreview, { props: { radius: 100, restriction: "strict", address: "東京都渋谷区" } });
    expect(w.find('[data-part="range"]').exists()).toBe(true);
    expect(w.find('[data-part="caption"]').text()).toBe("半径 100m の打刻範囲");
    expect(w.attributes("aria-label")).toBe("東京都渋谷区 を中心に半径100メートルの打刻範囲を表す地図");
    expect(w.find('[data-part="range"]').attributes("style")).toContain("164px");
    await w.setProps({ radius: 5 });
    expect(w.find('[data-part="range"]').exists()).toBe(false);
    expect(w.find('[data-part="caption"]').text()).toBe("打刻範囲を入れると円が出ます");
    await w.setProps({ radius: 100, restriction: "none" });
    expect(w.find('[data-part="range"]').exists()).toBe(false);
  });
  it("slot の地図を敷く", () => {
    const w = mount(ArMapPreview, { props: { radius: 100 }, slots: { default: '<div class="mymap" />' } });
    expect(w.find(".mymap").exists()).toBe(true);
    expect(w.find('[data-part="sample"]').exists()).toBe(false);
  });
});
