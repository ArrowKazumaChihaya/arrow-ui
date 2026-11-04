<!-- 店舗（部署）の階層の選択（BranchSelectorInner の置き換え） | 木の店舗から1つ選ぶ。「全店舗」は値 0 の行として木の先頭に、「部署/店舗追加」は actions（押すと action）、「子店舗を含める」は v-model:include-children（渡したときだけプルダウンの下に出し、オンで下の店舗のある店舗を選ぶと押す所に「子店舗を含む」）。開いている店舗は v-model:expanded（今の storageKey のように製品が localStorage に置けば、開け閉めを覚えておける）。 -->
<script setup lang="ts">
import { ArTreeSelect, type ArTreeSelectValue } from "@arrow/ui";
import { ref, watch } from "vue";
const tree = [
  { value: 0, label: "全店舗" },
  {
    value: 1,
    label: "ARROW事業部",
    children: [
      { value: 11, label: "渋谷店", children: [{ value: 111, label: "ホール" }, { value: 112, label: "キッチン" }] },
      { value: 12, label: "新宿店" },
    ],
  },
  { value: 2, label: "本社", children: [{ value: 21, label: "総務部" }] },
];
const branch = ref<ArTreeSelectValue | null>(1);
const include = ref(true);
const lastAction = ref("");
/** 今の TreeSelect の storageKey と同じく、閉じた店舗を覚えておく（製品の localStorage の代わり）。 */
const expanded = ref<ArTreeSelectValue[]>([1, 11, 2]);
watch(expanded, (v) => (lastAction.value = `開いている店舗：${v.join("・")}`));
</script>

<template>
  <div class="g">
    <div>
      <small>店舗（子店舗を含める）</small>
      <ArTreeSelect
        v-model="branch"
        v-model:include-children="include"
        v-model:expanded="expanded"
        :tree="tree"
        :show-path="false"
        variant="selbox"
        icon="store"
        label="店舗"
        :actions="[{ value: 'add_branch', label: '部署/店舗追加', icon: 'plus' }]"
        style="width: 260px"
        @action="lastAction = '部署/店舗追加を押した（製品は会社情報の店舗タブへ）'"
      />
    </div>
    <div>
      <small>店舗（含めるを出さない）</small>
      <ArTreeSelect v-model="branch" :tree="tree" :show-path="false" default-expand-all label="店舗" style="width: 240px" />
    </div>
    <p>値：{{ branch }}／子店舗を含める：{{ include ? "オン" : "オフ" }}／{{ lastAction }}</p>
  </div>
</template>

<style scoped>
.g { display: flex; flex-wrap: wrap; gap: 14px 40px; }
.g > div { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.g > p { flex-basis: 100%; margin: 0; font-size: 12px; }
small { font: 10px ui-monospace, monospace; color: #999; white-space: nowrap; }
</style>
