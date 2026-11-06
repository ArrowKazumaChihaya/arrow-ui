<script setup lang="ts">
/**
 * ArKanaText 1.0 — フリガナつきの氏名（今の Kana）。名前の上に小さくフリガナを出す。
 * 幅が狭い画面（768px 以下）と layout="inline" では「名前（フリガナ）」の1行にする。
 */
import { Comment, Fragment, Text, isVNode, useSlots } from "vue";
import type { ArKanaTextProps } from "./ArKanaText.contract";

const props = withDefaults(defineProps<ArKanaTextProps>(), { name: undefined, kana: undefined, layout: "stacked" });
const slots = useSlots();

function hasContent(nodes: readonly unknown[]): boolean {
  return nodes.some(node => {
    if (Array.isArray(node)) return hasContent(node);
    if (!isVNode(node)) return typeof node === "number" || (typeof node === "string" && node.trim().length > 0);
    if (node.type === Comment) return false;
    if (node.type === Text) return String(node.children ?? "").trim().length > 0;
    if (node.type === Fragment && Array.isArray(node.children)) return hasContent(node.children);
    return true;
  });
}

// Read slots during rendering so a parent's asynchronously loaded kana stays reactive.
function hasKana(): boolean {
  return slots.kana ? hasContent(slots.kana()) : Boolean(props.kana?.trim());
}
</script>

<template>
  <span data-ar="kana-text" data-part="root" :data-layout="layout">
    <span data-part="stack">
      <span v-if="hasKana()" data-part="kana"><slot name="kana">{{ kana }}</slot></span>
      <span data-part="name"><slot>{{ name }}</slot></span>
    </span>
    <span data-part="inline"><slot>{{ name }}</slot><template v-if="hasKana()">（<slot name="kana">{{ kana }}</slot>）</template></span>
  </span>
</template>
