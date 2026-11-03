<script setup lang="ts">
import { computed } from "vue";
import { highlight } from "./highlight";

interface Prop { name: string; type: string; required: boolean; description: string; default?: string }
interface Emit { name: string; payload?: string; type?: string; description?: string }
export interface Meta {
  name: string;
  version: string;
  description: string;
  props: Prop[];
  emits: (Emit | string)[];
  slots: string[];
  parts: string[];
  dataAr: string;
}
const props = defineProps<{ meta: Meta }>();

const iconUnion = /'cal' \| 'brief'[^]*?'xls'/g;
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const fmtType = (t: string) => t.replace(iconUnion, "ArIconName");
const emits = computed(() =>
  props.meta.emits.map((e) => (typeof e === "string" ? { name: e } : e)) as Emit[],
);
const slots = computed(() => props.meta.slots.map((s) => s.replaceAll("`", "")));
</script>

<template>
  <div class="api">
    <h2 id="api">指定できること</h2>
    <h3>属性（部品に渡す値）</h3>
    <div v-if="meta.props.length" class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>名前</th><th>説明</th><th>値の種類</th><th>何も渡さないとき</th></tr></thead>
        <tbody>
          <tr v-for="p in meta.props" :key="p.name">
            <td class="nm"><code>{{ kebab(p.name) }}</code><span v-if="p.required" class="req">必須</span></td>
            <td>{{ p.description || "—" }}</td>
            <td><code class="ty" v-html="highlight(fmtType(p.type))" /></td>
            <td><code v-if="p.default !== undefined" class="df">{{ p.default }}</code><span v-else class="mute">—</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mute">なし</p>

    <template v-if="emits.length">
      <h3>イベント（部品から届く知らせ）</h3>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>名前</th><th>説明</th><th>一緒に届く値</th></tr></thead>
          <tbody>
            <tr v-for="e in emits" :key="e.name">
              <td class="nm"><code>{{ e.name }}</code></td>
              <td>{{ e.description || "—" }}</td>
              <td><code v-if="e.payload || e.type" class="ty" v-html="highlight(fmtType(e.payload || e.type || ''))" /><span v-else class="mute">—</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div class="api-cols">
      <div>
        <h3>差し込める場所（スロット）</h3>
        <ul v-if="slots.length" class="chips"><li v-for="s in slots" :key="s"><code>#{{ s }}</code></li></ul>
        <p v-else class="mute">なし</p>
      </div>
      <div>
        <h3>見た目を当てる部位</h3>
        <ul v-if="meta.parts.length" class="chips"><li v-for="p in meta.parts" :key="p"><code>{{ p }}</code></li></ul>
        <p v-else class="mute">なし</p>
        <p class="hint">見た目のライブラリ（remix・classic）が色や形を当てる場所の名前。<code>[data-ar="{{ meta.dataAr }}"] &gt; [data-part="…"]</code> のように書く。</p>
      </div>
    </div>
  </div>
</template>
