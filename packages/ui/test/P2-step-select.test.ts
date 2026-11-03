import { mount } from "@vue/test-utils";
import { h } from "vue";
import ArStepSelect from "../src/components/ArStepSelect.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

const steps = [
  { key: "kind", title: "種類を選ぶ", done: true, crumbLabel: "種類", crumbValue: "給与関連" },
  { key: "doc", title: "書類を選ぶ", done: true, crumbLabel: "書類", crumbValue: "給与明細書" },
  { key: "ym", title: "年月を選ぶ", count: "2名" },
  { key: "dl", title: "ダウンロード" },
];

describe("ArStepSelect", () => {
  it("済み・今・次を決め、段の間に矢印、slot の中身を出す", () => {
    const w = mount(ArStepSelect, { props: { steps }, slots: { "step-ym": () => h("p", "年月の入力"), "extra-ym": () => h("span", "右") } });
    const s = w.findAll('[data-part="step"]');
    expect(s.map((x) => x.attributes("data-state"))).toEqual(["done", "done", "current", "next"]);
    expect(s[2]!.attributes("aria-current")).toBe("step");
    expect(s[3]!.get('[data-part="marker"]').text()).toBe("4");
    expect(w.findAll('[data-part="connector"]')).toHaveLength(3);
    expect(s[2]!.get('[data-part="body"]').text()).toBe("年月の入力");
    expect(s[2]!.get('[data-part="extra"]').text()).toBe("右");
    expect(s[2]!.get('[data-part="count"]').text()).toBe("2名");
  });
  it("道しるべの札を押すと jump を出し、その段の箱へフォーカスする", async () => {
    const w = mount(ArStepSelect, { props: { steps }, attachTo: document.body });
    const crumbs = w.findAll('[data-part="crumb"]');
    expect(crumbs).toHaveLength(2);
    expect(crumbs[1]!.attributes("aria-current")).toBe("step");
    await crumbs[0]!.trigger("click");
    expect(w.emitted("jump")).toEqual([["kind"]]);
    expect(document.activeElement).toBe(w.findAll('[data-part="step"]')[0]!.element);
  });
  it("札が1つ以下なら道しるべを出さない", () => {
    const w = mount(ArStepSelect, { props: { steps: [steps[0]!, steps[2]!] } });
    expect(w.find('[data-part="crumbs"]').exists()).toBe(false);
  });
});
