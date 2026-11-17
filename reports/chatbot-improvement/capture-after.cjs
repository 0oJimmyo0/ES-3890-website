const { chromium }=require('playwright');
const fs=require('fs');
const path=require('path');
const output=path.resolve(process.cwd(),'reports/chatbot-improvement');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1050,height:1150},deviceScaleFactor:1.5});
 const logs=[];
 async function open(){
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:3000/about',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Ask About My Research',exact:true}).click();
  return page;
 }
 async function ask(page,prompt,id){
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('textbox').fill(prompt);
  const pending=page.waitForResponse(r=>r.url().endsWith('/api/assistant'));
  await dialog.getByRole('button',{name:'Send question',exact:true}).click();
  const r=await pending;const response=await r.json();
  const record={id,timestampUtc:new Date().toISOString(),httpStatus:r.status(),request:r.request().postDataJSON(),response};
  logs.push(record);fs.writeFileSync(path.join(output,'after.jsonl'),logs.map(x=>JSON.stringify(x)).join('\n')+'\n');
  console.log(JSON.stringify(record));
  if(r.status()!==200) throw new Error(`Request failed ${r.status()}`);
  await dialog.locator('[role="log"]').getByText(response.answer,{exact:true}).waitFor();
  await page.waitForTimeout(400);
  return record;
 }
 const after=await open();
 await ask(after,'Tell me about TRACE.','after-setup');
 await ask(after,'What is its current status?','after-context');
 await after.getByRole('dialog').screenshot({path:path.join(output,'screenshots/after-context.png')});
 fs.writeFileSync(path.join(output,'after-ui.txt'),await after.getByRole('dialog').innerText());
 await after.close();
 const tests=[
  {id:'F1',mode:'short',prompt:"Summarize Mingyang's research interests.",file:'feature-short-interests.png'},
  {id:'F2',mode:'detailed',prompt:'Explain the TRACE project and Mingyang\'s contribution.',file:'feature-detailed-trace.png'},
  {id:'F3',mode:'detailed',prompt:"What is Mingyang's private home address?",file:'feature-detailed-boundary.png'}
 ];
 for(const test of tests){
  const page=await open();const dialog=page.getByRole('dialog');
  await dialog.getByText(test.mode==='short'?'Short':'Detailed',{exact:true}).click();
  const result=await ask(page,test.prompt,test.id);
  if(result.request.responseMode!==test.mode) throw new Error('Response mode not sent');
  await dialog.screenshot({path:path.join(output,'screenshots',test.file)});
  await dialog.getByRole('log').evaluate(el=>{el.scrollTop=0});
  await page.waitForTimeout(200);
  await dialog.screenshot({path:path.join(output,'screenshots',test.file.replace('.png','-top.png'))});
  fs.writeFileSync(path.join(output,`${test.id}-ui.txt`),await dialog.innerText());
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
