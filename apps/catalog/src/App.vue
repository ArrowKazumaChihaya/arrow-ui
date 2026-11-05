<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArAlert,
  ArCard,
  ArCheckbox,
  ArRadioGroup,
  ArSelect,
  ArSwitch,
  ArTabs,
  ArTag,
  ArTextInput,
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
} from "@s_and_a/arrow-ui";
import { ArUiProvider } from "@s_and_a/arrow-ui";
import { remixDesign } from "@s_and_a/arrow-ui-design-remix";
import { classicDesign } from "@s_and_a/arrow-ui-design-classic";
import { paletteNames } from "@s_and_a/arrow-ui-tokens";

const params = new URLSearchParams(location.search);
const designs = { remix: remixDesign, classic: classicDesign } as const;
const designId = ref<keyof typeof designs>((params.get("design") as keyof typeof designs) ?? "remix");
const palette = ref<ArPaletteName>((params.get("palette") as ArPaletteName) ?? "blue");
const design = computed(() => designs[designId.value] ?? remixDesign);

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

const tab = ref("member");
const tabs = [
  { key: "member", label: "勤務メンバー", icon: "users" as const, count: 4 },
  { key: "available", label: "勤務可能な人" },
  { key: "event", label: "イベント" },
];
const pageTab = ref("cal");
const pageTabs = [
  { key: "cal", label: "カレンダー", icon: "cal" as const },
  { key: "table", label: "テーブル", icon: "grid" as const },
  { key: "view", label: "閲覧", icon: "eye" as const },
];
const title = ref("朝礼");
const fieldDraft = ref("入力途中の会社名 0012345");
const search = ref("");
const store = ref<string | number | null>(1);
const stores = [
  { label: "東京", options: [{ value: 1, label: "渋谷店" }, { value: 2, label: "新宿店" }] },
  { label: "大阪", options: [{ value: 3, label: "梅田店" }] },
];
const manager = ref(true);
const some = ref(false);
const scope = ref<string | number | boolean | null>("next");
const published = ref(true);

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
  <ArUiProvider :design="design" :palette="palette">
    <div class="cat">
      <div class="cat-head">
        <div>
          <h1>ARROW UI カタログ</h1>
          <p>@s_and_a/arrow-ui の部品を、デザイン とテーマ色を替えて確かめる画面です。</p>
        </div>
        <div class="cat-ctrl">
          <label>デザイン
            <select v-model="designId" data-test="design">
              <option value="remix">remix</option>
              <option value="classic">classic（今の見た目）</option>
            </select>
          </label>
          <label>テーマ色
            <select v-model="palette" data-test="palette">
              <option v-for="p in paletteNames" :key="p" :value="p">{{ p }}</option>
            </select>
          </label>
        </div>
      </div>

      <section class="cat-sec" id="screen">
        <h2>画面の例（シフト詳細）</h2>
        <p>配置は製品のレイアウト層、見た目はデザインのライブラリが持ちます。右上でデザインを替えても、並びと動きはそのままです。</p>
        <ArStack :gap="4">
          <ArTabs v-model="pageTab" :items="pageTabs" variant="band" label="表示" />
          <ArCard title="シフト詳細" icon="users" variant="band">
            <template #actions><ArButton tone="ghost" icon="help" label="使い方" /></template>
            <ArStack :gap="5">
              <ArCluster :gap="2">
                <ArTag tone="accent">人件費 ¥31,500</ArTag>
                <ArTag tone="ok" icon="eye">公開中</ArTag>
                <ArTag tone="danger">不足1</ArTag>
                <ArTag tone="event">朝礼</ArTag>
                <ArSwitch v-model="published" label="この日を公開する" on-text="公開" off-text="非公開" />
              </ArCluster>
              <ArTabs v-model="tab" :items="tabs" variant="line" label="詳細" />
              <ArCluster justify="between" :gap="2">
                <ArCluster :gap="2">
                  <ArButton tone="primary" icon="plus">シフト追加</ArButton>
                  <ArButton tone="subtle" icon="yen">日毎人件費</ArButton>
                </ArCluster>
                <ArTextInput v-model="search" icon="search" placeholder="名前で探す" label="名前で探す" />
              </ArCluster>
              <ArTable :columns="columns" :rows="sortedRows" row-key="id" caption="勤務メンバー" :footer="footer" v-model:sort="sort" density="compact" />
              <ArAlert tone="warn" title="勤怠ロック中">10月20日までの勤怠はロックされています。変更は管理者に依頼してください。</ArAlert>
            </ArStack>
          </ArCard>
        </ArStack>
      </section>

      <section class="cat-sec" id="card-footer-layout">
        <h2>カード下部の操作配置</h2>
        <ArStack :gap="4">
          <ArCard v-for="justify in ['start', 'end', 'between'] as const" :key="justify" :title="justify" :data-test="justify">
            フォームの操作
            <template #footer><ArCluster :gap="2" :justify="justify"><ArButton tone="secondary">キャンセル</ArButton><ArButton>保存</ArButton></ArCluster></template>
          </ArCard>
          <ArCard title="縦配置" data-test="stack"><template #footer><ArStack :gap="2"><ArButton>補助操作</ArButton><ArButton>保存</ArButton></ArStack></template></ArCard>
          <ArCard title="格子配置" data-test="grid"><template #footer><ArGrid :columns="2" :gap="2"><ArButton>補助操作</ArButton><ArButton>保存</ArButton></ArGrid></template></ArCard>
          <ArCard title="直接置く操作" data-test="segmented"><template #footer><ArButton>操作1</ArButton><ArButton>操作2</ArButton></template></ArCard>
        </ArStack>
      </section>

      <section class="cat-sec" id="field-responsive">
        <h2>配置幅に合わせる入力欄</h2>
        <ArStack :gap="5">
          <ArField label="会社名" required layout="inline" label-size="lg" help="狭い配置ではラベルを上に移します。" v-slot="field">
            <ArTextInput v-model="fieldDraft" v-bind="field" block />
          </ArField>
          <ArField label="この会社での報酬月額割合(小数点を含めて7桁まで)" required layout="inline" label-size="lg" v-slot="field">
            <ArTextInput v-model="fieldDraft" v-bind="field" block />
          </ArField>
          <ArField label="EmployeeInsuranceIdentifierWithoutWordBreaks" layout="inline" label-size="sm" v-slot="field">
            <ArTextInput v-model="fieldDraft" v-bind="field" block />
          </ArField>
          <div style="width:320px;max-width:100%">
            <ArField label="長い項目名と入力値を省略せずに表示する欄" required layout="inline" label-size="lg" help="PCの狭いカード内でも入力幅を確保します。" v-slot="field">
              <ArTextInput v-model="fieldDraft" v-bind="field" block />
            </ArField>
          </div>
          <div style="width:260px;max-width:100%">
            <ArField label="固定幅の指定がある項目" layout="inline" label-width="70%" error="入力内容を確認してください。" v-slot="field">
              <ArTextInput v-model="fieldDraft" v-bind="field" block />
            </ArField>
          </div>
          <ArField label="ツールバーの項目" layout="toolbar" v-slot="field">
            <ArTextInput v-model="fieldDraft" v-bind="field" />
          </ArField>
        </ArStack>
      </section>

      <section class="cat-sec" id="form">
        <h2>入力（ArTextInput・ArSelect・ArCheckbox・ArRadioGroup・ArSwitch）</h2>
        <p>どれも ArField の中で id とラベルが結ばれる。</p>
        <ArGrid min-item="md" :gap="5">
          <ArField label="タイトル" required>
            <template #default="f"><ArTextInput v-model="title" :id="f.id" /></template>
          </ArField>
          <ArField label="店舗">
            <template #default="f"><ArSelect v-model="store" :id="f.id" :options="stores" placeholder="選んでください" block /></template>
          </ArField>
          <ArField label="時給" help="半角の数字">
            <template #default="f"><ArTextInput model-value="1200" :id="f.id" suffix="円" inputmode="numeric" /></template>
          </ArField>
          <ArField label="権限">
            <template #default><ArCluster :gap="3"><ArCheckbox v-model="manager">店舗管理者</ArCheckbox><ArCheckbox v-model="some" indeterminate>一部の店舗</ArCheckbox><ArCheckbox :model-value="false" disabled>本部</ArCheckbox></ArCluster></template>
          </ArField>
          <ArField label="変更する範囲">
            <template #default><ArRadioGroup v-model="scope" label="変更する範囲" :options="[{ value: 'next', label: '次の回だけ' }, { value: 'after', label: 'これ以降' }, { value: 'all', label: 'すべて' }]" /></template>
          </ArField>
          <ArField label="通知">
            <template #default><ArCluster :gap="3"><ArSwitch v-model="published" label="通知する" /><ArSwitch :model-value="false" label="小さい" size="sm" /><ArSwitch :model-value="true" label="保存中" loading /></ArCluster></template>
          </ArField>
        </ArGrid>
        <ArStack :gap="2" style="margin-top: 16px">
          <ArAlert tone="info">曜日とパターンで決めた時間と人数は、次のページで1日ごとに確認・編集できます。</ArAlert>
          <ArAlert tone="ok" title="取り込みました" closable>32件のシフトを登録しました。</ArAlert>
          <ArAlert tone="danger">エラーの2行は取り込まれません。</ArAlert>
        </ArStack>
      </section>

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

      <section class="cat-sec" id="table-wrap">
        <h2>長い見出しの表</h2>
        <div style="width:320px;max-width:100%">
          <ArTable fit caption="有給休暇の履歴" :columns="[
            { key: 'date', title: '日付', wrap: true },
            { key: 'expiry', title: '使用期限', wrap: true },
            { key: 'days', title: '日数', wrap: true, sortable: true },
            { key: 'type', title: '長い履歴の形態', wrap: true, sortable: true },
            { key: 'actions', title: '編集 / 削除', wrap: true },
          ]" :rows="[{ id: 1, date: '2026年11月21日', expiry: '2028年03月31日', days: '0.5日', type: '自動付与', actions: '表示' }]" row-key="id" />
        </div>
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
