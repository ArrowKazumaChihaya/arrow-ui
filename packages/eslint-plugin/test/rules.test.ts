import { RuleTester } from "eslint";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const plugin = require("../lib/index.cjs");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "arrow-ui-"));
const requires = path.join(dir, "arrow-ui.requires.ts");
fs.writeFileSync(
  requires,
  `import { defineRequirements } from "@s_and_a/arrow-ui/requirements";
export default defineRequirements({
  components: {
    ArButton: "^1.0", // ボタン
    ArTimeInput: "^1.0",
    "ArStack": "^1.0",
  },
});`,
);

const tester = new RuleTester({
  parser: require.resolve("vue-eslint-parser"),
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
} as never);

describe("@s_and_a/eslint-plugin-arrow-ui", () => {
  it("declared-components", () => {
    tester.run("declared-components", plugin.rules["declared-components"], {
      valid: [
        { code: `import { ArButton, ArTimeInput } from "@s_and_a/arrow-ui";`, options: [{ requires }] },
        { code: `<template><ArButton /><ar-time-input /></template>`, filename: "a.vue", options: [{ requires }] },
        { code: `import { Button } from "ant-design-vue";`, options: [{ requires }] },
      ],
      invalid: [
        {
          code: `import { ArButton, ArTable } from "@s_and_a/arrow-ui";`,
          options: [{ requires }],
          errors: [{ messageId: "undeclared", data: { name: "ArTable" } }],
        },
        {
          code: `<template><ArModal title="x" /></template>`,
          filename: "a.vue",
          options: [{ requires }],
          errors: [{ messageId: "undeclared", data: { name: "ArModal" } }],
        },
        {
          code: `import { ArButton } from "@s_and_a/arrow-ui";`,
          options: [{ requires: path.join(dir, "none.ts") }],
          errors: [{ messageId: "noFile" }],
        },
      ],
    });
  });

  it("restricted-components（View で並べる基礎を使わせない）", () => {
    const options = [{ components: plugin.layoutPrimitives, message: "src/Layout を使う" }];
    tester.run("restricted-components", plugin.rules["restricted-components"], {
      valid: [{ code: `<template><ArButton /></template>`, filename: "v.vue", options }],
      invalid: [
        {
          code: `<template><ar-stack :gap="6"><ArButton /></ar-stack></template>`,
          filename: "v.vue",
          options,
          errors: [{ messageId: "restricted", data: { name: "ArStack", message: "src/Layout を使う" } }],
        },
      ],
    });
  });
});
