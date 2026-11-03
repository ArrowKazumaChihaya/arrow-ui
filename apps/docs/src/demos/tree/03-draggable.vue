<!-- 並べ替え | draggable でつまみ（⋮⋮）が出て、ドラッグで並べ替える（行の上・下・中に落とす）。キーボードは Alt+↑↓。並べ替えるのは drop を受けた親。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArTree, type ArTreeDrop, type ArTreeNode } from "@arrow/ui";
const items = ref<ArTreeNode[]>([
  { key: "arrow", label: "ARROW事業部", icon: "folder", children: [{ key: "tokyo", label: "東京", icon: "folder" }, { key: "osaka", label: "大阪", icon: "folder" }] },
  { key: "hq", label: "本社", icon: "folder" },
  { key: "lab", label: "研究所", icon: "folder" },
]);
function take(list: ArTreeNode[], key: ArTreeNode["key"]): ArTreeNode | null {
  const i = list.findIndex((n) => n.key === key);
  if (i >= 0) return list.splice(i, 1)[0]!;
  for (const n of list) if (n.children) { const kids = [...n.children]; const hit = take(kids, key); if (hit) { n.children = kids; return hit; } }
  return null;
}
function put(list: ArTreeNode[], node: ArTreeNode, d: ArTreeDrop): boolean {
  const i = list.findIndex((n) => n.key === d.target);
  if (i >= 0) {
    if (d.position === "inside") list[i] = { ...list[i]!, children: [...(list[i]!.children ?? []), node] };
    else list.splice(d.position === "before" ? i : i + 1, 0, node);
    return true;
  }
  return list.some((n, j) => { if (!n.children) return false; const kids = [...n.children]; if (put(kids, node, d)) { list[j] = { ...n, children: kids }; return true; } return false; });
}
function onDrop(d: ArTreeDrop) {
  const list = [...items.value];
  const node = take(list, d.key);
  if (node && put(list, node, d)) items.value = list;
}
</script>

<template>
<div style="width: 260px">
  <ArTree :items="items" draggable default-expand-all label="部署" @drop="onDrop" />
</div>
</template>
