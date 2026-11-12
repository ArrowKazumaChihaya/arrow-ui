<!-- マスコット | 絵（SVG）と動き（CSS）は製品が渡す。motion に動きの名前を渡すと再生し、1回だけの動き（loop: false）は終わると待機の動きへ戻って motionend を知らせる。絵の色に var(--ar-accent) などのテーマ色を使うと、ページのテーマ色と利用者が選んだ色合いに従う。動きを減らす設定の人には動かさない。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArMascot, ArThemeScope, type ArMascotArtwork } from "@s_and_a/arrow-ui";

const artwork: ArMascotArtwork = {
  id: "demo",
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="demo-mascot"><ellipse cx="100" cy="182" rx="46" ry="7" style="fill:var(--ar-accent-line)"/><g class="body"><circle cx="100" cy="104" r="68" style="fill:var(--ar-accent-muted);stroke:var(--ar-accent-ink)" stroke-width="6"/><circle cx="78" cy="96" r="8" fill="#111723"/><circle cx="122" cy="96" r="8" fill="#111723"/><path d="M80 126q20 16 40 0" fill="none" stroke="#111723" stroke-width="6" stroke-linecap="round"/></g></svg>`,
  css: `.demo-mascot .body{transform-box:view-box;transform-origin:100px 172px;animation-duration:var(--duration);animation-timing-function:ease-in-out;animation-iteration-count:infinite}
.demo-mascot[data-motion="idle"] .body{animation-name:demo-mascot-breathe}
.demo-mascot[data-motion="jump"] .body{animation-name:demo-mascot-jump}
@keyframes demo-mascot-breathe{50%{transform:scale(1.02,.98)}}
@keyframes demo-mascot-jump{20%{transform:scale(1.08,.9)}50%{transform:translateY(-34px) scale(.96,1.05)}80%{transform:scale(1.05,.94)}}`,
  motions: { idle: { seconds: 3, loop: true }, jump: { seconds: 0.9, loop: false } },
};
const motion = ref("idle");
const replay = ref(0);
function jump() {
  motion.value = "jump";
  replay.value++;
}
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: end">
    <ArThemeScope v-for="palette in ['blue', 'green', 'pink'] as const" :key="palette" :palette="palette">
      <ArMascot :artwork="artwork" :motion="motion" :replay="replay" label="見本のマスコット" :size="96" @motionend="motion = 'idle'" />
    </ArThemeScope>
    <ArButton @click="jump">とぶ</ArButton>
  </div>
</template>
