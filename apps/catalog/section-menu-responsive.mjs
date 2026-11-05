import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const [modulePath, executablePath, out, base='http://127.0.0.1:5192/'] = process.argv.slice(2);
const {chromium}=await import(pathToFileURL(modulePath).href);
const browser=await chromium.launch({executablePath,headless:true});
fs.mkdirSync(out,{recursive:true});
try {
 const page=await browser.newPage();
 for(const width of [375,768,1440]) for(const design of ['classic','remix']) {
  await page.setViewportSize({width,height:900});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('[data-test="design"]').selectOption(design);
  const section=page.locator('#section-menu-responsive');
  const nav=section.locator('[data-part="navigation"]');
  await page.locator('#menu-basic').evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY+el.getBoundingClientRect().height-350));
  await page.screenshot({path:path.join(out,`menu-${design}-${width}.png`)});
  const active = width<=900 ? await nav.getByRole('combobox').innerText() : await nav.locator('[aria-current]').innerText();
  const coverage=await nav.evaluate(el=>{const r=el.getBoundingClientRect();const top=document.elementFromPoint(r.left+r.width/2,r.top+20);return el.contains(top);});
  console.log(JSON.stringify({width,design,active,coverage}));
  assert.ok(active.includes('基本情報'),'The current section remains selected until its next heading');
  assert.equal(coverage,true,'Sticky navigation must remain above form fields');
 }
}finally{await browser.close();}
