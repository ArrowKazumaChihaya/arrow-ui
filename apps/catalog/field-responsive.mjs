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
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto(base, { waitUntil: "networkidle" });
    const section = page.locator("#field-responsive");
    const input = section.locator("input").first();
    await input.fill("切り替えても保持する 0012345");
    const original = await input.elementHandle();
    for (const design of ["classic", "remix"]) {
      await page.locator('[data-test="design"]').selectOption(design);
      await section.scrollIntoViewIfNeeded();
      assert.equal(await input.inputValue(), "切り替えても保持する 0012345");
      assert.equal(await input.evaluate((el, old) => el === old, original), true);
      const fields = section.locator('[data-ar="field"]');
      for (const field of await fields.all()) {
        const geometry = await field.evaluate((el) => {
          const bounds = el.getBoundingClientRect();
          const label = el.querySelector(':scope > [data-part="label"]').getBoundingClientRect();
          const control = el.querySelector(':scope > [data-part="control"]').getBoundingClientRect();
          const input = el.querySelector("input");
          return { width: bounds.width, label: label.toJSON(), control: control.toJSON(), input: input.getBoundingClientRect().toJSON(), overflow: el.scrollWidth > el.clientWidth + 1 };
        });
        assert.equal(geometry.overflow, false, `${design}/${width}: field overflow`);
        if (geometry.width <= 480) {
          assert.ok(geometry.control.top >= geometry.label.bottom, "narrow field label must sit above its control");
          assert.ok(geometry.input.width >= geometry.width - 4, "narrow input must use the available width");
        } else {
          assert.ok(geometry.control.left > geometry.label.left, "wide field retains inline layout");
        }
      }
      await section.screenshot({ path: path.join(outputPath, `field-${design}-${width}.png`) });
      console.log(`Field layout: ${design}, ${width}px`);
    }
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
