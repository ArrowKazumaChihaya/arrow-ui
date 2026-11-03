"use strict";
/**
 * @arrow/eslint-plugin-ui
 * - declared-components：arrow-ui.requires.ts に宣言していない Ar 部品を使わせない
 * - restricted-components：指定した Ar 部品をその場所で使わせない（例：View で ArStack などの並べる基礎）
 */
const fs = require("node:fs");
const path = require("node:path");

const LIB = "@arrow/ui";
const cache = new Map();

/** requires ファイルの components の中の Ar 部品の名前を読む（型を解かずに文字として読む）。 */
function readDeclared(file) {
  const abs = path.resolve(process.cwd(), file);
  const stat = fs.existsSync(abs) ? fs.statSync(abs).mtimeMs : -1;
  const hit = cache.get(abs);
  if (hit && hit.stat === stat) return hit.names;
  let names = null;
  if (stat >= 0) {
    const text = fs.readFileSync(abs, "utf8").replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const start = text.search(/components\s*:\s*\{/);
    if (start >= 0) {
      let depth = 0;
      let i = text.indexOf("{", start);
      const from = i;
      for (; i < text.length; i++) {
        if (text[i] === "{") depth++;
        else if (text[i] === "}" && --depth === 0) break;
      }
      const body = text.slice(from + 1, i);
      names = new Set([...body.matchAll(/["']?\b(Ar[A-Z][A-Za-z0-9]*)\b["']?\s*:/g)].map((m) => m[1]));
    }
  }
  cache.set(abs, { stat, names });
  return names;
}

/** <ar-time-input> / <ArTimeInput> → ArTimeInput */
function pascal(name) {
  if (!name) return "";
  if (/^[A-Z]/.test(name)) return name;
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
const isAr = (n) => /^Ar[A-Z]/.test(n);

function templateVisitor(context, visitor, scriptVisitor) {
  const services = (context.sourceCode && context.sourceCode.parserServices) || context.parserServices;
  if (services && typeof services.defineTemplateBodyVisitor === "function")
    return services.defineTemplateBodyVisitor(visitor, scriptVisitor);
  return scriptVisitor;
}

function usageVisitors(context, check) {
  return templateVisitor(
    context,
    {
      VElement(node) {
        const n = pascal(node.rawName);
        if (isAr(n)) check(n, node.startTag || node);
      },
    },
    {
      ImportDeclaration(node) {
        if (node.source.value !== LIB) return;
        for (const s of node.specifiers) {
          if (s.type !== "ImportSpecifier") continue;
          const n = s.imported.name;
          if (isAr(n)) check(n, s);
        }
      },
    },
  );
}

const declaredComponents = {
  meta: {
    type: "problem",
    docs: { description: "arrow-ui.requires.ts に宣言した Ar 部品だけを使う" },
    schema: [{ type: "object", properties: { requires: { type: "string" } }, additionalProperties: false }],
    messages: {
      undeclared:
        "{{name}} は arrow-ui.requires.ts に宣言されていません。宣言に足してから使ってください（部品のライブラリとデザインのライブラリが満たすかは arrow-ui check で確かめます）。",
      noFile: "{{file}} が見つからないか、components を読めません。",
    },
  },
  create(context) {
    const file = (context.options[0] && context.options[0].requires) || "arrow-ui.requires.ts";
    const declared = readDeclared(file);
    let reportedFile = false;
    return usageVisitors(context, (name, node) => {
      if (!declared) {
        if (!reportedFile) context.report({ node, messageId: "noFile", data: { file } });
        reportedFile = true;
        return;
      }
      if (!declared.has(name)) context.report({ node, messageId: "undeclared", data: { name } });
    });
  },
};

const restrictedComponents = {
  meta: {
    type: "problem",
    docs: { description: "指定した Ar 部品をこの場所で使わせない" },
    schema: [
      {
        type: "object",
        properties: { components: { type: "array", items: { type: "string" } }, message: { type: "string" } },
        required: ["components"],
        additionalProperties: false,
      },
    ],
    messages: { restricted: "{{name}} はここでは使えません。{{message}}" },
  },
  create(context) {
    const opt = context.options[0] || { components: [] };
    const banned = new Set(opt.components);
    const message = opt.message || "";
    return usageVisitors(context, (name, node) => {
      if (banned.has(name)) context.report({ node, messageId: "restricted", data: { name, message } });
    });
  },
};

const LAYOUT = ["ArStack", "ArCluster", "ArGrid", "ArSplit"];

module.exports = {
  meta: { name: "@arrow/eslint-plugin-ui", version: "0.1.0" },
  rules: { "declared-components": declaredComponents, "restricted-components": restrictedComponents },
  /** 製品向けの推奨設定（eslint 8 の .eslintrc 形式）。View の場所は製品に合わせて変える。 */
  configs: {
    recommended: {
      plugins: ["@arrow/ui"],
      rules: { "@arrow/ui/declared-components": "error" },
      overrides: [
        {
          files: ["src/View/**/*.vue"],
          rules: {
            "@arrow/ui/restricted-components": [
              "error",
              { components: LAYOUT, message: "配置は製品のレイアウト層（src/Layout）の部品で行います。" },
            ],
          },
        },
      ],
    },
  },
  layoutPrimitives: LAYOUT,
};
