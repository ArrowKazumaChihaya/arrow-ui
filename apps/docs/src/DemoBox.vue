<script setup lang="ts">
import { computed, ref } from "vue";
import { ArUiProvider } from "@s_and_a/arrow-ui";
import type { Demo } from "./demos";
import { highlight } from "./highlight";
import { palette, shown, designs } from "./state";

/** screen：画面の例。余白なしで大きく出し、両方の見た目のときも左右に並べず上下に重ねる。 */
const props = defineProps<{ demo: Demo; both?: boolean; hideCode?: boolean; screen?: boolean }>();
const open = ref(false);
const copied = ref(false);
const list = computed(() => (props.both ? [...designs] : shown.value));
const html = computed(() => highlight(props.demo.source));
async function copy() {
  try {
    await navigator.clipboard.writeText(props.demo.source);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1400);
  } catch {
    /* コピーできない環境では何もしない */
  }
}
</script>

<template>
  <section class="demo" :class="{ 'is-screen': screen }" :id="demo.id">
    <div class="demo-stage" :class="{ 'is-both': list.length > 1 && !screen, 'is-stack': list.length > 1 && screen }">
      <div v-for="d in list" :key="d.id" class="demo-pane">
        <div v-if="list.length > 1" class="demo-pane-label">{{ d.id === "remix" ? "新しい見た目" : "今の見た目" }}</div>
        <ArUiProvider :design="d" :palette="palette" scope="self">
          <div class="demo-canvas"><component :is="demo.comp" /></div>
        </ArUiProvider>
      </div>
    </div>
    <div class="demo-meta">
      <h3 class="demo-title"><a :href="`#${demo.slug}/${demo.id}`">{{ demo.title }}</a></h3>
      <p class="demo-desc">{{ demo.desc }}</p>
      <div v-if="!hideCode" class="demo-tools">
        <button type="button" class="tool" :aria-expanded="open" @click="open = !open">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /></svg>
          {{ open ? "コードを閉じる" : "コードを見る" }}
        </button>
        <button type="button" class="tool" @click="copy">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>
          {{ copied ? "コピーしました" : "コピー" }}
        </button>
      </div>
    </div>
    <pre v-if="open" class="code"><code v-html="html" /></pre>
  </section>
</template>
