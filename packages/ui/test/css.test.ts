import fs from "node:fs";
import path from "node:path";

/**
 * 部品の中に別の部品が入る（ArField の中の ArCheckbox、ArCard の中の ArTable など）。
 * 部位の名前（label・head・body…）は部品をまたいで重なるので、
 * 入れ物の部品の部位は子の結合子（>）で書き、中の部品に効かないようにする。
 */
const root = path.resolve(__dirname, "../..");
const partsOf = (d: string) =>
  fs.readdirSync(path.join(root, d)).filter((f) => f.endsWith(".css")).map((f) => path.join(root, d, f));
const remixParts = partsOf("ui-design-remix/src/parts");
const classicParts = partsOf("ui-design-classic/src/parts");
const files = [path.join(root, "ui/src/styles/structure.css"), ...partsOf("ui/src/styles/parts"), ...remixParts, ...classicParts];
const containers = ["field", "card", "modal", "alert", "checkbox", "radio-group", "switch", "tabs", "select", "text-input", "time-input", "date-input", "button"];
const descendant = new RegExp(
  String.raw`\[data-ar="(${containers.join("|")})"\](?:\[[^\]]+\]|:[a-z-]+(?:\((?:[^()]|\([^()]*\))*\))?)* \[data-part=`,
  "g",
);

/** カッコの外のカンマで分ける（:is(th,td) は分けない）。 */
function splitTop(selector: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of selector) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  return [...out, cur];
}

describe("デザインの CSS", () => {
  for (const f of files) {
    it(`${path.relative(root, f)}：入れ物の部品の部位を子孫の結合子で書いていない`, () => {
      const css = fs.readFileSync(f, "utf8");
      expect(css.match(descendant) ?? []).toEqual([]);
    });
  }
  it("デザインの CSS は自分のデザインの中だけに効く", () => {
    for (const [f, id] of [...remixParts.map((f) => [f, "remix"] as const), ...classicParts.map((f) => [f, "classic"] as const)]) {
      const css = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const selectors = [...css.matchAll(/(^|})\s*([^@{}\s][^{}]*)\{/g)].map((m) => m[2]!.trim()).filter((s) => !/^(from|to|\d+%)/.test(s));
      const outside = selectors.flatMap(splitTop).map((s) => s.trim()).filter((s) => !s.startsWith(`[data-ar-design="${id}"]`));
      expect(outside).toEqual([]);
    }
  });
});
