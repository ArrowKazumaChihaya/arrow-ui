import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import ArButton from "../src/components/ArButton.vue";
import ArTabs from "../src/components/ArTabs.vue";
import ArSegmented from "../src/components/ArSegmented.vue";
import ArText from "../src/components/ArText.vue";
import ArTitle from "../src/components/ArTitle.vue";
import ArLink from "../src/components/ArLink.vue";
import ArDivider from "../src/components/ArDivider.vue";
import ArFloatButton from "../src/components/ArFloatButton.vue";
import { icons } from "../src/icons";

describe("ArIcon（追加のアイコン）", () => {
  it("デザインシステムの追加のアイコンがそろっている", () => {
    for (const n of ["star", "copy", "image", "folder", "file", "home", "up", "down", "zoom", "reload", "qmark", "smile", "drag"]) expect(icons).toHaveProperty(n);
  });
});

describe("ArButton（種類・形・リンク）", () => {
  it("幅変更で文字スロットが消えても同じボタンに操作名とアイコン形状を残す", async () => {
    const compact = ref(false);
    const host = mount(defineComponent({
      setup: () => () => h(ArButton, { icon: "gear", label: "デザインを選択" },
        compact.value ? {} : { default: () => "デザインを選択" }),
    }));
    const button = host.get("button");
    const element = button.element;
    expect(button.attributes("data-icon-only")).toBeUndefined();
    compact.value = true;
    await nextTick();
    expect(host.get("button").element).toBe(element);
    expect(button.attributes("data-icon-only")).toBe("true");
    expect(button.attributes("aria-label")).toBe("デザインを選択");
    expect(button.attributes("title")).toBe("デザインを選択");
    compact.value = false;
    await nextTick();
    expect(button.attributes("data-icon-only")).toBeUndefined();
    expect(button.text()).toBe("デザインを選択");
    host.unmount();
  });
  it("danger-fill・danger-outline は danger・danger-subtle と同じ見た目の名前になる", () => {
    expect(mount(ArButton, { props: { tone: "danger-fill" }, slots: { default: "削除する" } }).attributes("data-tone")).toBe("danger");
    expect(mount(ArButton, { props: { tone: "danger-outline" }, slots: { default: "削除" } }).attributes("data-tone")).toBe("danger-subtle");
    expect(mount(ArButton, { props: { tone: "muted" }, slots: { default: "あとで" } }).attributes("data-tone")).toBe("muted");
  });
  it("shape と iconEnd を出す。href なら a 要素、押せないときは行き先を外す", async () => {
    const w = mount(ArButton, { props: { shape: "circle", icon: "search", label: "探す" } });
    expect(w.attributes("data-shape")).toBe("circle");
    const l = mount(ArButton, { props: { tone: "link", href: "/help", iconEnd: "cr" }, slots: { default: "使い方" } });
    expect(l.element.tagName).toBe("A");
    expect(l.attributes("href")).toBe("/help");
    expect(l.find('[data-part="icon-end"]').exists()).toBe(true);
    await l.setProps({ disabled: true });
    expect(l.attributes("href")).toBeUndefined();
    expect(l.attributes("aria-disabled")).toBe("true");
    await l.trigger("click");
    expect(l.emitted("click")).toBeUndefined();
  });
});

describe("ArTabs（card）", () => {
  const items = [
    { key: "10", label: "10月分", closable: true },
    { key: "11", label: "11月分", closable: true },
  ];
  it("×と Delete キーで close、「＋」で add", async () => {
    const w = mount(ArTabs, { props: { modelValue: "10", items, label: "月", variant: "card", addable: true } });
    await w.findAll('[data-part="close"]')[1]!.trigger("click");
    expect(w.emitted("close")?.[0]).toEqual(["11"]);
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await w.findAll('[role="tab"]')[0]!.trigger("keydown", { key: "Delete" });
    expect(w.emitted("close")?.[1]).toEqual(["10"]);
    await w.get('[data-part="add"]').trigger("click");
    expect(w.emitted("add")).toHaveLength(1);
    expect(w.get('[role="tablist"]').attributes("aria-label")).toBe("月");
  });
  it("line・band では閉じるボタンを出さない", () => {
    const w = mount(ArTabs, { props: { modelValue: "10", items, label: "月" } });
    expect(w.find('[data-part="close"]').exists()).toBe(false);
  });
});

describe("ArSegmented", () => {
  it("radiogroup。←→で選び直し、使えないものは飛ばす", async () => {
    const w = mount(ArSegmented, {
      props: { modelValue: "a", label: "表示", options: [{ value: "a", label: "時間帯" }, { value: "b", label: "備考", disabled: true }, { value: "c", label: "チャート" }] },
      attachTo: document.body,
    });
    expect(w.attributes("role")).toBe("radiogroup");
    const radios = w.findAll('[role="radio"]');
    expect(radios[0]!.attributes("aria-checked")).toBe("true");
    expect(radios[0]!.attributes("tabindex")).toBe("0");
    await radios[0]!.trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["c"]);
    expect(w.emitted("change")?.[0]).toEqual(["c"]);
    await radios[2]!.trigger("click");
    expect(w.emitted("update:modelValue")?.[1]).toEqual(["c"]);
    w.unmount();
  });
  it("文字列の並びでも渡せる", () => {
    const w = mount(ArSegmented, { props: { modelValue: "日", label: "期間", options: ["日", "週", "月"] } });
    expect(w.findAll('[role="radio"]')).toHaveLength(3);
  });
});

describe("文字（ArTitle・ArText・ArLink）", () => {
  it("ArTitle は level の見出し要素", () => {
    const w = mount(ArTitle, { props: { level: 3 }, slots: { default: "見出し3" } });
    expect(w.element.tagName).toBe("H3");
    expect(w.attributes("data-level")).toBe("3");
  });
  it("ArText は意味の強い要素を選び、copyable でコピーする", async () => {
    const write = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText: write }, configurable: true });
    const w = mount(ArText, { props: { code: true, copyable: true, type: "secondary" }, slots: { default: "A-1024" } });
    expect(w.get('[data-part="content"]').element.tagName).toBe("CODE");
    expect(w.attributes("data-type")).toBe("secondary");
    await w.get('[data-part="copy"]').trigger("click");
    await nextTick();
    expect(write).toHaveBeenCalledWith("A-1024");
    expect(w.emitted("copy")?.[0]).toEqual(["A-1024"]);
    expect(w.get('[data-part="copy"]').attributes("aria-label")).toBe("コピーしました");
  });
  it("ArLink は押せないとき行き先を外し click を出さない", async () => {
    const w = mount(ArLink, { props: { href: "/a", disabled: true }, slots: { default: "使い方" } });
    expect(w.attributes("href")).toBeUndefined();
    await w.trigger("click");
    expect(w.emitted("click")).toBeUndefined();
  });
});

describe("ArDivider", () => {
  it("separator。文字があれば位置を出し、縦の線は aria-orientation", () => {
    const h = mount(ArDivider, { props: { align: "start" }, slots: { default: "左寄せ" } });
    expect(h.attributes("role")).toBe("separator");
    expect(h.attributes("data-align")).toBe("start");
    const v = mount(ArDivider, { props: { orientation: "vertical" } });
    expect(v.attributes("aria-orientation")).toBe("vertical");
  });
});

describe("ArFloatButton", () => {
  it("件数は読み上げの名前に入れ、グループの項目は select を出す", async () => {
    const w = mount(ArFloatButton, { props: { icon: "help", label: "ヘルプ", badge: 3 } });
    expect(w.attributes("aria-label")).toBe("ヘルプ（3件）");
    expect(w.get('[data-part="badge"]').text()).toBe("3");
    const g = mount(ArFloatButton, { props: { label: "操作", items: [{ key: "top", icon: "up", label: "上へ" }, { key: "mail", icon: "mail", label: "問い合わせ" }] } });
    await g.findAll('[data-part="item"]')[1]!.trigger("click");
    expect(g.emitted("select")?.[0]).toEqual(["mail"]);
  });
  it("backTop は押すとページの上へ戻る", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    const w = mount(ArFloatButton, { props: { backTop: true, visibilityHeight: -1 } });
    await nextTick();
    await w.get('[data-ar="float-button"]').trigger("click");
    expect(scrollTo).toHaveBeenCalled();
    expect(w.get('[data-ar="float-button"]').attributes("aria-label")).toBe("ページの上へ戻る");
  });
});
