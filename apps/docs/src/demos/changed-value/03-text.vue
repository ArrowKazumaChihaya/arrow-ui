<!-- 今の ARROW の表記そのまま（layout="text"） | 今の UI/ChangedValue と同じ1つの文「変更前 → 変更後」（矢印の前後に半角の空白）。変わったときは根に class="changed"。空の値は空の文字、変わったかは before と after をそのまま比べる。変更履歴の固定テスト（.changed の文字が「前 → 後」）と合う。 -->
<script setup lang="ts">
import { ArChangedValue, ArStack } from "@arrow/ui";
</script>

<template>
<ArStack :gap="3">
  <div>名前：<ArChangedValue layout="text" before="<b>before</b>" after="<script>after</script>" :changed="true" /></div>
  <div>時給：<ArChangedValue layout="text" before="1,100円" after="1,200円" /></div>
  <div>住所：<ArChangedValue layout="text" :before="null" after="東京都渋谷区神南1-2-3" /></div>
  <div>雇用形態：<ArChangedValue layout="text" before="パート" after="パート" /></div>
</ArStack>
</template>
