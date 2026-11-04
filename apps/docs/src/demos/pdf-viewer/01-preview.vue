<!-- プレビュー（給与明細書・5人分） | 上の段に ‹ 1 / 5 ›・「末永 修也（1人目）」・大きさ（70〜150%）。中身は page slot の HTML（製品が PDF の画像を渡すなら pages）。紙にフォーカスして ←→ でページ、+ − で大きさ。 -->
<script setup lang="ts">
import { ArPdfViewer } from "@s_and_a/arrow-ui";
import { computed, ref } from "vue";
const P = [
  ["0001", "末永 修也", "ARROW事業部", "役員", "420,000", "460,525", "398,855"],
  ["0002", "中口 万由香", "ARROW事業部", "社員", "280,000", "312,400", "251,320"],
  ["0003", "小山 結衣", "新宿店", "パート", "142,800", "150,000", "138,214"],
  ["0004", "森 千尋", "渋谷店", "社員", "250,000", "268,300", "219,875"],
  ["0005", "原 裕太", "ADVANCE事業部", "社員", "300,000", "331,900", "268,010"],
];
const page = ref(1);
const zoom = ref(100);
const s = computed(() => P[page.value - 1]!);
</script>

<template>
<div style="max-width: 820px; border: 1px solid #E6EBF0; border-radius: 12px; overflow: hidden">
  <ArPdfViewer v-model:page="page" v-model:zoom="zoom" :page-count="P.length" :people="P.map((p) => p[1]!)" label="給与明細書のプレビュー" height="560px" paper-min-height="780px">
    <template #page>
      <div style="padding: 44px 46px; font: 11px/1.5 'Noto Serif JP', 'Hiragino Mincho ProN', serif">
        <h1 style="text-align: center; font-size: 20px; margin: 0 0 18px; letter-spacing: .2em">給与明細書</h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px"><span>2026年10月分（支給日 2026/10/25）</span><span>ARROW株式会社</span></div>
        <table style="width: 100%; border-collapse: collapse">
          <tbody>
            <tr><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">社員コード</th><td style="border: 1px solid #888; padding: 5px 7px">{{ s[0] }}</td><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">氏名</th><td style="border: 1px solid #888; padding: 5px 7px">{{ s[1] }} 様</td></tr>
            <tr><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">所属</th><td style="border: 1px solid #888; padding: 5px 7px">{{ s[2] }}</td><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">区分</th><td style="border: 1px solid #888; padding: 5px 7px">{{ s[3] }}</td></tr>
            <tr><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">基本給</th><td style="border: 1px solid #888; padding: 5px 7px; text-align: right">{{ s[4] }}</td><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">総支給額</th><td style="border: 1px solid #888; padding: 5px 7px; text-align: right; font-weight: 700">{{ s[5] }}</td></tr>
            <tr><th style="border: 1px solid #888; background: #EEF0F2; padding: 5px 7px; text-align: left; font-weight: 400">差引支給額</th><td colspan="3" style="border: 1px solid #888; padding: 5px 7px; text-align: right; font-size: 15px; font-weight: 700">{{ s[6] }}</td></tr>
          </tbody>
        </table>
      </div>
    </template>
  </ArPdfViewer>
</div>
</template>
