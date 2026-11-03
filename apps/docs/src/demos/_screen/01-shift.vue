<!-- 画面の例：シフト（PC） | 部品だけで組み立てたシフトの画面。並べ方と余白は製品のレイアウト層（このファイルの CSS）、見た目はデザインのライブラリが持つ。右上で見た目を替えても、並びと動きは同じ。 -->
<script setup lang="ts">
import {
  ArAppFooter,
  ArAppHeader,
  ArButton,
  ArCalendar,
  ArCard,
  ArDaySummary,
  ArDivider,
  ArDropdown,
  ArEmpty,
  ArField,
  ArPeriodNav,
  ArSectionHead,
  ArSegmented,
  ArSelect,
  ArTable,
  ArTabs,
  ArTag,
  ArViewOptions,
  type ArAppNavItem,
  type ArCalendarCellMarks,
  type ArCalendarEvent,
  type ArMenuItem,
  type ArTableColumn,
  type ArViewOptionGroup,
} from "@arrow/ui";
import { computed, ref } from "vue";

const logo = new URL("../_assets/arrow-logo.svg", import.meta.url).href;

/* 頭 */
const menus: ArAppNavItem[] = [
  { key: "shift", label: "シフト", icon: "cal", palette: "blue" },
  { key: "attendance", label: "勤怠", icon: "brief", palette: "green" },
  { key: "payment", label: "給与賞与報酬年調", icon: "calc", palette: "yellow" },
  { key: "document", label: "書類集計", icon: "files", palette: "pink" },
  { key: "notification", label: "通知", icon: "speaker", palette: "orange" },
];
const menusEnd: ArAppNavItem[] = [
  { key: "company", label: "会社情報", icon: "bld", palette: "teal" },
  { key: "employee", label: "社員情報", icon: "users", palette: "teal" },
  { key: "config", label: "設定", icon: "gear", palette: "teal" },
];

/* 左：シフトカレンダー */
const view = ref("calendar");
const views = [
  { key: "calendar", label: "カレンダー", icon: "cal" as const },
  { key: "table", label: "テーブル", icon: "grid" as const },
  { key: "view", label: "閲覧", icon: "eye" as const },
];
const month = ref("2026-10");
const monthLabel = computed(() => `${month.value.slice(0, 4)}年${Number(month.value.slice(5))}月`);
function shiftMonth(n: number) {
  const [y, m] = month.value.split("-").map(Number) as [number, number];
  const t = y * 12 + (m - 1) + n;
  month.value = `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}
const store = ref<string | number | null>("arrow");
const stores = [
  { value: "arrow", label: "ARROW事業部" },
  { value: "shibuya", label: "渋谷店" },
  { value: "shinjuku", label: "新宿店" },
];
const ops: ArMenuItem[] = [
  { key: "g1", type: "group", label: "登録する", children: [
    { key: "recruit", label: "シフト募集", icon: "mega", description: "従業員に希望シフトを出してもらう" },
    { key: "bulk", label: "シフト一括登録", icon: "layers", description: "複数の日・人へパターンでまとめて登録" },
    { key: "excel", label: "Excel登録", icon: "sheet", description: "Excelファイルから読み込む" },
  ] },
  { key: "g2", type: "group", label: "見る・出力する", children: [
    { key: "print", label: "シフト表(印刷用)", icon: "print", description: "印刷用のシフト表を作る" },
    { key: "summary", label: "シフトサマリー", icon: "chart", description: "日ごと・人ごとの人数と時間" },
  ] },
  { key: "hr", type: "divider" },
  { key: "del", label: "シフト一括削除", icon: "trash", danger: true, description: "期間と人を選んでまとめて削除" },
];

const day = ref<string | null>("2026-10-21");
const TODAY = "2026-10-20";
const d = (n: number) => `2026-10-${String(n).padStart(2, "0")}`;
const COLORS = { 朝礼: "#2196F3", 棚卸し: "#E58500", 店長会議: "#7146C3" } as const;
const events: ArCalendarEvent[] = [
  ...[2, 5, 9, 12, 16, 19, 23, 26, 30].map((n) => ({ date: d(n), label: "朝礼", color: COLORS["朝礼"] })),
  { date: d(13), label: "棚卸し", color: COLORS["棚卸し"] },
  { date: d(27), label: "店長会議", color: COLORS["店長会議"] },
];
const people: Record<number, number> = { 1: 4, 2: 4, 3: 3, 4: 4, 5: 4, 6: 3, 7: 3, 8: 4, 9: 5, 10: 3, 11: 4, 12: 4, 13: 3, 14: 3, 15: 4, 16: 4, 17: 3, 18: 4, 19: 4, 20: 4, 21: 4, 22: 3, 23: 4, 24: 3, 25: 4, 26: 4, 27: 3, 28: 4, 29: 4, 30: 4, 31: 3 };
const submitted: Record<number, number> = { 20: 2, 21: 2, 24: 1, 25: 2, 30: 1 };
const short: Record<number, number> = { 25: 1, 27: 2 };
const LOCK = 15;
const marks = (date: string): ArCalendarCellMarks | undefined => {
  const n = Number(date.slice(8));
  if (date.slice(0, 7) !== "2026-10") return undefined;
  return { locked: n <= LOCK, unpublished: n >= 26, alert: !!short[n] };
};
const calShown = ref(["cnt", "short", "sub", "ev", "lk", "pub"]);
const calOptions: ArViewOptionGroup[] = [
  { label: "店舗・日ごと（人数・不足・イベント）", options: [
    { key: "cnt", label: "人数", description: "その日のシフトの人数", sample: { text: "4名", color: "#4A5562" } },
    { key: "short", label: "不足", description: "募集人数に足りない人数", sample: { text: "不足1", background: "#FDECEA", color: "#B4231C" } },
    { key: "ev", label: "イベント", description: "色の点と名前", sample: { text: "● 朝礼", color: "#7146C3" } },
  ] },
  { label: "従業員から", options: [
    { key: "sub", label: "提出", description: "希望シフトを出した人数", sample: { text: "提出2", background: "#E3F4EA", color: "#1E7A4C" } },
  ] },
  { label: "状態", options: [
    { key: "lk", label: "ロック中", description: "斜線の地と右上の鍵", sample: { icon: "lock", background: "repeating-linear-gradient(135deg,#F7F9FB 0 3px,#E3E8EE 3px 6px)", color: "#8592A0", ring: "inset 0 0 0 1px #E3E8EE" } },
    { key: "pub", label: "非公開", description: "左上に目の印", sample: { icon: "eyeoff", background: "#F7F9FB", color: "#8592A0", ring: "inset 0 0 0 1px #E6EBF0" } },
  ] },
];
const calEvents = computed(() => (calShown.value.includes("ev") ? events : []));
const calMarks = (date: string) => {
  const m = marks(date);
  return m && { locked: calShown.value.includes("lk") && m.locked, unpublished: calShown.value.includes("pub") && m.unpublished, alert: calShown.value.includes("short") && m.alert };
};

/* 右：シフト詳細 */
const dayNum = computed(() => Number((day.value ?? TODAY).slice(8)));
const WD = ["日", "月", "火", "水", "木", "金", "土"];
const wd = computed(() => new Date(2026, 9, dayNum.value).getDay());
function moveDay(n: number) {
  const t = Math.min(31, Math.max(1, dayNum.value + n));
  day.value = d(t);
}
const published = ref(true);
const mode = ref("time");

type Member = { id: number; name: string; pattern: string; color: string; start: string[]; end: string[]; in: string; out: string; bs: string; be: string };
const members: Member[] = [
  { id: 0, name: "千速 一真", pattern: "通常勤務2", color: "#D2483F", start: ["13:00"], end: ["22:00"], in: "", out: "", bs: "17:00", be: "18:00" },
  { id: 1, name: "末永 修也", pattern: "通常勤務1", color: "#4C5FC4", start: ["09:00"], end: ["18:00"], in: "", out: "", bs: "12:00", be: "13:00" },
  { id: 2, name: "新里 匠", pattern: "パターンなし", color: "#A9AFB6", start: ["09:00", "17:00"], end: ["12:00", "21:00"], in: "", out: "", bs: "", be: "" },
  { id: 3, name: "中口 万由香", pattern: "通常勤務2", color: "#D2483F", start: ["13:00"], end: ["22:00"], in: "", out: "", bs: "17:00", be: "18:00" },
];
const memberCols: ArTableColumn<Member>[] = [
  { key: "name", title: "名前", width: 140, avatar: (r) => ({ seed: r.id }), sub: (r) => ({ text: r.pattern, color: r.color }), sortable: true },
  { key: "start", title: "開始", width: 78, emphasis: "strong", numeric: true, align: "start", sortable: true },
  { key: "end", title: "終了", width: 78, emphasis: "strong", numeric: true, align: "start", sortable: true },
  { key: "in", title: "出勤", width: 102, sortable: true },
  { key: "out", title: "退勤", width: 102, sortable: true },
  { key: "bs", title: "休始", width: 102, emphasis: "muted", numeric: true, align: "start", sortable: true },
  { key: "be", title: "休終", width: 102, emphasis: "muted", numeric: true, align: "start", sortable: true },
];
const memberFoot = { name: { label: "出勤", value: "4名" }, start: { label: "シフト合計", value: "31時間00分", span: 2 }, in: { label: "打刻合計", value: "—", span: 2 } };
const memberShown = ref(["av", "pat", "sCnt", "sShift", "sPunch", "short"]);
const memberOptions: ArViewOptionGroup[] = [
  { label: "名前の列", options: [
    { key: "av", label: "サムネ", description: "頭文字の丸（写真があれば写真）", sample: { text: "千", background: "#E3EEFA", color: "#1F5F99" } },
    { key: "code", label: "社員コード", description: "名前の上に小さく", sample: { text: "S1001", background: "#F3F6F9", color: "#7B8794" } },
    { key: "pat", label: "パターン", description: "名前の下に色の点とパターン名", sample: { text: "通常勤務1", background: "#EEF1FB", color: "#4C5FC4" } },
  ] },
  { label: "表の下", options: [
    { key: "sCnt", label: "出勤人数", description: "合計の行：その日の人数", sample: { text: "3名", background: "#F7F9FB", color: "#1F2933", ring: "inset 0 0 0 1px #E6EBF0" } },
    { key: "sShift", label: "シフト合計", description: "合計の行：開始〜終了の下", sample: { text: "24時間", background: "#F7F9FB", color: "#1F2933", ring: "inset 0 0 0 1px #E6EBF0" } },
    { key: "sPunch", label: "打刻合計", description: "合計の行：出勤〜退勤の下（時間帯のとき）", sample: { text: "23時間", background: "#F7F9FB", color: "#1F2933", ring: "inset 0 0 0 1px #E6EBF0" } },
    { key: "short", label: "不足のお知らせ", description: "募集人数に足りないとき、表の下の右に", sample: { text: "不足1名", background: "#FDECEA", color: "#B4231C" } },
  ] },
];

type Avail = { id: number; name: string; tone: "purple" | "yellow"; start: string[]; end: string[]; note: string; added: boolean };
const avails: Avail[] = [
  { id: 3, name: "中口 万由香", tone: "purple", start: ["10:00"], end: ["15:00"], note: "午後は通院のため早めに上がりたいです", added: true },
  { id: 4, name: "松田 照恵", tone: "yellow", start: ["10:00", "17:00"], end: ["13:00", "22:00"], note: "昼と夜に分けて入れます", added: false },
];
const availCols: ArTableColumn<Avail>[] = [
  { key: "name", title: "名前", width: 192, avatar: (r) => ({ tone: r.tone }) },
  { key: "start", title: "開始", width: 60, emphasis: "strong", numeric: true, align: "start" },
  { key: "end", title: "終了", width: 60, emphasis: "strong", numeric: true, align: "start" },
  { key: "note", title: "備考", emphasis: "note" },
];
const availOpen = ref(true);
const availShown = ref(["av", "time", "note"]);
const availOptions: ArViewOptionGroup[] = [
  { options: [
    { key: "av", label: "サムネ", description: "頭文字の丸（写真があれば写真）", sample: { text: "千", background: "#E3EEFA", color: "#1F5F99" } },
    { key: "code", label: "社員コード", description: "名前の上に小さく", sample: { text: "S1001", background: "#F3F6F9", color: "#7B8794" } },
    { key: "time", label: "希望の時間", description: "開始と終了" },
    { key: "note", label: "備考", description: "従業員が書いたひとこと" },
  ] },
];

const footLinks = [
  { key: "guide", label: "ご利用ガイド" },
  { key: "terms", label: "利用規約" },
  { key: "law", label: "特定商取引法" },
  { key: "movie", label: "操作説明動画" },
  { key: "help", label: "ヘルプ" },
];
const supports = [
  { key: "report", label: "問題報告・ご意見", icon: "bug" as const },
  { key: "tel", label: "03-5656-8348", icon: "phone" as const },
  { key: "mail", label: "お問い合わせ", icon: "mail" as const },
];
</script>

<template>
  <div class="shift-screen">
    <ArAppHeader
      :menus="menus"
      :menus-end="menusEnd"
      current="shift"
      :pills="[
        { key: 'notice', label: 'システムからのお知らせ', count: 5, icon: 'speaker', tone: 'notice' },
        { key: 'todo', label: 'やることリスト', count: 3, icon: 'todo', tone: 'todo' },
      ]"
      :account="{ label: '管理ページ', initial: '管' }"
      :account-menu="[
        { key: 'status', label: '契約状況' },
        { key: 'personal', label: '個人ページ' },
        { key: 'logout', label: 'ログアウト' },
      ]"
    >
      <template #logo><img :src="logo" alt="ARROW" /></template>
    </ArAppHeader>

    <main class="shift-main">
      <ArCard title="シフトカレンダー" icon="cal" variant="band">
        <template #tabs><ArTabs v-model="view" variant="band" :items="views" label="表示の切り替え" /></template>
        <div class="shift-col">
          <ArPeriodNav
            :label="monthLabel"
            pickable
            today-label="今日"
            :today-disabled="month === '2026-10'"
            :labels="{ prev: '前の月', next: '次の月', pick: '年月を選ぶ' }"
            @prev="shiftMonth(-1)"
            @next="shiftMonth(1)"
            @today="month = '2026-10'"
          />
          <ArDivider class="shift-bleed" subtle bleed />
          <div class="shift-bar">
            <ArField label="店舗" layout="toolbar" v-slot="f">
              <ArSelect v-bind="f" v-model="store" :options="stores" variant="selbox" icon="store" />
            </ArField>
            <ArDropdown :items="ops" variant="ops" icon="hand2" label="操作" placement="bottom-end" :width="286" />
          </div>
          <ArCalendar
            v-model="day"
            v-model:month="month"
            variant="board"
            :show-header="false"
            weekend-colors
            :today="TODAY"
            :events="calEvents"
            :cell-marks="calMarks"
            label="シフトのカレンダー"
          >
            <template #cell="c">
              <ArTag v-if="calShown.includes('short') && short[c.day] && c.month === 10" tone="danger" size="xs">不足{{ short[c.day] }}</ArTag>
              <ArTag v-if="calShown.includes('sub') && submitted[c.day] && c.month === 10" tone="ok" size="xs">提出{{ submitted[c.day] }}</ArTag>
              <span v-if="calShown.includes('cnt') && c.month === 10">{{ people[c.day] }}名</span>
            </template>
          </ArCalendar>
          <div class="shift-legend">
            <ArViewOptions v-model="calShown" :groups="calOptions" label="カレンダーに表示" title="カレンダーに出すもの" placement="top-start" />
          </div>
        </div>
      </ArCard>

      <ArCard title="シフト詳細" icon="users" variant="band">
        <div class="shift-col">
          <ArPeriodNav
            :label="`10月${dayNum}日`"
            :weekday="WD[wd]"
            :weekday-tone="wd === 0 ? 'sun' : wd === 6 ? 'sat' : undefined"
            size="lg"
            :labels="{ prev: '前の日', next: '次の日', pick: '日を選ぶ' }"
            @prev="moveDay(-1)"
            @next="moveDay(1)"
          />
          <ArDaySummary class="shift-summary" :items="[{ label: '人件費', value: '¥36,300' }]" v-model:published="published" />

          <section class="shift-section">
            <ArSectionHead title="勤務メンバー" icon="users" count="4名">
              <template #actions><ArButton tone="subtle" icon="calc">日毎人件費</ArButton></template>
              <template #end>
                <ArField label="表示モード" layout="toolbar">
                  <ArSegmented
                    v-model="mode"
                    label="表示モード"
                    :options="[{ value: 'time', label: '時間帯' }, { value: 'note', label: '備考', count: 2 }, { value: 'chart', label: 'チャート' }]"
                  />
                </ArField>
              </template>
            </ArSectionHead>
            <ArTable :columns="memberCols" :rows="members" row-key="id" caption="勤務メンバー" variant="board" :footer="memberFoot">
              <template #before-rows><ArButton tone="dashed" block icon="plus">シフト追加</ArButton></template>
              <template #actions="{ row }">
                <ArButton tone="muted" size="sm" icon="pen" :label="`${row.name}を変更`" />
                <ArButton tone="muted" size="sm" icon="trash" :label="`${row.name}を削除`" />
              </template>
              <template #below>
                <ArViewOptions v-model="memberShown" :groups="memberOptions" title="勤務メンバーの表に出すもの" placement="top-start" />
              </template>
            </ArTable>
          </section>

          <ArDivider class="shift-rule" subtle />

          <section class="shift-section">
            <ArSectionHead v-model:open="availOpen" title="勤務可能な人" icon="inbox" count="2名" collapsible controls="shift-avail" />
            <div v-show="availOpen" id="shift-avail">
              <ArTable :columns="availCols" :rows="avails" row-key="id" caption="勤務可能な人" variant="board">
                <template #actions="{ row }">
                  <ArButton v-if="row.added" tone="subtle" size="xs" icon="plus" disabled>登録済み</ArButton>
                  <ArButton v-else tone="subtle" size="xs" icon="plus">シフトに入れる</ArButton>
                  <ArButton tone="muted" size="sm" icon="eyeoff" :label="`${row.name}を隠す`" />
                </template>
                <template #below>
                  <ArViewOptions v-model="availShown" :groups="availOptions" title="勤務可能な人の表に出すもの" placement="top-start" />
                </template>
              </ArTable>
            </div>
          </section>

          <ArDivider class="shift-rule" subtle />

          <section class="shift-section">
            <ArSectionHead title="イベント" icon="note" count="0件">
              <template #actions><ArButton tone="subtle" icon="repeat">繰り返しイベント</ArButton></template>
            </ArSectionHead>
            <ArButton tone="dashed" block icon="plus">イベント追加</ArButton>
            <ArEmpty text="この日のイベントはまだありません" size="sm" />
          </section>
        </div>
      </ArCard>
    </main>

    <ArAppFooter :links="footLinks" :supports="supports" copyright="Copyright ©2019 S&amp;A Co.,Ltd All rights reserved." />
  </div>
</template>

<style scoped>
/* 製品のレイアウト層にあたる：並べ方と余白だけ */
.shift-screen { min-width: 1440px; background: var(--ar-color-bg); }
.shift-main { display: grid; grid-template-columns: 2fr 3fr; align-items: start; gap: 24px; padding: 26px 32px 0; }
.shift-col { display: flex; flex-direction: column; }
.shift-screen .shift-col > .shift-bleed { margin-block: 14px; }
.shift-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.shift-legend { margin-top: 12px; }
.shift-summary { margin-top: 12px; }
.shift-section { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.shift-screen .shift-col > .shift-rule { margin: 28px 0 0; }
.shift-col > .shift-rule + .shift-section { margin-top: 28px; }
</style>
