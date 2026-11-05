import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const [modulePath,executablePath,out,base='http://127.0.0.1:5192/']=process.argv.slice(2);
const {chromium}=await import(pathToFileURL(modulePath).href);
const browser=await chromium.launch({executablePath,headless:true});
fs.mkdirSync(out,{recursive:true});
try{
 const page=await browser.newPage();page.setDefaultTimeout(10000);
 for(const width of [375,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  const section=page.locator('#changed-value-responsive');
  for(const design of ['classic','remix']){
   await page.locator('[data-test="design"]').selectOption(design);
   for(const value of ['1000001','0012345','09001234567','08001234567']){
    const span=section.getByText(value,{exact:true});
    assert.equal(await span.evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);return r.getClientRects().length;}),1,value+' stays on one line');
   }
   const bounds=await section.locator('[data-part="value"]').evaluateAll(values=>values.every(value=>Array.from(value.querySelectorAll('[data-part="before"],[data-part="after"]')).every(span=>{const v=value.getBoundingClientRect(),s=span.getBoundingClientRect();return s.right<=v.right+1&&s.left>=v.left-1;})));
   assert.ok(bounds,'Long values stay inside their fields');
   await section.screenshot({path:path.join(out,`changed-value-${design}-${width}.png`),animations:'disabled'});
   console.log(`Changed value: ${design}, ${width}px`);
  }
 }
}finally{await browser.close();}
