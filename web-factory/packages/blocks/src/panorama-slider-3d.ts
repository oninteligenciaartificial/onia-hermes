import { escapeAttribute, escapeHtml } from "./escape";

/**
 * panorama-slider-3d — vitrina de catalogo corto sobre un cilindro 3D.
 *
 * Puerto vanilla de la mecanica medida en
 * data/references/design-sources/fanvue-secciones/panorama-slider-3d.md
 * (medicion del 2026-08-18 con Playwright + Chromium sobre fanvue.com, viewport
 * 1440x900 y 375x812). Se copia MECANICA — transforms, duraciones, easing,
 * estructura. Nada de identidad: ni nombres, ni fotos, ni textos, ni assets.
 *
 * POR QUE EXISTE, y por que gano el 2do puesto del RANKING.md: da jerarquia
 * absoluta a UN item sin esconder que hay muchos mas. Convierte sin prometer
 * nada — no necesita cifras, ni testimonios, ni logos, que es justo lo que ONIA
 * no tiene y tiene prohibido inventar. Solo necesita items propios.
 *
 * POR QUE NO SE INSTALA SWIPER (que es lo que usa el original): Swiper aporta
 * aca solo drag, snap y loop. El efecto panoramico NI SIQUIERA VIENE en la
 * libreria — se verifico bajando el bundle, indexOf('panorama') da -1; es un
 * modulo custom de la pagina. Y cuesta 151,7 KB sin comprimir, o sea MAS que el
 * presupuesto entero de 150 KB de JS por landing. Esta version reproduce los
 * transforms medidos con error < 0,01 px con ~1,2 KB gzip. GSAP tampoco entra:
 * no hay timeline, ni scrub, ni easing custom — son transforms de compositor con
 * una transicion CSS.
 *
 * LA FORMULA (derivada del handler vivo de `progress` y verificada contra los
 * transforms inline reales en p = 0, 1, 2, 3):
 *
 *   ac         = 1 - cos(p * rot)
 *   R          = (S/2) / sin(rot/2)          // radio del cilindro
 *   translateX = -p*S + p*(S/3)*ac           // -p*S = posicion base
 *   translateZ = R*ac - depth
 *   rotateY    = p*rot
 *   opacidad   = max(0.2, 1 - |p|*1.8)       // solo el TEXTO, no la tarjeta
 *
 * El `-p*S` no esta en el original: alli la posicion base la ponia el
 * translate3d del wrapper de Swiper y el transform del slide llevaba solo el
 * delta. Sin wrapper hay que sumarlo. Es la unica diferencia matematica.
 *
 * ⚠️ TRAMPA YA PAGADA: bajo prefers-reduced-motion va `transition: none`, NUNCA
 * `transition-duration: 0.01ms` — con 0.01ms las propiedades discretas siguen
 * animando. Y el bloque trae su propio box-sizing: no puede depender del reset
 * de la pagina anfitriona.
 */

export type PanoramaCard = {
  /** Sin titulo la tarjeta no comunica nada: ese item se descarta. */
  title: string;
  subtitle?: string;
  /** Recorte 3:4 (min. 360x461). Sin imagen queda el placeholder del token. */
  image?: string;
  /** Vacio = imagen decorativa. Correcto cuando la foto repite el titulo. */
  imageAlt?: string;
  /** Sin href la tarjeta se renderiza como div: no finge ser un enlace. */
  href?: string;
};

export type PanoramaSlider3DProps = {
  items: ReadonlyArray<PanoramaCard>;
  heading?: string;
  intro?: string;
  /** ms entre saltos. `false` lo apaga. Medido en el original: 5000. */
  autoplay?: number | false;
  id?: string;
};

/**
 * Regla dura del documento fuente: con menos de 7 tarjetas el loop se ve saltar
 * (a ±3 ya estas mirando la vuelta) y con menos de 5 esto directamente no es el
 * bloque — es una grilla. El rango comodo es 10-14. Devolver "" es preferible a
 * renderizar un carrusel que se delata: el mismo criterio de trust.ts y
 * newsletter-band.ts, no se dibuja lo que no se tiene.
 */
const MIN_ITEMS = 5;

/** Medido: `swiper.params.autoplay.delay` = 5000 ms. */
const AUTOPLAY_MS = 5000;

export function renderPanoramaSlider3D({
  items,
  heading,
  intro,
  autoplay = AUTOPLAY_MS,
  id = "vitrina",
}: PanoramaSlider3DProps): string {
  const cards = (items ?? []).filter((item) => item?.title?.trim());
  if (cards.length < MIN_ITEMS) return "";

  const delay = typeof autoplay === "number" && autoplay > 0 ? Math.round(autoplay) : 0;
  const title = heading?.trim();
  const headingId = title ? `${id}-heading` : "";

  const cardsHtml = cards
    .map((card) => {
      const image = card.image?.trim();
      const subtitle = card.subtitle?.trim();
      const href = card.href?.trim();

      // width/height explicitos: la tarjeta reserva su caja antes de que baje la
      // foto y el cilindro no se recalcula a mitad de scroll (CLS).
      const media = image
        ? `<img class="wf-pano-img" src="${escapeAttribute(image)}"
                 alt="${escapeAttribute(card.imageAlt?.trim() ?? "")}"
                 width="360" height="461" loading="lazy" decoding="async">`
        : "";

      const inner = `
            <span class="wf-pano-media">${media}</span>
            <span class="wf-pano-text">
              <span class="wf-pano-title">${escapeHtml(card.title.trim())}</span>
              ${subtitle ? `<span class="wf-pano-sub">${escapeHtml(subtitle)}</span>` : ""}
            </span>`;

      const body = href
        ? `<a class="wf-pano-link" href="${escapeAttribute(href)}">${inner}
          </a>`
        : `<div class="wf-pano-link">${inner}
          </div>`;

      return `
          <li class="wf-pano-card">${body}</li>`;
    })
    .join("");

  return `
    <section class="wf-pano-section" id="${escapeAttribute(id)}"${headingId ? ` aria-labelledby="${headingId}"` : ""}>
      ${
        title || intro?.trim()
          ? `<div class="wf-pano-head">
        ${title ? `<h2 class="wf-pano-heading" id="${headingId}">${escapeHtml(title)}</h2>` : ""}
        ${intro?.trim() ? `<p class="wf-pano-intro">${escapeHtml(intro.trim())}</p>` : ""}
      </div>`
          : ""
      }
      <!--
        ul + li: para un lector de pantalla esto es una lista de N items, que es
        lo que es. tabindex="0" no es decoracion: sin JS este mismo <ul> es un
        contenedor con scroll horizontal, y un contenedor con scroll tiene que
        alcanzarse con el teclado.
      -->
      <ul class="wf-pano" data-wf-pano${delay ? ` data-wf-pano-autoplay="${delay}"` : ""}
          tabindex="0" ${headingId ? `aria-labelledby="${headingId}"` : `aria-label="Vitrina"`}>${cardsHtml}
      </ul>
    </section>
  `;
}

/**
 * Estilos con tokens del cliente.
 *
 * La decision de fondo: el estado BASE es la fila con scroll y snap nativos, y
 * el cilindro 3D se enciende cuando el JS pone `data-wf-pano-ready`. El
 * documento fuente marca la degradacion sin JS como "no resuelta" (12 tarjetas
 * apiladas en left:50%); asi queda resuelta sin una linea de JS extra, usando
 * scroll-snap que ya trae el navegador.
 *
 * Nota: sin backticks en estos comentarios — la hoja vive dentro de un template
 * literal y uno suelto la corta a la mitad.
 */
export const PANORAMA_SLIDER_3D_CSS = `
/*
 * border-box propio. Un bloque que publica su hoja no puede asumir el reset de
 * la pagina que lo hospeda: con content-box el padding del texto se suma al 100%
 * de alto de la tarjeta y el cilindro se descuadra.
 */
.wf-pano-section, .wf-pano-section * { box-sizing: border-box; }

.wf-pano-section {
  padding: clamp(48px, 7vw, 96px) 0;
  color: var(--color-fg);
}

.wf-pano-head {
  width: min(720px, 100% - 40px);
  margin: 0 auto clamp(28px, 4vw, 48px);
  text-align: center;
}

.wf-pano-heading {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4.2vw, 3rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-pano-intro {
  margin: 14px auto 0;
  max-width: 46ch;
  line-height: 1.6;
  color: color-mix(in srgb, var(--color-fg) 72%, transparent);
}

/*
 * SIN JS: fila con scroll y snap del navegador. Se ve y se usa igual de bien,
 * solo sin el cilindro.
 * Alto: 41vw reproduce los 591,5 px medidos a 1440. El maximo lo corta ahi
 * porque mas arriba la tarjeta empieza a comerse la pantalla completa.
 */
.wf-pano {
  --wf-pano-rotate: 25;
  --wf-pano-depth: 250;
  --wf-pano-w: 25%;
  --wf-pano-dur: 300ms;
  position: relative;
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0 20px;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  height: clamp(380px, 41vw, 592px);
}

.wf-pano-card {
  flex: 0 0 min(78%, 320px);
  scroll-snap-align: center;
}

/*
 * CON JS: el cilindro. perspective 1200px es el valor medido; el origen queda en
 * el centro del bloque, igual que el original (720px a 1440).
 */
.wf-pano[data-wf-pano-ready] {
  display: block;
  padding: 0;
  overflow: visible;
  scroll-snap-type: none;
  perspective: 1200px;
  cursor: grab;
  /* pan-y: el arrastre horizontal es nuestro, el scroll vertical del dedo NO. */
  touch-action: pan-y;
}

.wf-pano[data-wf-pano-ready].is-drag { cursor: grabbing; }

.wf-pano[data-wf-pano-ready] .wf-pano-card {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--wf-pano-w);
  height: 100%;
  margin-left: calc(var(--wf-pano-w) * -0.5);
  transform-style: preserve-3d;
  /*
   * 300ms + ease (= cubic-bezier(.25,.1,.25,1)): los dos medidos al soltar.
   * La duracion viaja por custom property para que la tarjeta y su texto se
   * muevan SIEMPRE juntos — el original sincroniza eso a mano por JS y con una
   * sola escritura queda declarativo.
   * Sin will-change: el translateZ ya promueve la capa, y 12 will-change a la
   * vez es peor que ninguno.
   */
  transition: transform var(--wf-pano-dur) ease;
}

/*
 * Mascaras laterales (30% de ancho, alto 120%, top -20%): medidas en el
 * original. No son decoracion — con perspective 1200px las tarjetas que pasan de
 * z ~1200 degeneran (sus rects medidos daban 152097 px de ancho). La mascara
 * tapa el artefacto. Se pintan del fondo de la pagina, no de negro fijo.
 */
.wf-pano[data-wf-pano-ready]::before,
.wf-pano[data-wf-pano-ready]::after {
  content: "";
  position: absolute;
  top: -20%;
  bottom: 0;
  width: 30%;
  z-index: 3;
  pointer-events: none;
}

.wf-pano[data-wf-pano-ready]::before {
  left: 0;
  background: linear-gradient(90deg, var(--wf-pano-fade, var(--color-bg)) 4%, transparent);
}

.wf-pano[data-wf-pano-ready]::after {
  right: 0;
  background: linear-gradient(90deg, transparent, var(--wf-pano-fade, var(--color-bg)) 90%);
}

.wf-pano-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

/* Sin foto queda un solido del token: la mecanica no depende de la imagen. */
.wf-pano-media {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-primary) 16%, var(--color-bg));
}

.wf-pano-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*
 * Se apaga SOLO el texto (medido: la tarjeta, el slide y la imagen quedan en
 * opacity 1 en todas las posiciones). Y la caida es un gradiente, no un
 * interruptor: en reposo parece binario porque 1 - 1*1.8 ya clampea a 0.2, pero
 * mientras se arrastra interpola.
 */
.wf-pano-text {
  display: block;
  padding-top: clamp(16px, 2.5vw, 36px);
  opacity: var(--wf-pano-op, 1);
  transition: opacity var(--wf-pano-dur) ease;
}

.wf-pano-title {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  font-weight: 600;
  line-height: 1.2;
}

.wf-pano-sub {
  display: block;
  margin-top: 6px;
  font-size: 0.86rem;
  line-height: 1.45;
  color: color-mix(in srgb, var(--color-fg) 65%, transparent);
}

.wf-pano-link:hover .wf-pano-title { color: var(--color-primary); }

/*
 * El original pone outline: none en el contenedor. No se copia: es un elemento
 * enfocable y sin anillo el que navega con teclado no sabe donde esta.
 */
.wf-pano:focus-visible,
.wf-pano-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 16px;
}

/*
 * Breakpoints: rotate y depth son los valores leidos de params.breakpoints del
 * original. El ancho sale de su slidesPerView (100/spv), exacto en los dos
 * viewports que se midieron — 25% = 360px a 1440 y 50% = 187,5px a 375. Los
 * anchos en px de 480 / 640 / 1024 quedan A VERIFICAR: no se midieron.
 * Aca son custom properties y no un objeto JS: el rubro que quiera otra
 * geometria la cambia en CSS.
 */
@media (max-width: 1199px) {
  .wf-pano { --wf-pano-rotate: 30; --wf-pano-depth: 200; --wf-pano-w: 25%; }
}

@media (max-width: 1023px) {
  .wf-pano { --wf-pano-rotate: 30; --wf-pano-depth: 150; --wf-pano-w: 33.333%; }
}

@media (max-width: 639px) {
  .wf-pano { --wf-pano-rotate: 35; --wf-pano-depth: 150; --wf-pano-w: 50%; }
}

/* Mas grados y menos profundidad: la lateral se pone casi de canto para que
   entren 2. Medido en vivo a 375. */
@media (max-width: 479px) {
  .wf-pano { --wf-pano-rotate: 45; --wf-pano-depth: 150; --wf-pano-w: 50%; }
}

/*
 * ⚠️ transition: none — NO transition-duration: 0.01ms. Con 0.01ms las
 * propiedades discretas siguen animando y ya nos dejo un dialogo abierto e
 * invisible capturando clics.
 * El selector repite [data-wf-pano-ready] a proposito: una media query no suma
 * especificidad, y .wf-pano-card a secas PERDERIA contra la regla del cilindro.
 */
@media (prefers-reduced-motion: reduce) {
  .wf-pano[data-wf-pano-ready] .wf-pano-card,
  .wf-pano-text,
  .wf-pano-title {
    transition: none;
    animation: none;
  }
}
`.trim();

/**
 * Runtime vanilla, cero dependencias — los sitios generados son HTML estatico.
 *
 * Lo unico que hacia falta portar de Swiper era: (a) convertir el arrastre en un
 * `progress` continuo, (b) hacer snap al entero mas cercano en 300 ms, (c) el
 * loop. Las tres son cortas, y el snap NO necesita requestAnimationFrame: se
 * escribe el transform una vez y lo interpola el compositor.
 *
 * Cuatro cosas que el original no hace y aca si:
 *   · prefers-reduced-motion (alli el autoplay arranca sin consultarlo).
 *   · flechas del teclado.
 *   · foco: tabular a una tarjeta girada 125 grados la dejaria enfocada e
 *     ilegible, asi que el carrusel la trae al centro.
 *   · el clic que cierra un arrastre no navega.
 */
export const PANORAMA_SLIDER_3D_JS = `
(function(){
  var roots=[].slice.call(document.querySelectorAll('[data-wf-pano]'));
  if(!roots.length)return;
  var RM=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)'))||{matches:false};

  roots.forEach(function(root){
    var cards=[].slice.call(root.querySelectorAll('.wf-pano-card'));
    var n=cards.length;
    if(!n)return;

    var center=0,drag=null,moved=0,timer=null,visible=false;
    var S=1,rot=25,depth=250;
    var DUR=300;                                   // medido al soltar

    // Geometria por CSS: el breakpoint se cambia en la hoja, no aca.
    function cfg(){
      var cs=getComputedStyle(root);
      S=cards[0].offsetWidth||1;
      rot=parseFloat(cs.getPropertyValue('--wf-pano-rotate'))||25;
      depth=parseFloat(cs.getPropertyValue('--wf-pano-depth'))||250;
    }

    function render(ms){
      var R=(S*0.5)/Math.sin(rot*Math.PI/360);
      for(var i=0;i<n;i++){
        var p=center-i;
        p=((p%n)+n+n/2)%n-n/2;                     // loop infinito
        var ac=1-Math.cos(p*rot*Math.PI/180);
        var el=cards[i];
        // La que da la vuelta salta de +n/2 a -n/2: si transicionara, cruzaria
        // la pantalla de lado a lado. Detras de la mascara, nadie ve el corte.
        el.style.setProperty('--wf-pano-dur',(Math.abs(p)>3?0:ms)+'ms');
        el.style.transform='translateX('+(-p*S+p*(S/3)*ac).toFixed(3)+'px) translateZ('+
          (R*ac-depth).toFixed(3)+'px) rotateY('+(p*rot).toFixed(3)+'deg)';
        el.style.setProperty('--wf-pano-op',Math.max(0.2,1-Math.abs(p)*1.8).toFixed(4));
        el.setAttribute('aria-current',Math.abs(p)<0.5?'true':'false');
      }
    }

    function go(i,ms){center=i;render(RM.matches?0:(ms==null?DUR:ms));}
    function stop(){clearInterval(timer);}
    function auto(){
      stop();
      var ms=parseInt(root.getAttribute('data-wf-pano-autoplay'),10);
      if(RM.matches||!visible||!(ms>0))return;
      timer=setInterval(function(){go(Math.round(center)+1);},ms);
    }

    root.addEventListener('pointerdown',function(e){
      if(e.button)return;
      drag={x:e.clientX,c:center};moved=0;
      if(root.setPointerCapture)root.setPointerCapture(e.pointerId);
      root.classList.add('is-drag');stop();
    });
    root.addEventListener('pointermove',function(e){
      if(!drag)return;
      var dx=e.clientX-drag.x;
      if(Math.abs(dx)>moved)moved=Math.abs(dx);
      center=drag.c-dx/S;
      render(0);                                   // durante el arrastre: 0ms
    });
    function end(){
      if(!drag)return;
      drag=null;root.classList.remove('is-drag');
      go(Math.round(center));                      // snap al entero mas cercano
      auto();
    }
    root.addEventListener('pointerup',end);
    root.addEventListener('pointercancel',end);
    // Soltar un arrastre encima de una tarjeta-enlace dispara click y navega: la
    // persona queria mover el carrusel, no entrar. Captura, para llegar antes.
    root.addEventListener('click',function(e){
      if(moved>6){e.preventDefault();e.stopPropagation();}
    },true);

    root.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight')go(Math.round(center)+1);
      else if(e.key==='ArrowLeft')go(Math.round(center)-1);
      else return;
      stop();
    });
    root.addEventListener('focusin',function(e){
      stop();
      for(var i=0;i<n;i++){if(cards[i]===e.target||cards[i].contains(e.target)){go(i);return;}}
    });
    root.addEventListener('focusout',function(e){
      if(!root.contains(e.relatedTarget))auto();
    });

    window.addEventListener('resize',function(){cfg();render(0);});

    // El atributo cambia el layout de fila-con-scroll (el que se ve sin JS) al
    // cilindro. Va ANTES de medir: si no, offsetWidth es el de la fila.
    root.setAttribute('data-wf-pano-ready','');
    cfg();
    render(0);

    // Gate de visibilidad medido: threshold 1, o sea con el bloque entero a la
    // vista. Se acota al alto del viewport porque si el bloque es mas alto que la
    // pantalla el 1.0 no se cumple NUNCA y el autoplay no arrancaria jamas.
    if(window.IntersectionObserver){
      var th=Math.min(1,(window.innerHeight||0)/(root.offsetHeight||1))||1;
      new window.IntersectionObserver(function(es){
        visible=!!es[0].isIntersecting;
        if(visible)auto();else stop();
      },{threshold:th}).observe(root);
    }
  });
})();
`.trim();

/** Script listo para pegar antes de </body>. */
export function renderPanoramaSlider3DScript(): string {
  return `<script>${PANORAMA_SLIDER_3D_JS}</script>`;
}
