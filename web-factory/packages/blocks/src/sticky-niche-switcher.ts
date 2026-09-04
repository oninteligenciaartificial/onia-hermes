import { escapeAttribute, escapeHtml } from "./escape";

/**
 * sticky-niche-switcher — "un producto, N rubros" en UNA sola pantalla, sin tabs
 * y sin pedirle un clic al visitante: el scroll hace el recorrido por el.
 *
 * Medido en vivo sobre fanvue.com el 2026-08-18 (Playwright + Chromium) y
 * documentado en
 * data/references/design-sources/fanvue-secciones/sticky-niche-switcher.md.
 * Elegido 1º en RANKING.md de esa misma carpeta. Todo numero de este archivo sale
 * de ahi; nada es "como suele hacerse".
 *
 * POR QUE ESTE BLOQUE Y NO OTRO: CLAUDE.md dice literal "Hay UN solo producto…
 * se vende con packs por rubro" y "No se le vende solo a clinicas: son 7 rubros".
 * Este patron es esa frase hecha pantalla — es el argumento contra la lectura de
 * "esto es un software dental".
 *
 * POR QUE SIN GSAP (autorizado en la casa, pero aca no compra nada): el original
 * no usa `scrub` ni `pin` (`vars.scrub === undefined` y `pin: false` en los 4
 * triggers medidos con la API de ScrollTrigger). Es un conmutador DISCRETO por
 * umbral — exactamente lo que un IntersectionObserver hace gratis — y el pegado
 * ya es `position: sticky` puro. Fanvue paga 113,8 KB crudos (GSAP 70,7 +
 * ScrollTrigger 43,1) = 76 % del presupuesto ONIA de 150 KB para una sola
 * seccion. Aca son ~800 B: JS decide UN entero (`--wf-niche-i`) y el CSS deriva
 * de ese entero los dos rodillos, la opacidad de las palabras y la pildora.
 *
 * POR QUE NO SE REUSA `data-wf-scrub` de motion.ts, que es el primitivo de la
 * casa para scroll+sticky: ese lee `getBoundingClientRect()` del track en cada
 * evento de scroll y cruza frames por opacidad. Aca la foto NO se cruza por
 * opacidad — es un rodillo (una tira que se traslada un slot exacto por rubro,
 * medido: `-331,188 px` por paso), y el indice tiene que existir como NUMERO en
 * CSS para que el calc funcione con cualquier n. Distinta mecanica, no la misma
 * con otra ropa.
 *
 * TRES DESVIACIONES DELIBERADAS DEL ORIGINAL, las tres medidas como mejora:
 *   1. UNA sola capa de animacion. En Fanvue la palabra tarda 685 ms y la foto
 *      495 ms porque un `transition: opacity .2s` de CSS persigue los valores
 *      inline que GSAP escribe cada frame. Es un accidente de dos sistemas
 *      encimados, no diseño. Aca anima solo el CSS: .5s cubic-bezier(.25,.46,.45,.94)
 *      (la cuadratica de salida real, ajustada con error <= 0,015 al muestreo rAF).
 *   2. `prefers-reduced-motion` de verdad. Fanvue no lo trata (verificado
 *      recargando con emulateMedia: mismo rodillo en translate(0%,-200%)).
 *   3. Teclado recuperado: `<a href>` + `aria-current`. Ellos lo perdieron al
 *      rehacer la seccion (sus palabras son `<div>` sin href, sin tabindex, sin
 *      role). Eso no se copia.
 *
 * SE ARRANCA SIN LA DERIVA VERTICAL de las tarjetas (§2.7 del doc): es una tabla
 * a mano de 8 valores, no una formula, y es lo primero que se rompe al cambiar
 * de tipografia o de cantidad de rubros. Se agrega despues, mirando la pantalla.
 *
 * REGLA ONIA QUE MANDA SOBRE EL DISEÑO: `metric` es dato de cliente. Con cero
 * clientes pagando esta PROHIBIDO inventar cifras o negocios, asi que el bloque
 * tiene que verse bien con `metric` vacio en los cinco rubros — por eso la
 * pildora se ACORTA sola en vez de romperse, y por eso sin negocio ni avatar ni
 * metrica no hay pildora.
 */

export type NichePhoto = {
  src: string;
  /** Alt obligatorio: la captura ES el argumento del rubro, nunca decoracion. */
  alt: string;
  srcset?: string;
  sizes?: string;
};

export type NicheItem = {
  /** Ancla y atribucion. Sin id el rubro no se renderiza. */
  id: string;
  /** La palabra grande. Sin palabra el rubro no se renderiza. */
  word: string;
  /** Link al pack del rubro. Sin href se renderiza un <span> (pierde teclado, no rompe). */
  href?: string;
  /** Tarjeta izquierda. */
  photoLeft?: NichePhoto;
  /** Tarjeta derecha: rueda en sentido contrario, medido `yPercent: +100 * i`. */
  photoRight?: NichePhoto;
  /** Nombre del negocio en la pildora. */
  business?: string;
  avatar?: { src: string; alt?: string };
  /** Linea al 50 % de opacidad. Dato de cliente: vacio hasta tener un caso real y autorizado. */
  metric?: string;
};

export type StickyNicheSwitcherProps = {
  /** Los rubros, en orden. Menos de 2 no es un conmutador: es una foto con texto. */
  niches: ReadonlyArray<NicheItem>;
  /** Linea corta sobre las palabras. Vive DENTRO del pegado, asi que no se va con el scroll. */
  eyebrow?: string;
  /**
   * Px de scroll por rubro. Medido 750 en >=1440. Piso 600: el tablet de Fanvue
   * usa 265 px contra una transicion de 500 ms, o sea que un scroll normal
   * atraviesa 2-3 rubros antes de que termine la primera animacion.
   */
  scrollPerNiche?: number;
  /** Nombre accesible de la lista de rubros. */
  label?: string;
  id?: string;
};

const STEP_FLOOR = 600;
const DEFAULT_STEP = 750;

/** Cada rodillo necesita UNA celda por rubro: un hueco se ve como un frame en blanco. */
function fullColumn<T>(items: ReadonlyArray<NicheItem>, pick: (n: NicheItem) => T | undefined): T[] | null {
  const cells = items.map(pick).filter((c): c is T => c !== undefined);
  return cells.length === items.length ? cells : null;
}

function photoCell(photo: NichePhoto): string {
  // Todas lazy, incluida la primera: este bloque va a media pagina, nunca es el
  // LCP, y las otras n-1 estan a <= 1 400 px del viewport dentro del rodillo, o
  // sea muy dentro del margen con que el navegador precarga lo lazy.
  return `<img class="wf-niche-shot" src="${escapeAttribute(photo.src.trim())}" alt="${escapeAttribute(photo.alt.trim())}"
                 width="282" height="331" loading="lazy" decoding="async"
                 ${photo.srcset?.trim() ? `srcset="${escapeAttribute(photo.srcset.trim())}"` : ""}
                 ${photo.sizes?.trim() ? `sizes="${escapeAttribute(photo.sizes.trim())}"` : ""}>`;
}

function avatarCell(item: NicheItem): string {
  const src = item.avatar?.src.trim();
  if (src) {
    return `<img class="wf-niche-face" src="${escapeAttribute(src)}" alt="" width="22" height="22" loading="lazy" decoding="async">`;
  }
  // Monograma: la inicial del negocio. Es dato propio, no una cara de stock.
  const initial = (item.business ?? "").trim().charAt(0).toUpperCase();
  return `<svg class="wf-niche-face" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="12" fill="currentColor" opacity=".24"></circle>
              <text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${escapeHtml(initial)}</text>
            </svg>`;
}

export function renderStickyNicheSwitcher({
  niches,
  eyebrow,
  scrollPerNiche = DEFAULT_STEP,
  label = "Rubros que cubre la plataforma",
  id = "rubros",
}: StickyNicheSwitcherProps): string {
  const items = niches.filter((n) => n.id.trim() && n.word.trim());

  // Con 1 rubro el conmutador miente ("un producto, N rubros" con N = 1) y el
  // runway serian 1 500 px de scroll para no conmutar nada.
  if (items.length < 2) return "";

  const left = fullColumn(items, (n) => (n.photoLeft?.src.trim() ? n.photoLeft : undefined));
  const right = fullColumn(items, (n) => (n.photoRight?.src.trim() ? n.photoRight : undefined));

  // Sin una columna completa de fotos no hay bloque: el rodillo es la mitad del
  // argumento y una ventana vacia al lado de las palabras se lee como un error.
  const primary = left ?? right;
  if (!primary) return "";
  const secondary = left && right ? right : null;

  // La pildora es una sola, sobre la tarjeta principal: con dos mostraria el
  // mismo negocio dos veces en la misma pantalla.
  const faces = fullColumn(items, (n) =>
    n.avatar?.src.trim() || (n.business ?? "").trim() ? n : undefined,
  );
  const names = fullColumn(items, (n) => ((n.business ?? "").trim() ? n : undefined));
  const pill =
    faces || names
      ? `<div class="wf-niche-pill" aria-hidden="true">
            ${
              faces
                ? `<span class="wf-niche-av"><span class="wf-niche-av-roll">${faces.map(avatarCell).join("")}</span></span>`
                : ""
            }
            ${
              names
                ? `<span class="wf-niche-win-text"><span class="wf-niche-rows">${names
                    .map(
                      (n) =>
                        `<span class="wf-niche-row">${escapeHtml((n.business ?? "").trim())}${
                          (n.metric ?? "").trim()
                            ? `<b class="wf-niche-dot"></b><i class="wf-niche-metric">${escapeHtml((n.metric ?? "").trim())}</i>`
                            : ""
                        }</span>`,
                    )
                    .join("")}</span></span>`
                : ""
            }
          </div>`
      : "";

  const card = (photos: ReadonlyArray<NichePhoto>, side: "l" | "r", withPill: boolean): string =>
    `<div class="wf-niche-card wf-niche-card--${side}">
        <div class="wf-niche-roll">${photos.map(photoCell).join("")}</div>
        ${withPill ? pill : ""}
      </div>`;

  const words = items
    .map((n, i) => {
      const current = i === 0 ? ' aria-current="true"' : ' aria-current="false"';
      const inner = escapeHtml(n.word.trim());
      const href = n.href?.trim();
      return `<li class="wf-niche-item" id="${escapeAttribute(`${id}-${n.id.trim()}`)}">${
        href
          ? `<a class="wf-niche-word" href="${escapeAttribute(href)}" data-wf-niche-word${current}>${inner}</a>`
          : `<span class="wf-niche-word" data-wf-niche-word${current}>${inner}</span>`
      }</li>`;
    })
    .join("");

  const step = Math.max(STEP_FLOOR, Math.round(scrollPerNiche));

  // Un centinela por rubro, repartidos cada `step`. El reparto real medido es
  // `alto_del_runway / (n + 1)`, NO `/ n`: ese +1 compra los dos colchones — el
  // primer rubro se lee un rato antes de que empiece a cambiar (885 px medidos)
  // y el ultimo no se evapora al despegarse (735 px). Verificado: 4500/6 = 750.
  const marks = items
    .map(
      (_, k) =>
        `<i class="wf-niche-mark" data-wf-niche-mark style="top:calc(var(--wf-niche-step) * ${k})"></i>`,
    )
    .join("");

  return `
    <section class="wf-niche" id="${escapeAttribute(id)}" data-wf-niche
             style="--wf-niche-step:${step}px;--wf-niche-run:${items.length + 1}">
      <div class="wf-niche-runway">
        <div class="wf-niche-marks" aria-hidden="true">${marks}</div>

        <div class="wf-niche-stage${secondary ? "" : " wf-niche-stage--one"}">
          ${card(primary, "l", true)}
          <div class="wf-niche-mid">
            ${eyebrow?.trim() ? `<p class="wf-niche-eyebrow">${escapeHtml(eyebrow.trim())}</p>` : ""}
            <ol class="wf-niche-words" aria-label="${escapeAttribute(label)}">${words}</ol>
          </div>
          ${secondary ? card(secondary, "r", false) : ""}
        </div>
      </div>
    </section>
  `;
}

/**
 * Estilos solo con tokens del cliente.
 *
 * POLARIDAD: la seccion invierte (fondo --color-fg, tinta --color-bg), igual que
 * newsletter-band. La escena medida es un fondo verde oliva oscuro rgb(53,65,48)
 * con palabras blancas; invertir a la tinta del cliente reproduce ese contraste
 * sin shippear un color literal, y le da a la pildora el fondo oscuro que su
 * backdrop-filter necesita para leerse sobre cualquier captura.
 *
 * Nota: sin backticks en los comentarios — esto vive dentro de un template
 * literal y uno suelto corta la hoja a la mitad.
 */
export const STICKY_NICHE_SWITCHER_CSS = `
/*
 * El bloque trae su propio border-box: los anchos de la tarjeta y de la ventana
 * de la pildora son geometria medida (282 x 331 y 28,8 px de alto), y con el
 * modelo de caja de contenido el padding de la pildora se sumaria al alto de la
 * ventana y el rodillo de nombres dejaria de calzar en su slot. Un bloque que
 * publica su hoja no puede depender de que la pagina anfitriona traiga reset.
 */
.wf-niche, .wf-niche * { box-sizing: border-box; }

.wf-niche {
  /* JS solo escribe este entero; todo lo demas se deriva aca. */
  --wf-niche-i: 0;
  --wf-niche-slot: 331px;          /* alto de tarjeta medido: 331,19 px */
  --wf-niche-stage: 630px;         /* alto del pegado medido */
  --wf-niche-dur: .5s;             /* duracion declarada en los 28 tweens del original */
  --wf-niche-ease: cubic-bezier(.25, .46, .45, .94);
  --wf-niche-pill-h: 28.8px;       /* ventana de la pildora = line-height del item */
  --wf-niche-av: 21.6px;

  background: var(--color-fg);
  color: var(--color-bg);
}

/*
 * El runway es el unico alto del bloque. NINGUN ancestro puede llevar
 * overflow:hidden o el sticky deja de pegarse.
 */
.wf-niche-runway {
  position: relative;
  height: calc(var(--wf-niche-step) * var(--wf-niche-run));
}

.wf-niche-marks { position: absolute; inset: 0; pointer-events: none; }

/*
 * Cada centinela es una BANDA de un rubro de alto, no un punto de 1 px. Con
 * puntos, un scroll rapido puede saltarlos entre dos frames sin que su
 * interseccion cambie nunca y el observador no despierta. Con bandas contiguas
 * hay siempre una tocando el viewport, y el borde entre dos bandas garantiza el
 * aviso: la de arriba deja de intersecar en el mismo pixel en que la de abajo
 * toma el techo. 1 px de ancho y sin contenido: no puede empujar nada.
 */
.wf-niche-mark { position: absolute; left: 0; width: 1px; height: var(--wf-niche-step); }

/*
 * El top de 135px del original NO es un numero suelto: es el pegado centrado en
 * el viewport. Se ve en dos de los tres anchos medidos — 1440: (900-630)/2 = 135
 * exacto; 768: (1024-409,6)/2 = 307,2 exacto. Escrito como formula, el centrado
 * se sostiene en cualquier alto de pantalla en vez de cortar la tarjeta abajo en
 * un portatil de 768 px de alto.
 */
.wf-niche-stage {
  position: sticky;
  top: max(16px, calc((100vh - var(--wf-niche-stage)) / 2));
  min-height: var(--wf-niche-stage);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(16px, 3vw, 56px);
  padding: 0 clamp(16px, 4vw, 64px);
}

/* Una sola columna de fotos: la escena se recompone en vez de dejar un hueco. */
.wf-niche-stage--one { grid-template-columns: auto minmax(0, 1fr); }

.wf-niche-mid { text-align: center; }

.wf-niche-eyebrow {
  margin: 0 0 clamp(16px, 2vw, 28px);
  color: color-mix(in srgb, var(--color-bg) 62%, transparent);
  font-size: .82rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.wf-niche-words {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .29em;                      /* 23,4 px sobre 81 px medidos */
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
 * Tipografia medida: peso 500, line-height por debajo de 1 y tracking negativo.
 * El maximo baja de los 81 px del original a 3.4rem porque nuestros rubros son
 * frases ("Servicios profesionales"), no palabras sueltas: a 81 px la frase se
 * come las dos tarjetas.
 */
.wf-niche-word {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 3.4vw, 3.4rem);
  font-weight: 500;
  line-height: .85;
  letter-spacing: -.0037em;
  color: inherit;
  text-decoration: none;
  opacity: .25;                    /* opacidad inactiva medida */
  transition: opacity var(--wf-niche-dur) var(--wf-niche-ease);
}

.wf-niche-word[aria-current="true"] { opacity: 1; }

.wf-niche-word:hover { opacity: .7; }
.wf-niche-word[aria-current="true"]:hover { opacity: 1; }

.wf-niche-word:focus-visible {
  outline: 2px solid var(--color-bg);
  outline-offset: 6px;
  border-radius: 6px;
  opacity: 1;
}

/*
 * La tarjeta ES la ventana: overflow hidden + una tira interior que se traslada
 * un slot exacto por rubro. Medido asi, y no como cross-fade: no hay un solo
 * frame con dos fotos a media opacidad encima, y es mas barato de componer.
 */
.wf-niche-card {
  position: relative;
  width: calc(var(--wf-niche-slot) * .853);   /* relacion medida 282,59/331,19 */
  height: var(--wf-niche-slot);
  border-radius: 16px;
  overflow: hidden;
}

.wf-niche-roll {
  display: flex;
  flex-direction: column;
  transform: translateY(calc(var(--wf-niche-i) * var(--wf-niche-slot) * -1));
  transition: transform var(--wf-niche-dur) var(--wf-niche-ease);
}

/*
 * La tira derecha rueda al reves: medido yPercent +100 contra -100 en el
 * original. Pero el signo SOLO no alcanza, y esto costo una medicion: con la
 * tira anclada arriba y las celdas en orden, translateY POSITIVO empuja la
 * celda 0 fuera de la ventana por abajo y no trae ninguna otra — la tarjeta
 * derecha quedaba VACIA en todos los estados menos el primero (medido: en i=1 e
 * i=2 ningun <img> solapaba el rect de la ventana). En el original el +100
 * funciona porque esa lista esta invertida por CSS, igual que la de metricas
 * (column-reverse medido en §2.5 del doc).
 * Las dos piezas que lo hacen funcionar, juntas:
 *   · anclada ABAJO: en reposo la ventana muestra el ultimo tramo de la tira,
 *   · column-reverse: y ese ultimo tramo es la celda 0, con la 1 justo encima.
 * Asi translateY(+slot) baja la tira y descubre la celda siguiente.
 */
.wf-niche-card--r .wf-niche-roll {
  position: absolute;
  inset: auto 0 0;
  flex-direction: column-reverse;
  transform: translateY(calc(var(--wf-niche-i) * var(--wf-niche-slot)));
}

.wf-niche-shot {
  display: block;
  width: 100%;
  height: var(--wf-niche-slot);
  object-fit: cover;
}

/*
 * Pildora: una sola ventana con dos rodillos adentro. El original anima ademas
 * el ANCHO de la lista con el offsetWidth del nombre activo para que el punto
 * separador quede pegado; aca el separador viaja DENTRO de la misma fila, asi
 * que queda pegado solo y nos ahorramos una lectura de layout en JS por paso.
 * El precio es unos px de fondo translucido de mas en los nombres cortos.
 */
.wf-niche-pill {
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--wf-niche-pill-h);
  max-width: calc(100% - 20px);
  padding: 0 9px;
  border-radius: 5.4px;
  background: color-mix(in srgb, var(--color-fg) 34%, transparent);
  backdrop-filter: blur(12px);
  color: var(--color-bg);
  overflow: hidden;
}

.wf-niche-av {
  flex: none;
  width: var(--wf-niche-av);
  height: var(--wf-niche-av);
  border-radius: 50%;
  overflow: hidden;
}

.wf-niche-av-roll {
  display: block;
  transform: translateY(calc(var(--wf-niche-i) * var(--wf-niche-av) * -1));
  transition: transform var(--wf-niche-dur) var(--wf-niche-ease);
}

.wf-niche-face {
  display: block;
  width: var(--wf-niche-av);
  height: var(--wf-niche-av);
  border-radius: 50%;
  object-fit: cover;
}

/* La regla que hace el rodillo de texto: alto de ventana == line-height de la fila. */
.wf-niche-win-text { display: block; height: var(--wf-niche-pill-h); overflow: hidden; }

.wf-niche-rows {
  display: block;
  transform: translateY(calc(var(--wf-niche-i) * var(--wf-niche-pill-h) * -1));
  transition: transform var(--wf-niche-dur) var(--wf-niche-ease);
}

.wf-niche-row {
  display: flex;
  align-items: center;
  gap: 5px;
  height: var(--wf-niche-pill-h);
  font-size: 10.8px;
  line-height: var(--wf-niche-pill-h);
  font-weight: 500;
  white-space: nowrap;
}

.wf-niche-dot {
  width: 2.7px;
  height: 2.7px;
  border-radius: 50%;
  background: currentColor;
  opacity: .5;
}

.wf-niche-metric { font-style: normal; opacity: .5; }

@media (max-width: 64em) {
  .wf-niche { --wf-niche-slot: 250px; --wf-niche-stage: 520px; }
}

/*
 * Debajo de 48em las dos tarjetas de 282 px no entran al lado de las palabras, y
 * el mismo apilado sirve para reduced-motion. Los centinelas se apagan: sin
 * ellos el indice se queda en 0 y --wf-niche-i deja de mover nada.
 */
@media (max-width: 47.99em), (prefers-reduced-motion: reduce) {
  .wf-niche-runway { height: auto; padding: clamp(48px, 9vw, 96px) 0; }
  .wf-niche-marks { display: none; }

  .wf-niche-stage {
    position: static;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /*
   * Las palabras PRIMERO. En el DOM la tarjeta va antes porque en escritorio
   * ocupa la columna izquierda; apilado tal cual, el visitante de movil se come
   * las 5 capturas antes de leer un solo rubro — o sea la prueba antes que la
   * afirmacion. Medido en 375: la tira apilada mide ~1 700 px de alto.
   */
  .wf-niche-mid { order: -1; }

  /* Todas las palabras legibles: sin conmutador, nadie pierde un rubro. */
  .wf-niche-word { opacity: 1; }

  /*
   * La tarjeta deja de ser ventana y muestra la tira entera: la foto k queda en
   * el mismo orden que la palabra k, asi que la informacion sigue completa.
   * La segunda columna se cae porque repetiria el mismo recorrido de rubros.
   */
  .wf-niche-card {
    width: min(100%, 282px);
    height: auto;
    margin: clamp(24px, 5vw, 40px) auto 0;
    overflow: visible;
  }

  .wf-niche-card--r { display: none; }
  .wf-niche-roll { transform: none; }
  .wf-niche-shot { height: auto; aspect-ratio: 282 / 331; margin-bottom: 12px; border-radius: 16px; }
  .wf-niche-pill { display: none; }
}

/*
 * ⚠️ transition: none — NUNCA transition-duration: 0.01ms. Con 0.01ms las
 * propiedades discretas siguen animando y el estado queda a medio camino,
 * invisible pero vivo. Ya nos paso con un dialogo.
 */
@media (prefers-reduced-motion: reduce) {
  .wf-niche-word,
  .wf-niche-roll,
  .wf-niche-av-roll,
  .wf-niche-rows {
    transition: none;
    animation: none;
  }

  .wf-niche-pill { backdrop-filter: none; }
}
`.trim();

/**
 * Runtime del bloque. Vanilla, cero dependencias, como el resto de la fabrica.
 *
 * Lo unico que hace: decidir el entero. Un centinela por rubro apilado en el
 * runway, y gana el ultimo cruzado. El observador entrega un estado inicial por
 * cada elemento observado, asi que una recarga a mitad del runway (o un enlace
 * profundo) arranca en el rubro correcto sin leer el scroll.
 *
 * Sin guardas de matchMedia a proposito: el CSS ya neutraliza el indice debajo
 * de 48em y bajo reduced-motion (los centinelas van display:none, sus rects son
 * cero y el indice se queda en 0). Una guarda de JS solo agregaria un bug al
 * cambiar de tamaño la ventana.
 *
 * POR QUE RELEE LA GEOMETRIA DE TODOS LOS CENTINELAS en cada aviso, en vez de
 * quedarse con el estado que trae cada entrada del observador (que es lo que
 * parece barato): acumular estado por centinela ESTA ROTO y se midio. En un
 * salto de scroll — un ancla, un arrastre de la barra, un flick — un centinela
 * pasa de abajo del viewport a arriba sin intersecar en ningun frame, asi que
 * no genera entrada y su ultimo estado sigue mandando. Medido saltando de
 * y=3920 a y=2050 en 1440x900: el indice se quedaba en 4 en vez de volver a 1 y
 * la seccion se veia clavada en el ultimo rubro, con las palabras y los dos
 * rodillos en el estado equivocado. Releer son n rects dentro de un callback
 * que solo ocurre al cruzar un borde de banda: sale gratis y no puede quedar
 * viejo.
 */
export const STICKY_NICHE_SWITCHER_JS = `
(function(){
  var roots=[].slice.call(document.querySelectorAll('[data-wf-niche]'));
  if(!roots.length||!('IntersectionObserver' in window))return;

  roots.forEach(function(root){
    var marks=[].slice.call(root.querySelectorAll('[data-wf-niche-mark]'));
    var words=[].slice.call(root.querySelectorAll('[data-wf-niche-word]'));
    if(marks.length<2)return;
    var cur=0;

    function set(i){
      if(i===cur)return;                                   // sin escrituras de estilo por frame
      cur=i;
      root.style.setProperty('--wf-niche-i',i);
      words.forEach(function(w,k){w.setAttribute('aria-current',k===i?'true':'false');});
    }

    // Se relee la geometria de TODOS: el estado que trae cada entrada se queda
    // viejo cuando un salto de scroll saltea un centinela. El por que, medido,
    // esta arriba en el comentario de este export.
    var io=new IntersectionObserver(function(){
      var i=0;
      for(var k=0;k<marks.length;k++)if(marks[k].getBoundingClientRect().top<0)i=k;
      set(i);
    },{threshold:0});

    marks.forEach(function(m){io.observe(m);});
  });
})();
`.trim();

/** Script listo para pegar antes de </body>. */
export function renderStickyNicheSwitcherScript(): string {
  return `<script>${STICKY_NICHE_SWITCHER_JS}</script>`;
}
