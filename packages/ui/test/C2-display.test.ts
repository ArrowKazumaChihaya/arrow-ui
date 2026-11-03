import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import ArTooltip from "../src/components/ArTooltip.vue";
import ArPopover from "../src/components/ArPopover.vue";
import ArCalendar from "../src/components/ArCalendar.vue";
import ArCarousel from "../src/components/ArCarousel.vue";
import ArImage from "../src/components/ArImage.vue";
import ArTree from "../src/components/ArTree.vue";
import ArQRCode from "../src/components/ArQRCode.vue";
import ArTimeline from "../src/components/ArTimeline.vue";
import ArTour from "../src/components/ArTour.vue";
import { encodeQr } from "../src/internal/qrcode";
import type { ArTreeNode } from "../src/components/ArTree.contract";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const floating = (ar: string) => document.body.querySelector<HTMLElement>(`[data-ar="${ar}"][data-part="root"]`);
afterEach(() => {
  document.body.innerHTML = "";
});

describe("ArTooltip", () => {
  it("乗せると遅れて出て、外れると消える。出ている間は aria-describedby", async () => {
    const w = mount(ArTooltip, { props: { title: "変更", delay: 30, hideDelay: 0 }, slots: { default: () => h("button", "編集") }, attachTo: document.body });
    await w.find('[data-part="trigger"]').trigger("mouseenter");
    expect(floating("tooltip")).toBeNull();
    await wait(50);
    await nextTick();
    const tip = floating("tooltip")!;
    expect(tip.textContent).toContain("変更");
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(w.find("button").attributes("aria-describedby")).toBe(tip.id);
    await w.find('[data-part="trigger"]').trigger("mouseleave");
    await wait(10);
    await nextTick();
    expect(floating("tooltip")).toBeNull();
    expect(w.find("button").attributes("aria-describedby")).toBeUndefined();
    w.unmount();
  });
  it("Escape で消える・disabled なら出ない", async () => {
    const w = mount(ArTooltip, { props: { title: "説明", open: true, tone: "accent" }, slots: { default: () => h("button", "x") }, attachTo: document.body });
    await nextTick();
    expect(floating("tooltip")!.querySelector('[data-part="panel"]')!.getAttribute("data-tone")).toBe("accent");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    await w.setProps({ disabled: true });
    expect(floating("tooltip")).toBeNull();
    w.unmount();
  });
});

describe("ArPopover", () => {
  it("押すと開いて吹き出しへフォーカス、Escape で閉じて基準へ戻す", async () => {
    const w = mount(ArPopover, {
      props: { title: "不足", content: "1名足りません" },
      slots: { default: () => h("button", "不足1") },
      attachTo: document.body,
    });
    const btn = w.find("button");
    expect(btn.attributes("aria-haspopup")).toBe("dialog");
    await btn.trigger("click");
    await nextTick();
    await nextTick();
    const panel = floating("popover")!.querySelector<HTMLElement>('[data-part="panel"]')!;
    expect(panel.getAttribute("role")).toBe("dialog");
    expect(panel.textContent).toContain("1名足りません");
    expect(btn.attributes("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(panel);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(floating("popover")).toBeNull();
    expect(document.activeElement).toBe(btn.element);
    w.unmount();
  });
  it("cell は乗せるとすぐ出る（矢印なし・tooltip）", async () => {
    const w = mount(ArPopover, {
      props: { variant: "cell", content: "千速 一真\nシフト　09:00〜18:00" },
      slots: { default: () => h("span", { tabindex: 0 }, "マス") },
      attachTo: document.body,
    });
    await w.find('[data-part="trigger"]').trigger("mouseenter");
    await nextTick();
    const panel = floating("popover")!.querySelector('[data-part="panel"]')!;
    expect(panel.getAttribute("role")).toBe("tooltip");
    expect(panel.getAttribute("data-variant")).toBe("cell");
    expect(panel.querySelector('[data-part="arrow"]')).toBeNull();
    w.unmount();
  });
});

describe("ArCalendar", () => {
  const cells = (w: ReturnType<typeof mount>) => w.findAll('[data-part="cell"]');
  it("月のマス・今日・選んだ日・印", () => {
    const w = mount(ArCalendar, {
      props: { modelValue: "2026-10-15", month: "2026-10", today: "2026-10-21", events: [{ date: "2026-10-14", label: "不足1", tone: "danger" }] },
    });
    expect(cells(w)).toHaveLength(35);
    expect(w.find('[data-date="2026-09-27"]').attributes("data-state")).toContain("adjacent");
    expect(w.find('[data-date="2026-10-21"]').attributes("aria-current")).toBe("date");
    expect(w.find('[data-date="2026-10-15"]').attributes("aria-selected")).toBe("true");
    expect(w.find('[data-date="2026-10-15"]').attributes("tabindex")).toBe("0");
    expect(w.find('[data-date="2026-10-14"] [data-part="event"]').attributes("data-tone")).toBe("danger");
    expect(w.find('[data-part="title"]').text()).toBe("2026年10月");
  });
  it("矢印で日を移り、月をまたぐと update:month、Enter で選ぶ", async () => {
    const w = mount(ArCalendar, { props: { modelValue: "2026-10-31", month: "2026-10", today: "2026-10-21" }, attachTo: document.body });
    await w.find('[data-date="2026-10-31"]').trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:month")?.at(-1)).toEqual(["2026-11"]);
    await w.setProps({ month: "2026-11" });
    await w.find('[data-date="2026-11-01"]').trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["2026-11-01"]);
    w.unmount();
  });
  it("土日の色・年の表示", async () => {
    const w = mount(ArCalendar, { props: { month: "2026-10", weekendColors: true } });
    expect(w.find('[data-date="2026-10-04"]').attributes("data-weekend")).toBe("sun");
    expect(w.find('[data-date="2026-10-03"]').attributes("data-weekend")).toBe("sat");
    await w.find('[data-mode="year"]').trigger("click");
    expect(w.emitted("update:mode")?.at(-1)).toEqual(["year"]);
    expect(w.findAll('[data-part="cell"]')).toHaveLength(12);
    await w.find('[data-month="3"]').trigger("click");
    expect(w.emitted("update:month")?.at(-1)).toEqual(["2026-03"]);
    expect(w.emitted("update:mode")?.at(-1)).toEqual(["month"]);
  });
});

describe("ArCarousel", () => {
  it("前後・点・←→ で切り替え、loop=false なら端で止まる", async () => {
    const w = mount(ArCarousel, { props: { items: ["a", "b", "c"], loop: false } });
    expect(w.find('[data-part="prev"]').attributes("disabled")).toBeDefined();
    await w.find('[data-part="next"]').trigger("click");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([1]);
    await w.findAll('[data-part="dot"]')[2]!.trigger("click");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([2]);
    expect(w.find('[data-part="next"]').attributes("disabled")).toBeDefined();
    await w.trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([1]);
    expect(w.findAll('[data-part="slide"]')[1]!.attributes("aria-hidden")).toBeUndefined();
    expect(w.findAll('[data-part="slide"]')[0]!.attributes("aria-hidden")).toBe("true");
  });
});

describe("ArImage", () => {
  it("読み込めないと灰色の箱、押すとプレビュー、Escape で閉じる", async () => {
    const w = mount(ArImage, { props: { src: "/a.png", alt: "店" }, attachTo: document.body });
    await w.find("button").trigger("click");
    await nextTick();
    const viewer = document.body.querySelector('[data-ar="image"][data-part="viewer"]')!;
    expect(viewer.getAttribute("role")).toBe("dialog");
    const zoomIn = viewer.querySelectorAll<HTMLButtonElement>('[data-part="tool"]')[1]!;
    zoomIn.click();
    await nextTick();
    expect(viewer.querySelector('[data-part="scale"]')!.textContent).toBe("125%");
    await wait(5);
    viewer.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(document.body.querySelector('[data-part="viewer"]')).toBeNull();
    await w.find("img").trigger("error");
    expect(w.find('[data-part="placeholder"]').exists()).toBe(true);
    const root = w.find('[data-ar="image"][data-part="root"]');
    expect(root.attributes("role")).toBe("img");
    expect(root.attributes("data-state")).toContain("error");
    w.unmount();
  });
});

describe("ArTree", () => {
  const items: ArTreeNode[] = [
    { key: "t", label: "東京", children: [{ key: "s", label: "渋谷店" }, { key: "j", label: "新宿店" }] },
    { key: "o", label: "大阪" },
  ];
  it("→ で開き、↓ で移り、Enter で選ぶ", async () => {
    const w = mount(ArTree, { props: { items }, attachTo: document.body });
    expect(w.findAll('[role="treeitem"]')).toHaveLength(2);
    await w.find('[data-key="t"]').trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:expanded")?.at(-1)).toEqual([["t"]]);
    expect(w.findAll('[role="treeitem"]')).toHaveLength(4);
    await w.find('[data-key="s"]').trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["s"]);
    expect(w.find('[data-key="s"]').attributes("aria-level")).toBe("2");
    w.unmount();
  });
  it("親をチェックすると子もすべて付き、一部なら mixed", async () => {
    const w = mount(ArTree, { props: { items, checkable: true, defaultExpandAll: true, checked: ["s"] } });
    expect(w.find('[data-key="t"]').attributes("aria-checked")).toBe("mixed");
    await w.find('[data-key="t"]').trigger("keydown", { key: " " });
    expect([...(w.emitted("update:checked")!.at(-1)![0] as string[])].sort()).toEqual(["j", "s", "t"]);
  });
  it("Alt+↓ で並べ替えの drop を出す", async () => {
    const w = mount(ArTree, { props: { items, draggable: true } });
    await w.find('[data-key="t"]').trigger("keydown", { key: "ArrowDown", altKey: true });
    expect(w.emitted("drop")?.at(-1)).toEqual([{ key: "t", target: "o", position: "after" }]);
  });
});

describe("ArQRCode", () => {
  it("QR の大きさと型番（規格どおり 21 + 4×(型番−1)）", () => {
    expect(encodeQr("ARROW", "L").size).toBe(21);
    const q = encodeQr("https://arrow.example.jp/punch?store=shibuya&t=1730000000", "M");
    expect(q.version).toBe(4);
    expect(q.size).toBe(33);
    // 3つの角の位置検出（7×7 の枠）
    expect(q.modules[0]!.slice(0, 7).every(Boolean)).toBe(true);
    expect(q.modules[1]![1]).toBe(false);
    expect(q.modules[3]![3]).toBe(true);
  });
  it("期限切れは幕と作り直すボタン", async () => {
    const w = mount(ArQRCode, { props: { value: "x", status: "expired" } });
    expect(w.attributes("data-state")).toBe("expired");
    await w.find('[data-part="refresh"]').trigger("click");
    expect(w.emitted("refresh")).toHaveLength(1);
  });
});

describe("ArTimeline", () => {
  it("意味の色・今・まだ を属性で出す", () => {
    const w = mount(ArTimeline, {
      props: { items: [{ title: "出勤", tone: "ok" }, { title: "休憩終了", status: "current" }, { title: "退勤", status: "pending" }] },
    });
    const li = w.findAll('[data-part="item"]');
    expect(li[0]!.attributes("data-tone")).toBe("ok");
    expect(li[1]!.attributes("aria-current")).toBe("step");
    expect(li[2]!.attributes("data-state")).toBe("pending");
  });
});

describe("ArTour", () => {
  it("次へ・前へ・完了で閉じる", async () => {
    const target = document.createElement("button");
    document.body.appendChild(target);
    const w = mount(ArTour, {
      props: { open: true, steps: [{ target, title: "一つ目" }, { title: "二つ目" }] },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();
    const panel = () => floating("tour")!.querySelector('[data-part="panel"]')!;
    expect(panel().textContent).toContain("一つ目");
    expect(panel().textContent).toContain("次へ（1/2）");
    expect(document.body.querySelector('[data-ar="tour"][data-part="overlay"]')).not.toBeNull();
    (panel().querySelector('[data-part="actions"] button:last-child') as HTMLButtonElement).click();
    expect(w.emitted("update:current")?.at(-1)).toEqual([1]);
    await nextTick();
    expect(panel().textContent).toContain("二つ目");
    (panel().querySelector('[data-part="actions"] button:last-child') as HTMLButtonElement).click();
    expect(w.emitted("finish")).toHaveLength(1);
    expect(w.emitted("update:open")?.at(-1)).toEqual([false]);
    w.unmount();
  });
});
