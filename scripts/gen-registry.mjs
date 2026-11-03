// 部品ごとのファイルから、まとめのファイルを作る（手で書かない）。
//   packages/ui/src/{components,layout,provider}/Ar*.meta.json  → contracts.ts・components.generated.ts
//   packages/ui-design-*/src/parts/*.css（1行目の @covers）        → styles.css・covers.generated.ts
//   上の meta                                                     → apps/docs/src/nav.generated.json
// 部品を足すときは、部品のファイル・meta.json・各デザインの parts/<部品>.css を置いて、これを走らせるだけ。
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ui = path.join(root, "packages/ui/src");
const check = process.argv.includes("--check");
const changed = [];

function write(file, text) {
  const old = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (old === text) return;
  changed.push(path.relative(root, file));
  if (!check) fs.writeFileSync(file, text);
}

/** 並べる順（目次の順）。ここにない分類は最後に足す。 */
const groupOrder = ["しくみ", "並べる", "基本", "移動", "入力", "表示", "知らせる", "ARROW", "Pro"];

const metas = [];
for (const dir of ["provider", "layout", "components"]) {
  const d = path.join(ui, dir);
  for (const f of fs.readdirSync(d).filter((f) => f.endsWith(".meta.json")).sort()) {
    const m = JSON.parse(fs.readFileSync(path.join(d, f), "utf8"));
    const name = f.replace(".meta.json", "");
    if (m.name !== name) throw new Error(`${f}: name が ${m.name}`);
    if (!/^\d+\.\d+\.\d+$/.test(m.version)) throw new Error(`${f}: version が不正`);
    for (const k of ["group", "ja", "slug"]) if (!m[k]) throw new Error(`${f}: ${k} がありません`);
    if (!fs.existsSync(path.join(d, `${name}.vue`))) throw new Error(`${name}.vue がありません`);
    metas.push({ ...m, dir, hasContract: fs.existsSync(path.join(d, `${name}.contract.ts`)) });
  }
}
const order = (g) => (groupOrder.includes(g) ? groupOrder.indexOf(g) : 99);
metas.sort((a, b) => order(a.group) - order(b.group) || (a.order ?? 50) - (b.order ?? 50) || a.name.localeCompare(b.name));
const slugs = new Set();
for (const m of metas) {
  if (slugs.has(m.slug)) throw new Error(`slug が重なっています: ${m.slug}`);
  slugs.add(m.slug);
}

const banner = "// このファイルは scripts/gen-registry.mjs が作る。手で直さない。\n";

write(
  path.join(ui, "contracts.ts"),
  banner +
    `/**
 * 部品ごとの契約の版。props・slot・emits・部位を
 * 足したらマイナー版、変えた・消したらメジャー版を上げる（README「版の決まり」）。
 * 製品の arrow-ui.requires.ts はこの版に対して必要な範囲を宣言する。
 * 元は各部品の Ar*.meta.json。
 */
export const contracts = {
${metas.map((m) => `  ${m.name}: "${m.version}",`).join("\n")}
} as const;

export type ArComponentName = keyof typeof contracts;
export const componentNames = Object.keys(contracts) as ArComponentName[];

/** 見た目を持たず、デザインのライブラリが対応しなくてよい部品（並べるための基礎と仕組み）。 */
export const structuralComponents: readonly ArComponentName[] = [
${metas
  .filter((m) => m.structural)
  .map((m) => `  "${m.name}",`)
  .join("\n")}
];

/** デザインが見た目を用意しなければならない部品。 */
export const designedComponents = componentNames.filter((n) => !structuralComponents.includes(n));

/** 説明のための情報（分類・日本語の名前）。 */
export const componentMeta: Record<ArComponentName, { group: string; ja: string; slug: string }> = {
${metas.map((m) => `  ${m.name}: { group: ${JSON.stringify(m.group)}, ja: ${JSON.stringify(m.ja)}, slug: ${JSON.stringify(m.slug)} },`).join("\n")}
};
`,
);

write(
  path.join(ui, "components.generated.ts"),
  banner +
    metas.map((m) => `export { default as ${m.name} } from "./${m.dir}/${m.name}.vue";`).join("\n") +
    "\n" +
    metas
      .filter((m) => m.hasContract)
      .map((m) => `export type * from "./${m.dir}/${m.name}.contract";`)
      .join("\n") +
    "\n",
);

// デザインのライブラリ
const designed = metas.filter((m) => !m.structural).map((m) => m.name);
for (const pkg of fs.readdirSync(path.join(root, "packages")).filter((p) => p.startsWith("ui-design-"))) {
  const src = path.join(root, "packages", pkg, "src");
  const partsDir = path.join(src, "parts");
  const files = fs.readdirSync(partsDir).filter((f) => f.endsWith(".css"));
  const base = files.filter((f) => f.startsWith("_")).sort();
  const comps = files.filter((f) => !f.startsWith("_")).sort();
  const covers = {};
  for (const f of comps) {
    const first = fs.readFileSync(path.join(partsDir, f), "utf8").split("\n")[0];
    const m = /^\/\* @covers (.+) \*\/$/.exec(first);
    if (!m) throw new Error(`${pkg}/parts/${f}: 1行目に /* @covers ArX 1.0.0 */ がありません`);
    for (const item of m[1].split(",")) {
      const [name, version] = item.trim().split(/\s+/);
      if (!designed.includes(name)) throw new Error(`${pkg}/parts/${f}: ${name} は見た目を持つ部品ではありません`);
      covers[name] = version;
    }
  }
  write(
    path.join(src, "styles.css"),
    `/* ${pkg} の見た目。scripts/gen-registry.mjs が parts/ から作る。手で直さない。 */\n` +
      [...base, ...comps].map((f) => `@import "./parts/${f}";`).join("\n") +
      "\n",
  );
  write(
    path.join(src, "covers.generated.ts"),
    banner +
      `/** このデザインが見た目を用意した部品と、その契約の版（parts/*.css の @covers から）。 */\nexport const covers = {\n${Object.entries(covers)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([n, v]) => `  ${n}: "${v}",`)
        .join("\n")}\n} as const;\n`,
  );
}

// 説明のサイトの目次
const groups = [];
for (const m of metas) {
  let g = groups.find((x) => x.title === m.group);
  if (!g) groups.push((g = { title: m.group, items: [] }));
  g.items.push({ slug: m.slug, name: m.name, ja: m.ja });
}
write(path.join(root, "apps/docs/src/nav.generated.json"), JSON.stringify(groups, null, 2) + "\n");

if (check && changed.length) {
  console.error(`まとめのファイルが古いままです。npm run gen を走らせてください：\n- ${changed.join("\n- ")}`);
  process.exit(1);
}
console.log(check ? "まとめのファイルは最新です" : `部品 ${metas.length}（${changed.length} ファイルを更新）`);
