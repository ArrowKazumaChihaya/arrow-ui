import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import ArAppHeader from "../src/components/ArAppHeader.vue";
import ArBottomNav from "../src/components/ArBottomNav.vue";
import ArMobileHeader from "../src/components/ArMobileHeader.vue";
import ArViewOptions from "../src/components/ArViewOptions.vue";
import ArRadio from "../src/components/ArRadio.vue";
import ArRadioGroup from "../src/components/ArRadioGroup.vue";
import ArCollapse from "../src/components/ArCollapse.vue";
import ArSelect from "../src/components/ArSelect.vue";
import ArTextInput from "../src/components/ArTextInput.vue";
import ArChangedValue from "../src/components/ArChangedValue.vue";
import ArZipInput from "../src/components/ArZipInput.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("F1：製品からの指摘（ヘッダー・スマホのメニュー・表示内容・ラジオ・折りたたみ・セレクト・入力・変更前後）", () => {
  it("ArAppHeader：ピルを押すと一覧を出したままにし、× で pill-item-delete、「すべて表示する」で pill-restore、Escape で閉じる", async () => {
    const w = mount(ArAppHeader, {
      attachTo: document.body,
      props: {
        menus: [],
        pills: [
          {
            key: "todo",
            label: "やることリスト",
            tone: "todo",
            items: [{ key: "tax", label: "住民税改定", deletable: true }, { key: "ot", label: "残業承認" }],
            hiddenCount: 2,
          },
        ],
      },
    });
    const pill = w.get('[data-part="pill"]');
    await pill.trigger("click");
    expect(w.emitted("pill")?.[0]).toEqual(["todo"]);
    expect(pill.attributes("aria-expanded")).toBe("true");
    await pill.trigger("pointerleave");
    await new Promise((r) => setTimeout(r, 200));
    // 一覧は ArFloat に載せて出す先（body）へ出すので、document から探す
    const q = (sel: string) => document.querySelector<HTMLElement>(sel);
    expect(q('[data-ar="app-pill-list"] [data-part="pill-list"]')).not.toBeNull();
    expect(document.querySelectorAll('[data-part="pill-delete"]')).toHaveLength(1);
    q('[data-part="pill-delete"]')!.click();
    expect(w.emitted("pill-item-delete")?.[0]).toEqual(["todo", "tax"]);
    q('[data-part="pill-restore"]')!.click();
    expect(w.emitted("pill-restore")?.[0]).toEqual(["todo"]);
    q('[data-part="pill-list"]')!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();
    expect(q('[data-part="pill-list"]')).toBeNull();
    w.unmount();
  });

  it("ArAppHeader：通知を選んだら一覧を閉じ、元のボタンへフォーカスを戻して詳細を開ける", async () => {
    const w = mount(ArAppHeader, {
      attachTo: document.body,
      props: {
        menus: [],
        pills: [{ key: "notice", label: "お知らせ", items: [{ key: "n1", label: "通知の詳細" }] }],
      },
    });
    const pill = w.get('[data-part="pill"]');
    await pill.trigger("click");
    const item = document.querySelector<HTMLButtonElement>('[data-part="pill-item"]')!;
    item.focus();
    item.click();
    await nextTick();
    expect(w.emitted("pill-item")?.[0]).toEqual(["notice", "n1"]);
    expect(document.querySelector('[data-part="pill-list"]')).toBeNull();
    expect(pill.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(pill.element);
    await pill.trigger("click");
    expect(document.querySelector('[data-part="pill-list"]')).not.toBeNull();
    w.unmount();
  });

  it("ArAppHeader：空のときは emptyText、↓ で一覧・子のメニューの最初へ移る、領域のタブに note", async () => {
    const w = mount(ArAppHeader, {
      attachTo: document.body,
      props: {
        menus: [{ key: "emp", label: "社員情報", children: [{ key: "list", label: "社員一覧" }, { key: "paid", label: "有給管理" }] }],
        pills: [{ key: "todo", label: "やることリスト", items: [], emptyText: "やることはありません" }],
        domains: [{ key: "ex", label: "経費精算", note: "未契約" }],
      },
    });
    await w.get('[data-part="pill"]').trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(document.querySelector('[data-part="pill-empty"]')?.textContent).toBe("やることはありません");
    await w.get('[data-part="item"]').trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(document.activeElement?.textContent).toBe("社員一覧");
    await w.get('[data-part="submenu"]').trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toBe("有給管理");
    await w.get('[data-part="submenu"]').trigger("keydown", { key: "Escape" });
    expect(w.find('[data-part="submenu"]').exists()).toBe(false);
    expect(w.get('[data-part="domain-note"]').text()).toBe("未契約");
    w.unmount();
  });

  it("ArAppHeader：domain-style=menu は1段目のボタンから領域を選び、畳むとメニューの段を隠す", async () => {
    const w = mount(ArAppHeader, {
      attachTo: document.body,
      props: {
        menus: [{ key: "shift", label: "シフト" }],
        domains: [{ key: "hr", label: "人事・労務" }, { key: "ex", label: "経費精算", note: "未契約" }],
        domain: "hr",
        domainStyle: "menu",
        collapsible: true,
      },
    });
    expect(w.find('[data-part="domains"]').exists()).toBe(false);
    const btn = w.get('[data-part="domain-switch"]');
    expect(btn.text()).toBe("人事・労務");
    expect(btn.attributes("aria-expanded")).toBe("false");
    await btn.trigger("click");
    await nextTick();
    const items = document.querySelectorAll<HTMLElement>('[data-part="domain-menu-item"]');
    expect(items).toHaveLength(2);
    expect(items[0]!.getAttribute("aria-checked")).toBe("true");
    expect(items[1]!.textContent).toContain("未契約");
    items[1]!.click();
    await nextTick();
    expect(w.emitted("domain")?.[0]).toEqual(["ex"]);
    expect(document.querySelector('[data-part="domain-menu-item"]')).toBeNull();
    await w.get('[data-part="toggle"]').trigger("click");
    expect(w.emitted("update:collapsed")?.[0]).toEqual([true]);
    await w.setProps({ collapsed: true });
    expect(w.find('[data-part="nav"]').exists()).toBe(false);
    expect(w.find('[data-part="expand"]').exists()).toBe(true);
    w.unmount();
  });

  it("ArBottomNav：子のある項目を押すと子の段（navigate も出す）、多い項目は「メニュー」から下の一覧に", async () => {
    const items = [
      { key: "shift", label: "シフト", children: [{ key: "submit", label: "シフト提出" }] },
      { key: "a", label: "勤怠" },
      { key: "b", label: "給与" },
      { key: "c", label: "書類" },
      { key: "d", label: "通知" },
      { key: "e", label: "設定", children: [{ key: "e1", label: "会社設定" }] },
    ];
    const w = mount(ArBottomNav, { attachTo: document.body, props: { items, fixed: false, current: "e1" } });
    const navItems = w.findAll('[data-part="item"]');
    expect(navItems).toHaveLength(5);
    expect(navItems[4]!.attributes("data-kind")).toBe("more");
    expect(navItems[4]!.attributes("data-state")).toContain("on");
    await navItems[0]!.trigger("click");
    expect(w.emitted("navigate")?.[0]?.[0]).toBe("shift");
    await w.get('[data-part="submenu-item"]').trigger("click");
    expect(w.emitted("navigate")?.[1]?.[0]).toBe("submit");
    expect(w.find('[data-part="submenu"]').exists()).toBe(false);
    await navItems[4]!.trigger("click");
    expect(w.emitted("more")).toHaveLength(1);
    await nextTick();
    const tiles = [...document.querySelectorAll<HTMLElement>('[data-ar="nav-sheet"] [data-part="tile"]')];
    expect(tiles.map((t) => t.textContent?.trim())).toEqual(["通知", "設定", "会社設定"]);
    tiles[2]!.click();
    expect(w.emitted("navigate")?.[2]?.[0]).toBe("e1");
    w.unmount();
  });

  it("ArMobileHeader：menus を渡すとメニューのボタン、押すと一覧、タイルで navigate", async () => {
    const w = mount(ArMobileHeader, { attachTo: document.body, props: { menus: [{ key: "shift", label: "シフト", children: [{ key: "view", label: "シフト閲覧" }] }] } });
    await w.get('[data-part="menu"]').trigger("click");
    await nextTick();
    const tiles = [...document.querySelectorAll<HTMLElement>('[data-ar="nav-sheet"] [data-part="tile"]')];
    expect(tiles).toHaveLength(2);
    tiles[1]!.click();
    expect(w.emitted("navigate")?.[0]?.[0]).toBe("view");
    w.unmount();
  });

  it("ArViewOptions：presets を押すとその組み合わせ、保存・消すはイベントだけ（ブラウザーに書かない）", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const groups = [{ options: [{ key: "a", label: "人数" }, { key: "b", label: "不足" }, { key: "c", label: "提出" }] }];
    const presets = [
      { key: "p1", label: "会社の既定", keys: ["a", "b"], scope: "company" as const, default: true },
      { key: "p2", label: "自分の", keys: ["c"], scope: "personal" as const, deletable: true },
    ];
    const w = mount(ArViewOptions, { attachTo: document.body, props: { modelValue: ["b", "a"], groups, presets, saveScopes: ["company", "personal"], open: true } });
    await nextTick();
    const rows = [...document.querySelectorAll<HTMLElement>('[data-part="preset"]')];
    expect(rows[0]!.dataset.state).toBe("on");
    (rows[1]!.querySelector('[data-part="preset-apply"]') as HTMLElement).click();
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["c"]]);
    expect(w.emitted("apply")?.[0]?.[0]).toMatchObject({ key: "p2" });
    (rows[1]!.querySelector('[data-part="preset-delete"]') as HTMLElement).click();
    expect(w.emitted("delete-preset")?.[0]?.[0]).toMatchObject({ key: "p2" });
    (document.querySelector('[data-part="save"] [data-kind="default"]') as HTMLElement).click();
    expect(w.emitted("save-preset")?.[0]?.[0]).toEqual({ label: "会社の既定", scope: "company", keys: ["a", "b"], asDefault: true });
    (document.querySelector('[data-part="save"] [data-kind="name"]') as HTMLElement).click();
    await nextTick();
    const input = document.querySelector<HTMLInputElement>('[data-part="save-form"] input')!;
    input.value = "夜の確認";
    input.dispatchEvent(new Event("input"));
    await nextTick();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(w.emitted("save-preset")?.[1]?.[0]).toEqual({ label: "夜の確認", scope: "personal", keys: ["a", "b"], asDefault: false });
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
    w.unmount();
  });

  it("ArRadio：value と modelValue が同じなら選ばれた形、押すと value を出す（UI/Radio の value・thisValue）", async () => {
    const w = mount(ArRadio, { props: { modelValue: 1, value: 2, name: "p", label: "田中を選ぶ", tabindex: 3 } });
    expect(w.attributes("data-state")).toBeUndefined();
    const input = w.get("input");
    expect(input.attributes("aria-label")).toBe("田中を選ぶ");
    expect(input.attributes("tabindex")).toBe("3");
    await input.setValue(true);
    expect(w.emitted("update:modelValue")?.[0]).toEqual([2]);
    await w.setProps({ modelValue: 2 });
    expect(w.attributes("data-state")).toContain("checked");
    await w.setProps({ disabled: true, modelValue: 1 });
    await input.trigger("change");
    expect(w.emitted("update:modelValue")).toHaveLength(1);
  });

  it("ArRadioGroup：#label と #extra（選択肢の下。押してもラジオは切り替わらない）", async () => {
    const w = mount(ArRadioGroup, {
      props: { modelValue: "a", label: "出し方", options: [{ value: "a", label: "A" }, { value: "b", label: "B" }] },
      slots: {
        label: ({ option }: { option: { label: string } }) => h("b", `${option.label}!`),
        extra: ({ option, checked }: { option: { value: string | number | boolean }; checked: boolean }) => (checked ? h("button", { class: "inner" }, `in-${String(option.value)}`) : null),
      },
    });
    expect(w.findAll('[data-part="label"] b').map((b) => b.text())).toEqual(["A!", "B!"]);
    const extras = w.findAll('[data-part="extra"]');
    expect(extras[0]!.text()).toBe("in-a");
    await w.get(".inner").trigger("click");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("ArCollapse：#title に部品、#header-extra は押しても開閉しない", async () => {
    const w = mount(ArCollapse, {
      props: { items: [{ key: "g", title: "プログラムガイド" }], modelValue: [] },
      slots: { "title-g": () => h("span", { class: "t" }, "ガイド＋札"), "header-extra-g": () => h("button", { class: "x" }, "コピー") },
    });
    expect(w.get('[data-part="trigger"] .t').text()).toBe("ガイド＋札");
    await w.get(".x").trigger("click");
    expect(w.emitted("update:modelValue")).toBeUndefined();
    await w.get('[data-part="trigger"]').trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual([["g"]]);
  });

  it("ArSelect：actions は ↑↓ で選択肢の続きとして移れ、Enter で action（値は変わらない）、width と tone を渡せる", async () => {
    const w = mount(ArSelect, {
      attachTo: document.body,
      props: { modelValue: 1, options: [{ value: 1, label: "渋谷店" }], actions: [{ value: "add", label: "店舗を追加", width: 130, tone: "secondary" }], label: "店舗" },
    });
    const root = w.get('[data-ar="select"]');
    await root.trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    await root.trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    const action = document.querySelector<HTMLElement>('[data-part="action"]')!;
    expect(action.dataset.state).toBe("active");
    expect(root.attributes("aria-activedescendant")).toBe(action.id);
    expect((action.querySelector('[data-ar="button"]') as HTMLElement).style.width).toBe("130px");
    await root.trigger("keydown", { key: "Enter" });
    expect(w.emitted("action")?.[0]).toEqual(["add"]);
    expect(w.emitted("update:modelValue")).toBeUndefined();
    w.unmount();
  });

  it("ArTextInput：class・style は箱、ほかの属性とイベントは input、inputClass、focus・select、直した値に欄がそろう", async () => {
    const onKeydown = vi.fn();
    const onPaste = vi.fn();
    const Host = defineComponent({
      setup() {
        const v = ref("");
        const el = ref<InstanceType<typeof ArTextInput> | null>(null);
        const mask = (s: string) => s.replace(/[^0-9]/g, "").slice(0, 3);
        return () =>
          h(ArTextInput, {
            ref: el,
            modelValue: v.value,
            "onUpdate:modelValue": (s: string) => (v.value = mask(s)),
            class: "outer",
            style: "width: 120px",
            tabindex: 5,
            inputmode: "numeric",
            "aria-describedby": "help",
            inputClass: "tabindexkey",
            onKeydown,
            onPaste,
          });
      },
    });
    const w = mount(Host, { attachTo: document.body });
    const root = w.get('[data-ar="text-input"]');
    const input = w.get("input");
    expect(root.classes()).toContain("outer");
    expect(root.attributes("style")).toContain("width: 120px");
    expect(input.classes()).toEqual(["tabindexkey"]);
    expect(input.attributes("tabindex")).toBe("5");
    expect(input.attributes("inputmode")).toBe("numeric");
    expect(input.attributes("aria-describedby")).toBe("help");
    await input.trigger("keydown", { key: "ArrowRight" });
    await input.trigger("paste");
    expect(onKeydown).toHaveBeenCalled();
    expect(onPaste).toHaveBeenCalled();
    await input.setValue("12");
    await nextTick();
    await input.setValue("12a");
    await nextTick();
    await nextTick();
    expect((input.element as HTMLInputElement).value).toBe("12");
    const comp = w.findComponent(ArTextInput).vm as unknown as { focus: () => void; select: () => void; input: HTMLInputElement };
    comp.focus();
    expect(document.activeElement).toBe(input.element);
    expect(comp.input).toBe(input.element);
    w.unmount();
  });

  it("ArChangedValue：layout=\"text\" は今の UI/ChangedValue と同じ「前 → 後」と class=\"changed\"（製品の履歴の固定テストと同じ確かめ方）", () => {
    const w = mount(ArChangedValue, { props: { layout: "text", before: "<b>before</b>", after: "<script>after</script>", changed: true } });
    expect(w.find(".changed").text()).toContain("<b>before</b> → <script>after</script>");
    expect(w.attributes("data-state")).toBe("changed");
    const same = mount(ArChangedValue, { props: { layout: "text", before: "パート", after: "パート" } });
    expect(same.classes()).not.toContain("changed");
    expect(same.text()).toBe("パート");
    const empty = mount(ArChangedValue, { props: { layout: "text", before: null, after: "東京" } });
    expect(empty.text()).toBe("→ 東京");
    expect(empty.element.textContent).toBe(" → 東京");
  });

  it("ArZipInput：tabindex は中の入力へ、class は外側、ref から focus()", () => {
    const w = mount(ArZipInput, { attachTo: document.body, props: { modelValue: null }, attrs: { tabindex: 4, class: "zip" } });
    expect(w.classes()).toContain("zip");
    expect(w.get("input").attributes("tabindex")).toBe("4");
    (w.vm as unknown as { focus: () => void }).focus();
    expect(document.activeElement).toBe(w.get("input").element);
    w.unmount();
  });
});
