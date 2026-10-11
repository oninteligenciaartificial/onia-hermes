// Seekable, sin callbacks ni reproducción manual: el framework controla las capas.
const tl=gsap.timeline({paused:true}),PUSH=PLAN.empuje.cuadros/24;
const ids=a=>a.map(i=>'#'+i).join(',');
// Estado inicial por fromTo (immediateRender por defecto): GSAP no aplica tl.set(...,0) si el primer time(0) llega a un timeline recién creado (medido 11-oct).
tl.fromTo('#s2,#placa',{x:1080},{x:1080,duration:0.01,ease:'none'},0);
tl.fromTo(ids(PLAN.ocultos),{opacity:0},{opacity:0,duration:0.01,ease:'none'},0);
// Los tiles de texto entran desde 18 px más abajo; el dato del gancho y el CTA solo funden.
tl.fromTo(ids(PLAN.deslizan),{y:18},{y:18,duration:0.01,ease:'none'},0);
// Aros: se dibujan (stroke-dashoffset 1000 → 0 con pathLength=1000, ~0,6 s) y quedan hasta el empuje siguiente. Con pathLength=1 GSAP redondeaba el offset a enteros y el aro saltaba de oculto a completo en 2 cuadros.
tl.fromTo(PLAN.aros_sel,{strokeDashoffset:PLAN.aro_len},{strokeDashoffset:PLAN.aro_len,duration:0.01,ease:'none'},0);
// Barras del gráfico (y la banda de las fotos oficiales entre sí) y puntos de «las otras siete»: arrancan en cero y crecen con su fila.
tl.fromTo(PLAN.barras.map(b=>b.sel).join(','),{width:'0%'},{width:'0%',duration:0.01,ease:'none'},0);
tl.fromTo(PLAN.puntos_sel,{scale:0},{scale:0,duration:0.01,ease:'none'},0);
// Costuras: empuje rígido de 6 cuadros a la izquierda. Lo que sale y lo que entra comparten curva y duración, pegados borde con borde; los tiles son hijos de su escena y viajan con ella.
for(const c of PLAN.costuras){tl.fromTo('#'+c.sale,{x:0},{x:-1080,duration:PUSH,ease:PLAN.empuje.ease,immediateRender:false},c.t-PUSH);
 tl.fromTo('#'+c.entra,{x:1080},{x:0,duration:PUSH,ease:PLAN.empuje.ease,immediateRender:false},c.t-PUSH);}
// Eventos del plan: cada uno es una entrada (fundido + 18 px), un aro, una barra o un acento; los tiles de texto tiñen el riel (borde de 10 px) y el fondo y los devuelven a su color de reposo.
const SLIDE=PLAN.deslizan.map(i=>'#'+i);
const REPOSO={'#cta':'#ffbc94','#cap-r3':'#ffbc94','#fila-a':'#ffbc94','#nota-copia':'#ffbc94'},ACENTO={'#cta':'#ffe2d0','#cap-r3':'#ffe2d0','#fila-a':'#ffe2d0','#nota-copia':'#ffe2d0'};
for(const ev of PLAN.eventos){if(ev.t===0)continue;const s=ev.selector;
 if(ev.empuje)continue;
 if(ev.aro){tl.to(s,{strokeDashoffset:0,duration:ev.dur,ease:'power1.inOut'},ev.t);continue;}
 if(ev.entrada)tl.to(s,{opacity:1,...(SLIDE.includes(s)?{y:0}:{}),duration:ev.fade??0.2,ease:'power3.out'},ev.t);
 tl.to(s,{borderLeftColor:ACENTO[s]??'#ffbc94',backgroundColor:'#22373a',duration:0.1,ease:'none'},ev.t);
 tl.to(s,{borderLeftColor:REPOSO[s]??'#83d5be',backgroundColor:'#11191b',duration:0.3,ease:'none'},ev.t+0.55);}
for(const b of PLAN.barras)tl.to(b.sel,{width:b.hasta,duration:b.d,ease:'power3.out'},b.t);
tl.to(PLAN.puntos_sel,{scale:1,duration:0.22,ease:'back.out(2)',stagger:0.06},PLAN.puntos_t);
tl.set({}, {},PLAN.lienzo.duracion);window.__timelines.main=tl;
