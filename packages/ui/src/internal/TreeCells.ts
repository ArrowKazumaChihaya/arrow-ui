import { cloneVNode, createTextVNode, Comment, defineComponent, Fragment, h, isVNode } from "vue";
import { UiTableCell, UiTableRow } from "../product";
import type { VNode, VNodeChild } from "vue";

function renderDefault(value: unknown): VNode[] {
  if (typeof value !== 'function') return [];
  const result: unknown = value();
  if (isVNode(result)) return [result];
  if (typeof result === 'string' || typeof result === 'number') return [createTextVNode(String(result))];
  return Array.isArray(result) ? result.flatMap(item => isVNode(item) ? [item] : typeof item === 'string' || typeof item === 'number' ? [createTextVNode(String(item))] : []) : [];
}
/** Preserve supplied cell components and listeners, adding the library's tree controls to cell one. */
function cells(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment) return [];
    if (node.type === Fragment && Array.isArray(node.children)) return cells(node.children.filter(isVNode));
    if (node.type === 'tr' || node.type === UiTableRow) {
      const children = node.children;
      if (Array.isArray(children)) return cells(children.filter(isVNode));
      if (children && typeof children === 'object') return cells(renderDefault(children.default));
    }
    return [node];
  });
}
export default defineComponent({
  name: 'ArTreeCells',
  props: { depth: { type: Number, required: true } },
  setup(props, { slots }) {
    return () => cells(slots.default?.() ?? []).map((node, index) => {
      const attributes = {
        'data-part': 'cell', role: 'gridcell',
        ...(index === 0 ? { 'data-tree': true, style: { '--ar-tt-depth': props.depth } } : {}),
      };
      const isCell = node.type === 'td' || node.type === 'th' || node.type === UiTableCell;
      if (index !== 0) return isCell ? cloneVNode(node, attributes) : h('td', attributes, [node]);
      const original = node.children;
      const content = (): VNodeChild => {
        if (!isCell) return node;
        if (typeof original === 'object' && original !== null && !Array.isArray(original)) return renderDefault(original.default);
        return original;
      };
      const render = () => [h('span', { 'data-part': 'tree' }, [
        ...(slots.controls?.() ?? []), h('span', { 'data-part': 'content' }, [content()]),
      ])];
      // Creating native cells anew normalizes their children flags. Mutating a cloned
      // text cell's children leaves Vue interpreting the new VNodes as plain text.
      if (!isCell) return h('td', attributes, render());
      if (typeof node.type === 'string') return h(node.type, { ...node.props, ...attributes }, render());
      const result = cloneVNode(node, attributes);
      result.children = { default: render };
      return result;
    });
  },
});
