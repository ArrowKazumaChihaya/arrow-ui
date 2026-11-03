/** コード例の色付け（Vue の SFC と TS だけを想定した小さなもの）。 */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const rules: [RegExp, string][] = [
  [/^<!--[\s\S]*?-->/, "c"],
  [/^\/\/[^\n]*/, "c"],
  [/^\/\*[\s\S]*?\*\//, "c"],
  [/^"(?:[^"\\\n]|\\.)*"|^'(?:[^'\\\n]|\\.)*'|^`(?:[^`\\]|\\.)*`/, "s"],
  [/^<\/?[A-Za-z][\w-]*/, "t"],
  [/^(?:[:@#][\w:.-]*|v-[\w:.-]+)(?==)/, "a"],
  [/^(?:import|from|export|const|let|type|interface|function|return|ref|computed|as|if|else)\b/, "k"],
  [/^\b\d[\d_]*\b/, "n"],
];

export function highlight(code: string): string {
  let out = "";
  let rest = code;
  let plain = "";
  const flush = () => {
    if (plain) out += esc(plain);
    plain = "";
  };
  outer: while (rest.length) {
    for (const [re, cls] of rules) {
      const m = re.exec(rest);
      if (m && m[0].length) {
        // 識別子の途中で始まるキーワードは拾わない
        if (cls === "k" && /[\w$]$/.test(plain)) break;
        flush();
        out += `<span class="hl-${cls}">${esc(m[0])}</span>`;
        rest = rest.slice(m[0].length);
        continue outer;
      }
    }
    plain += rest[0];
    rest = rest.slice(1);
  }
  flush();
  return out;
}
