const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const output = path.resolve(process.cwd(), 'reports/chatbot-improvement');
(async () => {
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1050,height:1150},deviceScaleFactor:1.5});
 const logs=[];
 page.on('console',m=>{if(m.type()==='error') console.error(m.text());});
 page.on('response',async r=>{if(r.url().endsWith('/api/assistant')){
  const entry={phase:'before',timestampUtc:new Date().toISOString(),httpStatus:r.status(),request:r.request().postDataJSON(),response:await r.json()}; logs.push(entry);fs.writeFileSync(path.join(output,'before.jsonl'),logs.map(x=>JSON.stringify(x)).join('\n')+'\n');
 }});
 await page.goto('http://127.0.0.1:3000/about',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Ask About My Research',exact:true}).click();
 const dialog=page.getByRole('dialog');
 async function ask(q){
  await dialog.getByRole('textbox').fill(q);
  const response=page.waitForResponse(r=>r.url().endsWith('/api/assistant'));
  await dialog.getByRole('button',{name:'Send question',exact:true}).click();
  const r=await response;console.log(r.status(),JSON.stringify(await r.json()));
  await dialog.getByRole('button',{name:'Send question',exact:true}).isDisabled();
  await page.waitForTimeout(700);
 }
 await ask('Tell me about TRACE.');
 await ask('What is its current status?');
 await dialog.screenshot({path:path.join(output,'screenshots/before-context.png')});
 await page.screenshot({path:path.join(output,'screenshots/before-full-page.png'),fullPage:true});
 fs.writeFileSync(path.join(output,'before-ui.txt'),await dialog.innerText());
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
