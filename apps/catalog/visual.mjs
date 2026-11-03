// カタログを デザインごとに撮る（見た目の差の確認・README 用）。使い方：npm run catalog を起こしてから node apps/catalog/visual.mjs
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
// プロジェクトに playwright があればそれを、なければグローバルのものを使う
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  const root = execSync("npm root -g").toString().trim();
  ({ chromium } = createRequire(`${root}/`)("playwright"));
}
import fs from "node:fs";
const base = process.env.CATALOG_URL ?? "http://127.0.0.1:5190/";
const out = new URL("./shots/", import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const errors = [];
for (const design of ["remix", "classic"]) {
  for (const [w, h, name] of [[1440, 900, "pc"], [375, 812, "sp"]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on("pageerror", (e) => errors.push(`${design}/${name}: ${e.message}`));
    p.on("console", (m) => m.type() === "error" && !/fonts|ERR_/.test(m.text()) && errors.push(`${design}/${name}: ${m.text()}`));
    await p.goto(`${base}?design=${design}`);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}${design}-${name}.png`, fullPage: true });
    await p.goto(`${base}?design=${design}&modal=1`);
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${out}${design}-${name}-modal.png` });
    await p.close();
  }
}
await b.close();
console.log(errors.length ? errors.join("\n") : "no errors");
