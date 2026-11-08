import { mount } from "@vue/test-utils";
import ArUpload from "../src/components/ArUpload.vue";

describe("ArUpload image selection", () => {
  it("keeps an undecodable image selected with an accessible fallback", async () => {
    const file = { id: "heic", name: "保険証明.heic", url: "blob:heic", status: "done" as const, previewFallback: "この端末ではプレビューできません" };
    const wrapper = mount(ArUpload, { props: { files: [file], listType: "picture" } });
    await wrapper.get("img").trigger("error");
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.get('[data-part="card-name"]').text()).toBe(file.previewFallback);
    expect(wrapper.emitted("remove")).toBeUndefined();
    await wrapper.get('[data-part="remove"]').trigger("click");
    expect(wrapper.emitted("remove")?.[0]).toEqual([file]);
    await wrapper.setProps({ files: [] });
    await wrapper.setProps({ files: [file] });
    expect(wrapper.get("img").attributes("src")).toBe(file.url);
  });

  it.each(["text", "picture"] as const)("cannot remove a disabled %s selection", async (listType) => {
    const file = { id: 1, name: "photo.jpg", status: "done" as const };
    const wrapper = mount(ArUpload, { props: { files: [file], listType, disabled: true } });
    expect(wrapper.get('[data-part="remove"]').attributes("disabled")).toBeDefined();
    await wrapper.get('[data-part="remove"]').trigger("click");
    expect(wrapper.emitted("remove")).toBeUndefined();
    await wrapper.setProps({ disabled: false });
    await wrapper.get('[data-part="remove"]').trigger("click");
    expect(wrapper.emitted("remove")?.[0]).toEqual([file]);
  });

  it("cannot remove a picture during an upload", async () => {
    const wrapper = mount(ArUpload, { props: { files: [{ id: 1, name: "photo.jpg", status: "uploading" }], listType: "picture" } });
    await wrapper.get('[data-part="remove"]').trigger("click");
    expect(wrapper.emitted("remove")).toBeUndefined();
  });
});
