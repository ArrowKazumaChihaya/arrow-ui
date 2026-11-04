<!-- 変更前→変更後 | 申請や履歴で、どこが変わったかを示す。変わっていなければ今の値だけ。 -->
<script setup lang="ts">
import { ArChangedValue, ArStack } from "@s_and_a/arrow-ui";
</script>

<template>
<ArStack :gap="3">
  <div>時給：<ArChangedValue before="1,100円" after="1,200円" /></div>
  <div>所属：<ArChangedValue before="渋谷店" after="新宿店" /></div>
  <div>住所：<ArChangedValue before="" after="東京都渋谷区神南1-2-3" /></div>
  <div>雇用形態：<ArChangedValue before="パート" after="パート" /></div>
  <div>通勤手当：<ArChangedValue before="12,000円" after="12,000円" :changed="true" /></div>
</ArStack>
</template>
