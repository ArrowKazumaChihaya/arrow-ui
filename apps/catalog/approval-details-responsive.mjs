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
 for(const width of [375,768,1440])for(const layout of ['row','list']){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('[data-test="approval-layout"]').selectOption(layout);
  const section=page.locator('#approval-details-responsive');
  const input=section.getByRole('textbox',{name:'承認メモ 2',exact:true});await input.fill('確認中の入力\n00123');const original=await input.elementHandle();
  let clicks=0;
  for(const design of ['classic','remix']){
   await page.locator('[data-test="design"]').selectOption(design);
   assert.equal(await input.inputValue(),'確認中の入力\n00123');assert.equal(await input.evaluate((el,old)=>el===old,original),true);
   for(let index=1;index<=3;index++){
    const button=section.getByRole('button',{name:`候補を確認 ${index}`,exact:true});await button.click();clicks++;
    assert.equal(await section.locator('[data-test="approval-clicked"]').innerText(),String(clicks));
    const bounds=await button.evaluate(el=>{const root=el.closest('[data-part="step"]');const r=root.getBoundingClientRect(),b=el.getBoundingClientRect();return {bottom:b.bottom<=r.bottom+1,right:b.right<=r.right+1,left:b.left>=r.left-1};});
    assert.deepEqual(bounds,{bottom:true,right:true,left:true});
   }
   await section.screenshot({path:path.join(out,`approval-${layout}-${design}-${width}.png`),animations:'disabled'});
   console.log(`Approval details: ${layout}, ${design}, ${width}px`);
  }
 }
}finally{await browser.close();}
