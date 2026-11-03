/** 時刻の入力の読み取り（ArTimeInput の中身。単体で試せるように分けてある）。 */

/**
 * "HH:mm"。空なら null、読めなければ undefined。
 * maxHour はシフトの終わりのように日をまたぐ時刻（例 29:00）を受けるときに 47 などを渡す。
 */
export function parseTime(input: string, maxHour = 23): string | null | undefined {
  const s = input.normalize("NFKC").replace(/\s/g, "").replace("：", ":");
  if (s === "") return null;
  let h: number;
  let m: number;
  const colon = /^(\d{1,2}):(\d{1,2})$/.exec(s);
  if (colon) {
    h = Number(colon[1]);
    m = Number(colon[2]);
  } else if (/^\d{1,4}$/.test(s)) {
    if (s.length <= 2) {
      h = Number(s);
      m = 0;
    } else {
      h = Number(s.slice(0, s.length - 2));
      m = Number(s.slice(-2));
    }
  } else return undefined;
  if (h > maxHour || m > 59) return undefined;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 分を足す（0:00〜23:59 の中で回す）。 */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number) as [number, number];
  const t = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/** "HH:mm" を分にする（24時を越える時刻も読む）。読めなければ null。 */
export function toMinutes(time: string | null | undefined): number | null {
  const m = time ? /^(\d{1,2}):(\d{2})$/.exec(time) : null;
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}
