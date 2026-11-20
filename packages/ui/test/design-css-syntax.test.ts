import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";

describe("デザインの CSS の書き方", () => {
  for (const design of ["ui-design-remix", "ui-design-classic"]) {
    const dir = join(__dirname, "..", "..", design, "src", "parts");
    it(`${design} の parts の CSS は、すべて閉じ忘れなく読める`, () => {
      for (const name of readdirSync(dir).filter((file) => file.endsWith(".css")))
        expect(() => postcss.parse(readFileSync(join(dir, name), "utf8"), { from: name }), name).not.toThrow();
    });
  }
});
