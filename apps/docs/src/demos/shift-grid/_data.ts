// シフトのテーブル（ArShiftGrid）の見本のデータ。シフトキャンバス（Remix.dc.html）の 2026年10月と同じ人・パターン・イベント。
// 製品の側の役目（イベントを受けてデータを書き換え、元に戻す履歴を持つ）も、ここで簡単に再現する。
import { computed, ref } from "vue";
import type { ArShiftGridCell, ArShiftGridDay, ArShiftGridMember, ArShiftGridPattern, ArShiftGridRange, ArShiftGridSpot, ArShiftGridTime } from "@arrow/ui";

const H = (h: number) => Math.round(h * 60);
const pad = (n: number) => String(n).padStart(2, "0");
export const TODAY = "2026-10-20";
export const LOCK = 15;

export const patterns: ArShiftGridPattern[] = [
  { key: "p1", name: "通常勤務1", color: "#4C5FC4", times: [{ start: H(9), end: H(18) }], breaks: [{ start: H(12), end: H(13) }] },
  { key: "p2", name: "通常勤務2", color: "#D2483F", times: [{ start: H(13), end: H(22) }], breaks: [{ start: H(17), end: H(18) }] },
  { key: "p3", name: "早番", color: "#449B47", times: [{ start: H(7), end: H(16) }], breaks: [{ start: H(11), end: H(12) }] },
  { key: "p4", name: "遅番", color: "#7146C3", times: [{ start: H(15), end: H(24) }], breaks: [{ start: H(19), end: H(20) }] },
];
const P = Object.fromEntries(patterns.map((p) => [p.key, p]));

const BASE = [
  ["ch", "千速 一真"],
  ["su", "末永 修也"],
  ["ni", "新里 匠"],
  ["na", "中口 万由香"],
  ["ma", "松田 照恵"],
];
const MORE = ["青木 美咲", "石田 蓮", "上野 結衣", "江口 大和", "大野 杏", "加藤 陽向", "木村 凛", "久保 悠真", "小池 さくら", "斎藤 湊", "佐野 心春", "清水 蒼", "杉山 楓", "高橋 樹", "田中 芽依", "土屋 颯", "中村 葵", "西田 海斗", "野口 莉子", "橋本 優斗", "原田 陽菜", "藤井 翔", "前田 紬", "森 悠人", "山口 結菜"];

const EVC: Record<string, string> = { 朝礼: "#2196F3", 棚卸し: "#E58500", 店長会議: "#7146C3" };
const NEED: Record<number, number> = { 13: 5, 21: 4, 25: 5, 26: 4, 27: 5 };
const AV: Record<number, [string, ArShiftGridTime[], string][]> = {
  20: [["na", [{ start: H(13), end: H(21) }], ""], ["ma", [{ start: H(9), end: H(12) }, { start: H(17), end: H(22) }], "昼と夜に分けて入れます"]],
  21: [["na", [{ start: H(10), end: H(15) }], "午後は通院のため早めに上がりたいです"], ["ma", [{ start: H(17), end: H(22) }], "夜なら入れます"]],
  24: [["ch", [{ start: H(9), end: H(18) }], ""]],
  25: [["su", [{ start: H(13), end: H(22) }], "どちらでも大丈夫です"], ["ni", [{ start: H(9), end: H(13) }], ""]],
  30: [["na", [{ start: H(9), end: H(18) }], ""]],
};

const ofPattern = (k: string): ArShiftGridCell => ({ pattern: k, times: P[k]!.times, breaks: P[k]!.breaks });

/** 1人の1日の最初のシフト（キャンバスの base と同じ並び）。 */
function base(key: string, i: number, d: number): ArShiftGridCell | undefined {
  if (key === "ni" && [16, 20, 21, 22].includes(d)) return { times: [{ start: H(9), end: H(12) }, { start: H(17), end: H(21) }] };
  if (key === "su" && d === 9) return { times: [{ start: H(10), end: H(19) }], breaks: [{ start: H(12), end: H(13) }] };
  if (key === "na" && d === 22) return { leave: true };
  if (key === "ma" && d === 28) return { times: [{ start: H(17.5), end: H(22) }] };
  const w = (d + i * 3) % 7;
  if (w === 5 || w === 6) return undefined;
  const c = ofPattern((d + i) % 3 === 0 ? "p2" : "p1");
  if (d < 20) c.punches = [{ start: c.times![0]!.start - 5, end: c.times![0]!.end + 2 }];
  return c;
}

export function makeData(opts: { crowd?: boolean; from?: number; to?: number } = {}) {
  const people = opts.crowd ? [...BASE, ...MORE.map((n, i) => [`x${i}`, n])] : BASE;
  const members: ArShiftGridMember[] = people.map(([key, name], i) => ({ key: key!, name: name!, code: `S${1001 + i}` }));
  const cells: Record<string, Record<string, ArShiftGridCell | undefined>> = {};
  people.forEach(([key], i) => {
    cells[key!] = {};
    for (let d = 1; d <= 31; d++) {
      const date = `2026-10-${pad(d)}`;
      const c = base(key!, i, d);
      const av = (AV[d] ?? []).find((a) => a[0] === key);
      cells[key!]![date] = av && !c ? { avail: { times: av[1], note: av[2] } } : c;
    }
  });
  const from = opts.from ?? 1;
  const to = opts.to ?? 31;
  const days: ArShiftGridDay[] = [];
  for (let d = from; d <= to; d++) {
    const wd = (d - 1 + 4) % 7; // 2026/10/1 は木曜
    const ev: { name: string; color: string; time: string }[] = [];
    if (wd === 1 || wd === 5) ev.push({ name: "朝礼", color: EVC["朝礼"]!, time: "09:00〜09:15" });
    if (d === 13) ev.push({ name: "棚卸し", color: EVC["棚卸し"]!, time: "終日" });
    if (d === 27) ev.push({ name: "店長会議", color: EVC["店長会議"]!, time: "15:00〜16:00" });
    days.push({
      date: `2026-10-${pad(d)}`,
      holiday: d === 12,
      locked: d <= LOCK,
      unpublished: d >= 26,
      events: ev,
      need: d >= 20 ? (NEED[d] ?? 3) * (opts.crowd ? 6 : 1) : undefined,
    });
  }
  return { members, cells, days };
}

/** 製品の役目：イベントを受けてマスを書き換え、元に戻す・やり直すの履歴を持つ。 */
export function useShiftGridDemo(opts: { crowd?: boolean; from?: number; to?: number } = {}) {
  const init = makeData(opts);
  const members = ref(init.members);
  const cells = ref(init.cells);
  const days = ref(init.days);
  const hist: string[] = [];
  const fut: string[] = [];
  const log = ref("");
  const snap = () => JSON.stringify(cells.value);
  const locked = (date: string) => Number(date.slice(8)) <= LOCK;
  function put(changes: [string, string, ArShiftGridCell | undefined][], msg: string) {
    const ok = changes.filter(([, date]) => !locked(date));
    if (!ok.length) {
      log.value = "勤怠ロック中の日は変更できません";
      return;
    }
    hist.push(snap());
    fut.length = 0;
    const next = JSON.parse(snap());
    for (const [k, date, v] of ok) next[k][date] = v;
    cells.value = next;
    log.value = msg.replace("%n", String(ok.length));
  }
  const at = (k: string | number, date: string) => cells.value[String(k)]?.[date];
  const each = (r: ArShiftGridRange, fn: (k: string, date: string, ri: number, ci: number) => void) =>
    r.members.forEach((k, ri) => r.dates.forEach((date, ci) => fn(String(k), date, ri, ci)));
  const memberWork = computed(() =>
    Object.fromEntries(
      members.value.map((m) => {
        let min = 0;
        let wd = 0;
        for (const d of days.value) {
          const c = at(m.key, d.date);
          if (c?.times?.length) {
            wd++;
            min += c.times.reduce((a, t) => a + t.end - t.start, 0) - (c.breaks ?? []).reduce((a, t) => a + t.end - t.start, 0);
          }
        }
        return [m.key, { minutes: min, workDays: wd, offDays: days.value.length - wd }];
      }),
    ),
  );
  const shownMembers = computed(() => members.value.map((m) => ({ ...m, ...memberWork.value[m.key] })));
  const on = {
    copy: (r: ArShiftGridRange) => (log.value = `${r.members.length * r.dates.length}マスをコピーしました`),
    cut: (r: ArShiftGridRange) => (log.value = `${r.members.length * r.dates.length}マスを切り取りました`),
    paste: ({ mode, source, target }: { mode: "copy" | "cut"; source: ArShiftGridRange; target: ArShiftGridRange }) => {
      const h = source.members.length;
      const w = source.dates.length;
      const ch: [string, string, ArShiftGridCell | undefined][] = [];
      if (mode === "cut") each(source, (k, date) => ch.push([k, date, undefined]));
      each(target, (k, date, ri, ci) => ch.push([k, date, at(source.members[ri % h]!, source.dates[ci % w]!)]));
      put(ch, "%n件に貼り付けました");
    },
    delete: (r: ArShiftGridRange) => {
      const ch: [string, string, ArShiftGridCell | undefined][] = [];
      each(r, (k, date) => ch.push([k, date, undefined]));
      put(ch, "%n件のシフトを削除しました");
    },
    autofill: ({ source, target }: { source: ArShiftGridRange; target: ArShiftGridRange }) => {
      const h = source.members.length;
      const w = source.dates.length;
      const ch: [string, string, ArShiftGridCell | undefined][] = [];
      each(target, (k, date, ri, ci) => ch.push([k, date, at(source.members[ri % h]!, source.dates[ci % w]!)]));
      put(ch, "オートフィルで%n件に反映しました");
    },
    undo: () => {
      const s = hist.pop();
      if (!s) return (log.value = "操作の履歴がありません");
      fut.push(snap());
      cells.value = JSON.parse(s);
      log.value = "元に戻しました";
    },
    redo: () => {
      const s = fut.pop();
      if (!s) return (log.value = "これより先の操作がありません");
      hist.push(snap());
      cells.value = JSON.parse(s);
      log.value = "やり直しました";
    },
    patternDrop: ({ pattern, targets }: { pattern: ArShiftGridPattern; targets: ArShiftGridSpot[] }) =>
      put(targets.map((t) => [String(t.member), t.date, ofPattern(String(pattern.key))]), `「${pattern.name}」を%n件に置きました`),
    chartMove: ({ from, to, cell }: { from: ArShiftGridSpot; to: ArShiftGridSpot; cell: ArShiftGridCell }) =>
      put([[String(from.member), from.date, undefined], [String(to.member), to.date, cell]], "シフトを移しました"),
    chartChange: (p: ArShiftGridSpot & { cell: ArShiftGridCell; times: ArShiftGridTime[]; breaks: ArShiftGridTime[] }) =>
      put([[String(p.member), p.date, { times: p.times, breaks: p.breaks }]], "シフトの時間を変えました"),
    chartCreate: (p: ArShiftGridSpot & { time: ArShiftGridTime }) => put([[String(p.member), p.date, { times: [p.time] }]], "シフトを追加しました"),
    refuse: ({ reason }: { reason: string }) =>
      (log.value = reason === "locked" ? "勤怠ロック中の日には移せません" : reason === "occupied" ? "その日にはすでにシフトがあります" : "このマスは変えられません"),
    reorder: ({ keys }: { keys: (string | number)[] }) => {
      members.value = keys.map((k) => members.value.find((m) => m.key === k)!);
      log.value = "並べ替えました";
    },
  };
  return { members: shownMembers, cells, days, log, on };
}
