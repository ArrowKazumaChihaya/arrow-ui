import { defineComponent, ref } from "vue";
import ArPayslipTable from "../src/components/ArPayslipTable.vue";
import ArPayslipLine from "../src/components/ArPayslipLine.vue";
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


describe("ArPayslip の編集スロット", () => {
  it("任意の列を編集でき、既定の列・見出し・行名との関連を維持する", async () => {
    const editor = defineComponent({
      components: { ArPayslip, ArPayslipTable, ArPayslipLine },
      setup: () => ({ columns, amount: ref("1250") }),
      template: `<ArPayslip title="給与明細" :columns="columns" :column-count="4">
        <template #column-1><ArPayslipTable title="支給"><ArPayslipLine label="基本給" editable>
          <template #default="{ labelId }"><input v-model="amount" :aria-labelledby="labelId" /></template>
        </ArPayslipLine></ArPayslipTable></template>
        <template #column-3><ArPayslipTable title="調整"><ArPayslipLine label="差額" :value="-1200" edited /></ArPayslipTable></template>
      </ArPayslip>`,
    });
    const w = mount(editor);
    const cols = w.findAll('[data-part="column"]');
    expect(cols).toHaveLength(4);
    expect(cols[0]!.text()).toContain("出勤日数");
    expect(cols[2]!.text()).toContain("税額表区分");
    expect(cols[3]!.text()).toContain("−1,200");
    const input = w.get("input");
    const label = cols[1]!.get('th[scope="row"]');
    expect(input.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(label.text()).toBe("基本給");
    expect(cols[1]!.get('tr[data-part="row"]').attributes("data-editable")).toBe("true");
    await input.setValue("9876");
    expect(w.vm.amount).toBe("9876");
    expect(cols[1]!.get("tbody").findAll("tr")).toHaveLength(1);
  });
  it("データ配列がなくても指定した列数で表を配置できる", () => {
    const w = mount(ArPayslip, { props: { title: "明細", columnCount: 2 }, slots: { "column-0": "支給", "column-1": "控除" } });
    expect(w.findAll('[data-part="column"]').map((col) => col.text())).toEqual(["支給", "控除"]);
  });
});
