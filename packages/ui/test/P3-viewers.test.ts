import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArPdfViewer from "../src/components/ArPdfViewer.vue";
import ArOrgChart from "../src/components/ArOrgChart.vue";
import ArTimeChart from "../src/components/ArTimeChart.vue";
import ArCalendar from "../src/components/ArCalendar.vue";

describe("ArPdfViewer", () => {
  it("ページ送り・何人目・大きさ", async () => {
    const pages = [1, 2, 3].map((n) => ({ src: `p${n}.png` }));
    const w = mount(ArPdfViewer, { props: { pages, people: ["末永 修也", "中口 万由香", "小山 結衣"] } });
    expect(w.find('[data-part="counter"]').text()).toBe("1 / 3");
    expect(w.find('[data-part="who"]').text()).toBe("末永 修也（1人目）");
    expect(w.find('[data-part="prev"]').attributes("disabled")).toBeDefined();
    await w.find('[data-part="next"]').trigger("click");
    expect(w.emitted("update:page")![0]).toEqual([2]);
    expect(w.find('[data-part="image"]').attributes("src")).toBe("p2.png");
    await w.find('[data-part="zoom-in"]').trigger("click");
    expect(w.emitted("update:zoom")![0]).toEqual([125]);
    await w.find('[data-part="viewport"]').trigger("keydown", { key: "ArrowRight" });
    expect(w.find('[data-part="who"]').text()).toBe("小山 結衣（3人目）");
  });
  it("iframe の src に #page と #zoom", () => {
    const w = mount(ArPdfViewer, { props: { src: "/a.pdf", pageCount: 4, page: 2, zoom: 85 } });
    expect(w.find("iframe").attributes("src")).toBe("/a.pdf#page=2&zoom=85");
  });
  it("toolbar を消すと見本の枠だけ（page slot）", () => {
    const w = mount(ArPdfViewer, { props: { toolbar: false }, slots: { page: "<h1>雇用契約書</h1>" } });
    expect(w.find('[data-part="bar"]').exists()).toBe(false);
    expect(w.attributes("data-bar")).toBe("none");
    expect(w.find('[data-part="paper"] h1').text()).toBe("雇用契約書");
  });
});

describe("ArOrgChart", () => {
  const nodes = [
    { key: "1", label: "ARROW事業部", code: "arrow", count: 8, children: [{ key: "5", label: "渋谷店", code: "shibuya", count: 12 }] },
    { key: "2", label: "ADVANCE事業部", code: "advance", count: 6 },
  ];
  it("札を押すと select、丸で開け閉め、拡大縮小", async () => {
    const w = mount(ArOrgChart, { props: { nodes, zoom: 1 } });
    expect(w.findAll('[data-part="node"]').length).toBe(3);
    expect(w.find('[data-part="node"]').attributes("aria-label")).toBe("ARROW事業部（arrow）を開く");
    await w.find('[data-part="node"]').trigger("click");
    expect((w.emitted("select")![0]![0] as { key: string }).key).toBe("1");
    await w.find('[data-part="toggle"]').trigger("click");
    expect(w.emitted("update:expanded")![0]).toEqual([[]]);
    expect(w.findAll('[data-part="node"]').length).toBe(2);
    await w.find('[data-part="zoom-in"]').trigger("click");
    expect(w.emitted("update:zoom")![0]).toEqual([1.1]);
    await w.find('[data-part="viewport"]').trigger("keydown", { key: "-" });
    expect(w.emitted("update:zoom")![1]).toEqual([0.9]);
  });
});

describe("ArTimeChart", () => {
  it("重なる計算区分を独立した帯に残し、区分名と全期間を読み上げる", async () => {
    const row = { key: "day", label: "11/04", bars: [{ kind: "work" as const, start: 480, end: 1080 }], tracks: [
      { key: "premium", label: "休日割増", bars: [{ kind: "outhol" as const, start: 480, end: 1080 }] },
      { key: "night", label: "深夜割増", bars: [{ kind: "night" as const, start: -60, end: 1620 }] },
    ] };
    const w = mount(ArTimeChart, { props: { mode: "day", rows: [row], legend: true } });
    expect(w.findAll('[data-part="bar"]')).toHaveLength(3);
    expect(w.get('[data-track="premium"] [data-part="bar"]').attributes("aria-label")).toContain("休日割増\n法定外休日");
    expect(w.get('[data-track="night"] [data-part="bar"]').attributes("aria-label")).toContain("深夜割増\n深夜勤務");
    expect(w.findAll('[data-part="tick"]').at(-1)?.text()).toBe("翌5");
    expect(w.findAll('[data-part="legend-item"]').map((x) => x.text())).toEqual(["通常勤務", "法定外休日", "深夜勤務"]);
    await w.setProps({ mode: "month" });
    await w.get('button[data-part="row-label"]').trigger("click");
    expect(w.emitted("select")?.[0]).toEqual([row]);
    w.unmount();
  });
  it("month：帯の場所と吹き出し、日付を押すと select", async () => {
    const rows = [
      { key: "1", label: "10/01", weekday: 4, sub: "通常", bars: [{ kind: "shift" as const, start: 780, end: 1320 }, { kind: "work" as const, start: 780, end: 1320, minutes: 480 }, { kind: "night" as const, start: 1320, end: 1380 }] },
      { key: "2", label: "10/04", weekday: 0, sub: "法定休日", note: "勤務なし", bars: [] },
    ];
    const w = mount(ArTimeChart, { props: { rows, legend: true } });
    const wraps = w.findAll('[data-part="lane"] [data-ar="tooltip"]');
    expect(wraps.map((x) => x.attributes("data-lane"))).toEqual(["shift", "main", "night"]);
    expect(wraps[1]!.attributes("style")).toContain("left: 48.27");
    expect(w.findAll('[data-part="legend-item"]').map((x) => x.text())).toEqual(["通常勤務", "深夜勤務（下の線）", "シフト（上の線）"]);
    expect(w.find('[data-part="lane"]').attributes("aria-label")).toContain("時間数 : 8時間00分");
    expect(w.find('[data-weekday="sun"]').text()).toBe("(日)");
    expect(w.findAll('[data-part="tick"]').map((t) => t.text())).toEqual(["0", "3", "6", "9", "12", "15", "18", "21", "翌0", "翌3"]);
    await w.find('button[data-part="row-label"]').trigger("click");
    expect((w.emitted("select")![0]![0] as { key: string }).key).toBe("1");
    expect(w.findAll('[data-part="note"]')[0]!.text()).toBe("勤務なし");
  });
  it("時間帯へキーボードで移り、独自の説明と金額を読める", async () => {
    const w = mount(ArTimeChart, { props: { mode: "day", rows: [{ key: "work", label: "勤務", bars: [{ kind: "work", start: -60, end: 1620, tip: "勤務 23:00〜27:00\n金額 1234" }] }] } });
    const bar = w.get('[data-part="bar"]');
    expect(bar.attributes("tabindex")).toBe("0");
    expect(bar.attributes("aria-label")).toBe("勤務 23:00〜27:00\n金額 1234");
    await w.setProps({ labels: { kinds: { work: "Work" } } });
    expect(bar.element).toBe(w.get('[data-part="bar"]').element);
    w.unmount();
  });
  it("day：帯の中の文字と1時間ごとの目盛り", () => {
    const w = mount(ArTimeChart, { props: { mode: "day", rows: [{ key: "s", label: "シフト", bars: [{ kind: "shift" as const, start: 1080, end: 1620, text: "18:00〜27:00" }] }] } });
    expect(w.find('[data-part="bar-text"]').text()).toBe("18:00〜27:00");
    expect(w.findAll('[data-part="tick"]')[0]!.text()).toBe("16");
    expect(w.find('button[data-part="row-label"]').exists()).toBe(false);
  });
});

describe("ArCalendar size=mini", () => {
  it("見出しは題だけ、マスに札と小さな文字、祝日は赤、下に footer", async () => {
    const w = mount(ArCalendar, {
      props: { size: "mini", month: "2026-11", title: "カレンダーで確かめる：2026年11月", weekendColors: true, showAdjacent: false, events: [{ date: "2026-11-03", label: "②", note: "10:00-19:00", background: "#F1EBFA" }], cellMarks: (d: string) => (d === "2026-11-03" ? { holiday: true } : undefined) },
      slots: { footer: "<span>① 曜日</span>" },
    });
    expect(w.attributes("data-size")).toBe("mini");
    expect(w.find('[data-part="title"]').text()).toBe("カレンダーで確かめる：2026年11月");
    expect(w.find('[data-part="modes"]').exists()).toBe(false);
    const c = w.find('[data-date="2026-11-03"]');
    expect(c.attributes("data-weekend")).toBe("sun");
    expect(c.find('[data-part="event"]').attributes("style")).toContain("background");
    expect(c.find('[data-part="note"]').text()).toBe("10:00-19:00");
    expect(w.find('[data-part="footer"]').text()).toBe("① 曜日");
    await c.trigger("click");
    expect(w.emitted("update:modelValue")![0]).toEqual(["2026-11-03"]);
  });
});
