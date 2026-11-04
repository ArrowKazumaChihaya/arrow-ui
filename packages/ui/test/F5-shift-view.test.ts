import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import ArShiftViewTable from "../src/components/ArShiftViewTable.vue";
import ArShiftDaySheet from "../src/components/ArShiftDaySheet.vue";
import { arUiContextKey } from "../src/provider/context";
import type { ArShiftViewRow, ArShiftViewShift } from "../src/components/ArShiftViewTable.contract";

const dates = ["2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20"];
const rows: ArShiftViewRow[] = [
  { key: 1, name: "千速 一真", keywords: "ちはや", live: "working" },
  { key: 2, name: "末永 修也", live: "absent" },
];
const shifts: ArShiftViewShift[] = [
  { id: 11, rowKey: 1, date: "2026-10-17", branchId: 2, times: [{ start: 1080, end: 1320 }] },
  { id: 10, rowKey: 1, date: "2026-10-17", branchId: 1, times: [{ start: 540, end: 1080 }], minutes: 480, color: "#4C5FC4" },
  { id: 12, rowKey: 2, date: "2026-10-18", branchId: 1, kind: "leave" },
  { id: 13, rowKey: 2, date: "2026-10-20", branchId: 1, times: [{ start: -60, end: 300 }] },
];
const branches = [
  { id: 1, name: "ARROW事業部" },
  { id: 2, name: "新宿店" },
];
const base = { dates, rows, shifts, branches, ownBranchIds: [1], today: "2026-10-20" };

describe("ArShiftViewTable", () => {
  it("人×日の表に札を早い時刻から並べ、店舗名とこの店舗／ほかの店舗／有給を分ける", () => {
    const w = mount(ArShiftViewTable, { props: base });
    const cells = w.findAll('tbody [data-part="cell"]');
    expect(cells).toHaveLength(8);
    const first = cells[0]!.findAll('[data-part="chip"]');
    expect(first.map((c) => c.attributes("data-scope"))).toEqual(["own", "other"]);
    expect(first[0]!.get('[data-part="chip-time"]').text()).toBe("9:00–18:00");
    expect(first[0]!.get('[data-part="chip-branch"]').text()).toBe("ARROW事業部");
    expect(first[1]!.get('[data-part="chip-branch"]').text()).toBe("新宿店");
    expect(first[0]!.attributes("style")).toContain("--ar-svt-chip: #4C5FC4");
    expect(cells[5]!.get('[data-part="chip"]').attributes("data-scope")).toBe("leave");
    expect(cells[5]!.text()).toContain("有給");
    expect(cells[7]!.text()).toContain("前日23:00–5:00");
  });

  it("名前の下の合計・今日の列・土日・合計の行・凡例をデータから作る", () => {
    const w = mount(ArShiftViewTable, { props: base });
    const subs = w.findAll('[data-part="name-sub"]').map((s) => s.text());
    expect(subs[0]).toBe("12時間・2日（他1）"); // キャンバスと同じく、この店舗の日とほかの店舗の日を足す
    const days = w.findAll('thead [data-part="day"]');
    expect(days[0]!.attributes("data-tone")).toBe("sat");
    expect(days[1]!.attributes("data-tone")).toBe("sun");
    expect(days[3]!.attributes("data-state")).toBe("today");
    expect(days[3]!.attributes("aria-current")).toBe("date");
    const foot = w.findAll('tfoot [data-part="foot"]').map((f) => f.text());
    expect(foot[0]).toBe("1人12時間");
    expect(foot[1]).toBe("0人0時間");
    expect(w.findAll('[data-part="legend-item"]').map((l) => l.attributes("data-kind"))).toEqual(["own", "other", "leave"]);
    expect(w.get('[data-part="legend-item"]').text()).toBe("この店舗（ARROW事業部）のシフト");
  });

  it("totals を渡すとその値を使い、勤怠の印を名前の前に出す", () => {
    const w = mount(ArShiftViewTable, { props: { ...base, totals: { "2026-10-17": { workers: 9, minutes: 600 } } } });
    expect(w.get('tfoot [data-part="foot"]').text()).toBe("9人10時間");
    const live = w.findAll('[data-part="live"]');
    expect(live.map((l) => [l.attributes("data-state"), l.attributes("aria-label")])).toEqual([
      ["working", "勤務中"],
      ["absent", "未打刻"],
    ]);
  });

  it("検索で行を絞り（keywords も当てる）、当てはまらなければ空の表示", async () => {
    const w = mount(ArShiftViewTable, { props: base });
    const input = w.get('[data-part="search-input"]');
    await input.setValue("ちはや");
    expect(w.emitted("update:query")?.at(-1)).toEqual(["ちはや"]);
    expect(w.findAll('tbody [data-part="name"]')).toHaveLength(1);
    await input.setValue("だれも");
    expect(w.get('[data-part="empty"]').text()).toContain("「だれも」に当てはまる従業員はいません");
  });

  it("search に数を渡すと行がその数以上のときだけ検索を出す", () => {
    expect(mount(ArShiftViewTable, { props: { ...base, search: 30 } }).find('[data-part="search"]').exists()).toBe(false);
    expect(mount(ArShiftViewTable, { props: { ...base, search: 2 } }).find('[data-part="search"]').exists()).toBe(true);
  });

  it("列の幅の −／＋ は刻みで動き、下限・上限で止まる", async () => {
    const w = mount(ArShiftViewTable, { props: { ...base, columnWidth: 96 } });
    const [out, inn] = w.findAll('[data-part="zoom-button"]');
    await out!.trigger("click");
    expect(w.emitted("update:columnWidth")?.[0]).toEqual([88]);
    await w.setProps({ columnWidth: 88 });
    expect(out!.attributes("disabled")).toBeDefined();
    await inn!.trigger("click");
    expect(w.emitted("update:columnWidth")?.at(-1)).toEqual([104]);
    expect(w.get('[data-part="table"]').attributes("style")).toContain("--ar-svt-cw: 88px");
  });

  it("期間の切り替えは periodOptions を渡したときだけ出し、update:period を出す", async () => {
    const w = mount(ArShiftViewTable, {
      props: { ...base, period: "half", periodOptions: [{ value: "week", label: "週" }, { value: "half", label: "半月" }] },
    });
    const items = w.findAll('[data-ar="segmented"] [data-part="item"]');
    expect(items).toHaveLength(2);
    await items[0]!.trigger("click");
    expect(w.emitted("update:period")?.[0]).toEqual(["week"]);
  });

  it("clickable で日付の見出しと札を押せる", async () => {
    const w = mount(ArShiftViewTable, { props: { ...base, clickable: true } });
    await w.get('thead [data-part="day-label"]').trigger("click");
    expect(w.emitted("day-click")?.[0]).toEqual(["2026-10-17"]);
    await w.get('[data-part="chip"]').trigger("click");
    const [s, r] = w.emitted("shift-click")![0] as [ArShiftViewShift, ArShiftViewRow];
    expect([s.id, r.key]).toEqual([10, 1]);
  });

  it("classic の形：今の閲覧タブ（右上に店舗名・「シフト」・09:00〜18:00、見出しは「17 (土)」、名前の下は「勤務 n日」）", () => {
    const design = { forms: { ArShiftViewTable: { chip: "labeled", time: "padded", dayHead: "inline", summary: "days", fill: "fixed", columnWidth: "136", nameWidth: "136" } } };
    const w = mount(ArShiftViewTable, {
      props: base,
      global: { provide: { [arUiContextKey as symbol]: { design: ref(design), palette: ref("blue"), portal: ref(null) } } },
    });
    const chip = w.get('[data-part="chip"]');
    expect(chip.findAll("[data-part]").map((p) => p.attributes("data-part"))).toEqual(["chip-branch", "chip-subject", "chip-time"]);
    expect(chip.text()).toBe("ARROW事業部シフト09:00〜18:00");
    expect(w.get('thead [data-part="day-num"]').text()).toBe("17 (土)");
    expect(w.get('[data-part="name-sub"]').text()).toBe("勤務 1日");
    expect(w.get('[data-ar="shift-view-table"]').attributes("data-fill")).toBe("fixed");
    expect(w.get('[data-part="table"]').attributes("style")).toContain("--ar-svt-cw: 136px");
  });
});

describe("ArShiftDaySheet", () => {
  it("下から出し、日付・曜日・要約を出して、前後・公開・閉じるを知らせる", async () => {
    const w = mount(ArShiftDaySheet, {
      props: { open: true, label: "10月21日", weekday: "水", summary: [{ label: "人件費", value: "¥36,300" }], published: true, teleportTo: null },
      slots: { default: () => h("p", { class: "inner" }, "勤務メンバー") },
    });
    await nextTick();
    const drawer = w.get('[data-ar="drawer"]');
    expect(drawer.attributes("data-placement")).toBe("bottom");
    expect(drawer.attributes("data-sheet")).toBe("shift-day");
    expect(w.get('[data-part="title"]').text()).toBe("シフト詳細");
    expect(w.get('[data-ar="period-nav"] [data-part="text"]').text()).toBe("10月21日");
    expect(w.get('[data-ar="period-nav"] [data-part="weekday"]').text()).toBe("水");
    expect(w.get('[data-ar="day-summary"]').text()).toContain("¥36,300");
    expect(w.get('[data-ar="shift-day-sheet"] [data-part="body"] .inner').text()).toBe("勤務メンバー");
    await w.get('[data-dir="next"]').trigger("click");
    await w.get('[data-dir="prev"]').trigger("click");
    expect(w.emitted("next")).toHaveLength(1);
    expect(w.emitted("prev")).toHaveLength(1);
    await w.get('[data-ar="day-summary"] [data-part="publish"]').trigger("click");
    expect(w.emitted("update:published")?.[0]).toEqual([false]);
    await w.get('[data-ar="drawer"] [data-part="close"]').trigger("click");
    expect(w.emitted("update:open")?.[0]).toEqual([false]);
    expect(w.emitted("close")).toHaveLength(1);
  });
});
