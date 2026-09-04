/**
 * Motion toolkit — the animation primitives the factory uses to make generated
 * webs feel professional, the same movement observed in the learned reel models
 * (see data/references/reels/web-models.json → motionLibrary).
 *
 * Generated sites are static HTML with `wf-*` classes, so this ships as plain CSS
 * + a tiny vanilla runtime — zero deps, zero React. Reduced-motion is built in:
 * under `prefers-reduced-motion: reduce` every element renders in its final state.
 *
 * Wire once per generated page:
 *   <head> ... ${renderMotionStyles()} </head>
 *   ...page...
 *   ${renderMotionScript()} </body>
 * (or drop renderMotionAssets() at the end of the body).
 *
 * Use in a block by adding a class + optional data attrs:
 *   <div class="wf-reveal">…</div>                     fade + slide up on scroll-in
 *   <figure class="wf-clip-reveal"><img class="wf-zoom"></figure>  cinematic media reveal
 *   <ul class="wf-stagger">…</ul>                       children cascade in
 *   <h1 class="wf-type-slam wf-onload">…</h1>           headline slams in on load
 *   <div class="wf-parallax" data-wf-parallax="0.2">…</div>        scroll parallax
 *   <article class="wf-hover-lift">…</article>          hover lift (cards)
 *   <div data-wf-scrub><figure class="wf-frame">…</figure>…</div>  scroll advances the scene
 *   <span class="wf-count" data-wf-count="4200">4.200</span>       count-up in view
 */

/** The factory's editorial easing, shared with the React side (ui.tsx EASE). */
export const WF_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export const MOTION_CSS = `
:root{--wf-ease:${WF_EASE};--wf-dur:.7s;--wf-stag:.08s}

/* base: pre-animation state, revealed by .wf-in (added by the runtime) */
.wf-reveal,.wf-clip-reveal,.wf-scale-in,.wf-slide-left,.wf-slide-right,.wf-type-slam,.wf-stagger>*{
  opacity:0;transition:opacity var(--wf-dur) var(--wf-ease),transform var(--wf-dur) var(--wf-ease),clip-path var(--wf-dur) var(--wf-ease);will-change:opacity,transform}
.wf-reveal{transform:translateY(24px)}
.wf-scale-in{transform:scale(.92)}
.wf-slide-left{transform:translateX(-28px)}
.wf-slide-right{transform:translateX(28px)}
.wf-type-slam{transform:scale(1.06)}
.wf-clip-reveal{opacity:1;clip-path:inset(0 0 100% 0)}
.wf-zoom{transform:scale(1.12);transition:transform 1.2s var(--wf-ease);will-change:transform}

/* revealed state */
.wf-in,.wf-in.wf-clip-reveal{opacity:1;transform:none;clip-path:inset(0 0 0 0)}
.wf-in .wf-zoom,.wf-in.wf-zoom{transform:none}

/* stagger: children cascade using their index (--wf-i set by the runtime) */
.wf-stagger>*{transition-delay:calc(var(--wf-stag) * var(--wf-i, 0))}
.wf-stagger.wf-in>*{opacity:1;transform:none}

/* hover lift for cards (pure CSS) */
.wf-hover-lift{transition:transform .3s var(--wf-ease),box-shadow .3s var(--wf-ease)}
.wf-hover-lift:hover{transform:translateY(-6px);box-shadow:0 24px 50px -24px rgba(10,17,38,.35)}

/* sticky nav: .wf-scrolled toggled by the runtime after a little scroll */
.wf-sticky{position:sticky;top:0;z-index:50;transition:background-color .3s var(--wf-ease),backdrop-filter .3s var(--wf-ease),box-shadow .3s var(--wf-ease)}

/* parallax elements are moved inline by the runtime; keep them from clipping */
.wf-parallax{will-change:transform}

/* scroll-linked scene (pattern bank P3, sticky + scrub): the frames of a
   [data-wf-scrub] track cross-fade as the visitor scrolls through it, so scroll
   progress IS the story advancing. Frame 0 is visible with no JS at all; the
   runtime only takes over once it sets data-wf-step. */
.wf-frame{opacity:0;transition:opacity .6s var(--wf-ease)}
[data-wf-scrub]:not([data-wf-step]) .wf-frame:first-child,.wf-frame.wf-on{opacity:1}

/* count-up (P5): the HTML always ships the FINAL number (SEO, no-JS, reduced
   motion); the runtime only animates toward the value already written. */
.wf-count{font-variant-numeric:tabular-nums}

/* reduced motion: everything final, no movement */
@media (prefers-reduced-motion: reduce){
  .wf-reveal,.wf-clip-reveal,.wf-scale-in,.wf-slide-left,.wf-slide-right,.wf-type-slam,.wf-zoom,.wf-stagger>*{
    opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}
  .wf-hover-lift:hover{transform:none}
  .wf-parallax{transform:none!important}
  .wf-frame{transition:none}
}
`.trim();

export const MOTION_RUNTIME_JS = `
(function(){
  var mm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce=mm&&mm.matches;
  var sel='.wf-reveal,.wf-clip-reveal,.wf-scale-in,.wf-slide-left,.wf-slide-right,.wf-type-slam,.wf-stagger';
  var els=[].slice.call(document.querySelectorAll(sel));
  [].forEach.call(document.querySelectorAll('.wf-stagger'),function(p){
    [].forEach.call(p.children,function(c,i){c.style.setProperty('--wf-i',i);});
  });
  function show(el){el.classList.add('wf-in');}
  if(reduce){els.forEach(show);return;}
  els.forEach(function(el){if(el.classList.contains('wf-onload')||el.classList.contains('wf-type-slam'))show(el);});
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(ents){
    ents.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -10% 0px'}):null;
  els.forEach(function(el){if(el.classList.contains('wf-in'))return;if(io)io.observe(el);else show(el);});
  setTimeout(function(){els.forEach(show);},3000);
  var px=[].slice.call(document.querySelectorAll('[data-wf-parallax]'));
  if(px.length){
    var onP=function(){var vh=window.innerHeight;px.forEach(function(el){
      var r=el.getBoundingClientRect();var prog=(vh-r.top)/(vh+r.height);
      var sp=parseFloat(el.getAttribute('data-wf-parallax'))||0.15;
      el.style.transform='translateY('+((prog-0.5)*sp*100).toFixed(1)+'px)';});};
    window.addEventListener('scroll',onP,{passive:true});onP();
  }
  var st=[].slice.call(document.querySelectorAll('.wf-sticky'));
  if(st.length){
    var onS=function(){var s=window.scrollY>8;st.forEach(function(el){el.classList.toggle('wf-scrolled',s);});};
    window.addEventListener('scroll',onS,{passive:true});onS();
  }
  var scenes=[].slice.call(document.querySelectorAll('[data-wf-scrub]'));
  if(scenes.length){
    var onScrub=function(){scenes.forEach(function(track){
      var fr=track.querySelectorAll('.wf-frame');if(fr.length<2)return;
      var r=track.getBoundingClientRect();var run=r.height-window.innerHeight;
      var p=run>0?Math.min(1,Math.max(0,-r.top/run)):0;
      var i=Math.min(fr.length-1,Math.floor(p*fr.length));
      if(track.getAttribute('data-wf-step')===String(i))return;
      track.setAttribute('data-wf-step',String(i));
      [].forEach.call(fr,function(f,n){f.classList.toggle('wf-on',n===i);});
      [].forEach.call(track.querySelectorAll('.wf-step'),function(s,n){
        s.classList.toggle('wf-on',n===i);
        if(n===i)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');
      });});};
    window.addEventListener('scroll',onScrub,{passive:true});
    window.addEventListener('resize',onScrub,{passive:true});onScrub();
  }
  var cs=[].slice.call(document.querySelectorAll('[data-wf-count]'));
  if(cs.length&&'IntersectionObserver' in window){
    var count=function(el){
      var to=parseFloat(el.getAttribute('data-wf-count'));if(!isFinite(to))return;
      var end=el.textContent,t0=0,d=1200,nf=new Intl.NumberFormat('es-BO',{maximumFractionDigits:0});
      var step=function(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/d);
        el.textContent=p<1?nf.format(to*(1-Math.pow(1-p,3))):end;
        if(p<1)requestAnimationFrame(step);};
      requestAnimationFrame(step);
    };
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){cio.unobserve(e.target);count(e.target);}});},{rootMargin:'0px 0px -15% 0px'});
    cs.forEach(function(el){cio.observe(el);});
  }
})();
`.trim();

/** Motion primitives → how to use them. Maps the learned models' motionSpec vocabulary to real classes. */
export const MOTION_PRIMITIVES = [
  { primitive: "fade", motionSpec: "fade + slide up", class: "wf-reveal", trigger: "in-view" },
  { primitive: "clip-path-reveal", motionSpec: "clip-path wipe up", class: "wf-clip-reveal", trigger: "in-view" },
  { primitive: "scale-zoom", motionSpec: "slow zoom on media", class: "wf-zoom (inside wf-clip-reveal)", trigger: "in-view" },
  { primitive: "scale-zoom", motionSpec: "scale-in", class: "wf-scale-in", trigger: "in-view" },
  { primitive: "slide-in", motionSpec: "slide from side", class: "wf-slide-left / wf-slide-right", trigger: "in-view" },
  { primitive: "staggered-children", motionSpec: "children cascade", class: "wf-stagger (on parent)", trigger: "in-view" },
  { primitive: "type-slam", motionSpec: "headline slams in", class: "wf-type-slam wf-onload", trigger: "on-load" },
  { primitive: "scroll-parallax", motionSpec: "parallax on media", class: "wf-parallax + data-wf-parallax='0.2'", trigger: "scroll-linked" },
  { primitive: "hover-lift", motionSpec: "card lift on hover", class: "wf-hover-lift", trigger: "hover" },
  { primitive: "sticky-nav", motionSpec: "sticky nav with scrolled state", class: "wf-sticky (+ .wf-scrolled)", trigger: "scroll-linked" },
  { primitive: "scroll-scrub", motionSpec: "el scroll avanza la escena por etapas", class: "data-wf-scrub (track) + .wf-frame / .wf-step", trigger: "scroll-linked" },
  { primitive: "count-up", motionSpec: "la metrica cuenta hasta su valor real", class: "wf-count + data-wf-count='4200'", trigger: "in-view" },
] as const;

export function renderMotionStyles(): string {
  return `<style data-wf-motion>${MOTION_CSS}</style>`;
}

export function renderMotionScript(): string {
  return `<script data-wf-motion>${MOTION_RUNTIME_JS}</script>`;
}

/** Both assets, safe to drop once at the end of a generated page's body. */
export function renderMotionAssets(): string {
  return `${renderMotionStyles()}${renderMotionScript()}`;
}
