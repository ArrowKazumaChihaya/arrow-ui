import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArTable from "../src/components/ArTable.vue";
import type { ArTableColumn } from "../src/components/ArTable.contract";

type R = { id: string; name: string; span?: number; memo?: string[]; info?: string };
const cols: ArTableColumn<R>[] = [
  { key: "name", title: "名前", sticky: true, colSpan: (r) => (r.id === "s" ? 2 : 1) },
  { key: "a", title: "A", colSpan: (r) => r.span ?? 1, value: (r) => `a-${r.id}` },
  { key: "b", title: "B", value: (r) => `b-${r.id}` },
  { key: "c", title: "C", value: (r) => `c-${r.id}` },
  { key: "memo", title: "メモ", lines: true },
];
const rows: R[] = [
  { id: "1", name: "一", span: 2, memo: ["x", "y"] },
  { id: "2", name: "二", span: 99, memo: [] },
  { id: "s", name: "止", memo: [] },
  { id: "i", name: "", info: "案内" },
];

describe("F2：横につなぐセル（ArTable 1.4）", () => {
  const w = mount(ArTable<R>, {
    props: { columns: cols, rows, rowKey: "id", caption: "表", selectable: true, fullRow: (r: R) => r.id === "i" },
    slots: { "full-row": ({ row }: { row: R }) => row.info, actions: () => "op" },
  });
  const trs = () => w.findAll('tbody[data-part="body"]>tr[data-part="row"]');

  it("colSpan は右の列をまたぎ、またがれた列は出さない。段・rowspan と一緒でも崩れない", () => {
    const first = trs()[0]!.findAll('td[data-part="cell"]:not([data-col])');
    expect(first.map((t) => t.text())).toEqual(["一", "a-1", "c-1", "x"]);
    expect(first[1]!.attributes("colspan")).toBe("2");
    expect(first[1]!.attributes("rowspan")).toBe("2");
    expect(trs()[1]!.findAll("td").map((t) => t.text())).toEqual(["y"]);
  });

  it("残りの列の数までに切る（右端まで）", () => {
    const cells = trs()[2]!.findAll('td[data-part="cell"]:not([data-col])');
    expect(cells.map((t) => t.text())).toEqual(["二", "a-2"]);
    expect(cells[1]!.attributes("colspan")).toBe("4");
    expect(cells[1]!.attributes("data-edge")).toBe("last");
  });

  it("止めた列と止めない列をまたぐセルは止めない", () => {
    const cells = trs()[3]!.findAll('td[data-part="cell"]:not([data-col])');
    expect(cells[0]!.attributes("colspan")).toBe("2");
    expect(cells[0]!.attributes("data-sticky")).toBeUndefined();
    expect(trs()[0]!.findAll("td")[1]!.attributes("data-sticky")).toBe("start");
  });

  it("fullRow の行は1つのセルでチェック・操作の列もまたぐ。全選択に数えない", async () => {
    const full = w.find('tr[data-full]');
    const td = full.find("td[data-full]");
    expect(td.text()).toBe("案内");
    // チェック＋5列＋操作
    expect(td.attributes("colspan")).toBe("7");
    await w.find('thead input[data-part="select"]').trigger("change");
    expect(w.emitted("update:selected")![0]).toEqual([["1", "2", "s"]]);
  });
});
