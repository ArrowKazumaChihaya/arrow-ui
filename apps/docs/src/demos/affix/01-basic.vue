<!-- スクロールしても上に残る帯 | 一番近いスクロールする箱の中で上に張り付く。白の半透明とぼかし、下に線。張り付いた・はがれたは change で分かる。 -->
<script setup lang="ts">
import { ArAffix, ArButton, ArCluster } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const stuck = ref(false);
</script>

<template>
<div style="height: 150px; overflow: auto; border-radius: 12px; box-shadow: inset 0 0 0 1px #E6EBF0; max-width: 520px">
  <ArAffix @change="stuck = $event">
    <b style="font-size: 13.5px">3件を選んでいます</b>
    <ArCluster :gap="2" style="margin-left: auto"><ArButton size="sm">選び直す</ArButton><ArButton size="sm" tone="primary">まとめて承認</ArButton></ArCluster>
  </ArAffix>
  <div style="padding: 12px; font-size: 13px; color: #66727F; line-height: 2.2">
    {{ stuck ? "張り付いています" : "スクロールしてみてください" }}<br>一覧…<br>一覧…<br>一覧…<br>一覧…<br>一覧…<br>一覧…<br>一覧…
  </div>
</div>
</template>
