#!/usr/bin/env node
/**
 * arrow-ui check [--requires <file>]
 * 製品の arrow-ui.requires.ts を読み、入れたライブラリと skin が宣言を満たすか確かめる。
 * 足りなければ一覧を出して 1 で終わる（CI でビルドを止める）。
 */
import { createJiti } from "jiti";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const [, , command, ...rest] = process.argv;
if (command !== "check") {
  console.log("使い方: arrow-ui check [--requires arrow-ui.requires.ts]");
  process.exit(command ? 1 : 0);
}
const at = rest.indexOf("--requires");
const candidates = at >= 0 ? [rest[at + 1]] : ["arrow-ui.requires.ts", "arrow-ui.requires.mts", "arrow-ui.requires.js", "arrow-ui.requires.mjs"];
const file = candidates.map((f) => path.resolve(process.cwd(), f)).find((f) => fs.existsSync(f));
if (!file) {
  console.error("arrow-ui.requires.ts が見つかりません。使う部品を宣言してください。");
  process.exit(1);
}
const jiti = createJiti(pathToFileURL(file).href, { interopDefault: true });
const requirements = await jiti.import(file, { default: true });
const { checkRequirements, formatProblems } = await jiti.import("@arrow/ui/requirements");
if (!requirements?.components) {
  console.error(`${path.basename(file)} が defineRequirements({ components }) を default export していません。`);
  process.exit(1);
}
const result = checkRequirements(requirements);
const skins = (requirements.skins ?? []).map((s) => s.id).join("・") || "なし";
console.log(`arrow-ui check：宣言 ${Object.keys(requirements.components).length} 部品・確かめた skin ${skins}`);
console.log(formatProblems(result));
process.exit(result.ok ? 0 : 1);
