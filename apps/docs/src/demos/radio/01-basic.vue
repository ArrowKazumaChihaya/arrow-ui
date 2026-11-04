<!-- 単独で置くラジオ | modelValue（今選ばれている値）と value（このラジオの値）が同じなら選ばれた形。押すと update:modelValue に value（今の ARROW の UI/Radio の value・thisValue と同じ）。同じ name を付けると ←→↑↓ で移れる。中身（default slot）は文字でも部品でもよい。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArCluster, ArRadio, ArStack } from "@s_and_a/arrow-ui";
const plan = ref<string | null>("b");
const none = ref<string | null>(null);
</script>

<template>
<ArStack :gap="3">
  <ArCluster :gap="4" align="center">
    <ArRadio v-model="plan" value="a" name="plan">Aプラン</ArRadio>
    <ArRadio v-model="plan" value="b" name="plan">Bプラン</ArRadio>
    <ArRadio v-model="plan" value="c" name="plan" disabled>Cプラン（選べない）</ArRadio>
  </ArCluster>
  <ArCluster :gap="4" align="center">
    <ArRadio v-model="none" value="x" label="文字なし（表の行の頭に置く形）" />
    <ArRadio :model-value="'y'" value="y" disabled label="選ばれたまま使えない" />
    <ArRadio v-model="none" value="z" invalid>選んでください（間違いの形）</ArRadio>
  </ArCluster>
  <p style="margin: 0; font-size: 12px">plan：{{ plan }} ／ none：{{ none ?? "なし" }}</p>
</ArStack>
</template>
