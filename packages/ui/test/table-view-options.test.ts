import { it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ArTable from "../src/components/ArTable.vue";
import ArViewOptions from "../src/components/ArViewOptions.vue";

it("hides optional columns and avatars without hiding row identity/actions or changing selection", async () => {
  const rows = [{ id: 7, name: "確認用社員", branch: "本部" }];
  const table = mount(ArTable<(typeof rows)[number]>, {
    props: {
      rows,
      rowKey: "id",
      caption: "社員",
      viewOptions: true,
      selectable: true,
      selected: [7],
      columns: [
        { key: "name", title: "名前", avatar: true, editor: "text" },
        { key: "branch", title: "店舗" },
        { key: "actions", title: "操作" },
      ],
    },
    slots: { "cell-actions": "編集" },
  });
  expect(table.find('[data-ar="avatar"]').exists()).toBe(true);
  table.getComponent(ArViewOptions).vm.$emit("update:modelValue", []);
  await table.vm.$nextTick();
  expect(table.findAll('tbody td[data-part="cell"]').map((cell) => cell.text())).toEqual([
    "", "確認用社員", "編集",
  ]);
  expect(table.findAll('thead th').map((cell) => cell.text())).not.toContain("店舗");
  expect(table.find('[data-ar="avatar"]').exists()).toBe(false);
  expect(table.get('tbody input[type="checkbox"]').element).toHaveProperty("checked", true);
  expect(table.emitted("update:selected")).toBeUndefined();
  await table.setProps({ editing: [7] });
  expect(table.getComponent(ArViewOptions).props("disabled")).toBe(true);
  table.unmount();
});

it("keeps optional columns visible until view options are explicitly enabled", () => {
  const table = mount(ArTable<{ id: number }>, {
    props: { rows: [{ id: 1 }], columns: [{ key: "id", title: "番号" }], rowKey: "id", caption: "一覧" },
  });
  expect(table.findComponent(ArViewOptions).exists()).toBe(false);
  expect(table.get('tbody td[data-part="cell"]').text()).toBe("1");
  table.unmount();
});
