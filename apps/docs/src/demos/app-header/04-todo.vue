<!-- やることリストの一覧（削除・すべて表示する・多いとき・空のとき） | items の deletable で行の右に ×（pill-item-delete）。hiddenCount が1以上なら下に「すべて表示する」（pill-restore）。行が多いと一覧の中でスクロールし、空のときは emptyText を出す。外す・戻すの保存は製品がして、items と hiddenCount を変える。ピルを押すと一覧を出したままにし、外を押すか Escape で閉じる。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArAppHeader, ArButton, ArCluster } from "@arrow/ui";
import type { ArAppHeaderPill } from "@arrow/ui";
const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;

/** 製品の TodoList（title・key・isDeletable）と同じ形のデータ。 */
const todoList = [
  { key: "resident_tax", title: "住民税改定", isDeletable: true },
  { key: "labor_ins", title: "労働保険改定", isDeletable: true },
  { key: "std_income", title: "標準報酬月額改定", isDeletable: true },
  { key: "nencho", title: "年末調整", isDeletable: true },
  { key: "overtime", title: "残業承認（4件）" },
  { key: "holiday", title: "休暇承認（2件）" },
  { key: "punch", title: "打刻修正承認（7件）" },
  { key: "change", title: "変更承認（1件）" },
  { key: "join", title: "入社承認（3件）" },
  { key: "demand", title: "シフト提出の締め切り（11/10）" },
  { key: "recruit", title: "募集の返事待ち（5名）" },
];
const notices = [
  { key: "lecture", title: "使い方レッスンの申し込み" },
  { key: "a1", title: "11月の定期メンテナンスのお知らせ" },
  { key: "a2", title: "年末調整の受付を開始しました" },
];
const hidden = ref<string[]>(["nencho"]);
const many = ref(true);
const shown = computed(() => (many.value ? todoList : []).filter((t) => !hidden.value.includes(t.key)));
const pills = computed<ArAppHeaderPill[]>(() => [
  { key: "notice", label: "システムからのお知らせ", count: 2, icon: "speaker", tone: "notice", items: notices.map((n) => ({ key: n.key, label: n.title })) },
  {
    key: "todo",
    label: "やることリスト",
    count: shown.value.length,
    icon: "todo",
    tone: "todo",
    items: shown.value.map((t) => ({ key: t.key, label: t.title, deletable: t.isDeletable })),
    hiddenCount: many.value ? hidden.value.length : 0,
    emptyText: "やることはありません",
  },
]);
const last = ref("");
</script>

<template>
<div style="margin: -24px; overflow-x: auto">
  <div style="min-width: 1100px; padding-bottom: 300px">
    <ArAppHeader
      :menus="[{ key: 'shift', label: 'シフト', icon: 'cal', palette: 'blue' }, { key: 'attendance', label: '勤怠', icon: 'brief', palette: 'green' }]"
      :menus-end="[{ key: 'config', label: '設定', icon: 'gear', palette: 'teal' }]"
      current="shift"
      :pills="pills"
      :account="{ label: '管理ページ', initial: '管' }"
      @pill-item="(p, k) => (last = `${p}:${k}`)"
      @pill-item-delete="(p, k) => { hidden.push(k); last = `外した：${k}`; }"
      @pill-restore="() => { hidden = []; last = 'すべて表示する'; }"
    >
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArAppHeader>
    <ArCluster :gap="2" align="center" style="margin: 16px 24px 0">
      <ArButton size="sm" tone="secondary" @click="many = !many">{{ many ? "空にする" : "やることを戻す" }}</ArButton>
      <span style="font-size: 12px">押したもの：{{ last || "—" }}</span>
    </ArCluster>
  </div>
</div>
</template>
