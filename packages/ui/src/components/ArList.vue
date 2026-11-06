<script setup lang="ts">
/**
 * ArList 1.1 — 人やものの一覧（antd 6 の Listy の形）。
 * 1行は「頭文字の丸・名前と説明・右の操作」。group が続く間を1つにまとめ、淡いテーマ色の見出しを上に出す（スクロールしても残る）。
 */
import { computed } from "vue";
import ArAvatar from "./ArAvatar.vue";
import ArEmpty from "./ArEmpty.vue";
import type { ArListItem, ArListProps } from "./ArList.contract";

const props = withDefaults(defineProps<ArListProps>(), { bordered: true, emptyText: "データがありません", maxHeight: undefined, size: "md" });

/** 続く group ごとにまとめる。 */
const groups = computed(() => {
  const out: { name: string | undefined; items: { item: ArListItem; index: number }[] }[] = [];
  props.items.forEach((item, index) => {
    const last = out.at(-1);
    if (last && last.name === item.group) last.items.push({ item, index });
    else out.push({ name: item.group, items: [{ item, index }] });
  });
  return out;
});
const avatarOf = (it: ArListItem) => {
  const a = typeof it.avatar === "object" ? it.avatar : {};
  return { src: a.src, text: a.text ?? Array.from(it.title.trim())[0] ?? "", tone: a.tone, seed: a.seed };
};
</script>

<template>
  <div data-ar="list" data-part="root" :data-bordered="bordered || undefined" :data-size="size">
    <div v-if="$slots.header" data-part="header"><slot name="header" /></div>
    <div data-part="viewport" :style="maxHeight ? { maxHeight: `${maxHeight}px` } : undefined" :tabindex="maxHeight ? 0 : undefined" role="region" :aria-label="label">
      <template v-if="items.length">
        <section v-for="(g, gi) in groups" :key="gi" data-part="group">
          <div v-if="g.name" data-part="group-title">{{ g.name }}</div>
          <ul data-part="items" role="list" :aria-label="g.name ?? label">
            <li
              v-for="{ item, index } in g.items"
              :key="item.key"
              data-part="item"
              :data-state="item.off ? 'off' : undefined"
            >
              <slot name="item" :item="item" :index="index">
                <span v-if="item.avatar || $slots.avatar" data-part="avatar">
                  <slot name="avatar" :item="item" :index="index"><ArAvatar v-bind="avatarOf(item)" :size="size === 'sm' ? 'sm' : 'md'" /></slot>
                </span>
                <div data-part="meta">
                  <b data-part="title"><slot name="title" :item="item" :index="index">{{ item.title }}</slot></b>
                  <div v-if="item.description || $slots.description" data-part="description">
                    <slot name="description" :item="item" :index="index">{{ item.description }}</slot>
                  </div>
                </div>
                <div v-if="$slots.actions" data-part="actions"><slot name="actions" :item="item" :index="index" /></div>
              </slot>
            </li>
          </ul>
        </section>
      </template>
      <div v-else data-part="empty"><slot name="empty"><ArEmpty :text="emptyText" /></slot></div>
    </div>
    <div v-if="$slots.footer" data-part="footer"><slot name="footer" /></div>
  </div>
</template>
