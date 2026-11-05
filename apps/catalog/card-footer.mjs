import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const [modulePath, executablePath, outputPath, base = "http://127.0.0.1:5190/"] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({ executablePath, headless: true });
fs.mkdirSync(outputPath, { recursive: true });
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto(base, { waitUntil: "networkidle" });
    const section = page.locator("#card-footer-layout");
    for (const design of ["classic", "remix"]) {
      await page.locator('[data-test="design"]').selectOption(design);
      await page.waitForFunction(d => document.querySelector('[data-ar-design]')?.getAttribute('data-ar-design') === d, design);
      for (const justify of ["start", "end", "between"]) {
        const group = section.locator(`[data-test="${justify}"] [data-ar="cluster"]`);
        const bounds = await group.evaluate(el => ({
          group: el.getBoundingClientRect().toJSON(),
          first: el.firstElementChild.getBoundingClientRect().toJSON(),
          last: el.lastElementChild.getBoundingClientRect().toJSON(),
        }));
        if (justify !== "end") assert.ok(Math.abs(bounds.first.left - bounds.group.left) < 2, `${design}/${width}/${justify}: first action`);
        if (justify !== "start") assert.ok(Math.abs(bounds.last.right - bounds.group.right) < 2, `${design}/${width}/${justify}: last action`);
      }
      for (const kind of ["stack", "grid"]) {
        const group = section.locator(`[data-test="${kind}"] [data-ar="${kind}"]`);
        assert.ok(await group.evaluate(el => {
          const bounds = el.getBoundingClientRect();
          return [...el.children].every(child => {const r = child.getBoundingClientRect();return r.bottom <= bounds.bottom + 1 && r.right <= bounds.right + 1;});
        }), `${kind} contains all actions`);
        assert.equal(await group.evaluate(el => getComputedStyle(el).display), kind === "grid" ? "grid" : "flex");
      }
      const segmented = section.locator('[data-test="segmented"] [data-part="footer"]');
      assert.ok(await segmented.evaluate(el => {
        const first = el.children[0].getBoundingClientRect(), second = el.children[1].getBoundingClientRect();
        return Math.abs(first.width - second.width) < 2 && Math.abs(first.right - second.left) < 2;
      }), "Direct footer actions retain equal segments");
      await section.scrollIntoViewIfNeeded();
      await section.screenshot({ path: path.join(outputPath, `footer-${design}-${width}.png`) });
      console.log(`Card footer: ${design}, ${width}px, six layouts`);
    }
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
