---
"@s_and_a/arrow-ui": patch
"@s_and_a/arrow-ui-design-remix": patch
---

ヘッダー・ログインを案に合わせた続きの直し。ArAppHeader：domain-style="menu" のとき spacer を常に出し（領域のない画面でもお知らせ・やることが右に寄る）、メニューの文字の太さが変わっても幅が動かないようにし、領域の切り替えに icon を出せるようにし、お知らせの丸が二重に見える指定を直した。remix：ホバーで色だけが変わるようにし、スマホの領域切替を2×2のアイコン（apps）にし、プルダウン（ArDropdown・ArSelect・ArTreeSelect・ArCascader）をすべて給与計算のメニューと同じ板と行にした。ArTour の × を押しやすくし、ArDescriptions のラベルを上下中央にし、ArAutoComplete の候補の幅を入力の幅（最大480px）にし、ArTimeInput（remix）は4桁そろったら確定して次の入力へ移り、ArTable は入力できる表の操作の列の幅を常に取り、board の2行目以降の行を低くし、ArPayslip に layout="wide"（スマホで横長の明細を縮めて出す）を足し、メニュー画面を PC でも中央の1枚の札にした。
