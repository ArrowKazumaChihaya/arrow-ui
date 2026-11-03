/// <reference types="vite/client" />
import type { Component } from "vue";

export interface Demo {
  id: string;
  slug: string;
  title: string;
  desc: string;
  comp: Component;
  source: string;
}

const mods = import.meta.glob<{ default: Component }>("./demos/*/*.vue", { eager: true });
const raws = import.meta.glob<string>("./demos/*/*.vue", { eager: true, query: "?raw", import: "default" });

export const demos: Demo[] = Object.keys(mods)
  .sort()
  .map((path) => {
    const [, slug = "", file = ""] = /\.\/demos\/([^/]+)\/([^/]+)\.vue$/.exec(path) ?? [];
    const raw = raws[path] ?? "";
    const head = /^<!--\s*([^|]*?)\s*\|\s*([\s\S]*?)\s*-->\n?/.exec(raw);
    return {
      id: `${slug}-${file.replace(/^\d+-/, "")}`,
      slug,
      title: head?.[1] ?? file,
      desc: head?.[2] ?? "",
      comp: mods[path]!.default,
      source: (head ? raw.slice(head[0].length) : raw).trim(),
    };
  });

export const demosOf = (slug: string) => demos.filter((d) => d.slug === slug);
