// Seekable, sin callbacks ni reproducción manual: el framework controla los clips.
const tl=gsap.timeline({paused:true}),PUSH=PLAN.empuje.cuadros/24;
tl.set('#m4,#overlay-m4,#placa',{x:1080},0);
tl.set('#dato-m1,#cta',{opacity:0},0);
tl.to('#dato-m1',{opacity:1,duration:0.18,ease:'power3.out'},1.5);
for(const c of PLAN.costuras){const sale=c.sale==='m1'?'#m1,#overlay-m1':'#m4,#overlay-m4',entra=c.entra==='m4'?'#m4,#overlay-m4':'#placa';
tl.fromTo(sale,{x:0},{x:-1080,duration:PUSH,ease:PLAN.empuje.ease,immediateRender:false},c.t-PUSH);
tl.fromTo(entra,{x:1080},{x:0,duration:PUSH,ease:PLAN.empuje.ease,immediateRender:false},c.t-PUSH);}
tl.to('#cta',{opacity:1,duration:0.08,ease:'none'},17.5);
for(const ev of PLAN.eventos){if(ev.t===0)continue;tl.to(ev.selector,{borderLeftColor:'#ffbc94',duration:0.1,ease:'none'},ev.t);tl.to(ev.selector,{borderLeftColor:'#83d5be',duration:0.1,ease:'none'},ev.t+0.28);}
tl.set({}, {},20);window.__timelines.main=tl;
