// ビルドした JS と CSS を1枚の HTML（Artifact に出すページ）にまとめる。
import fs from "node:fs";
const dist = new URL("./dist/", import.meta.url);
const js = fs.readFileSync(new URL("docs.js", dist), "utf8");
const css = fs.readFileSync(new URL("docs.css", dist), "utf8");
const html = `<title>ARROW UI</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="ARROW シリーズ共通の Vue 3 部品と、着せ替えられるデザインのライブラリ（remix・classic）の説明">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css.replaceAll("</style", "<\\/style")}</style>
<div id="app"></div>
<script type="module">${js.replaceAll("</script", "<\\/script")}</script>
`;
fs.writeFileSync(new URL("arrow-ui-docs.html", dist), html);
console.log(`arrow-ui-docs.html ${Math.round(html.length / 1024)} KB`);
