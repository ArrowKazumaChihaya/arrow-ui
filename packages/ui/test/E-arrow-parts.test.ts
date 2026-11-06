import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import ArYearInput from "../src/components/ArYearInput.vue";
import ArYearMonthInput from "../src/components/ArYearMonthInput.vue";
import ArMonthDayInput from "../src/components/ArMonthDayInput.vue";
import ArKanaInput from "../src/components/ArKanaInput.vue";
import ArKanaText from "../src/components/ArKanaText.vue";
import ArZipInput from "../src/components/ArZipInput.vue";
import ArFlagGroup from "../src/components/ArFlagGroup.vue";
import ArFlagView from "../src/components/ArFlagView.vue";
import ArChangedValue from "../src/components/ArChangedValue.vue";
import ArDaySummary from "../src/components/ArDaySummary.vue";
import ArInfo from "../src/components/ArInfo.vue";
import ArEllipsis from "../src/components/ArEllipsis.vue";
import ArBalloon from "../src/components/ArBalloon.vue";
import ArChip from "../src/components/ArChip.vue";
import ArThumbnail from "../src/components/ArThumbnail.vue";
import ArAppHeader from "../src/components/ArAppHeader.vue";
import ArAppFooter from "../src/components/ArAppFooter.vue";
import ArMobileHeader from "../src/components/ArMobileHeader.vue";
import ArBottomNav from "../src/components/ArBottomNav.vue";
import { eraLabel, yearList } from "../src/internal/yearParts";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ArYearInput", () => {
  it("ネイティブの select を使わず、↓で開いて選び Enter で決める", async () => {
    const w = mount(ArYearInput, { props: { modelValue: 2025, minYear: 2020, maxYear: 2026 }, attachTo: document.body });
    expect(w.find("select").exists()).toBe(false);
    const btn = w.get('[data-part="year"]');
    expect(btn.attributes("role")).toBe("combobox");
    expect(btn.text()).toContain("2025");
    await btn.trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(btn.attributes("aria-expanded")).toBe("true");
    const opts = document.querySelectorAll('[data-ar="year-list"] [role="option"]');
    expect(opts).toHaveLength(7);
    expect(opts[0]!.textContent).toContain("2026"); // 新しい年が上
    await btn.trigger("keydown", { key: "ArrowDown" }); // 2025 → 2024
    await btn.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")?.[0]).toEqual([2024]);
    expect(btn.attributes("aria-expanded")).toBe("false");
    w.unmount();
  });
  it("閉じたまま数字を打つとその年へ飛ぶ。和暦を添えられる", async () => {
    const w = mount(ArYearInput, { props: { modelValue: 2026, minYear: 2000, maxYear: 2026, era: true }, attachTo: document.body });
    expect(w.get('[data-part="value"]').text()).toBe("2026(令和8)");
    const btn = w.get('[data-part="year"]');
    for (const k of ["2", "0", "1", "9"]) await btn.trigger("keydown", { key: k });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([2019]);
    w.unmount();
  });
  it("和暦と年の並び", () => {
    expect(eraLabel(2019)).toBe("2019(令和元/平成31)");
    expect(eraLabel(1990)).toBe("1990(平成2)");
    expect(yearList(2024, 2026)).toEqual([2026, 2025, 2024]);
    expect(yearList(2024, 2026, 2030)[0]).toBe(2030); // 今の値が範囲の外でも並べる
  });
});

describe("ArYearMonthInput・ArMonthDayInput", () => {
  it("月を打つと YYYY-MM、範囲外は受け付けない（全角も読む）", async () => {
    const w = mount(ArYearMonthInput, { props: { modelValue: "2026-10" } });
    const m = w.get('[data-part="month"]');
    expect((m.element as HTMLInputElement).value).toBe("10");
    await m.setValue("４");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["2026-04"]);
    await m.setValue("13");
    expect((m.element as HTMLInputElement).value).toBe("4"); // 範囲外は打つ前に戻す（全角は半角にそろえる）
  });
  it("月日：2月30日は2月29日に寄せ、月が決まると日の欄へ進む", async () => {
    const w = mount(ArMonthDayInput, { props: { modelValue: null }, attachTo: document.body });
    const [m, d] = w.findAll("input");
    await m!.setValue("2");
    expect(document.activeElement).toBe(d!.element);
    await d!.setValue("30");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["02-29"]);
    await d!.setValue("32");
    expect((d!.element as HTMLInputElement).value).toBe("30");
    w.unmount();
  });
});

describe("ArKanaInput・ArKanaText", () => {
  it("姓・名を空白でつなぎ、ひらがなのフリガナは確定でカタカナに直す", async () => {
    const w = mount(ArKanaInput, { props: { name: "千速 一真", kana: null } });
    const inputs = w.findAll("input");
    expect((inputs[0]!.element as HTMLInputElement).value).toBe("千速");
    expect((inputs[1]!.element as HTMLInputElement).value).toBe("一真");
    await inputs[1]!.setValue("和真");
    expect(w.emitted("update:name")?.at(-1)).toEqual(["千速 和真"]);
    await inputs[2]!.setValue("ちはや");
    expect(w.emitted("update:kana")?.at(-1)).toEqual(["ちはや"]);
    await w.setProps({ kana: "ちはや" });
    await inputs[2]!.trigger("blur");
    expect(w.emitted("update:kana")?.at(-1)).toEqual(["チハヤ"]);
  });
  it("フリガナつきの氏名は、上に小さく・1行の両方の形を持つ", () => {
    const w = mount(ArKanaText, { props: { name: "山田 太郎", kana: "ヤマダ タロウ" } });
    expect(w.get('[data-part="kana"]').text()).toBe("ヤマダ タロウ");
    expect(w.get('[data-part="inline"]').text()).toBe("山田 太郎（ヤマダ タロウ）");
  });
});

describe("ArZipInput", () => {
  it("入力済みの番号をボタンから検索し、失敗後は再入力せず再試行できる", async () => {
    const lookup = vi.fn<(zip: string) => Promise<string | null>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce("東京都渋谷区神南");
    const w = mount(ArZipInput, { props: {
      modelValue: "150-0041", lookup,
      labels: { lookup: "Fill address", searching: "Searching", notFound: "Not found", failed: "Try again" },
    } });
    expect(lookup).not.toHaveBeenCalled();
    expect(w.get('[data-part="lookup"]').text()).toBe("Fill address");
    await w.get('[data-part="lookup"]').trigger("click");
    await flushPromises();
    expect(w.get('[data-part="status"]').text()).toBe("Try again");
    await w.get('[data-part="lookup"]').trigger("click");
    await flushPromises();
    expect(w.emitted("address")).toEqual([["東京都渋谷区神南", "150-0041"]]);
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await w.setProps({ modelValue: "150-00" });
    expect(w.get('[data-part="lookup"]').attributes("disabled")).toBeDefined();
    await w.setProps({ modelValue: "150-0041", disabled: true });
    expect(w.get('[data-part="lookup"]').attributes("disabled")).toBeDefined();
    await w.setProps({ lookup: undefined });
    expect(w.find('[data-part="lookup"]').exists()).toBe(false);
    w.unmount();
  });

  it.each(["reset", "disable", "unmount"])("検索中の%s後に古い住所を反映しない", async (action) => {
    let finish: (value: string | null) => void = () => {};
    const lookup = vi.fn(() => new Promise<string | null>((resolve) => { finish = resolve; }));
    const w = mount(ArZipInput, { props: { modelValue: "150-0041", lookup } });
    await w.get('[data-part="lookup"]').trigger("click");
    if (action === "reset") await w.setProps({ modelValue: null });
    else if (action === "disable") await w.setProps({ disabled: true });
    else w.unmount();
    finish("東京都渋谷区神南");
    await flushPromises();
    expect(w.emitted("address")).toBeUndefined();
    if (action !== "unmount") w.unmount();
  });

  it("数字だけを ###-#### に整え、7桁そろうと住所を引く", async () => {
    const lookup = vi.fn(async (z: string) => (z === "150-0041" ? "東京都渋谷区神南" : null));
    const w = mount(ArZipInput, { props: { modelValue: null, lookup } });
    await w.get("input").setValue("１５００ab041");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["150-0041"]);
    await flushPromises();
    expect(lookup).toHaveBeenCalledWith("150-0041");
    expect(w.emitted("address")?.[0]).toEqual(["東京都渋谷区神南", "150-0041"]);
    await w.get("input").setValue("9999999");
    await flushPromises();
    expect(w.attributes("data-state")).toBe("not-found");
  });
});

describe("ArFlagGroup・ArFlagView", () => {
  const week = ["日", "月", "火", "水", "木", "金", "土"].map((label, i) => ({ value: 1 << i, label }));
  it("入れるとビットを足し、外すと引く。allowed で項目を絞る", async () => {
    const w = mount(ArFlagGroup, { props: { modelValue: 2 + 8, options: week, allowed: 2 + 4 + 8 } });
    const boxes = w.findAll('input[type="checkbox"]');
    expect(boxes).toHaveLength(3);
    await boxes[1]!.setValue(true); // 火
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([14]);
    await boxes[0]!.setValue(false); // 月
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([8]);
  });
  it("立っている項目の名前を並べ、0 なら「なし」", () => {
    expect(mount(ArFlagView, { props: { value: 21, options: week } }).findAll('[data-part="item"]').map((x) => x.text())).toEqual(["日", "火", "木"]);
    expect(mount(ArFlagView, { props: { value: 0, options: week } }).text()).toBe("なし");
  });
});

describe("表示の部品", () => {
  it("ArChangedValue: rich values preserve blocks and hide prior content when unchanged", () => {
    const changed = mount(ArChangedValue, { props: { changed: true }, slots: { before: '<div>Previous image</div>', after: '<div>New image</div>' } });
    expect(changed.element.tagName).toBe("DIV");
    expect(changed.get('[data-part="before"]').text()).toBe("Previous image");
    expect(changed.get('[data-part="after"]').text()).toBe("New image");
    expect(changed.get('[data-part="before-label"]').attributes("data-ar-visually-hidden")).toBeUndefined();
    const same = mount(ArChangedValue, { props: { changed: false }, slots: { before: '<div>Previous image</div>', after: '<div>New image</div>' } });
    expect(same.find('[data-part="before"]').exists()).toBe(false);
    expect(same.text()).toBe("New image");
  });

  it("ArChangedValue：変わったときだけ 前→後", () => {
    const a = mount(ArChangedValue, { props: { before: "9:00", after: "10:00" } });
    expect(a.attributes("data-state")).toBe("changed");
    expect(a.get('[data-part="before"]').text()).toBe("9:00");
    const b = mount(ArChangedValue, { props: { before: "9:00", after: "9:00" } });
    expect(b.find('[data-part="before"]').exists()).toBe(false);
    expect(b.text()).toBe("9:00");
  });
  it("ArDaySummary：公開の札を押すと反対の値を出す", async () => {
    const w = mount(ArDaySummary, { props: { items: [{ label: "人件費", value: "¥36,300" }], published: true } });
    expect(w.get('[data-part="value"]').text()).toBe("¥36,300");
    const pub = w.get('[data-part="publish"]');
    expect(pub.attributes("aria-pressed")).toBe("true");
    await pub.trigger("click");
    expect(w.emitted("update:published")?.[0]).toEqual([false]);
  });
  it("ArInfo：mark は名前つきのボタンで open を出す。href があればリンク", async () => {
    const w = mount(ArInfo, { props: { kind: "mark", text: "休憩とは" } });
    expect(w.element.tagName).toBe("BUTTON");
    expect(w.attributes("aria-label")).toBe("休憩とは");
    await w.trigger("click");
    expect(w.emitted("open")).toHaveLength(1);
    const l = mount(ArInfo, { props: { kind: "detail", href: "https://example.com" } });
    expect(l.attributes("target")).toBe("_blank");
  });
  it("ArEllipsis・ArBalloon・ArChip は属性で見た目を受ける", () => {
    expect(mount(ArEllipsis, { props: { text: "長い", lines: 2 } }).attributes("data-lines")).toBe("multi");
    const b = mount(ArBalloon, { props: { shape: "dot", size: 30, tail: "right" }, slots: { default: "3" } });
    expect(b.attributes("style")).toContain("--ar-balloon-size: 30px");
    expect(mount(ArChip, { slots: { default: "繰り返し" } }).attributes("data-tone")).toBe("accent");
  });
  it("ArThumbnail：写真がなければ人の形、カメラで切り抜きを開く", async () => {
    const w = mount(ArThumbnail, { props: { modelValue: null }, attachTo: document.body });
    expect(w.find('[data-part="silhouette"]').exists()).toBe(true);
    await w.get('[data-part="camera"]').trigger("click");
    await nextTick();
    expect(document.querySelector('[data-ar="thumbnail-editor"]')).not.toBeNull();
    w.unmount();
  });
});

describe("画面の骨格", () => {
  const menus = [
    { key: "shift", label: "シフト", icon: "cal" as const },
    { key: "attendance", label: "勤怠", icon: "brief" as const, href: "/attendance" },
  ];
  it("ArAppHeader：今いる項目に aria-current、押すと navigate、件数を読み上げる", async () => {
    const w = mount(ArAppHeader, {
      props: { menus, current: "shift", pills: [{ key: "todo", label: "やることリスト", count: 3, tone: "todo" as const }], account: { label: "管理ページ" } },
      slots: { logo: '<img alt="ARROW" />' },
    });
    const items = w.findAll('[data-part="item"]');
    expect(items[0]!.attributes("aria-current")).toBe("page");
    expect(items[1]!.element.tagName).toBe("A");
    await items[1]!.trigger("click");
    expect(w.emitted("navigate")?.[0]?.[0]).toBe("attendance");
    expect(w.get('[data-part="count"]').text()).toContain("3件");
    await w.get('[data-part="pill"]').trigger("click");
    expect(w.emitted("pill")?.[0]).toEqual(["todo"]);
    expect(w.get('[data-part="logo"] img').attributes("alt")).toBe("ARROW");
  });
  it("ArAppHeader：管理ページのメニューは ↓ で開き、↑↓ で動かし、押すと account", async () => {
    const w = mount(ArAppHeader, {
      props: { menus, account: { label: "管理ページ" }, accountMenu: [{ key: "status", label: "契約状況" }, { key: "logout", label: "ログアウト" }] },
      attachTo: document.body,
    });
    const acc = w.get('[data-part="account"]');
    await acc.trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    await nextTick();
    expect(acc.attributes("aria-expanded")).toBe("true");
    const items = document.querySelectorAll<HTMLButtonElement>('[data-ar="app-account-menu"] [role="menuitem"]');
    expect(document.activeElement).toBe(items[0]);
    items[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(items[1]);
    items[1]!.click();
    expect(w.emitted("account")?.[0]).toEqual(["logout"]);
    w.unmount();
  });
  it("ArAppFooter・ArMobileHeader・ArBottomNav", async () => {
    const f = mount(ArAppFooter, { props: { links: [{ key: "guide", label: "ご利用ガイド" }], supports: [{ key: "mail", label: "お問い合わせ", icon: "mail" as const }] } });
    await f.get('[data-part="link"]').trigger("click");
    expect(f.emitted("select")?.[0]?.[0]).toBe("guide");
    const m = mount(ArMobileHeader, { props: { count: 5, noticeLabel: "お知らせ" } });
    expect(m.get('[data-part="notice"]').attributes("aria-label")).toBe("お知らせ 5件");
    await m.get('[data-part="notice"]').trigger("click");
    expect(m.emitted("notice")).toHaveLength(1);
    const n = mount(ArBottomNav, { props: { items: menus, current: "attendance", fixed: false } });
    expect(n.attributes("data-fixed")).toBeUndefined();
    expect(n.findAll('[data-part="item"]')[1]!.attributes("aria-current")).toBe("page");
  });
});
