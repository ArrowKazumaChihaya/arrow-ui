// 部品の説明（props・emits・slot・部位・既定値・説明文）を、ソースと契約の型から作る。
// 説明の画面（apps/docs）はこの JSON を読む。手で書かないので、部品と説明がずれない。
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "packages/ui/src");
const contracts = Object.fromEntries(
  [...fs.readFileSync(path.join(src, "contracts.ts"), "utf8").matchAll(/(Ar\w+): "([\d.]+)"/g)].map((m) => [m[1], m[2]]),
);
const fileOf = (name) =>
  ["provider", "layout", "components"].map((d) => path.join(src, d, `${name}.vue`)).find((f) => fs.existsSync(f));

const virtual = new Map();
const sfcs = {};
for (const name of Object.keys(contracts)) {
  const file = fileOf(name);
  const text = fs.readFileSync(file, "utf8");
  const script = /<script setup lang="ts"[^>]*>([\s\S]*?)<\/script>/.exec(text)[1];
  const template = /<template>([\s\S]*)<\/template>/.exec(text)?.[1] ?? "";
  const vfile = file.replace(/\.vue$/, ".__meta.ts");
  const generic = /<script setup lang="ts" generic="(\w+)/.exec(text)?.[1];
  virtual.set(vfile, (generic ? `interface ${generic} {}\n` : "") + script.replace(/defineSlots<[\s\S]*?>\(\);?/, ""));
  sfcs[name] = { file, vfile, script, template };
}
const shim = path.join(root, "env.d.ts");
const options = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  baseUrl: root,
  paths: { "@arrow/ui-tokens": ["packages/ui-tokens/src/index.ts"] },
  types: [],
};
const host = ts.createCompilerHost(options);
const readFile = host.readFile.bind(host);
const fileExists = host.fileExists.bind(host);
host.readFile = (f) => virtual.get(path.resolve(f)) ?? readFile(f);
host.fileExists = (f) => virtual.has(path.resolve(f)) || fileExists(f);
const getSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (f, lang) =>
  virtual.has(path.resolve(f)) ? ts.createSourceFile(f, virtual.get(path.resolve(f)), lang, true) : getSourceFile(f, lang);
const program = ts.createProgram([...virtual.keys(), shim], options, host);
const checker = program.getTypeChecker();
const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;

function call(sf, name) {
  let found;
  const visit = (n) => {
    if (!found && ts.isCallExpression(n) && n.expression.getText(sf) === name) found = n;
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}
const doc = (sym) => ts.displayPartsToString(sym.getDocumentationComment(checker)).trim();
const clean = (t) => {
  const s = t.replace(/ \| undefined$/, "").replace(/^undefined \| /, "");
  // 数の候補は小さい順に並べる（0 | 1 | 2 …）
  return /^\d+( \| \d+)+$/.test(s) ? s.split(" | ").map(Number).sort((a, b) => a - b).join(" | ") : s;
};

const out = [];
for (const [name, { vfile, script, template }] of Object.entries(sfcs)) {
  const sf = program.getSourceFile(vfile);
  const comment = /\/\*\*([\s\S]*?)\*\//.exec(script)?.[1] ?? "";
  const description = comment
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean)
    .filter((l) => !new RegExp(`^${name} [\\d.]+$`).test(l))
    .map((l) => l.replace(new RegExp(`^${name} [\\d.]+\\s*—\\s*`), ""))
    .join("\n");

  const propsCall = call(sf, "defineProps");
  const props = [];
  if (propsCall?.typeArguments?.[0]) {
    const type = checker.getTypeFromTypeNode(propsCall.typeArguments[0]);
    for (const sym of checker.getPropertiesOfType(type)) {
      const t = checker.getTypeOfSymbolAtLocation(sym, propsCall);
      props.push({
        name: sym.name,
        type: clean(checker.typeToString(t, undefined, flags)),
        required: !(sym.flags & ts.SymbolFlags.Optional),
        description: doc(sym),
      });
    }
  }
  const defaultsCall = call(sf, "withDefaults");
  const defaults = {};
  const obj = defaultsCall?.arguments?.[1];
  if (obj && ts.isObjectLiteralExpression(obj))
    for (const p of obj.properties)
      if (ts.isPropertyAssignment(p)) {
        let v = p.initializer.getText(sf).replace(/\s+/g, " ");
        if (v === "undefined") continue;
        v = v.replace(/^\(\) => \((.*)\)$/, "$1").replace(/^\(\) => /, "");
        defaults[p.name.getText(sf)] = v;
      }
  for (const p of props) if (p.name in defaults) p.default = defaults[p.name];

  const emits = [];
  const emitsCall = call(sf, "defineEmits");
  const emitsDocType = (() => {
    const contract = path.join(path.dirname(vfile), `${name}.contract.ts`);
    const csf = program.getSourceFile(contract);
    if (!csf) return null;
    const decl = csf.statements.find((s) => ts.isInterfaceDeclaration(s) && s.name.text === `${name}Emits`);
    return decl ? checker.getTypeAtLocation(decl) : null;
  })();
  if (emitsCall?.typeArguments?.[0]) {
    const type = checker.getTypeFromTypeNode(emitsCall.typeArguments[0]);
    for (const sym of checker.getPropertiesOfType(type)) {
      const t = checker.typeToString(checker.getTypeOfSymbolAtLocation(sym, emitsCall), undefined, flags);
      const fromContract = emitsDocType?.getProperty(sym.name);
      emits.push({ name: sym.name, payload: t, description: (fromContract && doc(fromContract)) || doc(sym) });
    }
  }
  const slots = [
    ...new Set(
      [...template.matchAll(/<slot\b([^>]*)>/g)].map((m) => {
        const named = /\bname="([^"]+)"/.exec(m[1]) ?? /:name="`([^`]+)`"/.exec(m[1]);
        return named ? named[1].replace(/\$\{[^}]*\}/g, "<key>") : "default";
      }),
    ),
  ];
  const parts = [...new Set([...template.matchAll(/data-part="([a-z-]+)"/g)].map((m) => m[1]))];
  const ar = /data-ar="([a-z-]+)"/.exec(template)?.[1] ?? null;
  out.push({ name, version: contracts[name], description, props, emits, slots, parts, dataAr: ar });
}
const diagnostics = ts.getPreEmitDiagnostics(program).filter((d) => d.file && virtual.has(path.resolve(d.file.fileName)));
if (diagnostics.length) console.warn(diagnostics.slice(0, 3).map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"));
const dest = path.join(root, "apps/docs/src/meta.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 1));
console.log(`meta: ${out.length} 部品 → ${path.relative(root, dest)}`);
