import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ArShiftGrid from "../src/components/ArShiftGrid.vue";
import { applyDrag, fillRect, inkOn, spanLong, spanShort } from "../src/internal/shiftGrid";
import type { ArShiftGridCell, ArShiftGridDay, ArShiftGridMember } from "../src/components/ArShiftGrid.contract";

afterEach(() => {
  document.body.innerHTML = "";
});

const members: ArShiftGridMember[] = [
  { key: 1, name: "千速 一真", minutes: 184 * 60, workDays: 23, offDays: 8 },
  { key: 2, name: "末永 修也", minutes: 176 * 60 + 30, workDays: 22, offDays: 9 },
];
const days: ArShiftGridDay[] = [
  { date: "2026-10-18", events: [{ name: "朝礼", color: "#2196F3" }] },
  { date: "2026-10-19", locked: true },
  { date: "2026-10-20", unpublished: true, need: 3 },
];
const patterns = [{ key: "p1", name: "通常勤務1", color: "#4C5FC4", times: [{ start: 540, end: 1080 }] }, { key: "p2", name: "早番", color: "#449B47" }];
const cells: Record<string, Record<string, ArShiftGridCell>> = {
  "1": {
    "2026-10-18": { pattern: "p1", times: [{ start: 540, end: 1080 }], breaks: [{ start: 720, end: 780 }] },
    "2026-10-20": { times: [{ start: 540, end: 720 }, { start: 1020, end: 1260 }] },
  },
  "2": { "2026-10-18": { leave: true }, "2026-10-20": { avail: { times: [{ start: 600, end: 900 }], note: "午後は通院" } } },
};
const base = { members, days, cells, patterns, today: "2026-10-20", platform: "mac" as const };
const cell = (w: ReturnType<typeof mount>, r: number, c: number) => w.get(`[data-part="cell"][data-r="${r}"][data-c="${c}"]`);

describe("ArShiftGrid", () => {
  it("見出し（曜日の色・今日・鍵・目の印）、イベント、名前の要約、人数と不足の行を描く", () => {
    const w = mount(ArShiftGrid, { props: base });
    const dates = w.findAll('[data-part="date"]');
    expect(dates[0]!.attributes("data-tone")).toBe("sun");
    expect(dates[2]!.attributes("data-today")).toBe("");
    expect(dates[2]!.attributes("data-unpublished")).toBe("");
    expect(w.findAll('[data-part="status"] [data-ar="icon"]').length).toBe(2);
    expect(w.get('[data-part="event"]').text()).toBe("朝礼");
    expect(w.findAll('[data-part="summary"]')[1]!.text()).toBe("176時間30分22日勤務9日休み");
    const foot = w.findAll('[data-part="foot"]');
    expect(foot[0]!.findAll('[data-part="foot-cell"]').map((x) => x.text())).toEqual(["1人", "0人", "1人"]);
    expect(foot[1]!.findAll('[data-part="foot-cell"]')[2]!.text()).toBe("不足2");
    expect(cell(w, 0, 1).attributes("data-locked")).toBe("");
  });

  it("マス：パターン色・パターンなし・有給・提出、広い列は1日2つのシフトを1行ずつ", async () => {
    const w = mount(ArShiftGrid, { props: { ...base, columnWidth: 80 } });
    expect(cell(w, 0, 0).attributes("style")).toContain("--sg-c: #4C5FC4");
    expect(cell(w, 0, 2).attributes("data-pattern")).toBe("none");
    expect(cell(w, 0, 2).findAll('[data-part="line"]').map((x) => x.text())).toEqual(["9:00–12:00", "17:00–21:00"]);
    expect(cell(w, 1, 0).get('[data-part="shift"]').attributes("data-leave")).toBe("");
    const av = cell(w, 1, 2).get('[data-part="avail"]');
    expect(av.text()).toBe("希望 10:00–15:00");
    await av.trigger("click");
    expect(w.emitted("avail")![0]![0]).toMatchObject({ member: 2, date: "2026-10-20", row: 1, col: 2 });
    await w.setProps({ columnWidth: 32 });
    expect(cell(w, 0, 2).findAll('[data-part="line"]')).toHaveLength(0);
    expect(cell(w, 1, 2).get('[data-part="avail"]').text()).toBe("希");
  });

  it("キーボード：矢印で選び、Shift で広げ、コピー・貼り付け・削除・元に戻す・やり直す", async () => {
    const w = mount(ArShiftGrid, { props: base, attachTo: document.body });
    const vp = w.get('[data-part="viewport"]');
    await vp.trigger("keydown", { key: "ArrowRight" });
    expect(cell(w, 0, 0).attributes("aria-selected")).toBe("true");
    await vp.trigger("keydown", { key: "ArrowDown", shiftKey: true });
    const sel = w.emitted("select")!.at(-1)![0] as { members: unknown[]; dates: string[] };
    expect(sel.members).toEqual([1, 2]);
    expect(sel.dates).toEqual(["2026-10-18"]);
    await vp.trigger("keydown", { key: "c", metaKey: true });
    expect(w.emitted("copy")).toHaveLength(1);
    expect(cell(w, 0, 0).attributes("data-clip")).toBe("copy");
    await vp.trigger("keydown", { key: "ArrowRight" });
    await vp.trigger("keydown", { key: "ArrowRight" });
    await vp.trigger("keydown", { key: "v", ctrlKey: true });
    const paste = w.emitted("paste")![0]![0] as { mode: string; source: { dates: string[] }; target: { members: unknown[]; dates: string[] } };
    expect(paste.mode).toBe("copy");
    expect(paste.source.dates).toEqual(["2026-10-18"]);
    expect(paste.target.members).toEqual([2]);
    expect(paste.target.dates).toEqual(["2026-10-20"]);
    await vp.trigger("keydown", { key: "Delete" });
    expect(w.emitted("delete")).toHaveLength(1);
    await vp.trigger("keydown", { key: "z", metaKey: true });
    await vp.trigger("keydown", { key: "z", metaKey: true, shiftKey: true });
    expect(w.emitted("undo")).toHaveLength(1);
    expect(w.emitted("redo")).toHaveLength(1);
    await vp.trigger("keydown", { key: "Enter" });
    expect(w.emitted("open")![0]![0]).toMatchObject({ member: 2, date: "2026-10-20" });
    await vp.trigger("keydown", { key: "Escape" });
    expect(w.findAll('[aria-selected="true"]')).toHaveLength(0);
  });

  it("切り取りは貼り付けで mode=cut、見るだけ（editable=false）はコピーしない", async () => {
    const w = mount(ArShiftGrid, { props: base });
    const vp = w.get('[data-part="viewport"]');
    await vp.trigger("keydown", { key: "ArrowRight" });
    await vp.trigger("keydown", { key: "x", metaKey: true });
    await vp.trigger("keydown", { key: "ArrowDown" });
    await vp.trigger("keydown", { key: "v", metaKey: true });
    expect((w.emitted("paste")![0]![0] as { mode: string }).mode).toBe("cut");
    const ro = mount(ArShiftGrid, { props: { ...base, editable: false } });
    const v2 = ro.get('[data-part="viewport"]');
    await v2.trigger("keydown", { key: "ArrowRight" });
    await v2.trigger("keydown", { key: "c", metaKey: true });
    expect(ro.emitted("copy")).toBeUndefined();
    expect(ro.find('[data-part="pattern-edit"]').exists()).toBe(false);
  });

  it("見出しの日付を押すと day-open、パターンの検索は名前の一部で絞り、合わないと知らせる", async () => {
    const w = mount(ArShiftGrid, { props: base });
    await w.findAll('[data-part="date"]')[1]!.trigger("click");
    expect((w.emitted("day-open")![0]![0] as ArShiftGridDay).date).toBe("2026-10-19");
    expect(w.findAll('[data-part="pattern"]')).toHaveLength(2);
    await w.get('[data-part="pattern-search"] input').setValue("早");
    expect(w.findAll('[data-part="pattern"]').map((x) => x.text())).toEqual(["早番"]);
    await w.get('[data-part="pattern-search"] input').setValue("夜");
    expect(w.get('[data-part="pattern-none"]').text()).toBe("「夜」に合うパターンはありません");
  });

  it("パターンを選んだマスへ Enter で置く（ロックの日は除く）", async () => {
    const w = mount(ArShiftGrid, { props: base });
    const vp = w.get('[data-part="viewport"]');
    await vp.trigger("keydown", { key: "ArrowRight" });
    await vp.trigger("keydown", { key: "ArrowRight", shiftKey: true });
    await w.findAll('[data-part="pattern"]')[0]!.trigger("keydown", { key: "Enter" });
    const p = w.emitted("pattern-drop")![0]![0] as { pattern: { name: string }; targets: { date: string }[] };
    expect(p.pattern.name).toBe("通常勤務1");
    expect(p.targets.map((t) => t.date)).toEqual(["2026-10-18"]);
  });

  it("列の幅の −／＋ はマスとチャートで別の範囲、マス／チャートの切り替え", async () => {
    const w = mount(ArShiftGrid, { props: { ...base, controls: true, columnWidth: 136 } });
    await w.get('[data-part="zoom-in"]').trigger("click");
    expect(w.emitted("update:columnWidth")![0]).toEqual([140]);
    expect(w.get('[data-part="zoom-in"]').attributes("disabled")).toBeDefined();
    (w.vm as unknown as { setMode: (m: string) => void }).setMode("chart");
    await nextTick();
    expect(w.emitted("update:mode")![0]).toEqual(["chart"]);
    expect(w.get('[data-ar="shift-grid"]').attributes("data-mode")).toBe("chart");
    expect(w.findAll('[data-part="axis"]')).toHaveLength(3);
    expect(cell(w, 0, 0).findAll('[data-part="bar"]')).toHaveLength(1);
    expect(cell(w, 0, 0).findAll('[data-part="break"]')).toHaveLength(1);
    expect(cell(w, 0, 0).get('[data-part="bar-label"]').text()).toBe("9:00–18:00");
    expect(cell(w, 0, 2).get('[data-part="bar-label"]').text()).toBe("9:00–12:00 / 17:00–21:00");
    expect(cell(w, 1, 2).findAll('[data-part="avail-bar"]')).toHaveLength(1);
  });

  it("チャート：帯の取っ手を右へドラッグすると chart-change（15分きざみ）", async () => {
    const w = mount(ArShiftGrid, { props: { ...base, mode: "chart" }, attachTo: document.body });
    const track = cell(w, 0, 0).get('[data-part="bar-track"]').element as HTMLElement;
    track.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 180, bottom: 16, width: 180, height: 16, toJSON() {} }) as DOMRect;
    const h = cell(w, 0, 0).findAll('[data-part="handle"]')[1]!;
    h.element.dispatchEvent(new MouseEvent("pointerdown", { button: 0, clientX: 120, bubbles: true }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 131 }));
    window.dispatchEvent(new MouseEvent("pointerup", {}));
    await nextTick();
    const ev = w.emitted("chart-change")![0]![0] as { times: { start: number; end: number }[] };
    expect(ev.times).toEqual([{ start: 540, end: 1140 }]);
  });

  it("右クリックで操作の一覧（追加／編集・コピー・切り取り・貼り付け・削除）", async () => {
    const w = mount(ArShiftGrid, { props: base, attachTo: document.body });
    await cell(w, 0, 0).trigger("contextmenu");
    await nextTick();
    const items = [...document.querySelectorAll('[data-ar="shift-grid-menu"] [data-part="menu-item"]')] as HTMLButtonElement[];
    expect(items.map((x) => x.textContent?.trim())).toEqual(["編集", "コピー", "切り取り", "貼り付け", "削除"]);
    expect(items[3]!.disabled).toBe(true);
    items[1]!.click();
    expect(w.emitted("copy")).toHaveLength(1);
  });

  it("classic の形：2段目に「名前」とシフトチャートのボタン、マスは塗り、要約は今の書き方", async () => {
    const design = { forms: { ArShiftGrid: { head: "button", cell: "fill", summary: "paren", fit: "scale" } } };
    const { arUiContextKey } = await import("../src/provider/context");
    const { ref } = await import("vue");
    const w = mount(ArShiftGrid, {
      props: { ...base, columnWidth: 136 },
      global: { provide: { [arUiContextKey as symbol]: { design: ref(design), palette: ref("blue"), portal: ref(null) } } },
    });
    const sub = w.get('[data-part="head-sub"]');
    expect(sub.get('[data-part="name-head"]').text()).toBe("名前");
    await sub.findAll('[data-part="chart-button"]')[0]!.trigger("click");
    expect(w.emitted("day-chart")).toHaveLength(1);
    expect(w.findAll('[data-part="date-num"]')[0]!.text()).toBe("18 (日)");
    expect(cell(w, 0, 0).attributes("style")).toContain("--sg-ink: white");
    expect(cell(w, 0, 0).findAll('[data-part="detail-label"]').map((x) => x.text())).toEqual(["通常勤務1", "シフト", "休憩"]);
    expect(cell(w, 1, 0).attributes("style")).toContain("--sg-c: #808080");
    expect(w.findAll('[data-part="summary"]')[0]!.text()).toBe("184時間0分 23日勤務（8日休み）");
  });
});

describe("shiftGrid の計算", () => {
  it("時刻の書き方・文字の色・オートフィル・ドラッグ", () => {
    expect(spanShort({ start: 540, end: 1080 })).toBe("9:00–18:00");
    expect(spanLong({ start: -60, end: 1440 })).toBe("前日23:00〜24:00");
    expect(inkOn("#4C5FC4")).toBe("white");
    expect(inkOn("#FFF2CC")).toBe("black");
    expect(fillRect({ r0: 0, r1: 0, c0: 0, c1: 1 }, { r: 3, c: 1 })).toEqual({ r0: 0, r1: 3, c0: 0, c1: 1 });
    expect(fillRect({ r0: 0, r1: 0, c0: 0, c1: 1 }, { r: 0, c: 0 })).toBeNull();
    const d = { kind: "move" as const, row: 0, col: 0, toRow: 0, toCol: 0, x0: 0, width: 100, anchor: 0, times: [{ start: 540, end: 1080 }], breaks: [{ start: 720, end: 780 }], next: [], nextBreaks: [], moved: false };
    expect(applyDrag(d, 60, 0, 1800, 15)).toEqual({ times: [{ start: 600, end: 1140 }], breaks: [{ start: 780, end: 840 }] });
    expect(applyDrag({ ...d, kind: "start" }, 600, 0, 1800, 15).times).toEqual([{ start: 1020, end: 1080 }]);
    expect(applyDrag({ ...d, kind: "new", anchor: 600 }, 90, 360, 1440, 15).times).toEqual([{ start: 600, end: 690 }]);
  });
});
