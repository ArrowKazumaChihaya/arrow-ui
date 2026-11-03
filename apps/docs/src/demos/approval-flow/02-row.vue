<!-- 横に並べる・編集する（申請設定） | layout="row"。先頭に「申請」（start）、段を › でつなぐ。step スロットで札をセレクトに替え、append で「ステップを足す」。 -->
<script setup lang="ts">
import { ArApprovalFlow, ArButton, ArSelect, ArStack, type ArApprovalStep } from "@arrow/ui";
import { ref } from "vue";
const opts = [
  { value: "store", label: "店長" },
  { value: "area", label: "エリアマネージャー" },
  { value: "hr", label: "人事部" },
];
const picks = ref<(string | null)[]>(["store", "hr"]);
const edit = ref<ArApprovalStep[]>(picks.value.map((p, i) => ({ key: i, title: p ?? "", state: "todo" })));
function add() {
  picks.value.push(null);
  edit.value.push({ key: edit.value.length, title: "", state: "todo" });
}
const status: ArApprovalStep[] = [
  { title: "店長", who: "新里 匠", state: "done" },
  { title: "人事部", who: "原 裕太", state: "current" },
  { title: "最終承認", state: "todo" },
];
</script>

<template>
<ArStack :gap="4">
  <ArApprovalFlow layout="row" start="申請" :steps="status" />
  <div>
    <ArApprovalFlow layout="row" start="申請" :steps="edit">
      <template #step="{ index }">
        <ArSelect v-model="picks[index]!" :options="opts" placeholder="選択してください" :label="`${index + 1}つ目の承認者`" style="width: 168px" />
      </template>
      <template #append><ArButton tone="ghost" size="sm" icon="plus" @click="add">ステップを足す</ArButton></template>
    </ArApprovalFlow>
    <p class="demo-note">※会社管理者は承認フローに関係なく常に承認可能です</p>
  </div>
</ArStack>
</template>
