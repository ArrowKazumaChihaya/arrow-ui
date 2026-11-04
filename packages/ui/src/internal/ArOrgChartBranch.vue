<script setup lang="ts">
/** ArOrgChart の枝（札と、その下の子の枝）。ライブラリの中だけで使う。自分を呼んで深い階層も描く。 */
import ArIcon from "../components/ArIcon.vue";
import type { ArOrgNode } from "../components/ArOrgChart.contract";

defineOptions({ name: "ArOrgChartBranch" });
defineProps<{
  node: ArOrgNode;
  level: number;
  isOpen: (key: string) => boolean;
  selected?: string | null;
  countText: (n: ArOrgNode) => string;
  toggleLabel: (n: ArOrgNode, open: boolean) => string;
  nodeLabel: (n: ArOrgNode) => string;
}>();
const emit = defineEmits<{ select: [node: ArOrgNode]; toggle: [node: ArOrgNode] }>();
</script>

<template>
  <div data-part="branch" :data-level="Math.min(level, 2)" :data-kids="node.children?.length ? '' : undefined" role="treeitem" :aria-expanded="node.children?.length ? isOpen(node.key) : undefined" :aria-level="level + 1">
    <div data-part="node-wrap">
      <button
        type="button"
        data-part="node"
        :data-state="selected === node.key ? 'selected' : undefined"
        :aria-label="nodeLabel(node)"
        :title="nodeLabel(node)"
        @click="emit('select', node)"
      >
        <span data-part="node-head">
          <ArIcon v-if="level === 0" line name="bld" data-part="node-icon" />
          <b data-part="name">{{ node.label }}</b>
        </span>
        <span v-if="node.code" data-part="code">{{ node.code }}</span>
        <span v-if="node.count != null || node.countLabel" data-part="count">
          <ArIcon v-if="level === 0" line name="users" data-part="count-icon" />{{ countText(node) }}
        </span>
      </button>
      <button
        v-if="node.children?.length"
        type="button"
        data-part="toggle"
        :data-state="isOpen(node.key) ? 'open' : undefined"
        :aria-label="toggleLabel(node, isOpen(node.key))"
        :title="toggleLabel(node, isOpen(node.key))"
        @click="emit('toggle', node)"
      >
        <ArIcon line :name="isOpen(node.key) ? 'minus' : 'plus'" />
        <span v-if="!isOpen(node.key)" data-part="toggle-count">{{ node.children.length }}</span>
      </button>
    </div>
    <div v-if="node.children?.length && isOpen(node.key)" data-part="children" role="group" :data-single="node.children.length === 1 || undefined">
      <div v-for="c in node.children" :key="c.key" data-part="child">
        <ArOrgChartBranch
          :node="c"
          :level="level + 1"
          :is-open="isOpen"
          :selected="selected"
          :count-text="countText"
          :toggle-label="toggleLabel"
          :node-label="nodeLabel"
          @select="(n) => emit('select', n)"
          @toggle="(n) => emit('toggle', n)"
        />
      </div>
    </div>
  </div>
</template>
