/**
 * ArRichTextEditor の HTML の扱い（部品の中だけで使う）。
 * - sanitizeHtml：危ないタグ・属性を消し、許した形だけを残す（入るとき・貼り付け・出すとき）。
 * - plain：文字と <br> だけにする（メールの本文）。
 * - 変数（`{{ $name }}`）を札（<span data-part="token">）に見せる／戻す。
 */

/** 中身ごと消すタグ（動く・外を読む・入力を集めるもの）。 */
const DROP = new Set([
  "script", "style", "iframe", "frame", "frameset", "object", "embed", "applet", "link", "meta", "base", "form", "input",
  "button", "textarea", "select", "option", "optgroup", "svg", "math", "template", "noscript", "video", "audio", "source",
  "track", "canvas", "dialog", "portal", "head", "title",
]);
/** 残すタグ。ここにも DROP にもないタグは外して中身だけ残す。 */
const KEEP = new Set([
  "p", "div", "br", "span", "b", "strong", "i", "em", "u", "s", "strike", "sub", "sup", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col", "blockquote", "hr",
  "a", "pre", "font",
]);
/** style で許す性質。 */
const STYLE_OK = new Set([
  "color", "background-color", "font-size", "font-weight", "font-style", "font-family", "text-decoration", "text-decoration-line",
  "text-align", "line-height", "letter-spacing", "vertical-align", "width", "height", "min-width", "max-width", "border",
  "border-top", "border-right", "border-bottom", "border-left", "border-color", "border-style", "border-width", "border-collapse",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "margin", "margin-top", "margin-right",
  "margin-bottom", "margin-left", "page-break-before", "page-break-after", "break-before", "break-after", "white-space",
  "text-indent", "list-style-type",
]);

function cleanStyle(v: string): string {
  return v
    .split(";")
    .map((d) => d.trim())
    .filter((d) => {
      const i = d.indexOf(":");
      if (i < 1) return false;
      const k = d.slice(0, i).trim().toLowerCase();
      const val = d.slice(i + 1).toLowerCase();
      return STYLE_OK.has(k) && !/url\s*\(|expression\s*\(|javascript:|@import|behavior/.test(val);
    })
    .join("; ");
}

function cleanAttrs(el: Element) {
  const tag = el.tagName.toLowerCase();
  for (const a of Array.from(el.attributes)) {
    const n = a.name.toLowerCase();
    const v = a.value;
    let ok = false;
    if (n === "style") {
      const s = cleanStyle(v);
      if (s) {
        el.setAttribute("style", s);
        ok = true;
      }
    } else if (n === "colspan" || n === "rowspan") ok = /^\d{1,3}$/.test(v);
    else if (n === "class") ok = /^[\w -]{1,80}$/.test(v);
    else if (n === "align") ok = /^(left|center|right|justify)$/i.test(v);
    else if (tag === "a" && n === "href") ok = /^(https?:|mailto:|tel:|#|\/)/i.test(v.trim());
    else if (tag === "a" && n === "target") ok = v === "_blank";
    else if (tag === "font" && (n === "color" || n === "size")) ok = /^[#\w]{1,20}$/.test(v);
    if (!ok) el.removeAttribute(a.name);
  }
  if (tag === "a" && el.getAttribute("target") === "_blank") el.setAttribute("rel", "noopener noreferrer");
}

function walk(node: Node, doc: Document) {
  for (const c of Array.from(node.childNodes)) {
    if (c.nodeType === 8) {
      c.remove();
      continue;
    }
    if (c.nodeType !== 1) continue;
    const el = c as Element;
    const tag = el.tagName.toLowerCase();
    if (DROP.has(tag)) {
      el.remove();
      continue;
    }
    walk(el, doc);
    if (!KEEP.has(tag)) {
      const frag = doc.createDocumentFragment();
      while (el.firstChild) frag.appendChild(el.firstChild);
      el.replaceWith(frag);
      continue;
    }
    cleanAttrs(el);
  }
}

function parse(html: string): { doc: Document; root: HTMLElement } {
  const doc = document.implementation.createHTMLDocument("");
  const root = doc.createElement("div");
  root.innerHTML = html;
  return { doc, root };
}

/** 危ないタグ・属性を消した HTML。 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  const { doc, root } = parse(html);
  walk(root, doc);
  return root.innerHTML;
}

const BLOCK = /^(p|div|h[1-6]|li|tr|blockquote|pre|table|ul|ol)$/;
/** 文字と <br> だけにする。段落・行の区切りは <br> にする。 */
export function plainHtml(html: string): string {
  if (!html) return "";
  const { root } = parse(html);
  const out: string[] = [];
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const visit = (n: Node) => {
    if (n.nodeType === 3) {
      out.push(esc(n.textContent ?? ""));
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = (n as Element).tagName.toLowerCase();
    if (DROP.has(tag)) return;
    if (tag === "br") {
      out.push("<br>");
      return;
    }
    const block = BLOCK.test(tag);
    if (block && out.length && out[out.length - 1] !== "<br>") out.push("<br>");
    n.childNodes.forEach(visit);
    if (block && out.length && out[out.length - 1] !== "<br>") out.push("<br>");
  };
  root.childNodes.forEach(visit);
  while (out[out.length - 1] === "<br>" && out.length > 1 && out[out.length - 2] === "<br>") out.pop();
  if (out[out.length - 1] === "<br>" && !/<br>\s*$/i.test(html)) out.pop();
  return out.join("");
}

/** 既定の変数の形 `{{ $name }}`。 */
export const defaultTokenPattern = /\{\{\s*\$[A-Za-z0-9_.]+\s*\}\}/g;

/** 本文の文字の中の変数を札（span）にする（見せるためだけ。値には残さない）。 */
export function decorateTokens(root: HTMLElement, pattern: RegExp) {
  const doc = root.ownerDocument;
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  const texts: Text[] = [];
  const tw = doc.createTreeWalker(root, 4);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    if ((n.parentElement as HTMLElement | null)?.dataset?.part !== "token") texts.push(n as Text);
  }
  for (const t of texts) {
    const s = t.data;
    re.lastIndex = 0;
    if (!re.test(s)) continue;
    re.lastIndex = 0;
    const frag = doc.createDocumentFragment();
    let last = 0;
    for (let m = re.exec(s); m; m = re.exec(s)) {
      if (m.index > last) frag.appendChild(doc.createTextNode(s.slice(last, m.index)));
      frag.appendChild(tokenEl(doc, m[0]));
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < s.length) frag.appendChild(doc.createTextNode(s.slice(last)));
    t.replaceWith(frag);
  }
}

export function tokenEl(doc: Document, text: string): HTMLElement {
  const sp = doc.createElement("span");
  sp.dataset.part = "token";
  sp.setAttribute("contenteditable", "false");
  sp.textContent = text;
  return sp;
}

/** 札を文字に戻し、見えない区切りの文字を消した HTML（v-model に出す値）。 */
export function serialize(root: HTMLElement, plain: boolean): string {
  const c = root.cloneNode(true) as HTMLElement;
  c.querySelectorAll('[data-part="token"]').forEach((t) => t.replaceWith(c.ownerDocument.createTextNode(t.textContent ?? "")));
  const html = c.innerHTML.replace(/​/g, "");
  const out = plain ? plainHtml(html) : sanitizeHtml(html);
  /* 空の段落だけ（<p><br></p> や <br>）は空にする */
  return /^(<(p|div)>)?(<br>)?(<\/(p|div)>)?$/i.test(out.trim()) ? "" : out;
}

/** 文字数（今の ARROW の Froala の charCounter と同じく、本文の文字を数える。改行は数えない）。 */
export function countChars(root: HTMLElement): number {
  return (root.textContent ?? "").replace(/​/g, "").length;
}
/** 単語の数（Froala の wordCounter と同じく、空白と改行で区切る）。 */
export function countWords(root: HTMLElement): number {
  const c = root.cloneNode(true) as HTMLElement;
  c.querySelectorAll("br").forEach((b) => b.replaceWith(" "));
  c.querySelectorAll("p,div,li,td,th,h1,h2,h3,h4,h5,h6,tr").forEach((b) => b.append(" "));
  return (c.textContent ?? "").replace(/​/g, "").split(/\s+/).filter(Boolean).length;
}
