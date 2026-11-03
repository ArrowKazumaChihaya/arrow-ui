import { mount } from "@vue/test-utils";
import ArPayslip from "../src/components/ArPayslip.vue";

const columns = [
  { title: "勤怠", rows: [{ label: "出勤日数", value: "17日", diff: "+1" }] },
  { title: "支給", rows: [{ label: "基本給", value: 250000, prev: 250000 }, { label: "残業手当", value: 4885, prev: 6839 }, { label: "前月調整", value: -3200, edited: true }, { label: "合計", value: 251685, total: true }] },
  [{ title: "その他", rows: [{ label: "税額表区分", value: "甲" }] }, { title: "差引支給額", rows: [{ label: "差引支給額", value: 228866, prev: 219154, total: true, big: true }] }],
];

describe("ArPayslip", () => {
  it("見出し・列・表・行を出し、数は3桁区切り・マイナスは印を付ける", () => {
    const w = mount(ArPayslip, { props: { title: "給与明細書", period: "2026年11月25日支給分", meta: [{ label: "氏名", value: "千速 一真 様" }], columns } });
    expect(w.get('[data-part="title"]').text()).toBe("給与明細書");
    expect(w.findAll('[data-part="column"]')).toHaveLength(3);
    expect(w.findAll('[data-part="section"]')).toHaveLength(4);
    const vals = w.findAll('[data-part="value"]');
    expect(vals[1]!.text()).toBe("250,000");
    expect(vals[3]!.attributes("data-negative")).toBe("true");
    expect(vals[3]!.text()).toContain("−3,200");
    expect(w.find('[data-part="edited"]').exists()).toBe(true);
    expect(w.findAll('[data-part="row"]')[4]!.attributes("data-state")).toBe("total");
    expect(w.find('[data-part="diff"]').exists()).toBe(false);
  });
  it("compare で差を出す（数は自動で計算、文字の差はそのまま、0 は ±0）", () => {
    const w = mount(ArPayslip, { props: { title: "給与明細書", columns, compare: "diff", totals: [{ label: "総支給額", value: 295085, prev: 296439 }] } });
    const diffs = w.findAll('[data-part="section"] [data-part="diff"]').map((d) => [d.text(), d.attributes("data-sign")]);
    expect(diffs).toEqual([["+1", "up"], ["±0", "zero"], ["−1,954", "down"], ["+9,712", "up"]]);
    expect(w.get('[data-part="total"] [data-part="diff"]').text()).toBe("−1,354");
    expect(w.get('[data-part="unit"]').text()).toBe("円");
  });
  it("compare=prev は「前 ○○」も出す", () => {
    const w = mount(ArPayslip, { props: { title: "給与明細書", columns, compare: "prev" } });
    expect(w.findAll('[data-part="prev"]').map((p) => p.text())).toContain("前 6,839");
  });
});
