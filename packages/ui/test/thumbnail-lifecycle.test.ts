import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ArThumbnail from "../src/components/ArThumbnail.vue";

const modal = defineComponent({
  props: ["open"],
  setup:
    (props, { slots }) =>
    () =>
      props.open ? h("section", [slots.default?.(), slots.footer?.()]) : null,
});
const active: ReturnType<typeof mount>[] = [];
const probes: TestImage[] = [];
class TestImage {
  naturalWidth = 200;
  naturalHeight = 100;
  src = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    probes.push(this);
  }
}
const createUrl = vi.fn<(blob: Blob) => string>();
const revokeUrl = vi.fn<(url: string) => void>();
const createDescriptor = Object.getOwnPropertyDescriptor(
  URL,
  "createObjectURL",
);
const revokeDescriptor = Object.getOwnPropertyDescriptor(
  URL,
  "revokeObjectURL",
);
const contextDescriptor = Object.getOwnPropertyDescriptor(
  HTMLCanvasElement.prototype,
  "getContext",
);
beforeEach(() => {
  probes.length = 0;
  createUrl
    .mockReset()
    .mockImplementation(() => `blob:fixture-${createUrl.mock.calls.length}`);
  revokeUrl.mockReset();
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: createUrl,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revokeUrl,
  });
  vi.stubGlobal("Image", TestImage);
});
afterEach(() => {
  for (const wrapper of active.splice(0)) wrapper.unmount();
  if (contextDescriptor)
    Object.defineProperty(
      HTMLCanvasElement.prototype,
      "getContext",
      contextDescriptor,
    );
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (createDescriptor)
    Object.defineProperty(URL, "createObjectURL", createDescriptor);
  else Reflect.deleteProperty(URL, "createObjectURL");
  if (revokeDescriptor)
    Object.defineProperty(URL, "revokeObjectURL", revokeDescriptor);
  else Reflect.deleteProperty(URL, "revokeObjectURL");
});
function editor(
  props: {
    closeOnSave?: boolean;
    freeCrop?: boolean;
    modelValue?: string | null;
  } = {},
) {
  const wrapper = mount(ArThumbnail, {
    props: { modelValue: null, open: true, ...props },
    global: { stubs: { ArModal: modal } },
  });
  active.push(wrapper);
  return wrapper;
}
function file(
  name: string,
  bytes: Promise<ArrayBuffer> = Promise.resolve(
    new Uint8Array([137, 80, 78, 71]).buffer,
  ),
) {
  const value = new File(["image"], name, { type: "image/png" });
  Object.defineProperty(value, "slice", {
    value: () => ({ arrayBuffer: () => bytes }),
  });
  return value;
}
async function select(wrapper: ReturnType<typeof editor>, value: File) {
  const input = wrapper.get('input[type="file"]');
  Object.defineProperty(input.element, "files", {
    configurable: true,
    value: [value],
  });
  await input.trigger("change");
  await flushPromises();
}
async function click(wrapper: ReturnType<typeof editor>, label: string) {
  const button = wrapper
    .findAll("button")
    .find(
      (button) =>
        button.text() === label || button.attributes("aria-label") === label,
    );
  if (!button) throw new Error(`Button not found: ${label}`);
  await button.trigger("click");
}

it.each([true, false])(
  "respects closeOnSave=%s while emitting the removal value",
  async (closeOnSave) => {
    const wrapper = editor({ closeOnSave });
    await click(wrapper, "登録");
    expect(wrapper.emitted("update:modelValue")).toEqual([[null]]);
    expect(wrapper.emitted("update:open")).toEqual(
      closeOnSave ? [[false]] : undefined,
    );
    expect(wrapper.find('[data-ar="thumbnail-editor"]').exists()).toBe(
      !closeOnSave,
    );
    if (!closeOnSave) {
      await wrapper.setProps({ open: false });
      expect(wrapper.find('[data-ar="thumbnail-editor"]').exists()).toBe(false);
    }
  },
);

it("ignores an older image completion and revokes its pending URL", async () => {
  const wrapper = editor();
  await select(wrapper, file("first.png"));
  await select(wrapper, file("second.png"));
  expect(revokeUrl).toHaveBeenCalledWith("blob:fixture-1");
  probes[1]?.onload?.();
  await flushPromises();
  probes[0]?.onload?.();
  await flushPromises();
  expect(wrapper.get('[data-part="picture"]').attributes("src")).toBe(
    "blob:fixture-2",
  );
  expect(wrapper.emitted("invalid-image")).toBeUndefined();
});

it("does not create a URL if the editor closes while image bytes are being read", async () => {
  let resolveBytes: (bytes: ArrayBuffer) => void = () => {};
  const bytes = new Promise<ArrayBuffer>((resolve) => {
    resolveBytes = resolve;
  });
  const wrapper = editor();
  await select(wrapper, file("late.png", bytes));
  await wrapper.setProps({ open: false });
  resolveBytes(new Uint8Array([137, 80, 78, 71]).buffer);
  await flushPromises();
  expect(createUrl).not.toHaveBeenCalled();
  expect(wrapper.emitted("invalid-image")).toBeUndefined();
});

it("releases pending probes on close and ignores their late failures after reopening", async () => {
  const wrapper = editor();
  await select(wrapper, file("late.png"));
  await wrapper.setProps({ open: false });
  expect(revokeUrl).toHaveBeenCalledWith("blob:fixture-1");
  await wrapper.setProps({ open: true });
  probes[0]?.onerror?.();
  await flushPromises();
  expect(wrapper.emitted("invalid-image")).toBeUndefined();
  expect(wrapper.find('[data-part="picture"]').exists()).toBe(false);
});

it("reports unreadable bytes without an unhandled rejection", async () => {
  const wrapper = editor();
  await select(
    wrapper,
    file("broken.png", Promise.reject(new Error("read failed"))),
  );
  expect(wrapper.emitted("invalid-image")).toEqual([["load"]]);
  expect(createUrl).not.toHaveBeenCalled();
});

it("removing the selected image invalidates a pending replacement", async () => {
  const wrapper = editor({ modelValue: "data:image/png;base64,fixture" });
  await select(wrapper, file("replacement.png"));
  await click(wrapper, "画像を消す");
  probes[0]?.onload?.();
  await flushPromises();
  expect(wrapper.find('[data-part="picture"]').exists()).toBe(false);
  expect(revokeUrl).toHaveBeenCalledWith("blob:fixture-1");
});

it.each(["close", "unmount"])(
  "discards a late free-crop result after %s",
  async (action) => {
    let finish: BlobCallback = () => {};
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: () => ({ fillRect: vi.fn(), drawImage: vi.fn() }),
    });
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback) => {
        finish = callback;
      },
    );
    const wrapper = editor({
      freeCrop: true,
      closeOnSave: false,
      modelValue: "data:image/png;base64,fixture",
    });
    const picture = wrapper.get('[data-part="picture"]');
    Object.defineProperty(picture.element, "naturalWidth", { value: 200 });
    Object.defineProperty(picture.element, "naturalHeight", { value: 100 });
    await picture.trigger("load");
    await click(wrapper, "登録");
    if (action === "close") await wrapper.setProps({ open: false });
    else wrapper.unmount();
    finish(new Blob(["output"], { type: "image/png" }));
    await flushPromises();
    expect(wrapper.emitted("file")).toBeUndefined();
    expect(wrapper.emitted("invalid-image")).toBeUndefined();
  },
);
