<!-- 大きさ（sm・md・lg） | md がキャンバスの大きさ（card 112・option のアイコン 44・tile 52）。sm は一覧や設定の中、lg はスマホや大きな選択。radio は ArRadioGroup の card と同じ段（sm 30・md 36・lg 42。省くと lg）。 -->
<script setup lang="ts">
import { ArChoiceCard } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const sizes = ["sm", "md", "lg"] as const;
const plan = ref<string>("c");
const tile = ref<string>("a");
const yn = ref<boolean>(false);
</script>

<template>
<div class="t">
  <template v-for="z in sizes" :key="z">
    <small>{{ z }}</small>
    <div class="r">
      <div role="radiogroup" :aria-label="`プラン（${z}）`" class="g2">
        <ArChoiceCard v-model="plan" :size="z" :value="'b'" title="Bプラン" description="月 300 円／人" />
        <ArChoiceCard v-model="plan" :size="z" :value="'c'" title="Cプラン" description="月 500 円／人" tag="ご利用中" />
      </div>
      <ArChoiceCard variant="option" :size="z" icon="mail" title="入社メールを送信" description="本人に入力してもらう" tag="推奨" tag-tone="ok" style="max-width: 300px" />
      <div role="radiogroup" :aria-label="`書類（${z}）`" class="g2">
        <ArChoiceCard v-model="tile" variant="tile" :size="z" :value="'a'" icon="files" title="雇用契約書" description="3件" />
        <ArChoiceCard v-model="tile" variant="tile" :size="z" :value="'b'" icon="files" title="労働条件通知書" description="1件" />
      </div>
      <div role="radiogroup" :aria-label="`保険料（${z}）`" class="g2">
        <ArChoiceCard v-model="yn" variant="radio" :size="z" :value="false" title="なし" />
        <ArChoiceCard v-model="yn" variant="radio" :size="z" :value="true" title="あり" />
      </div>
    </div>
  </template>
</div>
</template>

<style scoped>
.t { display: grid; grid-template-columns: 40px 1fr; gap: 18px 12px; align-items: start; }
.r { display: flex; flex-direction: column; gap: 10px; }
.g2 { display: grid; grid-template-columns: repeat(2, minmax(0, 260px)); gap: 10px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; padding-top: 6px; }
</style>
