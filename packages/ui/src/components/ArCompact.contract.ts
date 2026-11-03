/** ArCompact 1.0 の契約。 */
export interface ArCompactProps {
  /** 並べる向き。 */
  direction?: "horizontal" | "vertical";
  /** 親の幅いっぱい（中の最後の部品が残りを取る）。 */
  block?: boolean;
  /** まとまりの読み上げの名前（ボタンの組など）。渡すと role="group"。 */
  label?: string;
}
export type ArCompactPart = "root";
