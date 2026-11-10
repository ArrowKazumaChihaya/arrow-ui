---
"@s_and_a/arrow-ui": patch
"@s_and_a/arrow-ui-design-remix": patch
"@s_and_a/arrow-ui-design-classic": patch
---

使いやすさの修正。ArTable は row-click を受けている表だけ行に data-clickable を付け、remix・classic で指のカーソルにする（行を押せることが分かる）。remix の淡い地の上の文字色 accent-ink（緑・黄・橙・青緑・集計）を、同じ色の accent-muted の上でも 4.5:1 を超える濃さにする（テーマ色 accent と on-accent は変更なし）。remix はキーボード操作時の枠に、テーマ色の濃い実線の outline を重ねる（文字入力は対象外）。
