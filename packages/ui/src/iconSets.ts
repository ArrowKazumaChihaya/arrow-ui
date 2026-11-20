/**
 * 追加のアイコンの組。ARROW の線のアイコン（icons.ts）にない絵を、アプリが組ごと足す。
 * 呼ぶ名前は「組の名前:アイコンの名前」（例 `lucide:arrow-up`）。絵は ARROW の線のアイコンと同じ
 * 24×24・線（stroke）で描く SVG の中身。絵の中身は大きいので、読み込む関数で渡せば初めて使うときに読む。
 */
import { shallowReactive } from "vue";

/** 追加の組のアイコンの名前（「組の名前:アイコンの名前」）。 */
export type ArSetIconName = `${string}:${string}`;
/** 組の絵：アイコンの名前 → SVG の中身。 */
export type ArIconSet = Readonly<Record<string, string>>;

const loaders = new Map<string, () => Promise<ArIconSet>>();
const loading = new Map<string, Promise<ArIconSet>>();
/** 読み込んだ組。読み終わると描いている ArIcon が描き直る。 */
const loaded = shallowReactive(new Map<string, ArIconSet>());

function checked(set: string, icons: ArIconSet): ArIconSet {
  for (const [name, body] of Object.entries(icons)) {
    if (typeof body !== "string" || /<(style|script|foreignObject)\b|\son\w+=/i.test(body))
      throw new Error(`アイコン「${set}:${name}」の絵に <style>・<script>・on… は書けません`);
  }
  return icons;
}

/** 組を足す。絵をそのまま渡すか、初めて使うときに読む関数を渡す。同じ名前の組は置き換える。 */
export function registerIconSet(set: string, icons: ArIconSet | (() => Promise<ArIconSet>)): void {
  if (!/^[a-z][a-z0-9-]*$/.test(set)) throw new Error(`アイコンの組の名前「${set}」が使えません（英小文字・数字・-）`);
  loading.delete(set);
  if (typeof icons === "function") {
    loaders.set(set, icons);
    loaded.delete(set);
  } else {
    loaders.delete(set);
    loaded.set(set, checked(set, icons));
  }
}

/** 組を読む（読み終わっていればそのまま）。足していない組は空。 */
export function loadIconSet(set: string): Promise<ArIconSet> {
  const ready = loaded.get(set);
  if (ready) return Promise.resolve(ready);
  const loader = loaders.get(set);
  if (!loader) return Promise.resolve({});
  let pending = loading.get(set);
  if (!pending) {
    pending = loader().then((icons) => {
      const ok = checked(set, icons);
      if (loaders.get(set) === loader) loaded.set(set, ok);
      return ok;
    });
    pending.catch(() => loading.delete(set));
    loading.set(set, pending);
  }
  return pending;
}

/** 名前が追加の組のアイコン（「組の名前:アイコンの名前」）か。 */
export function isSetIconName(name: string): name is ArSetIconName {
  return name.includes(":");
}

/** 追加の組のアイコンの絵。まだ読んでいなければ読み始めて、読み終わるまでは空（読み終わると描き直る）。 */
export function setIconBody(name: ArSetIconName): string {
  const at = name.indexOf(":");
  const set = name.slice(0, at);
  const icons = loaded.get(set);
  if (!icons) {
    void loadIconSet(set).catch(() => undefined);
    return "";
  }
  return icons[name.slice(at + 1)] ?? "";
}
