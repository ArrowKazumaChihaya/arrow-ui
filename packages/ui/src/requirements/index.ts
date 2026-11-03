import { contracts as libraryContracts, structuralComponents, type ArComponentName } from "../contracts";
import type { ArSkin } from "../skin";
import { satisfies } from "./semver";

export { satisfies, parseVersion } from "./semver";

/**
 * 製品が使う部品と、必要な契約の版の範囲（例："^1.2"）。
 * 製品のリポジトリ直下の arrow-ui.requires.ts で default export する。
 */
export interface ArRequirements {
  components: Partial<Record<ArComponentName, string>>;
  /** 製品が起動時に選ぶかもしれない skin。CI ではすべてを確かめる。 */
  skins?: readonly Pick<ArSkin, "id" | "covers">[];
}

export function defineRequirements(r: ArRequirements): ArRequirements {
  return Object.freeze({ ...r, components: { ...r.components } });
}

export interface ArRequirementProblem {
  component: string;
  need: string;
  /** 足りない場所。"library" か "skin:<id>" */
  where: string;
  have: string | null;
}

export interface ArRequirementResult {
  ok: boolean;
  problems: ArRequirementProblem[];
}

/**
 * 宣言をライブラリと skin が満たすか確かめる。
 * contracts を渡さなければ、このライブラリ自身の契約で確かめる。
 */
export function checkRequirements(
  requirements: ArRequirements,
  options: {
    contracts?: Readonly<Record<string, string>>;
    skins?: readonly Pick<ArSkin, "id" | "covers">[];
  } = {},
): ArRequirementResult {
  const contracts: Readonly<Record<string, string>> = options.contracts ?? libraryContracts;
  const skins = options.skins ?? requirements.skins ?? [];
  const problems: ArRequirementProblem[] = [];
  for (const [component, need] of Object.entries(requirements.components)) {
    if (!need) continue;
    const have = contracts[component] ?? null;
    if (!have || !satisfies(have, need)) problems.push({ component, need, where: "library", have });
    for (const skin of skins) {
      const covered = (skin.covers as Record<string, string | undefined>)[component];
      const structural = !(component in skin.covers) && isStructural(component);
      if (structural) continue;
      if (!covered || !satisfies(covered, need))
        problems.push({ component, need, where: `skin:${skin.id}`, have: covered ?? null });
    }
  }
  return { ok: problems.length === 0, problems };
}

function isStructural(name: string): boolean {
  return (structuralComponents as readonly string[]).includes(name);
}

export function formatProblems(result: ArRequirementResult): string {
  if (result.ok) return "宣言した部品はすべてそろっています。";
  const lines = result.problems.map(
    (p) =>
      `- ${p.component}：${p.need} が必要 → ${p.where === "library" ? "ライブラリ" : p.where.replace("skin:", "skin ")} は ${p.have ?? "なし"}`,
  );
  return `足りない部品があります（${result.problems.length}件）。\n${lines.join("\n")}`;
}
