import { mount } from "@vue/test-utils";
import ArZoomControl from "../src/components/ArZoomControl.vue";
import ArBadge from "../src/components/ArBadge.vue";
import ArAvatar from "../src/components/ArAvatar.vue";

describe("ArZoomControl（担当 U4）", () => {
  it("−／＋ で out・in を出し、値を真ん中に出す。下限・上限で押せない", async () => {
    const w = mount(ArZoomControl, { props: { value: "64px", outDisabled: true, outLabel: "列を狭く", inLabel: "列を広く", label: "列の幅" } });
    expect(w.get('[data-part="zoom-value"]').text()).toBe("64px");
    expect(w.get('[role="group"]').attributes("aria-label")).toBe("列の幅");
    expect(w.get('[data-part="zoom-out"]').attributes("disabled")).toBeDefined();
    expect(w.get('[data-part="zoom-in"]').attributes("aria-label")).toBe("列を広く");
    await w.get('[data-part="zoom-in"]').trigger("click");
    expect(w.emitted("in")).toHaveLength(1);
    expect(w.emitted("out")).toBeUndefined();
  });
  it("variant と size を属性で出す", () => {
    const w = mount(ArZoomControl, { props: { value: "100%", variant: "plain", size: "sm" } });
    expect(w.attributes("data-variant")).toBe("plain");
    expect(w.attributes("data-size")).toBe("sm");
  });
});

describe("ArBadge 1.1（担当 U4）", () => {
  it("文字の件数・淡い地・白い縁", () => {
    const w = mount(ArBadge, { props: { count: "3/10", tone: "accent", variant: "subtle" } });
    expect(w.get('[data-part="count"]').text()).toBe("3/10");
    expect(w.attributes("data-variant")).toBe("subtle");
    expect(w.attributes("data-ring")).toBeUndefined();
    const r = mount(ArBadge, { props: { count: 120, ring: true, label: "" } });
    expect(r.get('[data-part="count"]').text()).toBe("99+");
    expect(r.attributes("data-ring")).toBeDefined();
    expect(r.find("[data-ar-visually-hidden]").exists()).toBe(false);
  });
});

describe("ArAvatar 1.1（担当 U4）", () => {
  it("写真と地・文字の色", () => {
    const w = mount(ArAvatar, { props: { text: "末", color: ["#E3EEFA", "#1F5F99"] } });
    expect(w.attributes("style")).toContain("background");
    const p = mount(ArAvatar, { props: { src: "/a.png", name: "末永" } });
    expect(p.get('[data-part="image"]').attributes("src")).toBe("/a.png");
  });
});
