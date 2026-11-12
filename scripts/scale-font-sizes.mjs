#!/usr/bin/env node
/**
 * CSS の文字の大きさ（font-size と font の中の px）を、利用者が選んだ倍率（--ar-font-scale）に追従させる。
 * 12px → calc(12px * var(--ar-font-scale, 1))。行の高さ（font: 13px/13px の /13px）も同じ倍率にする（文字が切れないように）。
 * 枠の幅・高さ・余白は変えない（形は保つ）。すでに calc(…var(--ar-font-scale…)) のものは触らない（何度実行しても同じ）。
 * --check を付けると書き換えず、残っている px があれば一覧を出して失敗する（テストから使う）。
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
export const FONT_SCALE_ROOTS = ["packages/ui-design-remix/src", "packages/ui-design-classic/src", "packages/ui/src/styles"];
/** 印刷は紙の大きさで決まるため、画面の文字の倍率を掛けない。 */
export const FONT_SCALE_EXCLUDES = ["packages/ui/src/styles/product-print.css"];

function cssFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...cssFiles(full));
    else if (entry.name.endsWith(".css")) out.push(full);
  }
  return out;
}

const PX = /(-?\d*\.?\d+)px\b/g;
const scale = (value) => value.replace(PX, (m, n) => (Number(n) === 0 ? m : `calc(${n}px * var(--ar-font-scale, 1))`));

/** 1つの宣言の値を変える。font-size は全体、font は大きさと行の高さの部分だけ（family の中の数字は触らない）。 */
export function scaleDeclaration(property, value) {
  if (value.includes("--ar-font-scale")) return value;
  if (property === "font-size") return scale(value);
  // font: [style] [weight] size[/line-height] family。family（最初の引用符か、size の後の語）より前だけを見る。
  const m = /^(\s*(?:[^\s'"/]+\s+)*?)(-?\d*\.?\d+px)(\s*\/\s*(-?\d*\.?\d+px))?(.*)$/s.exec(value);
  if (!m) return value;
  const [, head, size, , lineHeight, rest] = m;
  return `${head}${scale(size)}${lineHeight ? `/${scale(lineHeight)}` : ""}${rest}`;
}

export function transformCss(css) {
  return css.replace(/(^|[{;\s])(font-size|font)\s*:\s*([^;}]*)/g, (all, before, property, value) => {
    const next = scaleDeclaration(property, value);
    return next === value ? all : `${before}${property}:${next}`;
  });
}

/** 倍率に追従していない文字の大きさ（ファイルと宣言）。 */
export function remaining(css) {
  const found = [];
  css.replace(/(^|[{;\s])(font-size|font)\s*:\s*([^;}]*)/g, (all, before, property, value) => {
    if (!value.includes("--ar-font-scale") && scaleDeclaration(property, value) !== value) found.push(`${property}:${value.trim()}`);
    return all;
  });
  return found;
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const check = process.argv.includes("--check");
  let changed = 0;
  const problems = [];
  for (const dir of FONT_SCALE_ROOTS) {
    for (const file of cssFiles(path.join(root, dir)).filter((f) => !FONT_SCALE_EXCLUDES.includes(path.relative(root, f)))) {
      const css = fs.readFileSync(file, "utf8");
      if (check) {
        for (const d of remaining(css)) problems.push(`${path.relative(root, file)}: ${d}`);
        continue;
      }
      const next = transformCss(css);
      if (next !== css) {
        fs.writeFileSync(file, next);
        changed++;
      }
    }
  }
  if (check) {
    if (problems.length) {
      console.error(`文字の大きさが倍率に追従していません（${problems.length}件）。node scripts/scale-font-sizes.mjs で直します。\n` + problems.slice(0, 30).join("\n"));
      process.exit(1);
    }
    console.log("文字の大きさはすべて倍率に追従しています");
  } else console.log(`${changed} ファイルを書き換えました`);
}
