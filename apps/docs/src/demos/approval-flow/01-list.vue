<!-- 承認の進み具合（一覧） | layout="list"（既定）。番号の丸・段の名前と承認する人・状態の札。済み（done）・あなたの番（current）・まだ（todo）・差し戻し（denied）。 -->
<script setup lang="ts">
import { ArApprovalFlow, ArStack, type ArApprovalStep } from "@s_and_a/arrow-ui";
const steps: ArApprovalStep[] = [
  { title: "店長の承認", who: "末永 修也", state: "done", status: "承認済　10/31 18:02" },
  { title: "人事の承認", who: "千速 一真（あなた）", state: "current" },
  { title: "最終承認", who: "原 裕太", state: "todo" },
];
const waiting: ArApprovalStep[] = [
  { title: "店長の承認", who: "新里 匠", state: "done", status: "承認済　11/03 09:10" },
  { title: "会社管理者の承認", who: "原 裕太", state: "current", status: "承認待ち" },
];
const denied: ArApprovalStep[] = [
  { title: "店長の承認", who: "末永 修也", state: "denied", status: "差し戻し　11/02 18:20" },
  { title: "最終承認", who: "原 裕太", state: "todo" },
];
</script>

<template>
<ArStack :gap="4" style="width: 636px; max-width: 100%">
  <ArApprovalFlow :steps="steps" />
  <ArApprovalFlow :steps="waiting" />
  <ArApprovalFlow :steps="denied" />
</ArStack>
</template>
