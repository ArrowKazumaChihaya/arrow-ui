/** 契約の版の比較に要るだけの小さな semver（major.minor.patch と ^ ~ >= = *）。 */
export type Version = [number, number, number];

export function parseVersion(v: string): Version | null {
  const m = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/.exec(v.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
}

function cmp(a: Version, b: Version): number {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return (a[i] as number) - (b[i] as number);
  return 0;
}

/** version が range を満たすか。range が読めなければ例外。 */
export function satisfies(version: string, range: string): boolean {
  const v = parseVersion(version);
  if (!v) throw new Error(`版が読めません: ${version}`);
  const r = range.trim();
  if (r === "*" || r === "") return true;
  const op = /^(\^|~|>=|=)?\s*(.+)$/.exec(r);
  const base = op ? parseVersion(op[2] as string) : null;
  if (!op || !base) throw new Error(`版の範囲が読めません: ${range}`);
  switch (op[1]) {
    case "^":
      return v[0] === base[0] && cmp(v, base) >= 0;
    case "~":
      return v[0] === base[0] && v[1] === base[1] && cmp(v, base) >= 0;
    case ">=":
      return cmp(v, base) >= 0;
    default:
      return cmp(v, base) === 0;
  }
}
