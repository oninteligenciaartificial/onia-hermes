'use strict';
const cap=require('./screencast-session.cjs');
const {createRequire}=require('node:module');
const runtime=createRequire(process.env.SAMUEL_RUNTIME_PACKAGE || 'C:/dev/proyectos/onia-hermes/package.json');
cap.configure({chromium:runtime('playwright').chromium});
const mode=process.argv[2]||'recorrido';
const outputDir='E:/ONIA-YouTube/grabaciones/samuel';
(async()=>{
 const s=await cap.launch('higgsfield',{record:true,outputDir}); const started=Date.now(); const p=s.page;
 const wait=ms=>s.pause(ms); let offset=0;
 try {
  await s.run(()=>p.goto('https://higgsfield.ai/character',{waitUntil:'domcontentloaded'}));
  await s.run(()=>p.getByText(/lucia-sintetica-v3/i).waitFor({state:'visible',timeout:25000}));
  await wait(1800); offset=(Date.now()-started)/1000;
  await wait(2500);
  if(mode==='herramientas') {
   await s.run(()=>p.goto('https://higgsfield.ai/',{waitUntil:'domcontentloaded'}));
   await wait(4000); offset=(Date.now()-started)/1000;
   await wait(3500); await s.move(150,18,{duration:900}); await wait(2500);
   await s.move(202,18,{duration:900}); await wait(2500);
   await s.move(800,440,{duration:800});
   for(let i=0;i<12;i++){await s.run(()=>p.mouse.wheel(0,45));await wait(85);}
   await wait(3500);
   await s.run(()=>p.goto('https://higgsfield.ai/character',{waitUntil:'domcontentloaded'}));
   await s.run(()=>p.getByText(/lucia-sintetica-v3/i).waitFor({state:'visible',timeout:25000}));
   await wait(4200);
   await s.run(()=>p.screenshot({path:outputDir+'/higgsfield-00-herramientas-control.png'}));
   console.log(JSON.stringify(await s.finish('higgsfield-00-herramientas',{trimStart:Math.max(0,offset-1)})));
  } else if(mode==='recorrido') {
   await s.moveClick(p.getByRole('link',{name:'Create character',exact:true}),{settle:2200});
   await s.run(()=>p.getByText('Upload 20+ photos for best results',{exact:true}).last().waitFor({state:'visible',timeout:20000}));
   await s.move(718,245,{duration:900}); await wait(2200);
   await s.move(490,504,{duration:1100}); await wait(3500);
   await s.move(474,709,{duration:1100}); await wait(3500);
   await s.move(1030,500,{duration:1000}); await wait(3000);
   await s.run(()=>p.screenshot({path:outputDir+'/higgsfield-01-crear-soul-control.png'}));
   console.log(JSON.stringify(await s.finish('higgsfield-01-crear-soul',{trimStart:Math.max(0,offset-1)})));
  } else if(mode==='prompt') {
   const card=p.locator('article').filter({hasText:/lucia-sintetica-v3/i});
   await s.run(()=>card.hover()); await wait(1800);
   await s.moveClick(card.getByRole('button',{name:'Generate',exact:true}),{settle:2000});
   await s.run(()=>p.getByRole('textbox').waitFor({state:'visible',timeout:20000}));
   await wait(2200);
   if(await p.getByRole('button',{name:'Close',exact:true}).isVisible()) {
    await s.moveClick(p.getByRole('button',{name:'Close',exact:true}));
   }
   const prompt='Portrait of the same LUCIA character, light freckles, natural skin texture, warm brown hair, wearing a plain black shirt in a bright modern office, soft window light, realistic candid photo. Preserve her face and identity.';
   await s.type(p.getByRole('textbox'),prompt,{delay:18,timeout:60000}); await wait(3500);
   await s.move(1180,805,{duration:900}); await wait(3000);
   await s.run(()=>p.screenshot({path:outputDir+'/higgsfield-02-avatar-prompt-control.png'}));
   console.log(JSON.stringify(await s.finish(process.argv[3]||'higgsfield-02-avatar-prompt',{trimStart:Math.max(0,offset-1)})));
  } else { throw new Error('Modo no permitido: recorrido, prompt o herramientas'); }
 }catch(e){await s.abort(e.message);console.error(e.message);process.exitCode=1;}
})();
