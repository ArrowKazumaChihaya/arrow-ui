import { computePosition } from "../src/internal/floating";

const vp = { width: 1000, height: 800 };
const rect = (x: number, y: number, w: number, h: number) => ({ left: x, top: y, right: x + w, bottom: y + h, width: w, height: h, x, y, toJSON: () => ({}) }) as DOMRect;

describe("浮かぶものの置き場所", () => {
  it("下に置き、左をそろえる", () => {
    expect(computePosition(rect(100, 100, 200, 36), { width: 240, height: 200 }, "bottom-start", 4, vp)).toMatchObject({ top: 140, left: 100, placement: "bottom-start" });
  });
  it("下に入らなければ上へ返す", () => {
    expect(computePosition(rect(100, 700, 200, 36), { width: 240, height: 200 }, "bottom-start", 4, vp)).toMatchObject({ top: 496, placement: "top-start" });
  });
  it("右にはみ出すなら画面の中へ寄せる", () => {
    expect(computePosition(rect(900, 100, 80, 36), { width: 240, height: 100 }, "bottom-start", 4, vp).left).toBe(752);
  });
});
