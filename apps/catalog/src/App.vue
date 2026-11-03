<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArButton,
  ArCluster,
  ArDateInput,
  ArField,
  ArGrid,
  ArModal,
  ArStack,
  ArTable,
  ArThemeScope,
  ArTimeInput,
  type ArPaletteName,
  type ArTableColumn,
  type ArTableSort,
  type ArTimeValue,
} from "@arrow/ui";
import { ArUiProvider } from "@arrow/ui";
import { remixSkin } from "@arrow/ui-skin-remix";
import { classicSkin } from "@arrow/ui-skin-classic";
import { paletteNames } from "@arrow/ui-tokens";

const params = new URLSearchParams(location.search);
const skins = { remix: remixSkin, classic: classicSkin } as const;
const skinId = ref<keyof typeof skins>((params.get("skin") as keyof typeof skins) ?? "remix");
const palette = ref<ArPaletteName>((params.get("palette") as ArPaletteName) ?? "blue");
const skin = computed(() => skins[skinId.value] ?? remixSkin);

const shiftStart = ref<ArTimeValue>({ time: "09:00", day: "same" });
const clockIn = ref<ArTimeValue>({ time: "08:58", day: "same" });
const nightIn = ref<ArTimeValue>({ time: "23:30", day: "prev" });
const empty = ref<ArTimeValue>({ time: null, day: "same" });
const date = ref<string | null>("2026-10-21");
const lastLog = ref("（ここに確定した値が出ます）");

type Row = { id: number; name: string; store: string; start: string; end: string; minutes: number; cost: number };
const rows = ref<Row[]>([
  { id: 1, name: "佐藤 美咲", store: "渋谷店", start: "09:00", end: "18:00", minutes: 480, cost: 9600 },
  { id: 2, name: "田中 健", store: "新宿店", start: "13:00", end: "22:00", minutes: 480, cost: 10400 },
  { id: 3, name: "山本 葵", store: "渋谷店", start: "17:00", end: "22:00", minutes: 300, cost: 6000 },
  { id: 4, name: "鈴木 大地", store: "池袋店", start: "10:00", end: "15:00", minutes: 300, cost: 5500 },
]);
const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const columns: ArTableColumn<Row>[] = [
  { key: "name", title: "氏名", width: 140, sticky: true, sortable: true },
  { key: "store", title: "所属", width: 110 },
  { key: "start", title: "開始", width: 90, sortable: true },
  { key: "end", title: "終了", width: 90 },
  { key: "minutes", title: "時間", align: "end", width: 90, value: (r) => hm(r.minutes) },
  { key: "cost", title: "人件費", align: "end", width: 110, value: (r) => yen(r.cost), sortable: true },
];
const sort = ref<ArTableSort | null>(null);
const selected = ref<(string | number)[]>([1]);
const expanded = ref<(string | number)[]>([]);
const sortedRows = computed(() => {
  const s = sort.value;
  if (!s) return rows.value;
  const k = s.key as keyof Row;
  return [...rows.value].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (s.order === "asc" ? 1 : -1));
});
const footer = computed(() => ({
  name: `合計 ${rows.value.length}名`,
  minutes: hm(rows.value.reduce((s, r) => s + r.minutes, 0)),
  cost: yen(rows.value.reduce((s, r) => s + r.cost, 0)),
}));

const modalOpen = ref(params.get("modal") === "1");
const step = ref(1);
const eventDate = ref<string | null>("2026-10-21");
const eventStart = ref<ArTimeValue>({ time: "10:00", day: "same" });
const eventEnd = ref<ArTimeValue>({ time: "09:30", day: "same" });
const eventInvalid = computed(
  () => !!eventStart.value.time && !!eventEnd.value.time && eventEnd.value.time <= eventStart.value.time,
);
</script>

<template>
  <ArUiProvider :skin="skin" :palette="palette">
    <div class="cat">
      <div class="cat-head">
        <div>
          <h1>ARROW UI カタログ</h1>
          <p>@arrow/ui の部品を、skin とテーマ色を替えて確かめる画面です。</p>
        </div>
        <div class="cat-ctrl">
          <label>skin
            <select v-model="skinId" data-test="skin">
              <option value="remix">remix</option>
              <option value="classic">classic（移行中だけ）</option>
            </select>
          </label>
          <label>テーマ色
            <select v-model="palette" data-test="palette">
              <option v-for="p in paletteNames" :key="p" :value="p">{{ p }}</option>
            </select>
          </label>
        </div>
      </div>

      <section class="cat-sec" id="button">
        <h2>ArButton</h2>
        <p>tone（primary / secondary / subtle / ghost / danger / danger-subtle / dashed）・size・icon・loading・disabled。primary はまとまりに1つ。</p>
        <ArStack :gap="4">
          <ArCluster :gap="2">
            <ArButton tone="primary" icon="check">この内容で追加</ArButton>
            <ArButton>キャンセル</ArButton>
            <ArButton tone="subtle" icon="yen">日毎人件費</ArButton>
            <ArButton tone="ghost" icon="plus">行を追加</ArButton>
            <ArButton tone="danger">削除する</ArButton>
            <ArButton tone="danger-subtle">削除</ArButton>
          </ArCluster>
          <ArCluster :gap="2">
            <ArButton tone="primary" size="sm">小</ArButton>
            <ArButton tone="primary">ふつう</ArButton>
            <ArButton tone="primary" size="lg">大</ArButton>
            <ArButton icon="pen" label="変更" />
            <ArButton icon="trash" label="削除" tone="ghost" />
            <ArButton tone="primary" loading>保存中</ArButton>
            <ArButton tone="primary" disabled>使えない</ArButton>
          </ArCluster>
          <ArButton tone="dashed" icon="plus" block>シフト追加</ArButton>
        </ArStack>
      </section>

      <section class="cat-sec" id="inputs">
        <h2>ArField・ArTimeInput・ArDateInput</h2>
        <p>時刻は「930」「1730」のようにキーで入れて Enter かフォーカスを外すと確定。出勤などは［当日］を押すたびに［前日］と切り替わる（Tab では止まらない）。</p>
        <ArGrid min-item="md" :gap="5">
          <ArField label="シフトの開始" help="前日の切り替えなし">
            <template #default="f"><ArTimeInput v-model="shiftStart" :id="f.id" @commit="(v) => (lastLog = JSON.stringify(v))" /></template>
          </ArField>
          <ArField label="出勤">
            <template #default="f"><ArTimeInput v-model="clockIn" :id="f.id" day-shift @commit="(v) => (lastLog = JSON.stringify(v))" /></template>
          </ArField>
          <ArField label="出勤（前日）">
            <template #default="f"><ArTimeInput v-model="nightIn" :id="f.id" day-shift @commit="(v) => (lastLog = JSON.stringify(v))" /></template>
          </ArField>
          <ArField label="退勤" required>
            <template #default="f"><ArTimeInput v-model="empty" :id="f.id" day-shift /></template>
          </ArField>
          <ArField label="終了" error="終了は開始より後の時刻にしてください">
            <template #default="f"><ArTimeInput :model-value="{ time: '08:30', day: 'same' }" :id="f.id" invalid /></template>
          </ArField>
          <ArField label="使えない">
            <template #default="f"><ArTimeInput :model-value="{ time: '12:00', day: 'same' }" :id="f.id" disabled /></template>
          </ArField>
          <ArField label="日付">
            <template #default="f"><ArDateInput v-model="date" :id="f.id" label="日付" /></template>
          </ArField>
          <ArField label="大きさ">
            <template #default>
              <ArCluster :gap="2">
                <ArTimeInput :model-value="{ time: '09:00', day: 'same' }" size="sm" label="小" />
                <ArTimeInput :model-value="{ time: '09:00', day: 'same' }" label="中" />
                <ArTimeInput :model-value="{ time: '09:00', day: 'same' }" size="lg" label="大" />
              </ArCluster>
            </template>
          </ArField>
          <ArField label="横のラベル" layout="inline">
            <template #default="f"><ArTimeInput :model-value="{ time: '18:00', day: 'same' }" :id="f.id" /></template>
          </ArField>
        </ArGrid>
        <p class="cat-note" data-test="log">確定した値：<code>{{ lastLog }}</code>　日付：<code>{{ date }}</code></p>
      </section>

      <section class="cat-sec" id="table">
        <h2>ArTable</h2>
        <p>見出しと氏名の列は固定。並べ替えの印を押すと update:sort が出て、並べ替えは使う側（ここではカタログ）がする。選択・展開・合計の行。</p>
        <ArTable
          v-model:selected="selected"
          v-model:sort="sort"
          v-model:expanded="expanded"
          :columns="columns"
          :rows="sortedRows"
          row-key="id"
          caption="勤務メンバー"
          selectable
          expandable
          :footer="footer"
        >
          <template #expanded="{ row }">休憩 12:00〜13:00 ／ 打刻 08:58〜18:03（{{ row.name }}）</template>
        </ArTable>
      </section>

      <section class="cat-sec" id="theme">
        <h2>ArThemeScope</h2>
        <p>中の部品のテーマ色だけを切り替える。どのページにどの色を当てるかは製品のレイアウト層が決める。</p>
        <ArCluster :gap="3">
          <ArThemeScope v-for="p in paletteNames" :key="p" :palette="p">
            <ArButton tone="primary">{{ p }}</ArButton>
          </ArThemeScope>
        </ArCluster>
      </section>

      <section class="cat-sec" id="modal">
        <h2>ArModal</h2>
        <p>開くと本文の最初の入力にフォーカス。Tab は中で回り、Esc と × で閉じる。幕では閉じない（入力を失わないため）。</p>
        <ArButton tone="primary" icon="plus" @click="modalOpen = true">イベント追加</ArButton>
      </section>
    </div>

    <ArModal
      v-model:open="modalOpen"
      title="イベントを追加"
      description="10月21日（水）のイベントを登録します。"
      :steps="['内容', '日時', '確認']"
      :current-step="step"
    >
      <ArStack :gap="4">
        <ArField label="日付" required>
          <template #default="f"><ArDateInput v-model="eventDate" :id="f.id" label="日付" /></template>
        </ArField>
        <ArCluster :gap="4" align="start">
          <ArField label="開始">
            <template #default="f"><ArTimeInput v-model="eventStart" :id="f.id" /></template>
          </ArField>
          <ArField label="終了" :error="eventInvalid ? '終了は開始より後の時刻にしてください' : undefined">
            <template #default="f"><ArTimeInput v-model="eventEnd" :id="f.id" :invalid="eventInvalid" /></template>
          </ArField>
        </ArCluster>
      </ArStack>
      <template #footer>
        <ArButton @click="step = Math.max(0, step - 1)">戻る</ArButton>
        <ArButton tone="primary" @click="step = Math.min(2, step + 1)">次へ</ArButton>
      </template>
    </ArModal>
  </ArUiProvider>
</template>
