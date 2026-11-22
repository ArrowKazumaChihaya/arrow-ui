import { mount } from "@vue/test-utils";
import { h } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import ArCatalog from "../src/components/ArCatalog.vue";
import type { ArCatalogGroup } from "../src/components/ArCatalog.contract";

afterEach(() => {
  document.body.innerHTML = "";
});

const groups: ArCatalogGroup[] = [
  {
    key: "join",
    title: "入社",
    icon: "users",
    items: [
      { key: "fuyo", title: "扶養控除等申告書", formats: ["PDF"] },
      { key: "shaho", title: "社会保険被保険者資格取得届", formats: ["PDF", "CSV"] },
    ],
  },
  { key: "agg", title: "集計表", icon: "chart", items: [{ key: "shotoku", title: "所得税集計表", formats: ["CSV"], external: true }] },
];

describe("ArCatalog", () => {
  it("分類ごとの件数・一覧・形式の印を出し、行を押すと選ぶ", async () => {
    const w = mount(ArCatalog, { props: { title: "書類・集計", groups } });
    const nav = w.findAll('[data-part="nav-item"]').map((x) => x.text());
    expect(nav).toEqual(["すべて3", "よく使う0", "入社2", "集計表1"]);
    expect(w.findAll('[data-part="group"]')).toHaveLength(2);
    expect(w.findAll('[data-part="row"]')[1]!.findAll('[data-part="format"]').map((x) => x.attributes("aria-label"))).toEqual(["PDF", "CSV"]);
    expect(w.findAll('[data-part="end"]')[2]!.attributes("data-external")).toBe("");
    await w.findAll('[data-part="pick"]')[0]!.trigger("click");
    expect(w.emitted("update:selected")![0]).toEqual(["fuyo"]);
  });

  it("検索で絞り、当てはまらないと知らせる。分類を押すとその分類だけ", async () => {
    const w = mount(ArCatalog, { props: { title: "書類・集計", groups } });
    await w.get('[data-part="search"] input').setValue("資格");
    expect(w.findAll('[data-part="row-title"]').map((x) => x.text())).toEqual(["社会保険被保険者資格取得届"]);
    expect(w.get('[data-part="heading"] h2').text()).toBe("「資格」の検索結果");
    await w.get('[data-part="search"] input').setValue("ない言葉");
    expect(w.find('[data-part="empty"]').exists()).toBe(true);
    await w.findAll('[data-part="nav-item"]')[3]!.trigger("click");
    expect(w.findAll('[data-part="row-title"]').map((x) => x.text())).toEqual(["所得税集計表"]);
  });

  it("☆でよく使うに出し入れし、よく使うの一覧と札に並ぶ", async () => {
    const w = mount(ArCatalog, { props: { title: "書類・集計", groups, favorites: ["shotoku"] } });
    expect(w.findAll('[data-part="chip"]').map((x) => x.text())).toEqual(["所得税集計表"]);
    await w.findAll('[data-part="star"]')[0]!.trigger("click");
    expect(w.emitted("update:favorites")![0]).toEqual([["shotoku", "fuyo"]]);
    await w.findAll('[data-part="nav-item"]')[1]!.trigger("click");
    expect(w.findAll('[data-part="row-title"]').map((x) => x.text())).toEqual(["所得税集計表"]);
    expect(w.get('[data-part="row-group"]').text()).toBe("集計表");
  });

  it("選んだ項目の説明は detail スロット、閉じると選びをやめる", async () => {
    const w = mount(ArCatalog, {
      props: { title: "書類・集計", groups, selected: "shaho" },
      slots: { detail: ({ item }: { item: { title: string } }) => h("p", { "data-test": "detail" }, `${item.title}の説明`) },
    });
    expect(w.get('[data-part="aside"]').attributes("data-open")).toBe("");
    expect(w.get('[data-part="aside-tag"]').text()).toBe("入社");
    expect(w.get('[data-test="detail"]').text()).toBe("社会保険被保険者資格取得届の説明");
    await w.get('[data-part="aside-close"]').trigger("click");
    expect(w.emitted("update:selected")![0]).toEqual([null]);
    const empty = mount(ArCatalog, { props: { title: "書類・集計", groups } });
    expect(empty.find('[data-part="placeholder"]').exists()).toBe(true);
  });
});

describe("ArCatalog の件数", () => {
  it("同じ項目を複数の分類に置いても、「すべて」と見出しの件数は1つに数える", async () => {
    const shared = { key: "gensen", title: "源泉徴収票" };
    const w = mount(ArCatalog, {
      props: {
        title: "書類・集計",
        groups: [
          { key: "join", title: "入社", items: [shared, { key: "a", title: "資格取得届" }] },
          { key: "leave", title: "退社", items: [shared] },
        ],
      },
    });
    const allNav = w.get('[data-part="nav-item"]');
    expect(allNav.get('[data-part="nav-count"]').text()).toBe("2");
    expect(w.get('[data-part="heading-count"]').text()).toBe("2件");
    w.unmount();
  });
});
