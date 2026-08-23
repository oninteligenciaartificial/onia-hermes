# Prompts del lote del 2026-08-23 — O1 a O18

> **La fuente son estos prompts; las copias viven en [`sesiones/`](sesiones/README.md).**
> Si cambia una regla, se edita **acá**, no la copia.

18 posts entraron, 18 salieron con prompt. Cada uno linkea a su ficha, que trae la
reconstrucción completa, el estilo portable y lo que NO se puede afirmar.

> ⚠️ **Antes de ejecutar cualquiera de estos: leer**
> [`2026-08-23-patrones-de-motion-deduplicados.md`](2026-08-23-patrones-de-motion-deduplicados.md).
> Las 18 fichas propusieron ~25 entradas al banco de motion sin leerse entre sí; ahí están
> reducidas a los 7 patrones reales. **Nadie escribe en `MOTION_PATTERN_BANK_2026.md` sin
> pasar por ese archivo primero.**

## Índice

| # | Item | Destino | Prompt |
|---|---|---|---|
| **O1** | [DaVV7JjIY9I](2026-08-23-oyla-index-html-que-no-parece-ia.md) | `web-factory` | Portar los 4 mecanismos de OYLA al pattern bank y probarlos en un index.html de una pieza |
| **O2** | [DbBUMU2qjfW](2026-08-23-fable5-vs-gpt56-landing-3d-dial.md) | `web-factory` | Patron 'canvas fijado + scrub amortiguado' con escalera de degradacion — al banco de motion y a una demo |
| **O3** | [DbvxMwghtkA](2026-08-23-ascii-magic-v2-filtro-como-transicion.md) | `web-factory` | Teaser de 15 s con filtro-como-transicion (HyperFrames) |
| **O4** | [DcEJDHBTyPY](2026-08-23-30-senales-sitio-vibecoded.md) | `web-factory` | Auditoría anti-vibecoded — 30 señales |
| **O5** | [Daz0cVMBuD8](2026-08-23-molde-anuncio-prueba-externa-astrocat.md) | `marketing` | Plantilla de guion 'Hito con prueba externa' + preset de subtitulo ancla, renderizada en HyperFrames |
| **O6** | [Db9jbZtumB7](2026-08-23-reel-10-laminas-plano-fijo-comment-to-dm.md) | `marketing` | Portar el molde 'plano fijo + N laminas' y el comment-to-DM a un reel de Onia |
| **O7** | [DcPwVniOEKB](2026-08-23-meme-dos-cartas-setup-vivo-remate-congelado.md) | `marketing` | Meme de dos cartas — setup vivo / remate congelado |
| **O8** | DcYiAvqsjij | `marketing` | Molde de 6 movimientos: gancho falso -> prueba cruda -> metodologia -> comentario |
| **O9** | [Db1b33RAh_H](2026-08-23-carrusel-playa-ecuacion-comenta-clase.md) | `marketing` | Carrusel Onia de 4 laminas con el molde gancho-ecuacion-comenta |
| **O10** | [DcBWzXQF1_q](2026-08-23-carrusel-15-laminas-repos-nichados-buildercult.md) | `marketing` | Carrusel Onia de 15 laminas: molde BuilderCult portado al pack por rubro |
| **O11** | [DcWPKNoIEUE](2026-08-23-carrusel-gastos-anclaje-precio-ficha-catalogo.md) | `marketing` | Carrusel "lo que cuesta operar" — molde de anclaje de precio con ficha de catalogo |
| **O12** | [DbtH7_nNRF0](2026-08-23-pov-10000-reels-reveal-zoom-out.md) | `influencers-ia` | Reel ONIA con el molde POV-reveal: 8 s, cero cortes, una sola corriente |
| **O13** | [DcWOss3RxMq](2026-08-23-makeugc-vocera-ia-cerave-seedance-2-0.md) | `influencers-ia` | Vocera IA + producto: el molde de 22 s con CTA mudo |
| **O14** | [DcYNrdROAyg](2026-08-23-lolo-velada-higgsfield-marketing-studio.md) | `influencers-ia` | Molde 'parar el corte sobre la petición' — episodio de marca con CTA comentario→DM |
| **O15** | [DcJbUL6CCp3](2026-08-23-influencer-aesthetic-cinco-escenas-prompt-gateado.md) | `influencers-ia` | Banco de 5 escenas de foto-de-celular para Lucía (sin generar nada) |
| **O16** | [DZurBtZiT9X](2026-08-23-pov-timeline-como-prueba-de-trabajo.md) | `editor-de-videos` | Molde: pantalla filmada en diagonal (prueba de trabajo sin testimonio) |
| **O17** | [Dax5wGigc30](2026-08-23-70-millones-consejos-venta-cronometro-en-plano.md) | `editor-de-videos` | Reel 'lista densa contra reloj' — formato Onia, 58 s en una toma |
| **O18** | [Dbyx3bwE6Mp](2026-08-23-tychs-contador-papas-yolo11-sam2.md) | `editor-de-videos` | Carrusel-prueba de 4 láminas: el número que sube es el único argumento |

---

# → web-factory

## O1 · Portar los 4 mecanismos de OYLA al pattern bank y probarlos en un index.html de una pieza

- **Sale de:** [OYLA — el index.html suelto que no parece hecho con IA](2026-08-23-oyla-index-html-que-no-parece-ia.md) — `DaVV7JjIY9I`
- **Fuente:** https://www.instagram.com/p/DaVV7JjIY9I/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada para portar los cuatro mecanismos y armar la pagina: son CSS + GSAP en un archivo suelto, sin credencial, sin permiso y sin gasto. Dos salvedades honestas: (a) para replicar el hero con imagineria propia hacen falta fotos reales del cliente o permiso explicito de gasto en generacion paga (Higgsfield), que por regla es caso por caso; (b) la 'free guide' del autor NO esta en el post — no hay link ni contenido, asi que se le copia el RESULTADO leido del render, no su workflow.

```text
OBJETIVO UNICO DE ESTA SESION: dejar bancados y PROBADOS los 4 mecanismos de scroll del sitio OYLA (referencia: hermes-content/references/video-intake/, ficha DaVV7JjIY9I), en un unico archivo HTML abierto y MIRADO renderizado.

Contexto: es un reel de Instagram que filma una laptop mostrando un sitio de joyeria. El dato clave esta en la barra de URL del navegador: `file:///Users/dmitry/Downloads/oyla/index.html`. O sea el 'sitio' entero es UN archivo HTML estatico suelto, sin framework, sin build, sin deploy. Reproducilo igual: un solo index.html.

ANTES de codear, cargar (no es opcional): skill `impeccable` + la galeria/tokens internos, y `gsap-scrolltrigger`. Direccion de estilo declarada: editorial de lujo claro, NO minimal generico.

LOS 4 MECANISMOS A CONSTRUIR

1. SPLIT STICKY (el mas valioso, y el unico VERIFICADO por comparacion directa de fotogramas). Grid de 2 columnas. La columna izquierda (titulo serif + 3 parrafos cortos + un boton de texto con un ⊕) queda CONGELADA con `position: sticky; top: 0` mientras la derecha desfila por 4 paneles apilados en flujo normal. Cada panel: un numero o frase grande en serif display + una linea de apoyo en sans chica. Sin JS.

2. HERO PINNEADO CON MEDIA QUE ESCALA. Titular en versalitas serif clavado abajo-izquierda, mas un boton `DISCOVER ⊕`. Detras, media a pantalla completa que va de plano general a macro atado al progreso de scroll (`transform: scale()` sobre la media, o un <video> scrubbeado). El titular NO se mueve nunca. (Mecanismo reconstruido del render, no declarado por el autor.)

3. REVELADO DE TITULAR CON DUPLICADO DESENFOCADO. Cada titular serif entra con una copia fantasma borrosa y desplazada que se le va alcanzando. Dos copias apiladas, la de atras con `filter: blur()` + `translateY` animando a 0. Aplicar SOLO a los titulares serif, nunca al sans — en el original el sans esta nitido y eso es lo que prueba que es animacion y no artefacto de camara.

4. GRILLA DE 3 COLUMNAS CON FILETES DE 1px. Fondo hueso, filetes verticales de 1px como unica separacion (cero cards, cero sombras, cero bordes redondeados), producto flotando al centro ocupando ~15% de su celda, nombre + precio debajo en sans chica caja alta. La celda del medio se abre a media a sangre desbordando por arriba y por abajo a sus vecinas (hover-expand). Ademas crossfade entre dos sets de producto.

TOKENS (hex leidos del fotograma, aproximados — ajustar con criterio, no clavar a ciegas)
--bg: #F2EFEA; --surface: #F8F6F3; --ink: #1C1A18; --muted: #6E6A65; --rule: #DAD5CE; --accent: #7E1F2A
REGLA DURA DE PALETA: el acento aparece UNA sola vez en toda la pagina (el logo). Todo lo demas es hueso, tinta y filete. Si aparece un segundo elemento con color, esta mal.

TIPOGRAFIA: serif display de alto contraste (Didone/transicional) para titulares, versalitas con tracking ~0.04em. Grotesca neutra para micro-labels a ~10-11px CAJA ALTA con tracking ~0.14em, y para cuerpo a ~14-15px con interlineado 1.55 y medida ~55 caracteres. Dos familias, nada mas.

MOTION: sin rebotes ni elasticos. Desaceleracion larga, `cubic-bezier(0.16, 1, 0.3, 1)`. Animar solo `transform`, `opacity`, `filter`. Respetar `prefers-reduced-motion`.

VERIFICACION (regla del proyecto: verificar es MIRAR, no suponer)
- Abrir el archivo renderizado en Chromium headless via Playwright y LEER las capturas. Un 200 y un grep no son verificacion.
- Capturar 4 estados: hero al inicio, hero al final del scrub, split sticky con la derecha a mitad de camino (la izquierda TIENE que estar identica), y la grilla con la celda del medio abierta.
- Comprobar que el body no scrollea en horizontal a 375, 768 y 1440.

AL CERRAR
- Los 4 patrones documentados en `web-factory/docs/MOTION_PATTERN_BANK_2026.md`, cada uno con su mecanismo en una linea y el snippet minimo.
- El estilo (paleta, pairing tipografico, grilla de filetes) en `hermes-content/references/ui-patterns/editorial-hairline-joyeria/` junto al HTML probado.
- Handoff del carril en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos, incluido intentos fallidos.

NO HACER: no inventar el prompt original (no aparece escrito en ningun fotograma del reel — todo esto es reconstruido leyendo el render). No usar imagineria generada paga sin permiso explicito: para probar, placeholders o fotos que ya tengamos.

LISTO = existe un unico index.html que, abierto en Chromium headless y MIRADO en captura, muestra los 4 mecanismos funcionando (columna izquierda identica pixel a pixel entre dos posiciones de scroll distintas; titular del hero inmovil mientras la media cambia de escala; titulares serif con el duplicado desenfocado y el sans nitido; celda del medio abriendose a sangre), sin scroll horizontal a 375/768/1440, con el acento #7E1F2A apareciendo UNA sola vez en la pagina, y con los 4 patrones escritos en MOTION_PATTERN_BANK_2026.md.
```

## O2 · Patron 'canvas fijado + scrub amortiguado' con escalera de degradacion — al banco de motion y a una demo

- **Sale de:** [Fable 5 vs GPT 5.6 Sol — la misma landing 3D de producto, y el patrón que se roba](2026-08-23-fable5-vs-gpt56-landing-3d-dial.md) — `DbBUMU2qjfW`
- **Fuente:** https://www.instagram.com/p/DbBUMU2qjfW/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el patron portable, NADA: el sticky + scrub + estados por seccion + la escalera de degradacion se ejecutan hoy con GSAP y sprites/video, sin 3D, sin credenciales y sin pedirle nada a Sergio. Lo que falta es solo para la version 3D literal: (a) decidir si abrimos el frente R3F, que no tenemos skill y ningun cliente actual pide (vendemos a clinicas, comercio e importadoras, no a fabricantes de hardware); (b) un modelo 3D del producto, que ningun cliente nuestro tiene.

```text
OBJETIVO DE ESTA SESION: dejar en el repo el patron de scroll de landing de producto que aprendimos del reel DbBUMU2qjfW, escrito en el banco y DEMOSTRADO funcionando, sin abrir el frente 3D.

CONTEXTO — el mecanismo, ya reconstruido (no hace falta volver a mirar el video):

1. Canvas/visual FIJADO con ScrollTrigger.pin. El producto no se mueve de su sitio; lo que entra y sale son los bloques de texto y el color de fondo. Principio literal del autor original: 'el dispositivo esta fijo, el mundo cambia'.
2. Scrub AMORTIGUADO: scrub con valor numerico (arrancar en 0.8-1.2), NUNCA scrub:true. Sumar Lenis para el smooth scroll. Esta mezcla es la que produce la sensacion cara, mas que el modelo 3D.
3. Estados por seccion sobre UNA sola pieza: la pantalla del producto cambia de contenido por seccion (no son N imagenes sueltas, es el mismo elemento con la capa de pantalla cambiando).
4. Exploded view scrubbeada: las capas se separan sobre un eje vertical en funcion del progreso, con riel numerado 01..05 a la derecha (filete hairline + bajada de 2 lineas por item).
5. Crossfade de fondo claro<->oscuro entre secciones.
6. ESCALERA DE DEGRADACION (esto es lo que mas vale, y lo que desbloquea el 3D-look en nuestro presupuesto de performance): movil + prefers-reduced-motion + dispositivos debiles + WebGL por software reciben RENDERS ESTATICOS capturados de la escena real, 55-70 KB en WebP, con la maquetacion reordenada a 'texto arriba, producto abajo'. No es un fallback pobre: es la misma escena, congelada.

SISTEMA TIPOGRAFICO que acompana (portarlo igual): eyebrow diminuto en ladrillo #B5514B sobre el titular; titular en grotesca pesada de display, 2-3 lineas, interlineado ~0.95, sentence case CON punto final; cuerpo gris #6B6B6B de 2-3 lineas maximo; pie de seccion en micro-tipografia con separadores de punto medio. Papel #F4F4F2, tinta #111111, seccion oscura #0A0A0A, acento naranja #E8641E usado SOLO dentro de la pantalla del producto y en el CTA (color semantico, no decorativo). Los hex son aproximados: ajustalos a los tokens de la marca del proyecto donde lo apliques.

QUE HACER, en este orden:

A. Cargar la skill 'gsap-scrolltrigger' y 'gsap-core' ANTES de escribir codigo. No improvisar el pin ni el scrub.
B. Agregar el patron a web-factory/docs/MOTION_PATTERN_BANK_2026.md como entrada nueva, respetando el formato de las entradas que ya estan ahi. Incluir SI O SI la escalera de degradacion del punto 6 — es la parte que hace que este patron entre en nuestro presupuesto de performance (rules/web/performance.md: landing <=150 kb JS gzipped, LCP <2.5 s), y es exactamente lo que le faltaba a la ficha anterior 2026-08-11-web-3d-scrollytelling-united-carriers.md, que quedo en FUTURO por no tener respuesta de performance. Citar esa ficha y corregir su veredicto si corresponde: NO reescribirla al lado.
C. Construir UNA demo de una sola pagina que pruebe el patron SIN 3D: producto = una secuencia de imagenes/sprite o un <video> con currentTime scrubbeado, pinneado, con 4 secciones de texto y crossfade de fondo. Mas la ruta degradada real (prefers-reduced-motion + un breakpoint movil) sirviendo el estatico.
D. Verificar MIRANDO: abrir la demo renderizada con Playwright + Chromium headless y leer las capturas. Un 200 y un grep NO son verificacion. Capturar en 375 y 1440, y capturar tambien con prefers-reduced-motion forzado para probar que la ruta degradada se ve bien y no rota.
E. Medir peso y tiempo reales del bundle, no solo que responda.

LIMITES DUROS:
- NO abrir el frente R3F / three.js. No tenemos skill de 3D en web y ningun cliente actual lo pide. Si te sale al paso, anotalo como pendiente y segui.
- NO tocar main con WIP parcial: si un archivo nuevo importa otro archivo nuevo, van los dos o ninguno.
- Rama propia, commits conventional, gates (tsc --noEmit, tests, code-reviewer) antes de mergear.
- Si algo queda a medias, escribir el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md.

LISTO = la entrada del patron esta en web-factory/docs/MOTION_PATTERN_BANK_2026.md con la escalera de degradacion incluida y citando la ficha de united-carriers; existe una demo que corre; y hay capturas hechas con Playwright a 375 y 1440 MAS una con prefers-reduced-motion, las tres miradas y descritas, mostrando el pin, el scrub y la ruta degradada funcionando — con el peso del JS gzipped medido y por debajo de 150 kb.
```

## O3 · Teaser de 15 s con filtro-como-transicion (HyperFrames)

- **Sale de:** [ASCII Magic v2: el filtro como transicion (teaser de lanzamiento)](2026-08-23-ascii-magic-v2-filtro-como-transicion.md) — `DbvxMwghtkA`
- **Fuente:** https://www.instagram.com/p/DbvxMwghtkA/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada bloqueante: no hace falta credencial, permiso ni gasto (HyperFrames corre local y gratis). Faltan dos decisiones nuestras: (a) que material propio se procesa — capturas de la plataforma YA vivas, no mockups; (b) cortar el cierre 'coming soon', que viola la regla 'la venta nunca exhibe obra' del CLAUDE.md; se cierra en el nombre o en algo encendido en produccion.

```text
OBJETIVO: construir en HyperFrames un teaser de producto de ~15 s, 16:9, que use el patron 'filtro-como-transicion': UNA sola toma continua de camara, cero cortes a negro, cero fundidos, y las 'escenas' se separan cambiando el FILTRO aplicado encima del mismo movimiento.

REFERENCIA: reel de ASCII Magic v2 (https://www.instagram.com/p/DbvxMwghtkA/). Ficha completa en hermes-content/references/video-intake/ascii-magic-v2-filtro-como-transicion.md. El estilo es RECONSTRUIDO a partir de 31 fotogramas: nadie publico el codigo ni el proyecto.

ANTES DE CODEAR (obligatorio):
1. Cargar las skills: hyperframes (entrada), hyperframes-core, hyperframes-animation, motion-doctrine, seam-craft, cut-the-curve.
2. Buscar en el repo si YA existe un preset/filtro ASCII o halftone (grep por 'ascii', 'halftone', 'dither', 'scanline' en web-factory/ y en las skills de hyperframes). Si existe, reusarlo. Si no, recien ahi escribirlo.
3. Leer web-factory/docs/MOTION_PATTERN_BANK_2026.md para no duplicar un patron que ya este anotado.

QUE CONSTRUIR:

A) Pipeline de filtros — un <canvas> que muestrea cada frame de un <video>/<img> de fondo y lo re-dibuja en una grilla de celdas de ~8x8 px. Cinco modos, todos sobre la misma grilla:
   - ascii: luminancia media por celda -> caracter de la rampa '@M#x+0es. ' dibujado en monoespaciada blanca sobre negro.
   - halftone: circulo por celda con radio proporcional a la luminancia. Dos variantes: dura (blanco sobre negro, sin glow) y con bloom radial (ambar #FFC24D -> #FF8A1F -> #E03A00).
   - dither: Bayer 4x4, blanco y negro puro.
   - edges: Sobel + umbral. Variante 1: contorno blanco de 1 px sobre negro. Variante 2 'blueprint': mismos bordes blancos sobre fondo azul plano #1533E0.
   - glitch: desplazamiento horizontal aleatorio de bandas + separacion de canales RGB.
   Encima de TODOS: scanlines con repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 1px, transparent 1px 3px).

B) Capa de collage 3D (solo en 2 momentos): 8-12 paneles de captura colocados con transform: perspective() rotateX/rotateY translateZ sobre una superficie curva, sangrando por los cuatro bordes. La camara empuja hacia adentro. CSS 3D, NO WebGL.

C) Capa HUD de falsa deteccion (solo sobre el collage): divs con border:1px solid #FF2B2B, punto #2BFF5C de 4 px en el centro de cada caja, etiqueta monoespaciada 'x: NNN y: NNN' pegada arriba-izquierda, y un SVG con stroke-dasharray de 1 px conectando cajas con curvas punteadas.

D) Texto — LA REGLA MAS IMPORTANTE: el texto NO SE MUEVE NUNCA. Se revela caracter por caracter (typewriter a 10-12 caracteres/s) en su posicion final y se queda clavado en el eje vertical del centro (y = 50%) mientras los cinco fondos pasan por detras. El texto es el ancla; el fondo es lo que muta. Sobre fondo ruidoso, respaldarlo con una caja SOLIDA ceñida al texto (negra o blanca) — nunca degradado, nunca sombra. Tipografia: UNA monoespaciada blanca, regular, tracking 0.05em, ~5-6% del alto de cuadro, para todos los kickers; una grotesca semibold solo para el dato duro.

E) Guion, 8 estados (adaptar los textos a lo que este VIVO en produccion, sin inventar cifras):
   1. (0-2 s) una cifra sola, grande, negra sobre blanco, contando hacia arriba. Sin palabra que la explique.
   2. (2-4 s) segunda cifra que sube la apuesta, sobre el collage 3D + HUD.
   3. (4-5 s) el denominador de tiempo ('en N meses').
   4. (5-7 s) una frase partida en DOS planos, que cruza el cambio de filtro.
   5-7. tres kickers de 2-3 palabras, uno por plano, ~0,8-1 s cada uno, cada uno DEMOSTRADO por el fondo y no explicado.
   8. (13-15 s) el nombre. Se cierra AHI.

PROHIBIDO (regla dura del CLAUDE.md, 'La venta nunca exhibe obra'): no escribir 'coming soon', 'proximamente', 'muy pronto', 'beta', 'en construccion' ni ninguna palabra de estado de obra. El video se cierra en el nombre o en algo YA encendido en produccion. La referencia si lo hace; nosotros no.

TAMBIEN PROHIBIDO: inventar cifras. Si no hay un numero real y verificable en produccion, el estado 1 y 2 se reemplazan por otra cosa; no se fabrica.

AL TERMINAR: anotar los dos patrones en web-factory/docs/MOTION_PATTERN_BANK_2026.md ('filtro-como-transicion' y 'texto ancla / fondo mutante'), con el link a la ficha.

LISTO = un MP4 renderizado por HyperFrames, 16:9, entre 14 y 16 s, verificado ABRIENDO el archivo y mirando fotogramas concretos: (a) al menos 4 de los 5 filtros aparecen, uno por escena; (b) el texto esta en la misma coordenada Y en los 8 estados; (c) no hay ningun fotograma completamente negro ni completamente blanco de transicion; (d) grep del HTML no encuentra 'soon', 'proximamente', 'beta' ni 'muy pronto'; (e) los dos patrones estan escritos en MOTION_PATTERN_BANK_2026.md.
```

## O4 · Auditoría anti-vibecoded — 30 señales

- **Sale de:** [30 señales de sitio vibecoded](2026-08-23-30-senales-sitio-vibecoded.md) — `DcEJDHBTyPY`
- **Fuente:** https://www.instagram.com/p/DcEJDHBTyPY/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el checklist: NADA. Es leer los 30, escribirlos en design-quality.md y correrlo contra onia.com.bo y onia-platform; se cierra en una sesión. Para el reel: dos decisiones de Sergio, ninguna técnica. (a) La voz: Sergio a cámara (gratis, y el formato PIDE cara real) o Lucía por ElevenLabs (gasto → permiso explícito caso por caso). (b) La lista propia: los 30 de este video son tells del mercado gringo y varios no aplican — 'em dashes' es un tell de texto en inglés, 'inter/geist/space grotesk' es un tell del stack Vercel. Hay que escribir los ~20 que sí aplican a lo que se ve en Bolivia.

```text
Sos auditor de diseño. Vas a revisar la superficie web que te indique y decidir si delata que fue generada por IA sin criterio ('vibecoded').

REGLA DE ENTRADA: verificás MIRANDO. Abrí la página renderizada con Playwright + Chromium headless, sacá capturas a 375, 768 y 1440 de ancho, y LEÉ las capturas. Un HTTP 200 y un grep NO son verificación. Un grep sirve para descartar, nunca para confirmar que algo se ve bien.

Revisá estas 30 señales, una por una. Para cada una respondé SÍ (está presente) / NO / N-A, y si es SÍ citá el archivo y la línea o el selector exacto donde vive:

 1. Gradientes duros (saltos de tono agresivos, arcoíris de fondo)
 2. Íconos de la librería lucide sin retocar
 3. Fondo blanco puro (#FFF) sin capa ni temperatura
 4. Coloreado arcoíris (cada tarjeta un color distinto porque sí)
 5. Drop shadows genéricas en todo
 6. Tres feature cards en fila, iguales, sin jerarquía
 7. Emojis usados como íconos
 8. Liquid glass / glassmorphism sin profundidad real
 9. Rayas em (—) en el copy [ADAPTAR: en español el tell equivalente es el guion largo suelto y el 'no es X, es Y']
10. Tipografía Inter, Geist o Space Grotesk usada por defecto y sin razón
11. Franja de color al borde izquierdo de las tarjetas
12. Testimonios inventados (nombre + cargo + empresa que no existen)
13. Bento grid decorativo, sin contenido que lo justifique
14. Ventana de terminal falsa mostrando un npx que nadie corre
15. Construcción "no es X, es Y" en el copy
16. Bullets con tilde verde ✓
17. Tres planes de precio, siempre tres
18. Cero demos reales del producto (mockups vacíos, 'coming soon')
19. Border-radius suave y uniforme en absolutamente todo
20. Paleta violeta + negro (ojo #8B5CF6 / #6D28D9 / #0A0A0A / #18181B, o sea violet-500/700 + zinc-900/950 de Tailwind)
21. Sin skeleton loaders (spinner + 'Cargando...' en vez de esqueleto)
22. Orbes radiales de fondo
23. Retículas de puntos decorativas
24. Íconos de chispita ✨ en los botones de IA
25. Flechas → animadas en cada link
26. Sin Términos y Condiciones enlazados en el footer  ← DEUDA LEGAL, no estética
27. Sin Política de Privacidad enlazada en el footer  ← DEUDA LEGAL, no estética
28. Animación de hover en absolutamente todo (típico: translateY(-16px) + scale(1.05))
29. Colores neón
30. Pastel básico (baby blue / blush pink / mint green / butter yellow)

DESPUÉS de la tabla, entregá:
- El CONTEO: cuántos SÍ sobre 30.
- Los 26 y 27 aparte, marcados como bloqueantes legales si dan SÍ.
- Para cada SÍ estético, UNA corrección concreta con el archivo y el cambio exacto. Nada de consejos genéricos.
- Lo que NO pudiste verificar y por qué.

NO inventes hallazgos. Si no lo viste en la captura, decí que no lo viste.

LISTO = existe la tabla de 30 filas con archivo:línea citado en cada SÍ, las capturas a 375/768/1440 están guardadas en disco y referenciadas por ruta absoluta, los ítems 26 y 27 dan NO (o están abiertos como bloqueantes), y el conteo total de SÍ estéticos es ≤ 6.
```

---

# → marketing / motor de contenido

## O5 · Plantilla de guion 'Hito con prueba externa' + preset de subtitulo ancla, renderizada en HyperFrames

- **Sale de:** [Prueba primero, claim despues: el molde del anuncio con validador externo](2026-08-23-molde-anuncio-prueba-externa-astrocat.md) — `Daz0cVMBuD8`
- **Fuente:** https://www.instagram.com/p/Daz0cVMBuD8/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el estilo y la plantilla: NADA. Se hace hoy, sin credenciales, sin gasto y sin permisos. Para DISPARAR el molde falta el unico insumo que no se puede fabricar: un hito verificable declarado por un tercero con nombre. ONIA no tiene hoy ningun equivalente a un 'featured by Apple'; lo mas cercano documentado es el primer registro real que entro por Instagram el 21-ago, y esa cuenta se borro el 22. Advertencia dura: el molde entero se apoya en un documento real mostrado verbatim, asi que rellenarlo con un logro inventado no seria licencia creativa sino romper de frente la regla de 'No fabricar' y la de que la venta nunca exhibe obra. Se construye la plantilla ahora y se deja cargada esperando el hito. Segundo requisito operativo, facil de pasar por alto: el molde no exige rodaje pero SI exige un archivo de b-roll ya acumulado (proceso, escritorio, cuadernos, fotos viejas). Sin ese archivo no se puede ejecutar por rapido que llegue el hito, asi que empezar a acumularlo es tarea de hoy tambien.

```text
OBJETIVO UNICO DE LA SESION: dejar construida y RENDERIZADA una plantilla reutilizable de reel vertical llamada 'hito-con-prueba-externa', portada de un reel real que analizamos (ficha en hermes-content/references/video-intake/, fuente https://www.instagram.com/p/Daz0cVMBuD8/). No es un video para publicar: es un molde parametrizado que se dispara el dia que ONIA tenga un hito verificable.

ANTES DE CODEAR, leer en este orden: la skill .claude/skills/hyperframes/ (es la entrada obligatoria para cualquier video), despues hyperframes-core y captions-overlay. HyperFrames es el motor (Remotion esta jubilado por decision de Sergio del 21-ago). No reinventes el motor.

QUE CONSTRUIR

1) La composicion HyperFrames, 1080x1920, 30 fps, 11,2 s, 11 planos con 10 CORTES SECOS (cero transiciones, cero fades, cero whip, cero zoom). Cortes en: 1,53 / 2,33 / 3,23 / 4,10 / 5,33 / 6,30 / 7,30 / 8,00 / 9,20 / 10,23 s. Media de 1,02 s por plano. Respetalos: la cadencia casi metronomica es el patron, no un detalle.

2) El preset de subtitulo, que es la pieza mas reutilizable:
   - Sans geometrica Bold (Poppins Bold o equivalente disponible), blanco #FFFFFF con contorno negro solido de 5 px, SIN sombra difusa y SIN caja de fondo.
   - Dos lineas centradas, caja de 75% del ancho, interlineado 1.05, mayuscula de ~5% del alto del cuadro.
   - POSICION FIJA arrancando al 20% del alto, identica en los 11 planos. NO se mueve nunca. Con la imagen cortando cada segundo, este texto es la unica ancla estatica: es lo que hace legible el montaje.
   - SIN ANIMACION DE ENTRADA. Aparece y desaparece con el corte. Esto es deliberado y contradice a proposito nuestra skill motion-doctrine, que gobierna el motion graphics autoral y NO este carril. No le agregues easing 'para mejorarlo'.

3) Los 6 slots de texto parametrizados (6 bloques sobre 11 planos, ratio 1:2, el texto dura mas que el plano):
   A 0,00-1,53  {{GANCHO_DOCUMENTO}}   ej. 'Got this email this morning'
   B 1,53-2,60  {{CLAIM}}               ej. 'My Game got featured by Apple again!'
   C 2,60-4,10  {{CIFRA}}               ej. 'In 40+ different countries'
   D 4,10-8,00  {{PROCESO}}             ej. 'Me and my dad built this from scratch'  (4 planos, el bloque mas largo)
   E 8,00-9,20  {{COSTO}}               ej. 'Took a huge risk on this project'
   F 9,20-11,24 {{CIERRE_EMOCIONAL}}    ej. 'But I know she would be proud of me'

4) Los 11 slots de media, con su ROL escrito en el codigo (el rol es el activo, no el clip):
   1 persona a camara, contrapicado, con VACIO en el tercio superior para el texto
   2 {{DOCUMENTO_PRUEBA}} screenshot a sangre, legible, sin recortar el remitente ni la fecha
   3 y 4 {{ACTIVO_DEL_VALIDADOR}} arte oficial del tercero que valida
   5 producto funcionando
   6 proceso feo (escritorio real, cables, casa)
   7 artefacto de diseño a mano (cuaderno)
   8 boceto a mano, plano corto de textura
   9 producto funcionando otra vez
   10 y 11 archivo personal analogico
   Encuadre: todos los slots deben dejar cielo o espacio negativo en el tercio superior. En el reel original el UNICO error de layout aparece justo en el plano cuyo fondo no fue encuadrado para el texto.

5) Renderizar con placeholders OBVIAMENTE falsos (cartones de color con el rol escrito encima, 'SLOT 2: DOCUMENTO DE PRUEBA'). PROHIBIDO rellenar con un hito de ONIA inventado, con un logo de un tercero, o con una cifra que no exista: el molde entero se apoya en mostrar un documento real verbatim, y fabricarlo rompe la regla de 'No fabricar' del proyecto. El placeholder tiene que verse como placeholder.

6) Antes de renderizar el final, MOSTRAR A SERGIO la tabla de cortes y un preview 360p. Es regla de oro del carril de video: nunca cortar a ciegas.

7) Documentar en dos lugares, editando lo que ya existe en vez de crear docs sueltos:
   - el patron de ritmo (ancla de texto estatica + corte metronomico de 1,0 s) en web-factory/docs/MOTION_PATTERN_BANK_2026.md
   - el preset de subtitulo en .claude/skills/captions-overlay/
   Y dejar una nota en .claude/skills/motion-doctrine/ aclarando que la doctrina de continuidad de vector gobierna el motion graphics autoral y NO el montaje UGC de prueba social, donde el corte seco es correcto.

LO QUE NO HAY QUE HACER: no publicar nada, no inventar el hito, no agregar CTA (el molde original no pide nada y convierte por follow, con el arco abierto en el caption), no cambiar la cadencia 'para que respire', no agregar transiciones.

LISTO = existe un MP4 renderizado de 1080x1920 y ~11,2 s con 11 planos y 10 cortes secos verificados por deteccion de escena (ffmpeg select=gt(scene,0.3)) dentro de +/-0,1 s de los timestamps listados; el subtitulo se lee al 20% del alto sin moverse en ningun plano; los 6 slots de texto y los 11 de media estan parametrizados en la composicion; los placeholders se ven como placeholders; y el pattern bank mas la skill captions-overlay quedaron editados con el patron.
```

## O6 · Portar el molde 'plano fijo + N laminas' y el comment-to-DM a un reel de Onia

- **Sale de:** [Reel de 10 laminas sobre plano fijo, con gancho comment-to-DM](2026-08-23-reel-10-laminas-plano-fijo-comment-to-dm.md) — `Db9jbZtumB7`
- **Fuente:** https://www.instagram.com/p/Db9jbZtumB7/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el video, nada bloqueante: HyperFrames esta instalado y probado y el comment-to-DM esta encendido. Falta UNA decision de Sergio: cual es el iman. Onia vende software, no plantillas para freelancers, asi que copiar 'te regalo plantillas' seria copiar el contenido en vez del molde. El equivalente honesto y ya existente sale del generador de propuestas (hermes-content/propuestas/generador/) o del catalogo de venta. Esa decision es suya, no mia.

```text
OBJETIVO DE ESTA SESION (uno solo): producir UN reel vertical de ~12 s con el molde extraido del reel IG Db9jbZtumB7, renderizado con HyperFrames, y dejarlo listo para que Sergio lo MIRE antes de publicar. No publicar nada.

CONTEXTO: la ficha completa esta en hermes-content/references/video-intake/reel-10-laminas-plano-fijo-comment-to-dm.md. Leela primero. El original NO es de IA: es b-roll casero + laminas + musica, y por eso es barato de copiar.

EL MOLDE, exacto:
1) 0:00-0:03 GANCHO POR DOLOR CITADO. Tres quejas entre comillas tipograficas, con emoji, escritas como si fueran mensajes reales de terceros. Cada una un dolor DISTINTO del dueno de negocio boliviano (ej.: se le pierden las citas, no sabe cuanto vendio, la factura la hace a mano). El bloque de texto queda INMOVIL mientras corta el b-roll debajo (3 tomas, una cada ~1,3 s).
2) 0:04-0:11 LISTA NUMERADA, ~1 s por item, CERO cortes de camara. Un solo plano fijo continuo de fondo. Cada item: titulo en MAYUSCULAS bold (numero + punto + nombre) y una bajada en italica bold de max 3 lineas. El valor esta en el VOLUMEN y en que obliga a re-ver, no en que se lea entero.
3) SIN CTA en pantalla. El CTA entero va en el caption y es comment-to-DM: pedir comentar UNA palabra a cambio del iman.

EL MECANISMO VISUAL (esto es lo que hay que respetar, no el tema):
- El fondo es UNA sola toma, camara totalmente estatica, escena a oscuras con una unica fuente de luz lateral. Es el elemento portador: NUNCA se mueve.
- Cada lamina es un rectangulo flotante centrado, ~55-60% de la altura, anclado por debajo del centro, que hace SCROLL VERTICAL INTERNO (translateY lineal, velocidad constante) mientras el titulo de arriba queda fijo. Ese scroll es todo el movimiento del video.
- Nada respira, nada oscila, nada flota. Cero idle motion. Entradas por corte o disolvencia corta, sin easing dramatico.
- Paleta: monocromo oscuro con UN solo acento calido. Base #0B0B0C, superficie de lamina #1C1C1E, texto #FFFFFF puro, acento #FF4A17. Si aparece un logo de tercero, que sea el UNICO color saturado del video.
- Tipografia: 2 niveles y basta. Grotesca geometrica bold MAYUSCULAS para titulo, la misma familia en italica bold para la bajada. Sin cajas ni divisores.
- Textura: grano y vineteado REALES por luz baja, no filtro.

QUE HACER, en orden:
1. Leer la ficha y cargar la skill hyperframes (es la puerta de entrada de video) + motion-doctrine antes de escribir una linea de composicion.
2. PREGUNTAR A SERGIO cual es el iman antes de escribir el caption. Onia vende software, no plantillas de freelancer: copiar 'te regalo plantillas' seria copiar el contenido, no el molde. Candidatos honestos y ya existentes: algo que salga de hermes-content/propuestas/generador/ o del catalogo de venta. NO inventar un iman ni prometer nada que no exista.
3. Escribir el guion: 3 quejas + N items numerados (N entre 7 y 10, todos REALES y vivos en produccion; prohibido nombrar lo que no esta encendido — regla 'la venta nunca exhibe obra').
4. Componer en HyperFrames: video de fondo fijo + una sub-composicion por lamina con su data-* de timing y su translateY lineal.
5. Renderizar y MOSTRAR el preview a Sergio. No publicar. Construir y publicar son dos permisos distintos.

NO HACER:
- No usar 'muy pronto', 'beta', 'proximamente' ni ningun estado de obra en pantalla.
- No inventar cifras, testimonios ni logos de clientes: hay cero clientes pagando.
- No publicar ni programar el post.

APARTE, sin desviar esta sesion: anotar como pendiente para el carril onia-core que los 10 documentos del original son los estados del ciclo de vida de un cliente (acuerdo -> onboarding -> factura -> alcance -> entrega -> reporte -> cobro -> cierre -> feedback -> re-venta) y que vale contrastarlos contra las entidades y capabilities del core. Anotarlo, NO perseguirlo aca.

LISTO = existe un MP4 vertical de ~12 s renderizado con HyperFrames, con un plano fijo sin cortes durante la lista, N laminas con scroll interno lineal, dos niveles tipograficos y un solo acento de color; el caption con el comment-to-DM esta escrito y su iman fue elegido por Sergio; y Sergio VIO el preview renderizado y dio el OK sobre esa pieza. Nada publicado.
```

## O7 · Meme de dos cartas — setup vivo / remate congelado

- **Sale de:** [Meme de dos cartas: setup vivo, remate congelado](2026-08-23-meme-dos-cartas-setup-vivo-remate-congelado.md) — `DcPwVniOEKB`
- **Fuente:** https://www.instagram.com/p/DcPwVniOEKB/
- **Tipo:** MARKETING · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** (1) El plano A propio: no tenemos metraje de 'sala llena de gente laburando de noche' — hay que grabarlo (30 s de teléfono alcanzan) o cambiar el motor interno por otro que sí tengamos. (2) El ángulo, que es lo delicado: el motor del chiste es la auto-burla sobre la propia competencia, y apuntado a Onia rompe de frente 'la venta nunca exhibe obra'. Sólo es portable si el dolor es el DEL CLIENTE ('yo no sé nada de sistemas' → remate: el negocio funcionando), nunca nuestra entrega. (3) La música: no está en el video (0 palabras) y no se puede identificar — hay que elegir una de la biblioteca de Instagram, y la carta B congelada sin música es un cuadro muerto de 2,8 s.

```text
Armá un reel vertical de 6,6 s (720x1280, 30 fps) con la mecánica de dos cartas medida en el reel DcPwVniOEKB.

CARTA A — 0,000 a 3,800 s (114 fotogramas). Plano fijo, metraje VIVO: gente moviéndose dentro del cuadro, cámara sin reencuadre y sin push-in. Encima, texto quemado de 3 líneas centradas en el tercio superior (bloque del 23% al 37% de la altura), caja al 84% del ancho del cuadro, grotesca pesada casi condensada, blanco puro con contorno negro fino y sombra suave. El texto NO se anima: entra en el fotograma 0 y no se mueve más — cero fade, cero escala, cero typewriter. Contenido: la objeción del CLIENTE, en primera persona y entre comillas tipográficas.

CORTE DURO en 3,800 s. Sin cortinilla, sin fade, sin whip, sin cross-dissolve.

CARTA B — 3,800 a 6,600 s (84 fotogramas). Una imagen FIJA, congelada, cero movimiento. Tiene que INVERTIR la temperatura de color de la carta A (si A es cálida/magenta, B es fría/azul): esa inversión es el remate, no un adorno. Texto de 2 líneas, mismo tratamiento, pero ~1,5x más grande que el de la carta A. Contenido: el remate.

Reglas duras:
- Cero animación de texto en las dos cartas.
- Cero movimiento de cámara dentro de cada carta.
- Un solo corte en todo el video.
- Cama musical continua y fuerte de punta a punta, sin voz.
- El chiste apunta al dolor DEL CLIENTE, nunca a la entrega de Onia (regla "la venta nunca exhibe obra"). Prohibido cualquier gag que insinúe que no sabemos aterrizar lo que construimos.
- Antes de publicar, revisar los hashtags letra por letra: el original perdió alcance con un `#develeporlife` mal escrito.

LISTO = `ffprobe` reporta 198±3 fotogramas a 30 fps; `ffmpeg -i out.mp4 -vf "select='gt(scene,0.08)',metadata=print:file=-" -f null -` devuelve EXACTAMENTE 1 corte y su pts_time cae entre 3,6 y 4,0 s; y el PSNR entre el primer y el último fotograma de la carta B es >= 38 dB (prueba medida de que el remate está congelado, no sólo quieto).
```

## O8 · Molde de 6 movimientos: gancho falso -> prueba cruda -> metodologia -> comentario

- **Sale de:** Seedance 2.5 al estilo Batman: el gancho falso, la prueba cruda y el CTA que crece 3x — `DcYiAvqsjij`
- **Fuente:** https://www.instagram.com/p/DcYiAvqsjij/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** 1) Seedance 2.5 NO esta en nuestro stack: no lo tenemos ni lo probamos, y no se si aguanta consistencia de estilo animado entre planos. Hay que medir el analogo (Higgsfield/kling) antes de prometer nada; gasto = permiso explicito. 2) El preset de textura 'pantalla filmada' (halftone + viñeta + franja cromatica) no existe en editor-videos: es la pieza que mas unifica y la mas barata de agregar. 3) La config de karaoke actual no contempla grupos de 1-4 palabras con '...', ni el salto de escala del CTA, ni la regla de apagado cuando el grafico ya dice la palabra: tres parametros nuevos en captions-overlay. 4) El prompt de Seedance no esta en ningun lado del post; si queremos el estilo animado hay que RECONSTRUIRLO con la skill sacar-prompt y decir que es reconstruido.

```text
Escribi y produci un reel vertical de 60-75 s para ONIA usando este molde, recuperado literal del reel https://www.instagram.com/p/DcYiAvqsjij/ (70,8 s medidos, 234 palabras, ~198 ppm, ~95% del tiempo con voz).

GUION — seis movimientos, en este orden y con estas duraciones:
1) 0-4 s GANCHO FALSO: una afirmacion grande con marca conocida y numero concreto. Formato: 'Acaban de <verbo fuerte> a <numero> <rol> de <marca grande> por esta herramienta'.
2) 4-11 s RETRACTACION INMEDIATA + REENCUADRE: desmentite vos mismo en la frase siguiente ('bueno, realmente no lo se, pero...') y bajalo al espectador ('personas normales y corrientes como tu y como yo'). La retractacion compra la credibilidad que el gancho gasto. NO se saltea.
3) 11-16 s PRUEBA CRUDA: 5 s del entregable corriendo SOLO, con su propio audio, SIN voz en off encima. Si tiene remate, dejale 1-1,5 s de silencio antes.
4) 17-30 s ATRIBUCION + COSTO: que era, con que se hizo, cuanto tardo. Mostra un recibo visual (lamina/collage tipo scrapbook, presentada como captura de la app Fotos, no como grafico pulido).
5) 30-48 s MANEJO DE OBJECION (el corazon): poné la objecion en boca del espectador ('pero esto es todo gracias a la herramienta'), respondé que no, y resolvela con una analogia fisica (la de la camara: cualquiera puede tener la mejor camara del mundo). Cerra con la tesis: la diferencia NO es la herramienta, es la metodologia. Respaldalo con archivo B/N de oficio real.
6) 48-70 s AUTORIDAD -> CTA: quien lo hizo y con que cargo, prueba en pantalla, y cierre 'ponme la palabra <PALABRA> en los comentarios y te envio <entregable> gratis'.

PRODUCCION — reglas duras:
- Tres registros de imagen alternados y NINGUNA transicion: talking head camara en mano que nunca se detiene / b-roll a pantalla completa / clip generado SIEMPRE inserto, chico, letterboxed sobre campo oscuro (nunca a pantalla completa: esconde artefactos y da lectura de archivo).
- Textura obligatoria sobre TODO lo prestado o generado: halftone + viñeta + leve franja cromatica. Es lo que unifica material de origenes distintos.
- Karaoke quemado: una sola familia grotesca pesada, grupos de 1 a 4 palabras (NO palabra suelta), puntuacion conservada, sufijo '...' cuando el grupo no termino, cuerpo constante, ANCLAJE FIJO a ~52% del alto en los tres registros, color invertido segun fondo. Si un grafico en pantalla ya dice la palabra, apaga el subtitulo.
- Unico quiebre tipografico permitido: la palabra del CTA a ~3x el cuerpo, entre comillas tipograficas. Es el ultimo beat.
- Sin dead air: apuntar a >=90% del tiempo con voz. Un solo silencio, y que sea narrativo.
- Prohibido exhibir obra: nada de 'muy pronto', 'beta' ni 'en construccion'.
- Antes de cortar: tabla de cortes + preview 360p a Sergio. Nada de cortar a ciegas.
- Nada de gasto en generacion paga sin permiso explicito caso por caso.

LISTO = existe un MP4 vertical de 60-75 s renderizado con HyperFrames/editor-videos que cumple, verificado MIRANDO el render (no por grep ni por exit code): (1) los seis movimientos ocurren en las ventanas de tiempo indicadas, comprobado contra su propia transcripcion con timestamps; (2) el subtitulo aparece al mismo anclaje vertical (+/-3% del alto) en al menos un fotograma de cada uno de los tres registros; (3) la palabra del CTA mide >=2,5x el cuerpo del subtitulo normal, medido en pixeles sobre el ultimo fotograma; (4) la transcripcion del render cubre >=90% de la duracion total con voz; y (5) la tabla de cortes + el preview 360p fueron mostrados a Sergio y tienen su OK explicito sobre ESA pieza.
```

## O9 · Carrusel Onia de 4 laminas con el molde gancho-ecuacion-comenta

- **Sale de:** [Carrusel de playa: el molde gancho-ecuacion-comenta CLASE](2026-08-23-carrusel-playa-ecuacion-comenta-clase.md) — `Db1b33RAh_H`
- **Fuente:** https://www.instagram.com/p/Db1b33RAh_H/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada tecnico bloqueante. Faltan tres DECISIONES de contenido, no credenciales: (a) cual es el lead magnet real — que 'clase 1' mandamos por DM, hoy no existe; (b) que cifras usamos — Onia tiene 0 clientes pagando, asi que la ecuacion $200 = $10,000 NO se puede copiar: seria fabricar, y ademas 'la venta nunca exhibe obra' y '0 Humanos' contradice nuestro propio posicionamiento de agentes human-in-the-loop; (c) las capturas de onia-platform hay que restilarlas ANTES de fotografiarlas (ya decidido en la memoria landing-v3-aprobada). Postiz sigue sin credenciales de proveedor cargadas — NO VERIFICADO si publica carrusel hoy.

```text
Arma un carrusel de Instagram de 4 laminas para Onia portando el MOLDE de este referente (ficha en hermes-content/references/video-intake/, item Db1b33RAh_H). Portas la ESTRUCTURA y el DISENO, no el contenido ni las cifras.

MOLDE DE GUION, una idea por lamina, cero relleno:
1. GANCHO ABSURDO visual. Un contexto donde 'no se deberia poder trabajar' + la herramienta funcionando igual. Texto minusculas, coloquial, dos bloques: setup arriba-izquierda, remate abajo-derecha.
2. ESCALADA + DATO CURIOSO. Sube el absurdo y mete un dato real que la gente no sabe. Una cifra gigante manda la lamina.
3. LA PRUEBA, en layout de ECUACION horizontal: [etiqueta chica] cifra + [etiqueta chica] cifra = [etiqueta chica] resultado, y abajo a la derecha el remate del beneficio.
4. CTA COMENTARIO. 'Comenta <PALABRA>' gigante + que recibe la persona + lista de 4 bullets con flecha -> y divisoria de 1px entre items, en MAYUSCULAS.

DISENO, obligatorio:
- Vertical 3:4 (1080x1440). Foto de telefono real, grano natural, SIN filtro de agencia.
- Una sola grotesca neutra, dos pesos: Light para el contexto, Black para el gancho. Escala del gancho 4-6x el cuerpo. Interlineado ~0.9em en los bloques grandes.
- Texto 100% BLANCO, sin caja, sin sombra dura. El color lo pone la foto, nunca la tipografia.
- WRAP alrededor del sujeto: el sujeto al centro-bajo, el texto en las esquinas libres, apoyado en zonas desenfocadas. El texto NUNCA pisa cara ni pantalla.
- Alineacion segun el borde: bloque izquierdo alineado a izquierda, bloque derecho a derecha.

PROHIBICIONES DURAS de este encargo (nacen de reglas del repo, no las negocies):
- PROHIBIDO copiar la ecuacion '$200 + 0 Humanos = ~$10,000' ni inventar ninguna cifra de ahorro: Onia tiene 0 clientes pagando y no tenemos un caso medido. Si no hay numero verificable, la lamina 3 usa una prueba NO numerica (una capacidad concreta que si esta viva en produccion).
- PROHIBIDO decir '0 humanos' o equivalente: nuestros agentes son human-in-the-loop y venderlos como reemplazo total es fabricar.
- PROHIBIDO cualquier senal de obra: 'muy pronto', 'beta', 'proximamente'. Solo se nombra lo que esta ENCENDIDO en produccion.
- Las pantallas de laptop van con CAPTURAS REALES de onia-platform (restiladas antes), no con dashboards generados por IA.

CIRCUITO DE CONVERSION: cablea el 'Comenta <PALABRA>' contra el circuito comentario IG -> DM que ya esta vivo en produccion (memoria ig-comentario-dm-vivo, probado 18-ago). Antes de publicar, verificalo MIRANDO: comentario de prueba en la cuenta, y captura del DM que llega.

ANTES de publicar: mostrale las 4 laminas renderizadas a Sergio y espera OK explicito sobre ESAS piezas. Construir y publicar son dos permisos distintos.

LISTO = las 4 laminas renderizadas en 1080x1440 existen en disco, cero cifras sin fuente verificable en ellas, cero palabras de estado de obra (verificado con grep sobre el HTML fuente), el circuito comentario->DM devolvio un DM en una prueba real con captura, y Sergio dio OK explicito sobre las laminas renderizadas.
```

## O10 · Carrusel Onia de 15 laminas: molde BuilderCult portado al pack por rubro

- **Sale de:** [El carrusel de 15 láminas: molde de autoridad con CTA de comentario (BuilderCult)](2026-08-23-carrusel-15-laminas-repos-nichados-buildercult.md) — `DcBWzXQF1_q`
- **Fuente:** https://www.instagram.com/p/DcBWzXQF1_q/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Poco y nada bloqueante para producir. (a) Elegir el rubro del primer carrusel: decision de Sergio, no tecnica. (b) Credenciales de proveedor en Postiz si se publica desde ahi (dato heredado de memoria, RE-VERIFICAR en vivo antes de ejecutar); si no, se publica por el canal IG ya cableado. (c) Reemplazar la lamina 2: no tenemos case study con cifras y esta prohibido fabricarlo, va demo del producto vivo en su lugar.

```text
Construi un carrusel de Instagram de 15 laminas para Onia, portando el molde estructural y visual del carrusel de BuilderCult analizado en hermes-content/references/video-intake/ (id DcBWzXQF1_q). NO copies el contenido: copia la ARQUITECTURA y el SISTEMA VISUAL.

TEMA: por que un negocio de <RUBRO> (arranca por dental, que es el unico rubro con producto vivo y verificado en produccion) no necesita un software a medida sino un sistema que ya resuelve su rubro.

ARQUITECTURA OBLIGATORIA (15 laminas, roles fijos):
1. Portada: cifra o promesa concreta enorme + imagen que detenga el scroll. Sin parrafo explicativo.
2. Prueba: PROHIBIDO inventar cifras de facturacion o testimonios (cero clientes pagando). En su lugar va una CAPTURA REAL del producto vivo en produccion resolviendo un trabajo del rubro.
3. Reencuadre de la creencia del lector.
4. Anti-patron: que NO hacer (filtra al lector equivocado).
5-9. CINCO laminas con TITULAR IDENTICO y FONDO IDENTICO. Solo cambian el kicker numerado y la tarjeta de contenido. Es lo guardable del post.
10. El giro: lo que todos se pierden.
11. Playbook numerado 1-8, verbos en imperativo, una linea cada uno.
12. La herramienta: Onia. UNA sola lamina de producto, con captura de UI real.
13-14. Como se pone en marcha, 6 puntos con subtitulo bold + parrafo.
15. CTA de palabra clave unica. Repetila en la PRIMERA linea del caption, porque en el feed se ve junto a la portada.

SISTEMA VISUAL (portar exacto):
- Formato 4:5 vertical. Tarjeta blanca (#FCFCFB) flotante al ~92% del ancho, radio ~48px, margenes de fondo visibles por los 4 lados, sombra minima o nula.
- Firma de marca ONIA centrada al tope, IDENTICA en las 14 laminas interiores.
- Titular encajonado entre DOS reglas horizontales finas; tercera regla al pie espejando la de arriba. Este tic se repite en las 15.
- Titular en grotesque geometrica extendida, peso MEDIUM (no bold), tamano enorme, interlineado ~0.9.
- Enfasis = cambio de COLOR + peso a la vez (color de marca regular -> negro bold). Cero subrayado, cero cajas de resaltado, CERO emoji.
- Fondo degradado CON GRANO, y cambia POR BLOQUE TEMATICO, nunca por lamina. Las 5 de la lista comparten fondo. Las 3 finales comparten fondo. El grano es obligatorio: sin el, se ve plantilla de Canva.
- Maximo 6-9 bloques de texto por lamina, parrafos separados por linea en blanco completa.
- Bullets con vineta redonda e indent marcado.

REGLAS DE ONIA QUE MANDAN SOBRE EL MOLDE:
- Precios: se LEEN de onia-platform/lib/subscription-plans.ts (planes) y onia-platform/lib/pricing.ts (add-ons). No inventes ni un numero.
- Que se vende: se lee de hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md. Solo lo VIVO.
- PROHIBIDO exhibir obra: nada de 'muy pronto', 'beta', 'en construccion', 'proximamente'. Lo que no esta listo no se nombra.
- PROHIBIDO fabricar: cero testimonios, cero logos de clientes, cero cifras de facturacion.
- Los nombres DentalGest / GestiOS / Ganadero OS / ProveeGest NO son productos. Al cliente se le nombra el rubro ('modulo dental').

EJECUCION: escribi las 15 laminas como composicion HyperFrames (HTML), renderizalas a PNG 4:5, y ABRI las 15 imagenes para MIRARLAS. Un exit code 0 no es verificacion. Mostrale a Sergio la tira completa ANTES de publicar nada: construir y publicar son dos permisos distintos.

LISTO = 15 archivos PNG en 4:5 renderizados y ABIERTOS Y MIRADOS uno por uno, verificando en cada uno que (a) el titular esta entre dos reglas, (b) las laminas 5 a 9 comparten titular y fondo, (c) el fondo tiene grano visible, (d) no aparece ninguna palabra de estado de obra ni cifra de facturacion inventada, y (e) todo precio que aparezca coincide con el archivo fuente que le corresponde. La tira completa mostrada a Sergio, sin publicar.
```

## O11 · Carrusel "lo que cuesta operar" — molde de anclaje de precio con ficha de catalogo

- **Sale de:** [Carrusel de gastos: anclaje de precio con ficha de catálogo estilo Apple](2026-08-23-carrusel-gastos-anclaje-precio-ficha-catalogo.md) — `DcWPKNoIEUE`
- **Fuente:** https://www.instagram.com/p/DcWPKNoIEUE/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Tres cosas. (a) Los packshots recortados de cada item — si se generan con Higgsfield es gasto pago y necesita permiso explicito caso por caso. (b) La decision de que numeros de Onia entran, y esos se LEEN de onia-platform/lib/subscription-plans.ts (DEFAULT_PLAN_AMOUNTS) para planes y de onia-platform/lib/pricing.ts para add-ons — nunca se escriben a mano. (c) Nada mas: el molde y el motor de render ya existen.

```text
Construi un carrusel de 9 laminas para Instagram (1080x1350, 4:5) portando el molde de anclaje de precio documentado en hermes-content/references/video-intake/ (ficha: carrusel-gastos-anclaje-precio-ficha-catalogo).

EL MOLDE, sin desviarse:
- Lamina 1: gancho tipografico SIN imagen. Una frase entre comillas curvas en Black gigante, y debajo en gris un pie de nota con asterisco que reencuadra la frase y termina en flecha (ese asterisco hace dos trabajos: el chiste y la instruccion de swipe). Ej.: "Todo esto lo paga mi negocio" / *todo esto ->
- Laminas 2-8: SIETE fichas de estructura IDENTICA, cuatro campos y nada mas:
  1. objeto recortado sin fondo, flotando centrado en el tercio superior-medio, con sombra de contacto eliptica muy difusa debajo
  2. nombre propio, Bold/Black ~115px, tracking -0.02em, color #101010
  3. descripcion de 2-3 lineas en #8C8C8C ~46px, centrada, saltos de linea BALANCEADOS a mano. Dice que TRABAJO hace, nunca que categoria es
  4. precio, mismo peso y tamano que el nombre, SOLO en su renglon con aire arriba y abajo
- Lamina 9: ROMPE la plantilla. Titular arriba-izquierda a bandera con jerarquia invertida (nombre grande + promesa en bold mas chica pegada debajo, sin gris), figura o objeto grande abajo. Es la unica lamina con marca personal. Sin "comenta X", sin "guarda esto".

LA MECANICA (lo que hace que venda):
El orden de precios NO es ascendente. Abri con los dos items mas BARATOS que son los que hacen el trabajo, metele dos techos brutales intercalados en el medio, y cerra con gastos cotidianos. El lector fabrica solo la conclusion — el post NUNCA la enuncia. Ese es el punto entero: el argumento se entrega como aritmetica, no como afirmacion, y por eso no se discute.

ESTILO (identico en las 9):
- Fondo #F3F2F0 plano, sin gradiente ni textura ni grano, IGUAL en todas
- Una sola familia grotesca neo-suiza. Solo DOS roles: nombre+precio en Black, descripcion en gris. No inventes un tercer nivel
- Cero color propio: el unico color lo aporta cada objeto
- Los iconos de app van como squircle 3D con relieve, NO planos (es lo que los iguala visualmente a un packshot fotografiado)
- Sin cajas, sin lineas divisorias, sin numeracion, sin watermark en las fichas

REGLAS DURAS DE ESTE REPO:
- Los precios de Onia se LEEN, no se escriben a mano: planes en onia-platform/lib/subscription-plans.ts (DEFAULT_PLAN_AMOUNTS), add-ons en onia-platform/lib/pricing.ts. Si un numero no esta ahi, no va en la lamina
- PROHIBIDO cualquier estado de obra: nada de "muy pronto", "beta", "proximamente". Solo se nombra lo que esta vivo
- Prohibido fabricar: cero testimonios, cero logos de clientes, cero cifras inventadas
- Generacion paga (Higgsfield, ElevenLabs) requiere permiso explicito de Sergio caso por caso. Por defecto usa assets que ya tengamos o recortes gratuitos
- Antes de aplicar, MOSTRALE a Sergio las 9 laminas renderizadas. No publiques nada

COMO SE RENDERIZA:
Una sola composicion HyperFrames (skills hyperframes-core + slideshow): las 7 fichas son UN template HTML alimentado por un array de datos, no 7 disenos. Guarda la plantilla reutilizable en hermes-content/references/ui-patterns/ficha-producto-catalogo/.

LISTO = los 9 PNG de 1080x1350 existen en disco renderizados por HyperFrames, la plantilla quedo guardada en hermes-content/references/ui-patterns/ficha-producto-catalogo/, y cada cifra de Onia que aparece en las laminas coincide caracter por caracter con su valor en subscription-plans.ts o pricing.ts (verificado con grep del numero contra el archivo fuente).
```

---

# → INFLUENCERS IA

## O12 · Reel ONIA con el molde POV-reveal: 8 s, cero cortes, una sola corriente

- **Sale de:** [POV 10.000 reels: el reveal por zoom-out sin un solo corte](2026-08-23-pov-10000-reels-reveal-zoom-out.md) — `DbtH7_nNRF0`
- **Fuente:** https://www.instagram.com/p/DbtH7_nNRF0/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el reel: NADA. Se puede rodar hoy con un telefono contra un monitor, o renderizar entero con HyperFrames. Para la pantalla de flota de agentes: falta una decision de Sergio, no una credencial — y por regla, una superficie viva no se reemplaza sin que VEA la pieza renderizada primero. NO-VERIFICADO si ONIA Center ya tiene una vista parecida: no la abri en esta sesion.

```text
Construi UN reel vertical 1080x1920 de 8 segundos con el molde 'POV-reveal por zoom-out', copiado en FORMA (no en contenido) del reel IG DbtH7_nNRF0. Motor: HyperFrames (HTML->MP4). Carga ANTES de codear las skills hyperframes, hyperframes-core, motion-doctrine y cut-the-curve.

CONTENIDO (nuestro, honesto, sin exhibir obra):
Texto unico en pantalla: 'POV: tu clinica agenda sola mientras dormis'
Lo que se revela por zoom-out: un grid denso de tarjetas de agenda/turnos confirmandose solos. Empeza con UNA tarjeta ocupando casi todo el cuadro y termina con cientos en un grid. Solo capacidades VIVAS: nada de 'muy pronto', 'beta' ni 'proximamente' en ningun pixel.

LA FORMA (esto es lo que se copia, y es innegociable):
1. CERO CORTES. Una sola toma continua de 8 s. Si aparece un corte, esta mal hecho.
2. UNA SOLA CORRIENTE: todo el movimiento es scale-down continuo, en la misma direccion, de principio a fin. Nada entra desde un costado, nada rebota, nada hace idle wobble.
3. Curva ease-out: los primeros 2 s recorren la mayor parte de la escala; despues desacelera. Los ultimos 1,5 s son QUIETUD casi total — el ojo tiene que alcanzar a contar.
4. Escala EXPONENCIAL, no lineal: de 1 tarjeta visible a 300+. Que el salto se sienta multiplicativo.
5. El texto NO se anima: aparece en el frame 1, se queda fijo en el tercio superior y nunca tapa el contenido que el espectador tiene que mirar. Ese contraste (texto quieto / todo lo demas moviendose) es lo que lo hace legible.
6. Cero intro, cero logo al inicio, cero CTA, cero voz. El primer frame ya es el plano mas cerrado y mas intrigante, para que el loop reenganche.
7. El plano NO es recto: inclina la escena ~10-15 grados. Recto se lee como screen recording y muere.

ESTILO:
- Texto: sans Black (~800), blanco puro, dos lineas centradas con quiebre manual, sombra difusa (sin caja, sin contorno duro).
- Fondo casi negro (#0E0F10). Un solo color de acento en todo el cuadro, usado en no mas de tres sitios. Podes usar el verde lima de referencia (#86E57F) o el acento de marca de ONIA — decidilo leyendo los tokens del repo, NO inventes un color.
- Agrega grano sutil y un halo/bloom leve en los acentos: sin textura se ve renderizado y limpio de mas, y pierde el efecto 'esto es real'.

ANTES DE RENDERIZAR EN ALTA: mostrale a Sergio la tabla de cortes (aca: un solo bloque) y un preview 360p. Regla de oro del carril video: nunca se cierra a ciegas.

LISTO = existe un MP4 de 1080x1920 y ~8 s renderizado con HyperFrames, con CERO cortes verificados, en el que el conteo de tarjetas visibles pasa de 1 en el primer segundo a mas de 100 en el ultimo, el ultimo 1,5 s tiene movimiento casi nulo, el texto esta fijo e identico del primer al ultimo frame, y no aparece la palabra 'pronto', 'beta' ni 'proximamente' en ningun fotograma. Preview 360p mostrado a Sergio y OK explicito recibido antes del render final.
```

## O13 · Vocera IA + producto: el molde de 22 s con CTA mudo

- **Sale de:** [La vocera que no existe: 22 s de UGC con Seedance 2.0 seleccionado en pantalla](2026-08-23-makeugc-vocera-ia-cerave-seedance-2-0.md) — `DcWOss3RxMq`
- **Fuente:** https://www.instagram.com/p/DcWOss3RxMq/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** 1) CREDITOS: models_explore devolvio unlim.available=false para nuestra cuenta hoy. seedance_2_0 admite generaciones ilimitadas de prueba pero nuestro saldo no las cubre ahora, asi que cada generacion se paga ⇒ permiso explicito de Sergio caso por caso (regla de gasto del carril). 2) Una foto de producto real de un cliente y una foto fija de vocera que sostenga la identidad entre clips — la cara NO la sostiene el prompt, la sostiene la misma imagen en image_references. Nada mas: el molde de guion, la tipografia, las dos posiciones de texto y el CTA mudo se montan hoy sin gastar.

```text
AVISO: esto es RECONSTRUIDO. El prompt original nunca aparece en el reel — el textarea de MakeUGC esta vacio (0/2000). Lo que sigue es un prompt nuevo escrito para dar el mismo resultado con nuestras herramientas.

=== PASO 1 — los clips de la vocera (Higgsfield MCP, model_id: seedance_2_0) ===
Parametros (verificados en el catalogo el 2026-08-23):
  medias: [foto_vocera.jpg, foto_producto.png]  <- ambas como image_references
  aspect_ratio: 9:16 · duration: 10 · resolution: 720p · mode: fast · generate_audio: true

Prompt por clip:
"Handheld selfie video, vertical. A woman in a white bathrobe stands in a warm beige plaster bathroom with low golden side light. She holds [PRODUCTO] up toward the camera with one hand and speaks directly to the lens, casual and unhurried. Natural skin texture with visible pores and highlights, shallow depth of field. No music, no on-screen text, no captions. She says: '[FRASE DE 12-15 PALABRAS]'."

Generar 4 clips cambiando SOLO la frase hablada y el encuadre (espejo entero / espejo medio / macro de perfil / mano con producto). LA IDENTIDAD LA SOSTIENE LA MISMA FOTO EN image_references, NO EL TEXTO — no describir la cara en el prompt.

=== PASO 2 — el molde de 22 s (HyperFrames + skill editor-videos) ===
Nueve bloques, en este orden:
  1. 0-4 s   clip 1 · caption apilada ARRIBA-IZQUIERDA: "DEJE DE PAGAR" / "INFLUENCERS REALES"
  2. 4-5 s   macro de cara · caption CENTRADA: "Y DUPLIQUE MIS"
  3. 5-6 s   carton blanco full-bleed con el logo, 1 s
  4. 6-9 s   clip 2 · "ELLA GRABA CADA ANUNCIO" / "PARA MI TIENDA"
  5. 9-10 s  carton blanco: "NO ES REAL"
  6. 10-15 s CAPTURA DE PANTALLA REAL de la herramienta · "LA CREE ADENTRO"
  7. 15-16 s carton blanco: "EL ANUNCIO EN MINUTOS"
  8. 16-18,5 s clip 4 con producto en mano · "QUINCE ANUNCIOS POR SEMANA" / "MISMO PRESUPUESTO"
  9. 18,5-22,3 s CTA MUDO: carton blanco, una sola linea, sin voz encima.

=== REGLAS DEL MOLDE (leidas del reel, no inventadas) ===
- Tipografia: grotesca condensada pesada, CAJA ALTA. Blanco puro (#FFFFFF) sobre video; negro (~#0B0B0B) sobre carton off-white (~#FDFCF7). Hex aproximados.
- Dos posiciones de texto y solo dos: arriba-izquierda apilada (gancho) o centrada a media altura (cuerpo). NUNCA abajo.
- Los subtitulos entran por grupo de palabras y de forma aditiva: la linea 1 se queda, aparece la linea 2, luego se reemplaza el par. Sin desplazamiento, sin escalado, sin wobble.
- Los cartones blancos son la respiracion: separan cada afirmacion, duran ~1 s, una sola linea centrada.
- Un corte cada ~1,8 s. Locucion a ~200 palabras/minuto: encimada, sin pausas habladas.
- La captura de pantalla real es la UNICA textura fria del video. Ese contraste contra la piel calida es la prueba. No estilizarla.
- El ultimo tramo va SIN VOZ. El CTA se lee, no se escucha.
- Se admite que es IA dentro del propio video ("no es real"). No se esconde — regla de Lucia.
- Cero carteles de estado de obra: nada de "beta", "muy pronto", "en construccion".
- Prohibido inventar cifras de ventas. Si no hay dato real de un cliente, ese bloque no se pone.

LISTO = un MP4 vertical 9:16 de 20-24 s con los 9 bloques en el orden de arriba, la MISMA cara reconocible en los 4 clips generados, el carton final sin voz encima ocupando >=3 s, texto solo en las dos posiciones permitidas, y cero carteles de estado de obra ni cifras no verificadas.
```

## O14 · Molde 'parar el corte sobre la petición' — episodio de marca con CTA comentario→DM

- **Sale de:** [Lolo en La Velada: el anuncio de IA cabe dentro de un móvil](2026-08-23-lolo-velada-higgsfield-marketing-studio.md) — `DcYNrdROAyg`
- **Fuente:** https://www.instagram.com/p/DcYNrdROAyg/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el molde de guion, el corte y el CTA: NADA. Se puede hacer esta semana con lo que ya está encendido. Para el bloque UGC: solo el permiso de gasto por render, caso por caso según la regla — pero es UN render, no cuarenta; listar las plantillas ya está hecho y costó cero. Lo que NO se porta, y hay que decirlo sin rodeos: el acceso a un evento como La Velada, el traje físico y los invitados famosos; eso no se compra con créditos. Lo que sí se porta es el método: personaje propio y recurrente, venta en el mismo registro que el contenido, y la petición encima del único plano que no corta.

```text
Construí un episodio de marca de Onia de 90–170 s para publicación de feed en Instagram, siguiendo el molde medido en el reel DcYNrdROAyg (@yvan.thecreator × Higgsfield). No inventes el ritmo: replicá estas proporciones.

ESTRUCTURA DEL GUION (respetá los porcentajes, no los segundos exactos):
1. Gancho por fricción, primer 11% del metraje: dos personajes discutiendo algo humano (dinero, orgullo, un reproche). CERO producto, CERO marca en boca.
2. Sembrá en el 11–17% el conflicto que vas a cobrar en el CTA final. Tiene que quedar abierto.
3. Incidente en el 17–26%: alguien pide algo al protagonista y genera un conflicto emocional real, no publicitario.
4. VENTA en el 30–41% del metraje, máximo 17 s. Reglas duras: (a) el registro NO cambia — se vende con el mismo tono con el que se hace comedia; (b) el beneficio se dice en lenguaje de estatus o vergüenza, nunca de eficiencia (el original dice 'parecéis una tienda de verdad y no un puesto del mercadillo', no dice 'ahorra en producción'); (c) si hay IA en la pieza, se declara en voz alta y se convierte en el chiste, no se esconde.
5. Abandoná la venta por completo del 41% al 68% y volvé a la trama.
6. Segundo toque de marca de ~7% del metraje, con el beneficio reformulado.
7. Vuelta a la trama hasta el 87%.
8. CTA del 87% al 94%.
9. Placa negra final del 94% al 100% con SOLO subtítulo, para una segunda oferta distinta (share/historias).

La marca se nombra DOS veces en todo el episodio. No más.

REGLAS DE CORTE (esto es lo que hay que medir al final):
- Mediana de duración de plano ≤ 3,5 s en todo el episodio.
- UN solo plano, sin cortar, de duración ≥ 3× la mediana, y tiene que caer exactamente encima del CTA.
- Ese plano del CTA es el único bloqueado en trípode; todo lo demás va en mano.
- Un segundo plano largo (≥ 3× la mediana) puede usarse sobre el reveal de producto, y solo ahí.
- Placa negra final de 8–12 s, luma < 0,06.

SUBTÍTULOS (quemados, con editor-videos/HyperFrames):
- Sans grotesca pesada, blanco, filo oscuro fino, SIN caja de fondo.
- 2–4 palabras por tarjeta, siempre una línea.
- Línea base al ~91% de la altura del cuadro.
- Caja baja de frase en TODO el episodio, salvo la palabra clave del CTA en VERSALES. Un solo cambio tipográfico en todo el film.

CTA: elegí una palabra clave de una sola pieza, en versales, y enganchala al circuito comentario→DM que ya está vivo en producción. La recompensa del DM tiene que ser el pago del conflicto sembrado en el paso 2.

ENTREGABLE: guion con timecodes + tabla de cortes (in/out por plano) + el mp4 renderizado.

LISTO = sobre el mp4 renderizado, `ffmpeg -i out.mp4 -filter:v "select='gt(scene,0.35)',showinfo" -f null -` da mediana de hueco entre cortes ≤ 3,5 s Y exactamente un hueco ≥ 3× esa mediana cuyo inicio cae dentro del bloque de CTA; y `ffmpeg -i out.mp4 -vf blackdetect=d=0.5:pix_th=0.06 -f null -` reporta un black_duration de entre 8 y 12 s terminando a menos de 0,5 s del final del archivo.
```

## O15 · Banco de 5 escenas de foto-de-celular para Lucía (sin generar nada)

- **Sale de:** [Influencer Aesthetic — 5 escenas de foto de celular, con el prompt gateado](2026-08-23-influencer-aesthetic-cinco-escenas-prompt-gateado.md) — `DcJbUL6CCp3`
- **Fuente:** https://www.instagram.com/p/DcJbUL6CCp3/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Tres cosas. (1) Los prompts NO estan: el autor los gatea detras de comentar '8'. Hay que RECONSTRUIRLOS con nuestra anatomia de 11 bloques — no comentar, no pedirlos. (2) Generar imagenes es gasto pago: permiso explicito de Sergio, escena por escena, con costo estimado en creditos. (3) Una decision de Sergio: si las 5 escenas las protagoniza Lucia (exige sostener la misma cara, trabajo que el original nunca hizo) o si son 5 modelos distintas como aca.

```text
Objetivo: escribir el banco de escenas que le falta al brief de imagen de Lucía. Hoy tenemos la GRAMÁTICA pero no el VOCABULARIO — sabemos cómo se escribe un prompt de foto realista, pero no qué escena poner. Este carrusel aporta 5 arquetipos que funcionan.

CONTEXTO OBLIGATORIO — leé estos dos archivos antes de escribir una palabra:
- hermes-content/references/video-intake/2026-08-15-realismo-de-celular-prompts-soul.md (la anatomía de 11 bloques; en especial el 7 = la luz como DEFECTO, el 8 = firma óptica del celular, y el 11 = lista de hex explícitos)
- hermes-content/references/video-intake/2026-08-23-influencer-aesthetic-cinco-escenas-prompt-gateado.md (las 5 escenas y su estilo)

TAREA 1 — Instanciar las 5 escenas.
Agregá al final de la ficha 2026-08-23-influencer-aesthetic-cinco-escenas-prompt-gateado.md una sección '## Las 5 escenas, instanciadas en los 11 bloques', con un prompt COMPLETO por escena (los 11 bloques, en orden, en inglés):
- E1 · Tumbona en acantilado mediterráneo a mediodía — libro abierto tapando el torso, gafas oscuras, pelo mojado, sol duro cenital, altas luces quemadas
- E2 · Espejo del baño de casa, sin maquillaje — pijama, taza en la mano, celular tapando medio rostro, luz cálida de aplique, desorden real en la mesada
- E3 · Sala de cine vacía — butacas de terciopelo, pantalla encendida como ÚNICA fuente de luz, sujeto pequeño dentro del cuadro
- E4 · Tienda de barrio de noche — neón, producto en la mano, risa a media carcajada, fondo cargado de mercadería
- E5 · Terraza de azotea en hora dorada — sombrilla, vaso en la mano, azoteas y aires acondicionados de fondo

TAREA 2 — Reglas duras al instanciar. No son opcionales:
1. SIN MARCAS LEGIBLES. Los originales muestran Fanta, Doritos, Sprite, Adidas, Oakley y una tapa de libro real. Los nuestros describen el objeto genérico ('botella de gaseosa naranja sin etiqueta legible', 'zapatilla deportiva blanca lisa'). Agregá los negativos correspondientes.
2. Oclusión parcial del rostro en al menos 3 de 5 (libro, celular, vaso). Menos superficie donde el modelo falla.
3. Cada escena cierra con su lista de 10-13 hex, como manda el bloque 11.
4. El defecto óptico va SIEMPRE (bloques 7 y 8). Prohibidas las palabras 'beautiful', 'perfect', 'flawless', 'cinematic'. Se pide suciedad, no belleza.

TAREA 3 — Registrar el molde.
Agregá una fila R14 a hermes-content/references/video-intake/BANCO_DE_REPLICABLES.md, en NIVEL 2 (🟡 crédito de imagen):
R14 · Carrusel de 6 láminas con texto sólo en los extremos — gancho con título en lámina 1, 4 láminas MUDAS de puro material, CTA en lámina 6 con cebo de UN SOLO DÍGITO. Fuente: DcJbUL6CCp3 + su ficha. Insumo: 5 imágenes generadas + el circuito comentario→DM (ya vivo en prod desde el 18-ago).

TAREA 4 — Anotar el hueco, no taparlo.
Cerrá la sección con '### Lo que este banco NO resuelve': las 5 láminas originales usan 5 mujeres DISTINTAS; el autor nunca resolvió consistencia de cara porque su formato no la pide. Para Lucía hay que sostener la misma cara en las 5, y eso exige Soul + anclas de identidad (2026-08-15-bloquear-identidad-avatar-anclas.md). Dejalo escrito como trabajo pendiente, no lo des por resuelto.

PROHIBIDO EN ESTA TAREA:
- Generar una sola imagen. Generar es gasto pago. Dejá los prompts listos y pedile permiso explícito a Sergio, escena por escena, con el costo estimado en créditos.
- Comentar '8' en el post original ni pedirle los prompts al autor. No hace falta: la anatomía ya la tenemos gratis de otra fuente, y los prompts se reconstruyen.
- Crear archivos nuevos. Todo va en la ficha existente y en el banco existente.

LISTO = la ficha 2026-08-23-influencer-aesthetic-cinco-escenas-prompt-gateado.md contiene una sección con los 5 prompts completos (11 bloques cada uno + su lista de hex), sin una sola marca legible en vestuario o props, con oclusión parcial de rostro en ≥3 de 5; BANCO_DE_REPLICABLES.md tiene la fila R14 en Nivel 2; existe la sección 'Lo que este banco NO resuelve'; y se generaron CERO imágenes.
```

---

# → editor de videos / HyperFrames

## O16 · Molde: pantalla filmada en diagonal (prueba de trabajo sin testimonio)

- **Sale de:** [POV: el timeline como prueba de trabajo](2026-08-23-pov-timeline-como-prueba-de-trabajo.md) — `DZurBtZiT9X`
- **Fuente:** https://www.instagram.com/p/DZurBtZiT9X/
- **Tipo:** MARKETING · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Tres cosas, la primera es bloqueo real. (1) NO tenemos testimonio de cliente: cero clientes pagando y la regla prohibe inventarlos, asi que el payload debe cambiar. La version honesta reemplaza el testimonial por una pantalla viva del producto (un alta de clinica, el chatbot contestando, el pipeline moviendose); el molde aguanta el cambio porque no depende del contenido, depende de que haya algo reproduciendose. (2) Falta decidir el end card: el original es solo un dominio en texto plano sobre negro; el nuestro seria onia.com.bo con el tile verde ya decidido. Decision de cinco minutos que nadie tomo. (3) Hay que reescribir el gancho: 'POV: trying to make X look cool' + 'How'd I do?' funciona en la cuenta de un editor freelance, pero en la cuenta de Onia 'como me salio?' suena a producto no terminado y choca con la regla de no exhibir obra. El gancho tiene que ir en afirmativo y sobre algo VIVO.

```text
Arma un reel vertical de 30 a 40 segundos que use el molde 'pantalla filmada en diagonal'. La idea entera es no producir nada nuevo: se filma trabajo que YA existe reproduciendose en una pantalla.

REGLAS DEL MOLDE (no negociables, son lo que hace que funcione):

1. UNA SOLA TOMA CONTINUA de telefono. Nada de cortes en la capa de afuera. Deriva de mano lenta, sin zoom, sin barrido. El paralaje entre el rotulo fijo y la pantalla viva es todo el movimiento que necesitas.

2. FILMA EL MONITOR, no hagas captura de pantalla. El muare, el brillo del LCD y el grano de poca luz son la textura que dice 'esto es real'. Una captura limpia mata el efecto.

3. EL DISPOSITIVO VA GIRADO 15 a 20 grados, nunca de frente. La pantalla tiene que cruzar el cuadro como una cinta en diagonal que se aleja en perspectiva. De frente es una captura aburrida; en angulo es un objeto.

4. ENCUADRE 9:16: tercio superior para la pared y el rotulo, dos tercios inferiores para el dispositivo. Lo cercano desenfocado, lo importante al centro y a foco.

5. UN SOLO ROTULO DE TEXTO, FIJO LOS 35 SEGUNDOS. Sans geometrica bold, dos lineas maximo, interlineado apretado, mayuscula solo inicial, sombra oscura suave. CERO animacion de texto. Nada de segundo bloque, nada de revelacion.

6. FILMA DE NOCHE con una fuente calida en el fondo (lampara, neon, luz de cocina). La regla de color es CALIDO AFUERA, FRIO ADENTRO: la habitacion ambar, la pantalla gris azulada. Ese contraste de temperatura convierte la pantalla en una ventana sin ningun efecto.

7. DOS SILENCIOS. Los primeros ~5 segundos sin audio del contenido, para que se lea el rotulo. Los ultimos ~3.5 segundos en negro con el end card, tambien en silencio.

8. END CARD: onia.com.bo en texto blanco chico centrado sobre negro, mas el tile verde. Texto plano, sin animacion, sin claim.

QUE SE REPRODUCE EN LA PANTALLA (esto es lo que cambia respecto del original):
El original mete un testimonial de cliente sonando dentro del preview. NOSOTROS NO PODEMOS: cero clientes pagando, prohibido inventar testimonios. Reemplazalo por una pantalla VIVA del producto en produccion. Opciones, elegi una y una sola:
  - el alta de una clinica en onia.com.bo, de principio a fin
  - el chatbot de WhatsApp contestando una consulta real
  - el pipeline de leads de ONIA Center moviendo una tarjeta
  - el editor de conocimiento del chatbot guardando una fila

EL GANCHO: escribilo en AFIRMATIVO y sobre algo que este VIVO en produccion. Nada de 'como me salio?', nada de 'estamos probando', nada de estado de obra. Prohibido 'muy pronto', 'beta', 'proximamente'.

EL CAPTION: una sola pregunta corta que sea barata de contestar, mas nada. Sin hashtags de relleno.

ANTES DE APLICAR CUALQUIER CORTE: mostrale a Sergio la tabla de cortes y un preview en 360p. Regla de oro del carril, no se saltea.

HERRAMIENTAS: telefono para la toma; HyperFrames / editor-videos para el rotulo y el end card; ver-videos para revisar la pieza renderizada; Postiz o la ruta de Instagram para publicar. Cero gasto pago, cero Higgsfield, cero ElevenLabs.

LISTO = existe un MP4 vertical 9:16 de entre 30 y 40 segundos, renderizado en disco, que cumple las 8 reglas del molde verificadas UNA POR UNA mirando la pieza renderizada (no el codigo, no un log): (a) cero cortes en la capa de afuera, (b) el dispositivo esta girado y la pantalla se lee en diagonal, (c) hay exactamente un rotulo de texto y no se mueve, (d) la pantalla reproduce una superficie de Onia que esta VIVA en produccion hoy, (e) el gancho no contiene ninguna palabra de estado de obra, (f) hay silencio al principio y al final, (g) el end card dice onia.com.bo, (h) Sergio vio la tabla de cortes y el preview 360p y dio OK explicito sobre ESA pieza.
```

## O17 · Reel 'lista densa contra reloj' — formato Onia, 58 s en una toma

- **Sale de:** ["$70 millones de consejos de venta en 60 segundos" — el cronómetro está DENTRO del plano y no hay un solo corte](2026-08-23-70-millones-consejos-venta-cronometro-en-plano.md) — `Dax5wGigc30`
- **Fuente:** https://www.instagram.com/p/Dax5wGigc30/
- **Tipo:** MARKETING · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** (a) EL GUION, que no existe: ~24 frases-consejo en espanol boliviano sobre vender software a duenos de negocio, densas y sin relleno, que quepan en 58 s a 3,4 palabras/s (~200 palabras exactas). Ese es el trabajo real. (b) Decidir el par tipografico propio de Onia (una geometrica ligera + una didone) y fijarlo como tokens: copiar Futura+Playfair tal cual es copiar el estilo de otra marca. (c) EL NUMERO DEL GANCHO: Onia NO tiene un '$70 millones' y por la regla de no fabricar esta prohibido inventarlo — el banner debe apoyarse en la promesa de densidad o en una cifra sostenible. (d) EL CUELLO DE BOTELLA REAL: Sergio delante de camara 58 s sin cortarse. Una sola toma no perdona, y es la unica parte que no se automatiza.

```text
Armá un reel vertical de 58 segundos para Onia con el formato 'lista densa contra reloj'. Reproducí estas reglas EXACTAS, todas medidas de una pieza real, no estimadas:

GRABACIÓN
1. UNA SOLA TOMA, cero cortes. Nada de cortar silencios, nada de jump cuts, nada de b-roll. Si la toma se traba, se repite entera.
2. Cámara fija, plano medio a la altura de una mesa/barra, la persona en el TERCIO DERECHO del cuadro mirando a lente.
3. En el TERCIO INFERIOR IZQUIERDO va un portátil apoyado, reproduciendo a pantalla completa un video de cronómetro de 1 minuto (buscá '1 minute timer black background' en YouTube). En el primer segundo la persona SEÑALA el reloj con la mano: ese gesto es la apertura, no hay locución de arranque.
4. Fondo oscuro y cálido, desenfocado, con un acento de luz cálida. Un solo color saturado en el cuadro (la ropa). Lavalier a la vista, no lo escondas.
5. Voz sola: NADA de música de fondo. Normalizá la voz fuerte (~-18 dBFS RMS).

GUION
6. ~200 palabras exactas, habladas a 3,4 palabras por segundo. Eso es ~24 frases-consejo, una cada 2,4 segundos. Sin relleno, sin 'como les decía', sin transiciones.
7. Estructura: 0-5 s tesis que descalifica el instinto del espectador · 5-9 s reencuadre emocional · 9-17 s UNA TAXONOMÍA (tipos de comprador) — es el tramo que la gente guarda · 17-27 s mecánica · 27-46 s objeciones · 46-58 s cierre con un remate que se CONTRADICE con el ritmo que acabás de ejecutar.
8. CERO CTA. Nada de 'seguime', 'guardalo', 'comentá'. La conversión es la densidad: imposible retener todo en un pase, así que se rebobina.

TEXTO EN PANTALLA
9. BANNER FIJO desde el fotograma 0 hasta el último, nunca sale: versalitas negras en grotesca pesada sobre píldora blanca redondeada, dos líneas, centrado arriba (x 0,29-0,71 · y 0,216-0,270 del cuadro). Terminá el banner en DOS PUNTOS: prometen una lista. El número del banner tiene que ser VERDADERO — si no tenemos cifra, la promesa es de densidad, no de plata. Prohibido inventar.
10. SUBTÍTULO: bloques de 4-5 palabras, mediana 1,30 s por bloque (rango 0,50-2,95 s). Dentro de cada bloque las palabras APARECEN DE A UNA siguiendo el habla real. Total: ~46 bloques en 58 s.
11. CERO ANIMACIÓN. Cada palabra y cada bloque aparecen y desaparecen en UN SOLO FOTOGRAMA. Sin fundidos, sin pop, sin escalado, sin resaltado karaoke de la palabra activa. Si le ponés easing, arruinaste la pieza: a 0,29 s por evento el movimiento es ruido.
12. DOS TIPOGRAFÍAS que se turnan por bloque, sin regla fija: una geométrica ligera en minúscula y una serif display en VERSALITAS. Blanco puro (#FBF7FA aprox.) con halo mínimo. Elegí el par propio de Onia y fijalo como token; no copies Futura+Playfair tal cual.
13. ESCALERA: cada línea nueva del bloque se centra ~6% del ancho de cuadro más a la derecha que la anterior.
14. El bloque vive en la banda y 0,33-0,40 del alto, en el vacío oscuro. NUNCA pisa la cara, NUNCA pisa el portátil, NUNCA pisa el banner.

CIERRE
15. Cortá con el reloj entre 0:01 y 0:03, NUNCA en 0:00. Sin outro, sin tarjeta final, sin CTA. El bucle queda abierto a propósito.

Antes de aplicar cualquier corte o de renderizar, mostrale a Sergio la tabla de bloques + un preview 360p. Regla de oro del carril: nunca cortar a ciegas.

LISTO = el mp4 exportado pasa las SEIS verificaciones medidas con ffmpeg/ffprobe sobre el archivo final, no sobre la intención: (1) `ffmpeg -vf "select='gt(scene,0.10)',showinfo"` devuelve 0 eventos de escena; (2) la duración está entre 55 y 60 s; (3) contando píxeles blancos en la región del subtítulo a 30 fps hay entre 40 y 50 caídas de tinta (bloques) con mediana entre 1,1 y 1,5 s; (4) ninguna caída ni subida de tinta tarda más de 1 fotograma (cero fundidos); (5) el piso de audio en su ventana de 100 ms más callada está por debajo de -45 dBFS (sin cama musical); (6) el último fotograma muestra el cronómetro entre 0:01 y 0:03. Y Sergio dio el OK explícito sobre ESA pieza renderizada, no sobre el plan.
```

## O18 · Carrusel-prueba de 4 láminas: el número que sube es el único argumento

- **Sale de:** [TYCHS — el contador que sube es todo el argumento (carrusel de 4 láminas, conteo de papas con YOLO11 Nano + SAM 2)](2026-08-23-tychs-contador-papas-yolo11-sam2.md) — `Dbyx3bwE6Mp`
- **Fuente:** https://www.instagram.com/p/Dbyx3bwE6Mp/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Tres cosas concretas. (1) Un video fuente de 13-15 s de una pantalla real de ONIA con un número que suba solo — citas agendadas, mensajes respondidos por el agente, ítems procesados — en toma única con captura fija. (2) Definir el par de verdes: el verde de marca de Onia más un 'verde máquina' distinto para la salida del sistema; hoy ese segundo verde no existe. (3) Datos que se muevan: el alta está CERRADA hasta v1.0 y la cuenta de clinica klein se borró, así que hace falta un tenant demo con datos sembrados, y por la regla de no fabricar ese material se rotula demo. Lo que NO falta: el motor, el formato ni el permiso de gasto — es render local y gratis, no toca Higgsfield ni ElevenLabs.

```text
Armá un carrusel de Instagram de 4 láminas en 4:5 (1080x1350) que demuestre que [MÓDULO DE ONIA] funciona, sin una sola palabra hablada y sin exhibir obra.

REGLAS DURAS
- Prohibido "muy pronto", "beta", "en construcción", "próximamente", banners de borrador o listas de lo que falta.
- Prohibido inventar testimonios, logos o cifras. Si es demo, se rotula demo.
- Si aparece un precio, se LEE de onia-platform/lib/pricing.ts (add-ons) o lib/subscription-plans.ts (planes). No se escribe a mano.

LÁMINA 1 — LA PRUEBA (video, 13-15 s, TOMA ÚNICA, cero cortes)
- Captura de pantalla real de ONIA con UN número que sube solo (citas agendadas, mensajes respondidos por el agente, ítems procesados). Captura fija, sin paneo.
- El número va en VERDE MÁQUINA (#00FF00 puro), posición FIJA, sin animación, sin easing, sin odómetro: se redibuja el entero crudo cada fotograma. El número ES el motion design. No agregues transiciones, zoom, parallax ni entradas de texto.
- Si hay un estado o una región que importa, marcala con un polígono de trazo magenta (#FF00FF) y relleno traslúcido oscuro (#4A0F45 al ~55%), y cambiá el color de los elementos al entrar: un color fuera (violeta #6A3BC0), otro dentro (ámbar #C8873C).
- Al pie: banda NEGRA SÓLIDA (#000000, NO degradado) ocupando ~28% del alto, con el titular QUEMADO en grotesca condensada black, TODO MAYÚSCULAS, tracking apretado, interlineado apretado, 4 líneas.
- El titular alterna VERDE DE MARCA y BLANCO por BLOQUE DE SENTIDO, nunca por palabra suelta.
- En la costura entre video y banda negra: el logo centrado, flanqueado por dos hairlines que llegan a los bordes.
- Franja inferior fina: "DESLIZÁ PARA VER MÁS" en versalitas tracked-out + chip verde con ▶.
- Audio: cama instrumental, sin voz, ~-16 dB medios. El post tiene que funcionar con el sonido apagado.

LÁMINA 2 — EL MECANISMO, CON NOMBRES REALES
- Imagen del cómo: la pantalla o el diagrama que muestra el mecanismo.
- Titular en verde de marca, condensada black, máximo 2 líneas.
- Debajo, banda negra con el cuerpo en ITÁLICA sentence-case (contraste deliberado contra el titular): UNA sola oración que NOMBRA las herramientas de verdad. Nada de "IA avanzada" ni "tecnología de punta": nombres propios o nada.

LÁMINA 3 — LA PRUEBA OTRA VEZ, LIMPIA
- El MISMO video de la lámina 1, mismo render del contador, pero SIN titular.
- Metelo en una tarjeta de esquinas redondeadas con borde hairline blanco, centrada sobre un fondo oscuro que es el mismo video escalado y desenfocado. Logo arriba a la derecha.
- Sirve para que quien ya leyó el titular pueda MIRAR sin texto encima.

LÁMINA 4 — EL CIERRE
- Foto ambiente amplia del contexto de uso.
- Titular al pie alternando BLANCO y VERDE DE MARCA, condensada black, mayúsculas, 3 líneas.
- UN solo pedido. Sin link, sin precio, sin lista de features.

PALETA (ajustá el verde de marca al de Onia; el verde máquina queda como está)
- Negro banda #000000 · Blanco #FFFFFF
- Verde de marca ≈ #8CC63F (voz editorial)
- Verde máquina #00FF00 (salida del sistema)
- NUNCA usar el mismo verde para las dos cosas: esa separación es todo el truco.

RENDER
HyperFrames (HTML→MP4). El contador, el polígono, el titular y el chip de swipe son HTML/CSS sobre el video: no hace falta OpenCV ni ningún modelo de visión.

LISTO = las 4 láminas exportadas en 4:5 (1080x1350); `ffmpeg -i sX.mp4 -vf "select=gt(scene\,0.15),showinfo" -f null -` devuelve CERO cortes en las láminas 1 y 3; el contador se lee con un valor en el primer fotograma y uno MAYOR y distinto en el último; un grep sobre todos los textos devuelve cero coincidencias de pronto|beta|construcción|próximamente; y las 4 láminas fueron ABIERTAS Y MIRADAS renderizadas (no solo exportadas) antes de publicar.
```

---
