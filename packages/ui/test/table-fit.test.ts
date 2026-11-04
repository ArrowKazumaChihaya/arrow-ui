import { it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArTable from "../src/components/ArTable.vue";

it("fitting a table and wrapping long text preserve the edited row, selection, and action payload", async () => {
  const rows = [{ id: 7, name: "契約書", reason: "就業時間を確認したい\n長い否認理由" }];
  const w = mount(ArTable<(typeof rows)[number]>, {
    props: {
      rows,
      columns: [
        { key: "name", title: "書類", width: 160, editor: "text" },
        { key: "reason", title: "理由", wrap: true },
      ],
      rowKey: "id",
      caption: "合意履歴",
      selectable: true,
      selected: [7],
      editing: [7],
      edits: { "7:name": "編集中の書類名" },
    },
  });
  const input = w.get('input[data-part="cell-input"]');
  const original = input.element;
  expect(w.attributes("data-fit")).toBeUndefined();
  await w.setProps({ fit: true });
  expect(w.get('input[data-part="cell-input"]').element).toBe(original);
  expect(original).toHaveProperty("value", "編集中の書類名");
  expect(w.get('tbody input[type="checkbox"]').element).toHaveProperty("checked", true);
  expect(w.get('td[data-wrap]').text()).toContain("就業時間を確認したい\n長い否認理由");
  expect(w.attributes("data-fit")).toBe("true");
  await input.trigger("keydown", { key: "Enter", ctrlKey: true });
  expect(w.emitted("commit")?.[0]?.[0]).toMatchObject({ key: 7, values: { name: "編集中の書類名" } });
  w.unmount();
});
