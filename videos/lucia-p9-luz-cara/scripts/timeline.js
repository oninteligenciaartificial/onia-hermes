// Seekable, sin callbacks ni reproducción manual: el framework controla los clips.
const tl=gsap.timeline({paused:true}),PUSH=PLAN.empuje.cuadros/24;
// Estado inicial por fromTo (immediateRender por defecto): GSAP no aplica tl.set(...,0) si el primer time(0) llega a un timeline recien creado (medido 11-oct).
tl.fromTo('#m4,#overlay-m4,#placa',{x:1080},{x:1080,duration:0.01,ease:'none'},0);
tl.fromTo('#dato-m1,#cta,#aviso-refs,#limite-cara,#toma,#brillo',{opacity:0},{opacity:0,duration:0.01,ease:'none'},0);
// Las notas entran de a una desde 18 px más abajo (el aviso, las tres notas de la placa); el dato de Kling y el CTA solo funden.
tl.fromTo('#aviso-refs,#limite-cara,#toma,#brillo',{y:18},{y:18,duration:0.01,ease:'none'},0);
for(const c of PLAN.costuras){const sale=c.sale==='m1'?'#m1,#overlay-m1':'#m4,#overlay-m4',entra=c.entra==='m4'?'#m4,#overlay-m4':'#placa';
tl.fromTo(sale,{x:0},{x:-1080,duration:PUSH,ease:PLAN.empuje.ease,immediateRender:false},c.t-PUSH);
tl.fromTo(entra,{x:1080},{x:0,duration:PUSH,ease:PLAN.empuje.ease,immediateRender:false},c.t-PUSH);}
// Eventos del plan: cada uno es una entrada (fundido + 18 px) o un acento, y los dos tiñen el riel (borde de 10 px) y el fondo de la tarjeta y los devuelven a su color de reposo.
const SLIDE=['#aviso-refs','#limite-cara','#toma','#brillo'];
for(const ev of PLAN.eventos){if(ev.t===0)continue;const s=ev.selector,cta=s==='#cta';
 if(ev.entrada)tl.to(s,{opacity:1,...(SLIDE.includes(s)?{y:0}:{}),duration:ev.fade??0.2,ease:'power3.out'},ev.t);
 if(s==='#comparacion')continue;
 tl.to(s,{borderLeftColor:cta?'#ffe2d0':'#ffbc94',backgroundColor:'#22373a',duration:0.1,ease:'none'},ev.t);
 tl.to(s,{borderLeftColor:cta?'#ffbc94':'#83d5be',backgroundColor:'#11191b',duration:0.3,ease:'none'},ev.t+0.55);}
tl.set({}, {},20);window.__timelines.main=tl;
