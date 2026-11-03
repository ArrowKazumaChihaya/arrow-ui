/** ArLayout 1.0 の契約。 */
export interface ArLayoutProps {
  /** 横のメニュー（sider スロット）の幅（px）。 */
  siderWidth?: number;
  /** 横のメニューを右に置く。 */
  siderPlacement?: "start" | "end";
  /** 外側に角丸12と線を付ける（画面の一部に枠として置くとき）。画面全体なら付けない。 */
  bordered?: boolean;
  /** 高さを親いっぱいにする（中身はその中でスクロール）。 */
  fill?: boolean;
}
/** スロット：header（ヘッダー）・sider（横のメニュー）・default（中身）・footer（フッター）。 */
export type ArLayoutPart = "root" | "header" | "sider" | "content" | "footer";
