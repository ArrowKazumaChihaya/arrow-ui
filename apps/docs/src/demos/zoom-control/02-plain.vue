<!-- 板の中に置く（plain） | すでに白い板の中に置くときは箱なし（組織図の右下の操作）。ほかのボタン（「全体を表示」など）と並べる。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArZoomControl } from "@arrow/ui";

const z = ref(100);
</script>

<template>
<div style="display: inline-flex; align-items: center; gap: 4px; padding: 4px; border-radius: 12px; background: #fff; box-shadow: 0 2px 8px rgba(31, 41, 51, 0.12)">
  <ArZoomControl
    variant="plain"
    :value="`${z}%`"
    :out-disabled="z <= 50"
    :in-disabled="z >= 200"
    label="拡大・縮小"
    out-label="縮小"
    in-label="拡大"
    @out="z = Math.max(50, z - 10)"
    @in="z = Math.min(200, z + 10)"
  />
  <ArButton tone="muted" size="sm" @click="z = 100">全体を表示</ArButton>
</div>
</template>
