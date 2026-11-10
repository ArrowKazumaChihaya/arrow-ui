import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArTable from "../src/components/ArTable.vue";
import type { ArTableColumn } from "../src/components/ArTable.contract";

type R = { id: string; name: string };
const cols: ArTableColumn<R>[] = [{ key: "name", title: "名前", value: (r) => r.name }];
const rows: R[] = [
  { id: "1", name: "一" },
  { id: "2", name: "二" },
];
const rowEls = (w: ReturnType<typeof mount>) => w.findAll('tbody[data-part="body"]>tr[data-part="row"]');

describe("F5：行を押せる表（ArTable の row-click）", () => {
  it("row-click を受けている表だけ、行に data-clickable を付ける（指のカーソルの目印）", () => {
    const listening = mount(ArTable<R>, {
      props: { columns: cols, rows, rowKey: "id", caption: "表", onRowClick: () => {} },
    });
    expect(rowEls(listening).map((tr) => tr.attributes("data-clickable"))).toEqual(["true", "true"]);

    const quiet = mount(ArTable<R>, { props: { columns: cols, rows, rowKey: "id", caption: "表" } });
    expect(rowEls(quiet).map((tr) => tr.attributes("data-clickable"))).toEqual([undefined, undefined]);
  });

  it("行を押すと row-click に行と番号が届く", async () => {
    const w = mount(ArTable<R>, { props: { columns: cols, rows, rowKey: "id", caption: "表" } });
    await rowEls(w)[1]!.trigger("click");
    expect(w.emitted("row-click")).toEqual([[rows[1], 1]]);
  });
});
