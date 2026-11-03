import { mount } from "@vue/test-utils";
import ArMenuTile from "../src/components/ArMenuTile.vue";

describe("ArMenuTile", () => {
  it("名前・件数・一言を出し、押すと click を出す", async () => {
    const w = mount(ArMenuTile, { props: { label: "勤怠", icon: "brief", palette: "green", count: 2, note: "エラー 2日" } });
    expect(w.element.tagName).toBe("BUTTON");
    expect(w.attributes("data-ar-palette")).toBe("green");
    expect(w.get('[data-part="label"]').text()).toBe("勤怠");
    expect(w.get('[data-part="count"]').text()).toBe("2");
    expect(w.get('[data-part="note"]').text()).toBe("エラー 2日");
    expect(w.attributes("aria-label")).toBe("勤怠（エラー 2日・2件）");
    expect(w.get('[data-part="icon"]').attributes("data-icon")).toBe("brief");
    await w.trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
  });
  it("件数は 0 なら出さず、100 以上は 99+", () => {
    expect(mount(ArMenuTile, { props: { label: "a", icon: "cal", count: 0 } }).find('[data-part="count"]').exists()).toBe(false);
    expect(mount(ArMenuTile, { props: { label: "a", icon: "cal", count: 128 } }).get('[data-part="count"]').text()).toBe("99+");
  });
  it("href でリンクになり、disabled は押せない", async () => {
    const a = mount(ArMenuTile, { props: { label: "マイページ", icon: "switch-user", href: "/personal/menu" } });
    expect(a.element.tagName).toBe("A");
    expect(a.attributes("href")).toBe("/personal/menu");
    const d = mount(ArMenuTile, { props: { label: "経費", icon: "yen", disabled: true } });
    expect(d.attributes("disabled")).toBeDefined();
    expect(d.attributes("data-state")).toBe("disabled");
    await d.trigger("click");
    expect(d.emitted("click")).toBeUndefined();
  });
});
