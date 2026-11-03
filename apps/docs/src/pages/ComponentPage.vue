<script setup lang="ts">
import { computed } from "vue";
import DemoBox from "../DemoBox.vue";
import ApiTables, { type Meta } from "../ApiTables.vue";
import CodeBlock from "../CodeBlock.vue";
import metaJson from "../meta.json";
import { demosOf } from "../demos";
import { designs } from "../state";
import * as s from "../snippets";
import type { NavItem } from "../nav";

const props = defineProps<{ item: NavItem }>();
const meta = computed(() => (metaJson as Meta[]).find((m) => m.name === props.item.name)!);
const list = computed(() => demosOf(props.item.slug));
const structural = computed(() => ["ArUiProvider", "ArThemeScope", "ArStack", "ArCluster", "ArGrid", "ArSplit"].includes(props.item.name));
const covered = computed(() => designs.map((d) => ({ id: d.id, v: (d.covers as Record<string, string>)[props.item.name] })));
const isLayout = computed(() => ["ArStack", "ArCluster", "ArGrid", "ArSplit"].includes(props.item.name));
</script>

<template>
  <article class="page">
    <p class="eyebrow"><code class="eyebrow-code">{{ item.name }}</code></p>
    <h1 class="page-title">{{ item.ja }}</h1>
    <p class="lede pre">{{ meta.description }}</p>
    <ul class="facts">
      <li><span>決まりの版</span><code>{{ meta.version }}</code></li>
      <li v-if="meta.dataAr"><span>CSS の目印</span><code>{{ meta.dataAr }}</code></li>
      <li v-if="structural"><span>見た目</span>どの見た目でも同じ（形だけ持つ）</li>
      <li v-else v-for="c in covered" :key="c.id">
        <span>{{ c.id === "remix" ? "新しい見た目" : "今の見た目" }}</span>
        <template v-if="c.v">対応済み</template>
        <template v-else><em class="ng">まだ</em></template>
      </li>
    </ul>
    <p v-if="isLayout" class="callout">
      並べる部品は、製品のレイアウト層（<code>src/Layout</code>）で使います。画面（<code>src/View</code>）では使いません。
    </p>

    <template v-if="item.name === 'ArUiProvider'">
      <h2 id="usage">使い方</h2>
      <p>アプリの一番外に1つ置きます。デザインは製品が起動時に決めて渡し、利用者が選ぶ仕組みは持ちません。</p>
      <CodeBlock :code="s.appVue" file="App.vue" />
      <p><code>scope="self"</code> にすると、html ではなくこの部品の中だけにデザインを当てます。このページの見本は、この方法で2つのデザインを並べています。</p>
      <CodeBlock :code="s.scopeSelf" />
    </template>
    <template v-if="item.name === 'ArThemeScope'">
      <h2 id="usage">使い方</h2>
      <CodeBlock :code="s.themeScope" />
    </template>

    <template v-if="list.length">
      <h2 id="demos">見本</h2>
      <div class="demos">
        <DemoBox v-for="d in list" :key="d.id" :demo="d" />
      </div>
    </template>

    <ApiTables :meta="meta" />
  </article>
</template>
