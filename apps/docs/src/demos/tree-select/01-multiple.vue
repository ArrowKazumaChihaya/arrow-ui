<!-- 部署を選ぶ（チェック） | multiple はチェックで選ぶ。親をチェックすると下が全部入り、一部だけ選んでいる親は indeterminate。selbox では「営業部 / 東京営業所」のように上の部署から出す。 -->
<script setup lang="ts">
import { ArTreeSelect, ArStack } from "@s_and_a/arrow-ui";
import { ref } from "vue";
const depts = ref<(string | number)[]>(["tokyo"]);
const many = ref<(string | number)[]>(["tokyo", "osaka", "hr"]);
const tree = [
  { value: "sales", label: "営業部", children: [{ value: "tokyo", label: "東京営業所" }, { value: "osaka", label: "大阪営業所" }] },
  { value: "admin", label: "管理部", children: [{ value: "hr", label: "人事課" }, { value: "acc", label: "経理課" }, { value: "gen", label: "総務課（廃止）", disabled: true }] },
];
</script>

<template>
<ArStack :gap="3" align="start">
  <ArTreeSelect v-model="depts" :tree="tree" multiple variant="selbox" icon="bld" label="部署" style="width: 260px" />
  <ArTreeSelect v-model="many" :tree="tree" multiple clearable default-expand-all label="部署（札）" style="width: 300px" />
</ArStack>
</template>
