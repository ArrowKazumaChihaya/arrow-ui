import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import ArPeriodNav from "../src/components/ArPeriodNav.vue";
import ArSectionHead from "../src/components/ArSectionHead.vue";
import ArViewOptions from "../src/components/ArViewOptions.vue";
import ArCalendar from "../src/components/ArCalendar.vue";
import ArSegmented from "../src/components/ArSegmented.vue";
import ArDivider from "../src/components/ArDivider.vue";
import ArTable from "../src/components/ArTable.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ArPeriodNav", () => {
  it("前へ・次へ・年月・今日を押すとそれぞれ知らせる。前後は名前つき", async () => {
    const w = mount(ArPeriodNav, {
      props: { label: "2026年10月", pickable: true, todayLabel: "今日", labels: { prev: "前の月", next: "次の月", pick: "年月を選ぶ" } },
    });
    const [prev, next] = w.findAll('[data-part="arrow"]');
    expect(prev!.attributes("aria-label")).toBe("前の月");
    await prev!.trigger("click");
    await next!.trigger("click");
    await w.get('button[data-part="label"]').trigger("click");
    await w.get('[data-part="today"]').trigger("click");
    expect(w.emitted("prev")).toHaveLength(1);
    expect(w.emitted("next")).toHaveLength(1);
    expect(w.emitted("pick")).toHaveLength(1);
    expect(w.emitted("today")).toHaveLength(1);
  });
  it("日の切り替えは曜日の札を出し、今日のボタンは渡さなければ出さない", () => {
    const w = mount(ArPeriodNav, { props: { label: "10月21日", weekday: "水", size: "lg", prevDisabled: true } });
    expect(w.get('[data-part="weekday"]').text()).toBe("水");
    expect(w.find('[data-part="today"]').exists()).toBe(false);
    expect(w.find('button[data-part="label"]').exists()).toBe(false);
    expect(w.findAll('[data-part="arrow"]')[0]!.attributes("disabled")).toBeDefined();
  });
});

describe("ArSectionHead", () => {
  it("件数の札と操作を出し、collapsible なら押すと open を切り替える", async () => {
    const w = mount(ArSectionHead, {
      props: { title: "勤務可能な人", icon: "inbox", count: "2名", collapsible: true, open: true, controls: "x" },
      slots: { actions: "<button>操作</button>" },
    });
    const t = w.get('[data-part="toggle"]');
    expect(t.element.tagName).toBe("BUTTON");
    expect(t.attributes("aria-expanded")).toBe("true");
    expect(t.attributes("aria-controls")).toBe("x");
    expect(w.get('[data-part="count"]').text()).toBe("2名");
    expect(w.find("h3").text()).toBe("勤務可能な人");
    await t.trigger("click");
    expect(w.emitted("update:open")![0]).toEqual([false]);
  });
  it("collapsible でなければ見出しはボタンにならない", () => {
    const w = mount(ArSectionHead, { props: { title: "勤務メンバー" } });
    expect(w.get('[data-part="toggle"]').element.tagName).toBe("DIV");
  });
});

describe("ArViewOptions", () => {
  const groups = [
    { label: "日ごと", options: [{ key: "a", label: "人数" }, { key: "b", label: "不足", sample: { text: "不足1" } }] },
    { options: [{ key: "c", label: "ロック中", disabled: true }] },
  ];
  it("ボタンに選んでいる数を出し、↓で開いて Space で切り替える", async () => {
    const w = mount(ArViewOptions, { props: { modelValue: ["a"], groups }, attachTo: document.body });
    const btn = w.get('[data-part="trigger"]');
    expect(btn.get('[data-part="count"]').text()).toBe("1/3");
    await btn.trigger("keydown", { key: "ArrowDown" });
    await flushPromises();
    await nextTick();
    expect(btn.attributes("aria-expanded")).toBe("true");
    const items = document.querySelectorAll<HTMLButtonElement>('[role="menuitemcheckbox"]');
    expect(items).toHaveLength(3);
    expect(items[0]!.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(items[0]);
    items[1]!.click();
    expect(w.emitted("update:modelValue")![0]).toEqual([["a", "b"]]);
    w.unmount();
  });
  it("「すべて表示」は選べない項目を足さず、Escape で閉じてボタンへ戻る", async () => {
    const w = mount(ArViewOptions, { props: { modelValue: [], groups, open: true }, attachTo: document.body });
    await flushPromises();
    const foot = document.querySelectorAll<HTMLButtonElement>('[data-part="foot"] button');
    foot[0]!.click();
    expect(w.emitted("update:modelValue")![0]).toEqual([["a", "b"]]);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    w.unmount();
  });
});

describe("ArCalendar board", () => {
  it("印（ロック・非公開・注意）を状態と読み上げに出し、月の1日は「10/1」、cell slot は下の段に置く", () => {
    const w = mount(ArCalendar, {
      props: {
        variant: "board",
        month: "2026-10",
        today: "2026-10-20",
        showHeader: false,
        events: [{ date: "2026-10-02", label: "朝礼", color: "#2196F3" }],
        cellMarks: (d: string) => (d === "2026-10-01" ? { locked: true } : d === "2026-10-27" ? { unpublished: true, alert: true } : undefined),
      },
      slots: { cell: "<span class='n'>4名</span>" },
    });
    const first = w.get('[data-date="2026-10-01"]');
    expect(first.attributes("data-state")).toContain("locked");
    expect(first.attributes("aria-label")).toContain("ロック中");
    expect(first.get('[data-part="day"]').text()).toBe("10/1");
    expect(first.find('[data-part="lock"]').exists()).toBe(true);
    expect(first.get('[data-part="foot"] .n').text()).toBe("4名");
    const d27 = w.get('[data-date="2026-10-27"]');
    expect(d27.attributes("data-state")).toContain("alert");
    expect(d27.find('[data-part="unpublished"]').exists()).toBe(true);
    const ev = w.get('[data-date="2026-10-02"] [data-part="event"]');
    expect(ev.text()).toBe("朝礼");
    expect((ev.element as HTMLElement).style.getPropertyValue("--ar-event-color")).toBe("#2196F3");
    // 前後の月のマスには下の段を出さない
    expect(w.get('[data-date="2026-09-27"]').find('[data-part="foot"]').exists()).toBe(false);
  });
});

describe("シフト画面で足したもの", () => {
  it("ArSegmented：count で件数の丸", () => {
    const w = mount(ArSegmented, { props: { modelValue: "a", label: "表示モード", options: [{ value: "a", label: "時間帯" }, { value: "b", label: "備考", count: 2 }] } });
    const items = w.findAll('[data-part="item"]');
    expect(items[0]!.find('[data-part="count"]').exists()).toBe(false);
    expect(items[1]!.get('[data-part="count"]').text()).toBe("2");
  });
  it("ArDivider：subtle・bleed を属性に出す", () => {
    const w = mount(ArDivider, { props: { subtle: true, bleed: true } });
    expect(w.attributes("data-subtle")).toBeDefined();
    expect(w.attributes("data-bleed")).toBeDefined();
  });
  it("ArTable：sub のない名前の列は data-single、emphasis note を出す", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 総称の部品は行の型を決めずに使う
    const w = mount(ArTable as any, {
      props: {
        caption: "勤務可能な人",
        variant: "board",
        rowKey: "id",
        rows: [{ id: 1, name: "中口 万由香", note: "早めに上がりたい" }],
        columns: [
          { key: "name", title: "名前", avatar: true },
          { key: "note", title: "備考", emphasis: "note" },
        ],
      },
    });
    expect(w.get('[data-part="person"]').attributes("data-single")).toBeDefined();
    expect(w.get('th[data-person="single"]').text()).toBe("名前");
    expect(w.findAll('td[data-emphasis="note"]')).toHaveLength(1);
  });
});
