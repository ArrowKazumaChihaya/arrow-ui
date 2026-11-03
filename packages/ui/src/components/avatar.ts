import type { ArAvatarTone } from "./ArAvatar.contract";

/** 人ごとの色の順（シフト画面の並び順に合わせる）。 */
export const arAvatarPeopleTones: readonly ArAvatarTone[] = ["blue", "orange", "green", "purple", "yellow"];

/** seed から人ごとの色を選ぶ。数は並び順としてそのまま回し、文字は簡単なハッシュで選ぶ。 */
export function arAvatarToneOf(seed: string | number): ArAvatarTone {
  let n = typeof seed === "number" ? seed : 0;
  if (typeof seed === "string") for (const ch of seed) n = (n * 31 + ch.codePointAt(0)!) >>> 0;
  return arAvatarPeopleTones[Math.abs(Math.trunc(n)) % arAvatarPeopleTones.length]!;
}
