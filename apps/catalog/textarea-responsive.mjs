import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const [modulePath, executablePath, outputPath, base = "http://127.0.0.1:5192/"] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({ executablePath, headless: true });
fs.mkdirSync(outputPath, { recursive: true });
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    const section = page.locator("#textarea-responsive");
    const memo = section.getByRole("textbox", { name: "メモ", exact: true });
    await memo.fill("改行と先頭0を保持\n0012345");
    const original = await memo.elementHandle();
    for (const design of ["classic", "remix"]) {
      await page.locator('[data-test="design"]').selectOption(design);
      await section.scrollIntoViewIfNeeded();
      assert.equal(await memo.inputValue(), "改行と先頭0を保持\n0012345");
      assert.equal(await memo.evaluate((el, old) => el === old, original), true);
      for (const root of await section.locator('[data-ar="textarea"][data-block]').all()) {
        const size = await root.evaluate(el => ({ width: el.getBoundingClientRect().width, available: el.parentElement.getBoundingClientRect().width, overflow: el.scrollWidth > el.clientWidth + 1 }));
        assert.ok(Math.abs(size.width - size.available) <= 1, `${design}/${width}: ${JSON.stringify(size)}`);
        assert.equal(size.overflow, false);
      }
      assert.equal(await section.getByRole("textbox", {name: "既定幅のメモ", exact: true}).locator("..").getAttribute("data-block"), null);
      await section.screenshot({ path: path.join(outputPath, `textarea-${design}-${width}.png`) });
      console.log(`Textarea width: ${design}, ${width}px`);
    }
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
