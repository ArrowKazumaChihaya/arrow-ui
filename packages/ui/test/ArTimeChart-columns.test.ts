import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ArTimeChart from "../src/components/ArTimeChart.vue";

const rows = [
  { key: "1", label: "11/01", bars: [{ start: 540, end: 1020, kind: "work" as const }], cells: { shift: "9:00〜17:00", work: "9:02〜17:05\n18:00〜19:00" } },
  { key: "2", label: "11/02", bars: [] },
];
const columns = [
  { key: "shift", label: "シフト" },
  { key: "work", label: "勤怠" },
];

describe("ArTimeChart の左の文字の列", () => {
  it("month では日付とチャートの間に列を出し、行ごとの文字（改行も）を入れる", () => {
    const w = mount(ArTimeChart, { props: { mode: "month", rows, columns } });
    expect(w.attributes("data-info")).toBe("");
    expect(w.find('[data-part="head-info"]').text()).toBe("シフト勤怠");
    const cells = w.findAll('[data-part="info"]');
    expect(cells).toHaveLength(2);
    expect(cells[0]!.findAll('[data-part="info-cell"]').map((c) => c.text())).toEqual(["9:00〜17:00", "9:02〜17:05\n18:00〜19:00"]);
    expect(cells[1]!.findAll('[data-part="info-cell"]').map((c) => c.text())).toEqual(["", ""]);
  });

  it("day や列のないときは今までどおり", () => {
    expect(mount(ArTimeChart, { props: { mode: "day", rows, columns } }).find('[data-part="info"]').exists()).toBe(false);
    const w = mount(ArTimeChart, { props: { mode: "month", rows } });
    expect(w.attributes("data-info")).toBeUndefined();
    expect(w.find('[data-part="head-info"]').exists()).toBe(false);
  });
});
