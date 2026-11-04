import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import ArTable from "../src/components/ArTable.vue";
import ArCard from "../src/components/ArCard.vue";
import ArTag from "../src/components/ArTag.vue";
import ArBadge from "../src/components/ArBadge.vue";
import ArRibbon from "../src/components/ArRibbon.vue";
import ArAvatar from "../src/components/ArAvatar.vue";
import ArAvatarGroup from "../src/components/ArAvatarGroup.vue";
import ArDescriptions from "../src/components/ArDescriptions.vue";
import ArStatistic from "../src/components/ArStatistic.vue";
import ArCountdown from "../src/components/ArCountdown.vue";
import ArList from "../src/components/ArList.vue";
import ArEmpty from "../src/components/ArEmpty.vue";
import ArCollapse from "../src/components/ArCollapse.vue";
import { arAvatarToneOf } from "../src/components/avatar";

// generic な ArTable は props を any で渡す
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const T = ArTable as any;
type Row = { id: number; name: string; start: string[]; cost: number; note: string };
const rows: Row[] = [
  { id: 1, name: "末永 修也", start: ["09:00"], cost: 9600, note: "" },
  { id: 2, name: "新里 匠", start: ["09:00", "17:00"], cost: 6000, note: "早め" },
];
const columns = [
  { key: "name", title: "名前", avatar: true, sub: (r: Row) => ({ text: r.id === 1 ? "通常勤務1" : "パターンなし", color: "#4C5FC4" }) },
  { key: "start", title: "開始", emphasis: "strong" },
  { key: "cost", title: "人件費", numeric: true },
  { key: "note", title: "備考" },
];

describe("ArTable（C1）", () => {
  it("名前の列は頭文字の丸と小さな説明、配列は1行ずつ、空欄は「—」、数字の列は右寄せ", () => {
    const w = mount(T, { props: { columns, rows, rowKey: "id", caption: "勤務メンバー", variant: "board" } });
    expect(w.attributes("data-variant")).toBe("board");
    const first = w.findAll('tbody [data-part="row"]')[0]!;
    expect(first.get('[data-ar="avatar"]').text()).toBe("末");
    expect(first.get('[data-part="sub"]').text()).toBe("通常勤務1");
    expect(first.find('[data-part="sub-mark"]').exists()).toBe(true);
    const second = w.findAll('tbody [data-part="row"]')[1]!;
    expect(second.findAll('[data-part="lines"] > span').map((s) => s.text())).toEqual(["09:00", "17:00"]);
    const cells = first.findAll('[data-part="cell"]');
    expect(cells[2]!.attributes("data-align")).toBe("end");
    expect(cells[2]!.attributes("data-numeric")).toBeDefined();
    expect(cells[3]!.text()).toBe("—");
    expect(cells[3]!.attributes("data-blank")).toBeDefined();
  });

  it("行の右端の操作・見出しの下の行・表の下の slot", () => {
    const w = mount(T, {
      props: { columns, rows, rowKey: "id", caption: "表" },
      slots: {
        actions: ({ row }: { row: Row }) => h("button", { "aria-label": `${row.name}を変更` }, "変"),
        "before-rows": () => h("button", "シフト追加"),
        below: () => h("nav", "ページ送り"),
      },
    });
    expect(w.findAll('[data-part="actions"] button')).toHaveLength(2);
    expect(w.get('[data-col="actions"] [data-ar-visually-hidden]').text()).toBe("操作");
    expect(w.get('[data-part="before-rows"]').text()).toBe("シフト追加");
    expect(w.get('[data-part="below"]').text()).toBe("ページ送り");
  });

  it("合計の行：見出しつきの値と span でつなぐ", () => {
    const w = mount(T, {
      props: { columns, rows, rowKey: "id", caption: "表", footer: { name: { label: "出勤", value: "2名" }, start: { label: "シフト合計", value: "13時間", span: 2 } } },
    });
    const tds = w.findAll('tfoot [data-part="cell"]');
    expect(tds).toHaveLength(3);
    expect(tds[0]!.get('[data-part="foot-label"]').text()).toBe("出勤");
    expect(tds[1]!.attributes("colspan")).toBe("2");
    expect(tds[1]!.get('[data-part="foot-value"]').text()).toBe("13時間");
  });

  it("薄い行・開いた行の状態、空のときは ArEmpty", async () => {
    const w = mount(T, { props: { columns, rows, rowKey: "id", caption: "表", expandable: true, expanded: [2], rowOff: (r: Row) => r.id === 1 } });
    const trs = w.findAll('tbody [data-part="row"]');
    expect(trs[0]!.attributes("data-state")).toBe("off");
    expect(trs[1]!.attributes("data-state")).toBe("expanded");
    await w.setProps({ rows: [], emptyText: "まだありません", emptyIcon: "inbox" });
    expect(w.get('[data-part="empty"] [data-ar="empty"]').text()).toBe("まだありません");
  });
});

describe("ArCard・ArTag（C1）", () => {
  it("カードは形・大きさ・cover・footer の部位を持つ", () => {
    const w = mount(ArCard, {
      props: { title: "今月の人件費", variant: "elevated", size: "sm" },
      slots: { default: "本文", cover: "絵", footer: () => [h("button", "a"), h("button", "b")] },
    });
    expect(w.attributes("data-variant")).toBe("elevated");
    expect(w.attributes("data-size")).toBe("sm");
    expect(w.get('[data-part="cover"]').text()).toBe("絵");
    expect(w.findAll('[data-part="footer"] button')).toHaveLength(2);
  });

  it("選べる札は押すと update:checked、aria-pressed を持つ", async () => {
    const w = mount(ArTag, { props: { checkable: true, checked: false }, slots: { default: "渋谷店" } });
    expect(w.element.tagName).toBe("BUTTON");
    expect(w.attributes("aria-pressed")).toBe("false");
    await w.trigger("click");
    expect(w.emitted("update:checked")?.[0]).toEqual([true]);
    await w.setProps({ checked: true });
    expect(w.attributes("data-state")).toBe("checked");
  });

  it("外せる札は × で close。丸い札・件数の札は属性で出す", async () => {
    const w = mount(ArTag, { props: { closable: true, closeLabel: "早番を外す", shape: "pill", count: true }, slots: { default: "早番" } });
    expect(w.attributes("data-shape")).toBe("pill");
    expect(w.attributes("data-count")).toBeDefined();
    await w.get('[data-part="close"]').trigger("click");
    expect(w.emitted("close")).toHaveLength(1);
    expect(w.get('[data-part="close"]').attributes("aria-label")).toBe("早番を外す");
  });
});

describe("ArBadge・ArRibbon", () => {
  it("件数は max を超えると 99+、0 は出さない（showZero で出す）、読み上げの名前を持つ", async () => {
    const w = mount(ArBadge, { props: { count: 120 }, slots: { default: "<button>通知</button>" } });
    expect(w.get('[data-part="count"]').text()).toBe("99+");
    expect(w.get("[data-ar-visually-hidden]").text()).toBe("120件");
    await w.setProps({ count: 0 });
    expect(w.find('[data-part="count"]').exists()).toBe(false);
    await w.setProps({ showZero: true });
    expect(w.get('[data-part="count"]').text()).toBe("0");
    expect(w.attributes("data-standalone")).toBeUndefined();
  });
  it("状態の点は点＋言葉", () => {
    const w = mount(ArBadge, { props: { status: "ok", text: "出勤中" } });
    expect(w.attributes("data-mode")).toBe("status");
    expect(w.get('[data-part="text"]').text()).toBe("出勤中");
  });
  it("リボンは中身の右上に言葉を出す", () => {
    const w = mount(ArRibbon, { props: { text: "おすすめ" }, slots: { default: "カード" } });
    expect(w.get('[data-part="ribbon"]').text()).toBe("おすすめ");
    expect(w.attributes("data-placement")).toBe("end");
  });
});

describe("ArAvatar・ArAvatarGroup", () => {
  it("名前の頭文字を出し、名前を読み上げる。seed で人ごとの色", () => {
    const w = mount(ArAvatar, { props: { name: "佐藤 美咲", seed: 1 } });
    expect(w.text()).toBe("佐");
    expect(w.attributes("aria-label")).toBe("佐藤 美咲");
    expect(w.attributes("data-tone")).toBe("orange");
    expect(arAvatarToneOf(5)).toBe("blue");
    expect(arAvatarToneOf("佐藤")).toBe(arAvatarToneOf("佐藤"));
  });
  it("重ねると max を超えた分を +N にまとめ、大きさを伝える", () => {
    const w = mount(ArAvatarGroup, {
      props: { max: 2, size: "sm" },
      slots: { default: () => ["佐", "田", "山", "鈴"].map((n) => h(ArAvatar, { name: n })) },
    });
    const avs = w.findAll('[data-ar="avatar"]');
    expect(avs).toHaveLength(3);
    expect(avs[2]!.text()).toBe("+2");
    expect(avs[0]!.attributes("data-size")).toBe("sm");
  });
});

describe("ArDescriptions・ArStatistic・ArCountdown", () => {
  it.each(["plain", "bordered"] as const)("%s の縦並びは説明と値・slot・列結合を保ち、表示切替で本文を作り直さない", async (variant) => {
    const note = "長い申請事由をラベルの下で最後まで表示します。\n追記も保持します。";
    const w = mount(ArDescriptions, {
      props: { variant, layout: "stacked", column: 2, items: [{ key: "date", label: "希望日", value: "2026-11-04" }, { key: "note", label: "申請事由(任意)", value: note, span: 2 }] },
      slots: { "item-date": "11月4日（水）" },
    });
    expect(w.findAll("dt").map((node) => node.text())).toEqual(["希望日", "申請事由(任意)"]);
    expect(w.findAll("dd").map((node) => node.text())).toEqual(["11月4日（水）", note]);
    const value = w.findAll("dd")[1]!.element;
    expect(w.findAll('[data-part="item"]')[1]!.attributes("style")).toContain("span 2");
    expect(w.findAll("dd")[1]!.attributes("style")).toBeUndefined();
    await w.setProps({ layout: "inline" });
    expect(w.findAll("dd")[1]!.element).toBe(value);
    expect(w.findAll("dd")[1]!.text()).toBe(note);
    if (variant === "bordered") expect(w.findAll("dd")[1]!.attributes("style")).toContain("span 3");
    w.unmount();
  });
  it("説明リストは dt/dd で、slot で値を差し替えられ、span で横につなぐ", () => {
    const w = mount(ArDescriptions, {
      props: { items: [{ key: "name", label: "氏名", value: "佐藤" }, { key: "type", label: "雇用形態" }, { key: "note", label: "備考", value: "x", span: 3 }] },
      slots: { "item-type": "パート" },
    });
    expect(w.findAll("dt").map((d) => d.text())).toEqual(["氏名", "雇用形態", "備考"]);
    expect(w.findAll("dd")[1]!.text()).toBe("パート");
    expect(w.findAll("dd")[2]!.attributes("style")).toContain("span 5");
  });
  it("統計は3桁ごとに区切り、単位と増減を出す", () => {
    const w = mount(ArStatistic, { props: { title: "今月の人件費", value: 1284500, prefix: "¥", trend: "down", trendValue: "3.2%" } });
    expect(w.get('[data-part="value"]').text()).toBe("1,284,500");
    expect(w.get('[data-part="trend"]').attributes("data-trend")).toBe("down");
    expect(w.get('[data-part="trend"]').text()).toContain("減少");
  });
  it("しめきりまでの残りは残りが少ないと warn、0 で finish", async () => {
    vi.useFakeTimers();
    const now = Date.now();
    const w = mount(ArCountdown, { props: { title: "提出まで", target: now + 2000, warnWithin: 60000 } });
    expect(w.get('[data-part="value"]').text()).toBe("00:00:02");
    expect(w.attributes("data-tone")).toBe("warn");
    vi.advanceTimersByTime(3000);
    await nextTick();
    expect(w.emitted("finish")).toHaveLength(1);
    vi.useRealTimers();
  });
});

describe("ArList・ArEmpty・ArCollapse", () => {
  it("リストは続く group をまとめて見出しを出し、右の操作の slot を持つ", () => {
    const w = mount(ArList, {
      props: {
        label: "勤務可能な人",
        items: [
          { key: 1, title: "佐藤 美咲", avatar: true, group: "提出" },
          { key: 2, title: "田中 健", group: "提出", off: true },
          { key: 3, title: "鈴木 大地", group: "未提出" },
        ],
      },
      slots: { actions: ({ item }: { item: { title: string } }) => h("button", `${item.title}を入れる`) },
    });
    expect(w.findAll('[data-part="group-title"]').map((g) => g.text())).toEqual(["提出", "未提出"]);
    expect(w.findAll('[data-part="item"]')).toHaveLength(3);
    expect(w.findAll('[data-part="item"]')[1]!.attributes("data-state")).toBe("off");
    expect(w.get('[data-part="avatar"]').text()).toBe("佐");
    expect(w.findAll('[data-part="actions"] button')).toHaveLength(3);
  });
  it("空のリストは ArEmpty の文", () => {
    const w = mount(ArList, { props: { label: "x", items: [], emptyText: "いません" } });
    expect(w.get('[data-ar="empty"]').text()).toBe("いません");
    const e = mount(ArEmpty, { props: { icon: "inbox", size: "md" }, slots: { default: "なし", action: "<button>次</button>" } });
    expect(e.attributes("data-size")).toBe("md");
    expect(e.find('[data-part="icon"]').exists()).toBe(true);
    expect(e.get('[data-part="action"]').text()).toBe("次");
  });
  it("折りたたみは押すと開閉、accordion は1つだけ、↓ で次の見出しへ", async () => {
    const items = [{ key: "a", title: "勤怠ライブ" }, { key: "b", title: "位置情報" }, { key: "c", title: "使えない", disabled: true }];
    const w = mount(ArCollapse, { props: { items, modelValue: ["a"], accordion: true }, slots: { "panel-a": "中身A", "panel-b": "中身B" }, attachTo: document.body });
    const triggers = w.findAll('[data-part="trigger"]');
    expect(triggers[0]!.attributes("aria-expanded")).toBe("true");
    expect(w.get('[data-part="panel"]').attributes("data-state")).toBe("open");
    await triggers[1]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["b"]]);
    await triggers[0]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[1]).toEqual([[]]);
    (triggers[0]!.element as HTMLElement).focus();
    await triggers[0]!.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(triggers[1]!.element);
    await triggers[1]!.trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(triggers[0]!.element);
    expect(triggers[0]!.attributes("aria-controls")).toBe(w.findAll('[data-part="body"]')[0]!.attributes("id"));
    w.unmount();
  });
});
