import { computed, ref, watch } from "vue";
import type { ArPaletteName } from "@s_and_a/arrow-ui";
import { remixDesign } from "@s_and_a/arrow-ui-design-remix";
import { classicDesign } from "@s_and_a/arrow-ui-design-classic";

export const designs = [remixDesign, classicDesign] as const;
export type ViewMode = "remix" | "classic" | "both";

const read = (k: string) => {
  try {
    return localStorage.getItem(`arrow-ui-docs:${k}`);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(`arrow-ui-docs:${k}`, v);
  } catch {
    /* 保存できなくても動く */
  }
};

/** 見ているデザイン（remix・classic・並べて比べる）とテーマ色。見る人の好みとしてだけ覚える。 */
export const mode = ref<ViewMode>((read("mode") as ViewMode) || "remix");
export const palette = ref<ArPaletteName>((read("palette") as ArPaletteName) || "blue");
watch(mode, (v) => write("mode", v));
watch(palette, (v) => write("palette", v));

export const shown = computed(() =>
  mode.value === "both" ? [...designs] : designs.filter((d) => d.id === mode.value),
);
