/** 時刻の入力の読み取り（ArTimeInput の中身。単体で試せるように分けてある）。 */

/** "HH:mm"。空なら null、読めなければ undefined。 */
export function parseTime(input: string): string | null | undefined {
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
  if (h > 23 || m > 59) return undefined;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 分を足す（0:00〜23:59 の中で回す）。 */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number) as [number, number];
  const t = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}
