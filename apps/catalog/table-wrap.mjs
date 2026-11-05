import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const [modulePath, executablePath, outputPath, base = "http://127.0.0.1:5190/"] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({ executablePath, headless: true });
fs.mkdirSync(outputPath, { recursive: true });
try {
  const page = await browser.newPage();
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    const section = page.locator('#table-wrap');
    const table = section.getByRole('table');
    const original = await table.elementHandle();
    for (const design of ['classic', 'remix']) {
      await page.locator('[data-test="design"]').selectOption(design);
      await section.scrollIntoViewIfNeeded();
      assert.equal(await table.evaluate((el, before) => el === before, original), true);
      assert.equal(await table.locator('th').count(), 5);
      for (const header of await table.locator('th').all()) {
        const result = await header.evaluate(el => {
          const bounds = el.getBoundingClientRect();
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const failures = [];
          let node;
          while ((node = walker.nextNode())) {
            if (!node.textContent.trim()) continue;
            const range = document.createRange(); range.selectNodeContents(node);
            for (const rect of range.getClientRects()) {
              if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1) failures.push(node.textContent);
            }
          }
          return failures;
        });
        assert.deepEqual(result, [], `${width}/${design}: heading must fit`);
      }
      await section.getByRole('button', { name: '日数', exact: true }).click();
      assert.ok(await table.locator('th[aria-sort]').count());
      await section.screenshot({ path: path.join(outputPath, `table-wrap-${design}-${width}.png`) });
      console.log(`Table heading wrap: ${design}, ${width}px`);
    }
  }
} finally { await browser.close(); }
