import { mount } from "@vue/test-utils";
import { h } from "vue";
import ArButton from "../src/components/ArButton.vue";
import ArField from "../src/components/ArField.vue";
import ArTable from "../src/components/ArTable.vue";
import ArModal from "../src/components/ArModal.vue";
import type { ArFieldControlProps } from "../src/components/ArField.contract";
import type { ArTableColumn } from "../src/components/ArTable.contract";

// mount は generic な部品（ArTable）の Row を推論できないので、表のテストでは props を any で渡す
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const T = ArTable as any;

describe("ArButton", () => {
  it("押すと click。読み込み中と使えないときは出さない", async () => {
    const w = mount(ArButton, { props: { tone: "primary" }, slots: { default: "保存する" } });
    await w.trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
    await w.setProps({ loading: true });
    expect(w.attributes("disabled")).toBeDefined();
    expect(w.attributes("aria-busy")).toBe("true");
    expect(w.attributes("data-state")).toContain("loading");
    expect(w.find('[data-part="spinner"]').exists()).toBe(true);
  });
  it("アイコンだけのボタンは label を名前にする", () => {
    const w = mount(ArButton, { props: { icon: "pen", label: "変更" } });
    expect(w.attributes("aria-label")).toBe("変更");
    expect(w.attributes("data-icon-only")).toBeDefined();
  });
  it("部品・種類・大きさを属性で出す（design はこれだけを見る）", () => {
    const w = mount(ArButton, { props: { tone: "danger", size: "sm" }, slots: { default: "削除" } });
    expect(w.attributes("data-ar")).toBe("button");
    expect(w.attributes("data-tone")).toBe("danger");
    expect(w.attributes("data-size")).toBe("sm");
    expect(w.attributes("type")).toBe("button");
  });
});

describe("ArField", () => {
  it("ラベルと入力・間違い・説明を id で結ぶ", () => {
    const w = mount(ArField, {
      props: { label: "タイトル", required: true, error: "タイトルを入れてください", help: "従業員にも見えます" },
      slots: { default: (p: ArFieldControlProps) => h("input", { ...p }) },
    });
    const input = w.get("input");
    const id = input.attributes("id");
    expect(w.get("label").attributes("for")).toBe(id);
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-required")).toBe("true");
    const described = input.attributes("aria-describedby")?.split(" ") ?? [];
    expect(described).toHaveLength(2);
    for (const d of described) expect(w.find(`#${d}`).exists()).toBe(true);
    expect(w.get('[data-part="required"]').text()).toBe("必須");
    expect(w.attributes("data-state")).toBe("invalid");
  });
});

type Row = { id: number; name: string; minutes: number };
const rows: Row[] = [
  { id: 1, name: "佐藤 美咲", minutes: 480 },
  { id: 2, name: "田中 健", minutes: 300 },
];
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 140, sticky: true, sortable: true },
  { key: "minutes", title: "時間", align: "end" as const, value: (r: Row) => `${r.minutes / 60}:00` },
];

describe("ArTable", () => {
  it("列の値・右寄せ・左の固定・合計の行", () => {
    const w = mount(T, {
      props: { columns, rows, rowKey: "id", caption: "勤務メンバー", footer: { name: "合計 2名", minutes: "13:00" } },
    });
    const cells = w.findAll('tbody [data-part="cell"]');
    expect(cells[1]?.text()).toBe("8:00");
    expect(cells[1]?.attributes("data-align")).toBe("end");
    expect(cells[0]?.attributes("data-sticky")).toBe("start");
    expect(w.get('[data-part="foot"]').text()).toContain("合計 2名");
    expect(w.get('[data-part="viewport"]').attributes("aria-label")).toBe("勤務メンバー");
  });

  it("並べ替えの印を押すと asc → desc → なし を出す（並べ替えは製品がする）", async () => {
    const w = mount(T, { props: { columns, rows, rowKey: "id", caption: "表" } });
    await w.get('[data-part="sort"]').trigger("click");
    expect(w.emitted("update:sort")?.[0]).toEqual([{ key: "name", order: "asc" }]);
    await w.setProps({ sort: { key: "name", order: "asc" } });
    expect(w.get("th[aria-sort]").attributes("aria-sort")).toBe("ascending");
    await w.get('[data-part="sort"]').trigger("click");
    expect(w.emitted("update:sort")?.[1]).toEqual([{ key: "name", order: "desc" }]);
    await w.setProps({ sort: { key: "name", order: "desc" } });
    await w.get('[data-part="sort"]').trigger("click");
    expect(w.emitted("update:sort")?.[2]).toEqual([null]);
  });

  it("選択：1行・すべて・一部（indeterminate）", async () => {
    const w = mount(T, { props: { columns, rows, rowKey: "id", caption: "表", selectable: true } });
    const boxes = w.findAll('[data-part="select"]');
    await boxes[1]?.trigger("change");
    expect(w.emitted("update:selected")?.[0]).toEqual([[1]]);
    await w.setProps({ selected: [1] });
    expect((w.findAll('[data-part="select"]')[0]?.element as HTMLInputElement).indeterminate).toBe(true);
    expect(w.findAll('[data-part="row"]')[0]?.attributes("data-state")).toBe("selected");
    await w.findAll('[data-part="select"]')[0]?.trigger("change");
    expect(w.emitted("update:selected")?.[1]).toEqual([[1, 2]]);
  });

  it("展開すると expanded の slot を出す", async () => {
    const w = mount(T, {
      props: { columns, rows, rowKey: "id", caption: "表", expandable: true },
      slots: { expanded: ({ row }: { row: Row }) => `休憩 ${row.name}` },
    });
    await w.get('[data-part="expand-toggle"]').trigger("click");
    expect(w.emitted("update:expanded")?.[0]).toEqual([[1]]);
    await w.setProps({ expanded: [1] });
    expect(w.get('[data-part="expanded-row"]').text()).toBe("休憩 佐藤 美咲");
  });

  it("行がなければ空の文", () => {
    const w = mount(T, { props: { columns, rows: [], rowKey: "id", caption: "表" } });
    expect(w.get('[data-part="empty"]').text()).toBe("データがありません");
  });
});

describe("ArModal", () => {
  const base = { title: "イベントを追加", teleportTo: null };

  it("閉じていると何も出さない", () => {
    const w = mount(ArModal, { props: { ...base, open: false } });
    expect(w.find('[data-ar="modal"]').exists()).toBe(false);
  });

  it("dialog として名前を持ち、手順を出す", () => {
    const w = mount(ArModal, {
      props: { ...base, open: true, steps: ["期間と人数", "日ごとの確認", "相手"], currentStep: 1 },
      slots: { default: "本文", footer: "ボタン" },
      attachTo: document.body,
    });
    const dialog = w.get('[role="dialog"]');
    expect(dialog.attributes("aria-modal")).toBe("true");
    const title = w.get(`#${dialog.attributes("aria-labelledby")}`);
    expect(title.text()).toBe("イベントを追加");
    const steps = w.findAll('[data-part="step"]');
    expect(steps[0]?.attributes("data-state")).toBe("done");
    expect(steps[1]?.attributes("aria-current")).toBe("step");
    expect(document.documentElement.hasAttribute("data-ar-modal-open")).toBe(true);
    w.unmount();
  });

  it("Esc と × で閉じる。幕では既定で閉じない", async () => {
    const w = mount(ArModal, { props: { ...base, open: true }, attachTo: document.body });
    await w.get('[data-part="scrim"]').trigger("click");
    expect(w.emitted("update:open")).toBeUndefined();
    await w.get('[data-ar="modal"]').trigger("keydown", { key: "Escape" });
    expect(w.emitted("update:open")?.[0]).toEqual([false]);
    await w.get('[data-part="close"]').trigger("click");
    expect(w.emitted("close")).toHaveLength(2);
    w.unmount();
  });

  it("開くと本文の最初の入力にフォーカスする", async () => {
    const w = mount(ArModal, {
      props: { ...base, open: false },
      slots: { default: '<input id="first" />' },
      attachTo: document.body,
    });
    await w.setProps({ open: true });
    await new Promise((r) => setTimeout(r));
    expect(document.activeElement?.id).toBe("first");
    w.unmount();
  });
});
