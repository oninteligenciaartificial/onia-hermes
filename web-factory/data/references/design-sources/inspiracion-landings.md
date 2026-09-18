# Grupo: inspiracion-landings

Cosecha 2026-08-16. Fuentes: Dribbble (landing pages populares 2026), Lapa Ninja
(la fuente "7,300+ landing page examples"), Fontpair.

Nota de cobertura previa: las tres fuentes YA figuran a nivel politica en
`web-factory/SOURCES.md` (seccion 5b) y `DESIGN_STACK.md` como una linea cada una
("inspiracion visual/mood", "landing research por categoria", "pairing tipografico").
Este archivo profundiza lo que NO estaba: patrones concretos, taxonomia y pares
tipograficos con uso recomendado.

---

## 1. Dribbble — shots de landing pages (dribbble.com/tags/landing-page)

**Que es.** Galeria social de disenio; los shots de landing son mockups estaticos
(muchos nunca shippeados). Fetch directo bloqueado (pagina vacia para scrapers);
lo siguiente viene de WebSearch sobre Dribbble Select 2026 y roundups de tendencias
que citan shots populares.

**Que ofrece concretamente.**
- Shots populares 2026 tipo "Cerebra" (Wavespace): landing de ciberseguridad con
  fondo oscuro en capas, tipografia precisa y contenido modular.
- Patrones recurrentes en los shots top del anio: hero con tipografia oversized que
  reemplaza (o convive con) la imagen hero; dark mode de alto contraste con
  elementos flotantes que simulan movimiento; bento grids "activos" (el tile se
  abre, reproduce video o revela capa extra al hover); glassmorphism sutil (capas
  translucidas finas, no el blur pesado de 2021); motion liviano CSS/JS (CTA que
  pulsa al entrar al viewport, producto que scrollea detras del texto).
- Dribbble Select (curaduria anual) como filtro de calidad frente al feed general.

**Ideas transferibles a nuestras webs/dashboards.**
1. Hero tipografico sin imagen: headline oversized (clamp 3rem-8rem) + una sola
   linea de subcopy + CTA; util cuando el cliente no tiene fotos buenas (caso
   frecuente en rubros locales).
2. Bento grid activo para la seccion de features: 4-6 tiles desiguales, el tile
   grande revela un mini-clip o cifra al hover; degrade honesto a estatico en mobile.
3. Dark hero de alto contraste SOLO para rubros tech/seguridad/SaaS: fondo casi
   negro, una capa flotante con parallax leve, acento unico de color en el CTA.
4. CTA con pulso unico al entrar al viewport (IntersectionObserver, una vez, no
   loop) — llama la atencion sin ruido; respeta prefers-reduced-motion.
5. Producto que scrollea detras de un overlay de texto sticky: patron scrollytelling
   barato para mostrar un dashboard/app sin video.
6. Glass sutil para tarjetas sobre foto de fondo (blur 8-12px, borde 1px blanco 15%):
   sirve en restaurantes/hoteles donde la foto ES el contenido.
7. Capas con profundidad en el hero: mockup del producto rotado 2-4 grados con
   sombra larga + chip flotante con un KPI real encima — vende "sistema vivo" en
   propuestas de la plataforma.

**Que NO copiar y por que.**
- Layouts/assets/copy de shots concretos: derechos del autor de cada shot; ademas
  SOURCES.md ya lo prohibe ("no copiar layout, assets, copy ni marca").
- El overdesign tipico de Dribbble: shots que nunca pasaron por contenido real,
  formularios, estados de error ni mobile. Choca con nuestro Content rule
  ("solo datos que ayudan a decidir").
- Heros 3D/WebGL pesados: rompen el presupuesto de LCP < 2.5s de nuestras reglas web.
- Dark-mode-first por defecto: nuestros rubros (dental, comercio, ganadero) piden
  claridad y confianza, no estetica gamer. Dark solo si el rubro lo justifica.

**Licencia/costo.** Gratis para mirar; cada shot es copyright de su autor. Sin
licencia de reuso. Scraping bloqueado.

**Veredicto: INSPIRAR** (solo mood y patrones; jamas fuente de codigo ni layout).

---

## 2. Lapa Ninja — "7,300+ landing page examples" (lapa.ninja)

**Que es.** La fuente "landing page design examples 7300" del encargo ES Lapa Ninja
(confirmado por busqueda: "Landing Page Design Examples: 7,300+ Best Landing Pages |
Lapa Ninja"; Landingfolio no publica esa cifra). Galeria de landings REALES desde
2015: 7.300+ ejemplos, 15.000+ screenshots full-page y grabaciones de video.
Fetch directo devuelve 403 (Cloudflare, igual que Landbook en el smoke 2026-06-24):
cosecha manual o via el harvester Playwright con navegador real, no via WebFetch.

**Que ofrece concretamente.**
- Taxonomia por industria (SaaS, business, ecommerce, AI, health, food, real
  estate...), por color, por anio y por plataforma.
- Colecciones tipograficas navegables: `/typeface/` (categorias de tipografia),
  `/category/typography/` (712 landings donde la tipografia es protagonista),
  `/collection/serif-fonts/` (172 ejemplos), `/collection/mono-fonts/` (77 ejemplos).
- Cada entrada trae screenshot full-page + metadata: paleta de colores y fuentes
  usadas. Eso permite responder "que tipografia usan las landings de salud que
  funcionan" con ejemplos reales, no mockups.
- Blog (blog.lapa.ninja) con roundups y recursos.

**Ideas transferibles a nuestras webs/dashboards.**
1. Usar sus colecciones de fuente como validador del brand-kit: antes de fijar la
   tipografia de un cliente, mirar 5 landings reales del mismo rubro en Lapa y
   confirmar que el registro (serif elegante vs sans neutra) coincide con el rubro.
2. Filtrar por industria = benchmark de estructura por rubro: extraer el ORDEN de
   secciones (hero → prueba → oferta → FAQ → CTA) de 3-5 ejemplos del rubro y
   alimentar el pattern bank, sin copiar ninguno.
3. La coleccion mono-fonts como referencia para superficies "tecnicas" nuestras
   (docs de API, paneles dev, pricing de planes tecnicos): mono solo en datos y
   cifras, nunca en body.
4. Metadata de paleta por ejemplo: contrastar la paleta del cliente contra las
   dominantes de su industria — si todo el rubro es azul-confianza y el cliente
   quiere violeta, es decision consciente, no accidente.
5. Screenshots full-page (no solo hero): estudiar como resuelven el "valle" del
   medio de la pagina (entre hero y pricing), donde nuestras landings tienden a
   rellenar con tarjetas decorativas.
6. Los video recordings de landings: referencia gratis de ritmo de scroll y reveals
   reales (que porcentaje del viewport dispara la animacion) para calibrar nuestro
   `data-reveal`.
7. Filtro por anio: comparar 2024 vs 2026 del mismo rubro para detectar que patron
   ya envejecio antes de proponerlo a un cliente.

**Que NO copiar y por que.**
- Codigo, HTML/CSS, copy o assets de los sitios indexados: Lapa solo indexa
  screenshots de sitios de terceros; no hay licencia alguna de reuso. SOURCES.md ya
  lo clasifica "inspiracion solamente" y el limite comercial lo lista como
  "codigo restringido".
- Screenshots como assets de cliente o en propuestas: mismo problema de derechos.
- Sesgo de la galeria: sobre-representa SaaS/startup en ingles; el ritmo textual
  no traduce directo a rubros bolivianos (dental, ganadero) que necesitan mas
  prueba local y menos jerga.

**Licencia/costo.** Navegacion gratis; contenido indexado es copyright de cada
sitio. Sin API oficial; 403 a fetchers.

**Veredicto: ADOPTAR como fuente de research estructural** (ya estaba en la
politica; lo nuevo: usar sus colecciones tipograficas y metadata de paleta/fuente
como validador por rubro). Codigo: nunca.

---

## 3. Fontpair — pares tipograficos (fontpair.co)

**Que es.** Directorio curado de pares de Google Fonts (heading + body), organizado
por categoria (sans/serif/display/mono/handwriting), con brand kits (tipografia +
paleta) y libreria buscable. Todo apunta a Google Fonts, o sea licencia OFL: apto
para sitios de cliente sin costo.

**Que ofrece concretamente — pares cosechados (agosto 2026), con uso recomendado
para nuestros rubros.**

| # | Heading | Body | Categoria | Uso recomendado ONIA |
|---|---|---|---|---|
| 1 | Work Sans | Bitter | Sans + Serif | Clinicas/salud: moderno arriba, serif legible y calido en cuerpo largo (tratamientos, FAQ). |
| 2 | Epilogue | Baskervville | Sans + Serif | Legal/finanzas/consultoria: headline contemporaneo + cuerpo clasico que transmite seriedad. |
| 3 | DM Sans | Staatliches (display en heading) | Display + Sans | Restaurantes/eventos: display condensado para titulos con caracter, DM Sans neutra para menu/detalle. |
| 4 | Montserrat | Google Sans* | Sans + Sans | Comercio/retail generico: geometrica conocida, segura; *Google Sans no esta en Google Fonts — sustituir body por Inter o Figtree. |
| 5 | Libre Franklin | Eczar | Sans + Serif | Editorial/educacion: sans periodistica + serif expresiva; bueno para blogs y paginas de curso. |
| 6 | EB Garamond | DM Mono (acentos) | Serif + Mono | Marca premium/boutique: garamond en titulos, mono SOLO en precios, SKUs y specs — no en parrafos. |
| 7 | Zalando Sans Expanded | Zalando Sans | Sans (familia) | SaaS/plataforma (nuestro propio material): una familia, dos anchos = jerarquia sin cambiar de voz; carga liviana. |
| 8 | Alumni Sans | DM Sans | Sans + Sans | Servicios locales/industrial: condensada de impacto en headlines, DM Sans en UI; rinde bien en cards densas. |
| 9 | Zalando Sans | JetBrains Mono | Sans + Mono | Dashboards y paneles internos: mono para cifras tabulares y codigos; sans para todo lo demas. |
| 10 | Ysabeau SC | Ysabeau | Sans (SC + normal) | Real estate/arquitectura: small caps en labels y navegacion, normal en cuerpo — elegancia sin serif. |

Patron general del sitio: casi todos los pares son "misma familia en dos pesos/anchos"
o "sans moderna + serif clasica". Los pares display (Metal + EB Garamond) existen
pero son de nicho — no cosechados como recomendables para cliente.

**Ideas transferibles.**
1. Regla de dos fuentes maximo (ya en nuestras web rules) implementada como "una
   familia, dos anchos" (par 7/10): menos requests, jerarquia igual de clara.
2. Mono como acento de datos, nunca como voz (pares 6 y 9): en KPIs de dashboard,
   precios y specs — `font-variant-numeric: tabular-nums` incluido.
3. Brand kits de Fontpair (tipografia + paleta juntas) como formato para nuestros
   client-context: entregar el par tipografico YA emparejado con la paleta, no por
   separado.
4. Mapear registro de rubro a categoria de par: confianza/tradicion → sans+serif;
   tech/plataforma → sans+sans o sans+mono; hospitalidad → display+sans. Decision
   en 1 minuto en vez de explorar 1.500 fuentes.
5. Small caps (Ysabeau SC) para eyebrows/labels de seccion en vez de uppercase con
   letter-spacing manual: mas fino y sin CSS fragil.

**Que NO copiar y por que.**
- "Google Sans" del par Montserrat+Google Sans: es fuente propietaria de Google,
  NO esta en Google Fonts — usarla seria violacion de licencia. Sustituir.
- Pares handwriting/display extremos para sitios de cliente serio: caracter alto,
  legibilidad baja; chocan con el benchmark Bench/Garabato/HSB.
- No copiar el par "porque se ve lindo" sin probarlo con espaniol real: varias
  fuentes render bien en ingles corto pero mal con tildes/enie en cuerpo largo —
  probar con copy real del cliente antes de fijar.

**Licencia/costo.** Sitio gratis; fuentes = Google Fonts (OFL/Apache) → uso
comercial libre, self-host permitido (preferible por performance y privacidad).

**Veredicto: ADOPTAR** (unica de las tres con salida directa a produccion: el par
elegido se instala tal cual; ya estaba como politica de una linea, ahora hay 10
pares concretos mapeados a rubros).

---

## 4. Deck.gallery (reel IG `DdZZmsQtr2-`, 2026-09-18)

**Que es.** Galeria curada de decks, slides, keynotes y brand guidelines «elegidos por su
calidad de disenio» (reports de Lululemon, «The State of Influence», brand guidelines de VEJA).
No son webs: es la unica fuente del stack que ensenia jerarquia y ritmo tipografico en 16:9.

**Para que sirve aca.** Propuestas comerciales (generador `hermes-content/propuestas/`),
imagenes OG (`scripts/marca-personal/generar-og.py`) y la skill `slides`: portadas con una
sola frase grande, cifras a pagina completa, secuencia problema → solucion.

**Regla.** Inspiration-only: se mira estructura y escala, no se copia deck ni asset.
Agregada como `deck-gallery` en `gallery-reference-sources.json`.
