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

/* reduced motion: everything final, no movement */
@media (prefers-reduced-motion: reduce){
  .wf-reveal,.wf-clip-reveal,.wf-scale-in,.wf-slide-left,.wf-slide-right,.wf-type-slam,.wf-zoom,.wf-stagger>*{
    opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}
  .wf-hover-lift:hover{transform:none}
  .wf-parallax{transform:none!important}
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
