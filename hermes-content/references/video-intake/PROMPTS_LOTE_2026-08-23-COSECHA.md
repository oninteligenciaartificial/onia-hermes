# Prompts del lote cosechado del DM — P1 a P15

**2026-08-23.** Primer lote que NO llegó por links pegados a mano: salió del cosechador
automático sobre el hilo de DM. Ese script nunca se había corrido y hubo que arreglarle las
tres partes (ver commit `35e2bcd6`).

| | |
|---|---|
| Posts compartidos en el hilo | **143** |
| Ya estaban en el corpus | 50 |
| Nuevos | 93 |
| Pasaron el triaje por caption | **32** |
| **Con ficha escrita** | **15** |
| **Pendientes** | **17** — ver [`PENDIENTE_COSECHA.md`](PENDIENTE_COSECHA.md) |

> ⚠️ **Cobertura de este lote:** sin transcripción de audio. Speaches devolvió `fetch failed`
> para los 26 videos, en paralelo y también de a uno. Las fichas se hicieron con **texto en
> pantalla + caption + cortes medidos con ffmpeg**. Ninguna afirma nada sobre lo que se *dice*.

| # | Item | Cuenta | Destino | Prompt |
|---|---|---|---|---|
| **P1** | [Db--nmlFmqR](2026-08-23-cosecha-cinco-skills-animacion-genjutsu-motion-design.md) | @sujeitoprogramador | `web-factory` | Evaluar e instalar genjutsu y motion-design-skill (los 2 hallazgos que no tenemos) |
| **P2** | [DbEHFJjjd6y](2026-08-23-cosecha-toggle-luces-grilla-producto.md) | @andrew.plerdy | `web-factory` | Reconstruir el toggle que conmuta la grilla entera de productos |
| **P3** | [Db6y_ypvWbF](2026-08-23-cosecha-guia-una-pagina-prd-ianlee.md) | @ianlee.js | `web-factory` | Plantilla 'guia de una pagina': el patron de documento-lead-magnet extraido del reel Db6y_ypvWbF |
| **P4** | [Db9L8EDhf5H](2026-08-23-cosecha-review-united-carriers-eje-de-scroll-y-velocimetro.md) | @oproductdesigner | `web-factory` | P23 + P24 en el banco de motion: el eje que gira y el velocimetro por scroll (y corregir la ficha de United Carriers del 11-ago) |
| **P5** | [DbZHuAuIDhh](2026-08-23-cosecha-claude-design-sistema-de-diseno-de-marca.md) | @vison.studios | `web-factory` | Crear el Design System de Onia en claude.ai/design con DesignSync (sin Figma, sin gasto) |
| **P6** | [Db2swVmk7eI](2026-08-23-cosecha-marco-editorial-carrusel-poster-adgod-rhode.md) | @adgod.ai | `marketing` | Molde B del banco de carruseles: la campaña conceptual (sándwich de 10 láminas) |
| **P7** | [DadOo9Mo3AA](2026-08-23-cosecha-demo-en-una-toma-vision-sobre-cctv.md) | @supra_digitalsolutions | `marketing` | Guion + plan de rodaje: el reel de demo en UNA sola toma para ONIA |
| **P8** | [DbqmAEYhJsF](2026-08-23-cosecha-prompt-en-vivo-canon-g7x-flash-chatgpt.md) | @marian.rojass | `marketing` | Tres reels con el molde 'prompt en vivo' (screen recording + overlay estático) |
| **P9** | [Day9oS2ClDu](2026-08-23-cosecha-latigo-dibujado-sobre-captura-de-terminal.md) | @algorithmicscaracasccct | `editor-de-videos` | Portar el patron 'overlay dibujado que golpea la UI' a un reel de 7 s de Onia Platform |
| **P10** | [DaAjqtugWF_](2026-08-23-cosecha-marco-hud-y-cierre-en-wordmark.md) | @formd.designs | `editor-de-videos` | Marco HUD de cuatro esquinas + cierre por elemento portador, como composicion reutilizable de HyperFrames |
| **P11** | [Dax0R-atz8d](2026-08-23-cosecha-explicador-servicio-3-pasos-hilo-continuo.md) | @metromedia.house | `editor-de-videos` | Plantilla HyperFrames: 3 laminas de paso con hilo continuo y subtitulo palabra-a-palabra |
| **P12** | [Db60O6OxWU5](2026-08-23-cosecha-escalera-ruim-bom-excelente.md) | @tiagolemosx | `editor-de-videos` | Plantilla HyperFrames: escalera comparativa RUIM/BOM/EXCELENTE, parametrizada por rubro |
| **P13** | [DblhPOux1YP](2026-08-23-cosecha-nueve-formatos-anuncio-sin-cortes.md) | @davidaistar | `editor-de-videos` | Plantilla HyperFrames: listicle sobre toma continua |
| **P14** | [DbJy34KhdyM](2026-08-23-cosecha-recorte-de-podcast-que-retiene-sin-cortar.md) | @niidea.tv | `editor-de-videos` | Pack de overlays 'recorte vertical ONIA' en HyperFrames |
| **P15** | [DcJivjZOOth](2026-08-23-cosecha-contador-escalado-una-sola-toma.md) | @bastian.xu | `editor-de-videos` | Patrón «contador escalado»: overlay reutilizable de 13 s para reels de Onia |

---

# → web-factory

## P1 · Evaluar e instalar genjutsu y motion-design-skill (los 2 hallazgos que no tenemos)

- **Sale de:** [Cinco skills de animación: dos son skills de verdad, tres son librerías de siempre](2026-08-23-cosecha-cinco-skills-animacion-genjutsu-motion-design.md) — `Db--nmlFmqR` · @sujeitoprogramador
- **Fuente:** https://www.instagram.com/p/Db--nmlFmqR/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para web-factory, NADA: los dos repos son públicos y MIT, y la evaluación es leer el código antes de instalar (con una precaución concreta: la barra de lenguajes de Genjutsu dice Python 95,1% + Shell 4,9%, o sea que trae scripts ejecutables, no solo markdown — eso se revisa ANTES de instalarlo, no después). Para marketing, tampoco falta credencial ni permiso de gasto: el circuito comentario→DM está vivo y el destino ya está decidido desde el 23-ago. Lo único que falta ahí es elegir el TEMA del roundup propio, porque Onia no vende skills de animación.

```text
Objetivo único de la sesión: decidir, con evidencia leída, si las skills públicas `AThevon/genjutsu` y `lottiefiles/motion-design-skill` entran a nuestro stack de motion o se descartan por duplicación.

De dónde sale: ficha de video-intake `cinco-skills-animacion-genjutsu-motion-design` (carrusel de @sujeitoprogramador, IG Db--nmlFmqR). El carrusel lista 5 "skills de animación". Ya verifiqué por grep sobre todo el repo que TRES de las cinco ya las tenemos y NO hay que tocarlas:
- GSAP → plugin `gsap-skills` instalado, 8 skills (gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-frameworks, gsap-performance, gsap-utils).
- Three.js → adapter en `.claude/skills/hyperframes-animation/adapters/three.md`.
- Motion / Framer Motion → ya en uso en web-factory, documentado en `hermes-content/references/ui-patterns/APRENDIZAJE_WEBS.md`.
Las dos que NO existen en el repo (cero coincidencias de grep) son las dos de este encargo.

Pasos:

1) Worktree propio con ruta explícita, `git branch --show-current` antes de tocar nada. Carril web-factory.

2) Clonar los dos repos FUERA del repo (a un temp), no instalarlos todavía:
   - https://github.com/AThevon/genjutsu
   - https://github.com/lottiefiles/motion-design-skill

3) REVISIÓN DE SEGURIDAD ANTES DE INSTALAR — no es opcional. Dato leído en pantalla en la lámina s02 del carrusel: el repo de Genjutsu declara `Python 95,1% · Shell 4,9%`. Una skill de diseño de movimiento que es 95% Python + 5% shell tiene SCRIPTS EJECUTABLES, no es solo markdown. Antes de instalar:
   - listar todo archivo `.py`, `.sh`, y todo hook declarado;
   - leer qué hacen: si escriben fuera del cwd, si hacen red, si leen credenciales o `.env`, si tocan configuración de Claude;
   - si algo hace red o toca settings/credenciales, PARAR y reportarlo sin instalar.
   Mismo chequeo para motion-design-skill (su README se declara "philosophy-first, implementation-agnostic", así que probablemente sea markdown puro — verificarlo, no asumirlo).

4) SOLAPAMIENTO. Leer el SKILL.md / README de cada uno contra lo que ya tenemos y responder por escrito, skill por skill:
   - ¿Qué dice que hace que `.claude/skills/motion-doctrine/` NO cubra ya?
   - ¿Qué dice que hace que `.claude/skills/cut-the-curve/` y `seam-craft` NO cubran ya?
   - ¿Qué aporta sobre `web-factory/docs/MOTION_PATTERN_BANK_2026.md`?
   - ¿Contradice alguna regla de motion-doctrine? (motion-doctrine se declara superior a guías de motion upstream — si hay choque, gana motion-doctrine y hay que decirlo explícito).
   Genjutsu además dice cubrir Android (Jetpack Compose) y Apple (SwiftUI) — eso NO nos sirve hoy, no lo cuentes como valor.

5) VEREDICTO POR SKILL, uno de tres: INSTALAR / DESCARTAR-POR-DUPLICACIÓN / DESCARTAR-POR-RIESGO. Con la razón en una línea y el archivo concreto que la respalda.

6) Solo las que den INSTALAR se instalan, y se prueban de verdad, no por grep: aplicar la skill a UN componente real de web-factory y MIRAR el resultado renderizado (Playwright + captura, y leer la captura). Un 200 y un grep no son verificación.

7) Escribir el resultado donde corresponde: si una skill entra, se anota en la skill nuestra que corresponda (editar la existente, NO crear doc suelto en la raíz). Si las dos se descartan, se anota el descarte con su razón en la ficha de video-intake para que nadie las vuelva a evaluar en tres semanas.

8) Cerrar el carril: commits conventional explicando el POR QUÉ, gates (`tsc --noEmit`, tests, code-reviewer), y handoff en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos, incluyendo intentos fallidos.

No hagas: no instales nada sin haber leído sus scripts; no reabras la Landing v3 (aprobada, base clara); no toques los 4 archivos raíz de web-factory sin avisar; no persigas el otro frente que salió de esta ficha (el molde de carrusel para marketing) — ese va en otra sesión, anótalo y seguí.

LISTO = existe un veredicto escrito (INSTALAR / DESCARTAR-POR-DUPLICACIÓN / DESCARTAR-POR-RIESGO) para cada una de las dos skills, cada veredicto citando el archivo leído que lo respalda; y si alguna dio INSTALAR, hay una captura renderizada de un componente real de web-factory hecho con ella, mirada y comentada.
```

## P2 · Reconstruir el toggle que conmuta la grilla entera de productos

- **Sale de:** [El toggle "Lights" que enciende toda la grilla de productos](2026-08-23-cosecha-toggle-luces-grilla-producto.md) — `DbEHFJjjd6y` · @andrew.plerdy
- **Fuente:** https://www.instagram.com/p/DbEHFJjjd6y/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el patron web: NADA. Se hace hoy, sin credencial, sin gasto y sin decision pendiente. Para el molde de video faltan dos decisiones chicas y una prohibicion: (i) elegir la palabra clave del comentario en espanol (el equivalente de LEAK); (ii) que la pieza mande a agendar demo en cal.onia.com.bo y no a un PDF (decidido el 23-ago); (iii) PROHIBIDO copiar el overlay de heatmap - inventar un mapa de calor es fabricar dato y choca con la regla de no fabricar.

```text
Trabajas en el repo onia-hermes. Objetivo unico de la sesion: agregar un patron nuevo a la biblioteca de UI reconstruidos.

CONTEXTO
En https://www.instagram.com/p/DbEHFJjjd6y/ (@andrew.plerdy) una tienda de iluminacion tiene, en la barra de herramientas de la coleccion (a la derecha de "View"), un toggle etiquetado "Lights". Al accionarlo, las 8 fichas de producto visibles cambian su foto AL MISMO TIEMPO: pasan de la version con la lampara apagada (pared clara, fondo gris frio) a la version encendida (bulbo emitiendo, halo ambar, entorno oscurecido). No es hover por ficha ni carrusel: es UN control a nivel de coleccion que conmuta la imagen primaria de TODA la grilla. El video no muestra codigo - se reconstruye, no se copia.

QUE HACER
1. Lee primero hermes-content/references/ui-patterns/README.md y respeta sus reglas al pie de la letra (un index.html autocontenido y sin dependencias, fuente anotada en comentario arriba del archivo, solo transform y opacity salvo justificacion escrita, prefers-reduced-motion con `transition: none` y NO con 0.01ms).
2. Crea hermes-content/references/ui-patterns/toggle-luces-grilla/index.html con:
   - Una grilla de 8 fichas de producto (nombre + "Desde Bs X"), responsive, que no desborde a 320px de ancho.
   - Una barra de herramientas arriba con el toggle etiquetado. Usa un input[type=checkbox] con label (o un button con aria-pressed) - debe ser operable con teclado y anunciar su estado a un lector de pantalla.
   - Cada ficha con DOS imagenes apiladas en el mismo contenedor (position:absolute), la de estado A abajo y la de estado B arriba con opacity:0. El toggle escribe el estado UNA sola vez en el contenedor de la grilla y las fichas lo leen por selector descendiente: UN evento, N imagenes. Prohibido un listener por tarjeta y prohibido cambiar src.
   - Crossfade de opacity entre ambas imagenes, ~250-350ms, con la misma curva para las 8.
   - Como no tenemos fotos reales de lampara encendida/apagada, genera los dos estados con gradientes CSS inline o SVG data-uri dentro del mismo archivo (fondo gris frio ~#D8D2C8 vs halo ambar ~#E8913A). No descargues nada ni referencies assets externos: el archivo tiene que abrir solo.
   - Un parrafo corto de nota al pie del HTML (en comentario) explicando por que el apilado evita el parpadeo del primer clic: ambas imagenes ya estan en el DOM.
3. En el mismo archivo, en el comentario de cabecera, anota: la fuente (URL + cuenta), que se reconstruyo sin ver codigo, y que el valor real del patron es fotografico (dos assets del MISMO encuadre, mismo angulo y mismo lente, cambiando solo el estado) - sin eso el gesto se lee como "cambio la foto" y no como "encendi la luz".
4. Agrega el patron a la tabla/indice de hermes-content/references/ui-patterns/README.md si el README lleva indice; si no lleva, no inventes uno.
5. Agrega a web-factory/docs/MOTION_PATTERN_BANK_2026.md una entrada corta para el gesto "crossfade de grilla completa disparado por un toggle de coleccion", respetando el formato que ya usa ese archivo.
6. Abre el index.html con Chromium headless y MIRA la captura en los dos estados (no basta con que el archivo exista). Verifica ademas que con prefers-reduced-motion forzado el cambio sea instantaneo y que las 8 fichas efectivamente esten en el estado B.
7. Commit conventional en tu propia rama, explicando el POR QUE.

NO HAGAS
- No copies el overlay de heatmap del video ni ninguna cosa parecida a un mapa de calor: inventar dato de usuarios viola la regla de no fabricar de este repo.
- No metas GSAP, framer-motion ni ninguna libreria: son dos opacity y un :checked.
- No toques nada fuera de hermes-content/references/ui-patterns/ y web-factory/docs/MOTION_PATTERN_BANK_2026.md.

LISTO = existe hermes-content/references/ui-patterns/toggle-luces-grilla/index.html, abre sin errores de consola y sin ninguna peticion de red externa, y una captura de Chromium headless muestra las 8 fichas en estado apagado y otra captura las muestra a las 8 en estado encendido tras un solo clic en el toggle.
```

## P3 · Plantilla 'guia de una pagina': el patron de documento-lead-magnet extraido del reel Db6y_ypvWbF

- **Sale de:** [El documento como lead magnet: la guía de una página de @ianlee.js](2026-08-23-cosecha-guia-una-pagina-prd-ianlee.md) — `Db6y_ypvWbF` · @ianlee.js
- **Fuente:** https://www.instagram.com/p/Db6y_ypvWbF/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada. No hace falta credencial, permiso ni gasto. El CONTENIDO del metodo PRD ya esta cubierto por make-plan, superpowers:writing-plans y el comando prp-prd; lo que se copia aca es la FORMA, no el fondo.

```text
Objetivo unico de la sesion: construir la plantilla HTML reutilizable de 'guia de una pagina' de ONIA, portando el MECANISMO de diseno de un documento de referencia. No es un rediseno de nada vivo: es un archivo nuevo en el banco de patrones.

Carril: web-factory. Worktree con ruta explicita; correr `git branch --show-current` antes de tocar nada.

ANTES de codear, cargar: skill `impeccable`, skill `ui-ux-pro-max`, y la galeria interna `hermes-content/references/ui-patterns/`. Regla del proyecto: nada de plantilla generica de Tailwind/shadcn — hay que cumplir >=4 de las Required Qualities de rules/web/design-quality.md.

REFERENCIA (extraida a mano de 58 fotogramas de https://www.instagram.com/p/Db6y_ypvWbF/ de @ianlee.js; los fotogramas estan en el intake de video, ficha `guia-una-pagina-prd-ianlee`). El documento original es en espanol, se llama 'Escribe tu maldito PRD' y es una pagina HTML renderizada en navegador. NO lo copies literal: porta el MECANISMO, con contenido nuestro.

El mecanismo, pieza por pieza:
1. Titulo corto y contundente + una sola linea de subtitulo que promete el beneficio en tres palabras ('claridad, control y velocidad'). Regla horizontal de 1px debajo.
2. Secciones numeradas con el simbolo de seccion (§1, §2, §3). El titulo de la seccion es corto y su definicion va EN LA MISMA LINEA, en gris, no debajo. Esto ahorra media pantalla por seccion.
3. Bloque de dos columnas contrapuestas: 'CONTIENE' (azul) vs 'NUNCA CONTIENE' (rojo). Cada item es un chip con borde de 1px y relleno tenue. Los chips de la columna roja van TACHADOS. El tachado hace el trabajo que haria un parrafo entero de 'no incluyas'.
4. Bloque de comparacion 'ASI NO' / 'ASI SI': la caja mala en gris con los items tachados, la caja buena en rojo con una cita real entre comillas angulares. Sin iconos de check ni de cruz.
5. Parrafo de cierre de seccion con negrita A COLOR sobre las 3-4 frases clave, para que el resumen se lea sin leer el parrafo.
6. Tabla de tres columnas donde la columna del medio es una BARRA de ancho creciente y la barra ES el dato: sin eje, sin numero, sin leyenda. La columna derecha dice el veredicto en negrita + la explicacion en gris.

Tokens (hex aproximado, leido de pantalla; ajustalos a la paleta viva de ONIA si ya existe una en el repo, y si existe MANDA la de ONIA):
- papel #FDFDFC, tinta #1A1A1A
- acento primario ~#2B4C9B sobre relleno ~#F4F7FE
- acento de prohibicion ~#B3261E sobre relleno ~#FDF4F3
- descarte ~#F2F2F0 con texto tachado ~#8A8A85
Tipografia: UNA sola grotesca geometrica en dos pesos. Etiquetas de seccion en versalitas espaciadas. Cero sombras, cero degradados, cero radios grandes, cero texturas. Plano y editorial.

QUE CONSTRUIR:
- `hermes-content/references/ui-patterns/guia-una-pagina/plantilla.html` — autocontenido, sin CDN, tokens CSS en `:root`, responsive real (sin scroll horizontal a 390px), y con los seis bloques de arriba marcados con comentarios HTML para que se puedan borrar los que no se usen.
- `hermes-content/references/ui-patterns/guia-una-pagina/README.md` — que dice de donde salio el patron (la URL y la cuenta), que hace cada bloque y CUANDO usar cada uno.
- Un ejemplo relleno con contenido REAL de ONIA en la misma carpeta (`ejemplo-dental.html`), usando el rubro dental que es el unico vivo.

REGLAS DURAS DE ONIA que aplican al ejemplo relleno:
- Prohibido escribir una cifra de precio a mano. Los precios se LEEN de onia-platform/lib/pricing.ts (add-ons) y onia-platform/lib/subscription-plans.ts (planes). Si el ejemplo necesita un precio, dejalo como un placeholder marcado, no lo inventes.
- Prohibido exhibir obra: ni 'muy pronto', ni 'beta', ni 'proximamente', ni listas de lo que falta. Solo se nombra lo que esta vivo.
- Prohibido fabricar: cero testimonios, cero logos de clientes, cero metricas. Hay cero clientes pagando.
- El unico CTA final es agendar una demo en https://cal.onia.com.bo (decision del 2026-08-23). No es un PDF, no es un lead magnet descargable.

VERIFICAR MIRANDO, no suponiendo: abrir los dos HTML en Chromium headless con Playwright y GUARDAR las capturas al lado del archivo. Un grep no confirma que se vea bien.

LISTO = existen `hermes-content/references/ui-patterns/guia-una-pagina/plantilla.html`, `README.md` y `ejemplo-dental.html`; hay cuatro capturas PNG guardadas en esa carpeta (plantilla y ejemplo, cada uno a 1440x900 y a 390x844) tomadas con Chromium headless y MIRADAS; ninguno de los dos HTML produce scroll horizontal a 390px; `grep -iE 'muy pronto|beta|proximamente|próximamente'` sobre la carpeta no devuelve nada; el ejemplo no contiene ningun numero de precio escrito a mano; y el unico href de CTA del ejemplo es https://cal.onia.com.bo.
```

## P4 · P23 + P24 en el banco de motion: el eje que gira y el velocimetro por scroll (y corregir la ficha de United Carriers del 11-ago)

- **Sale de:** [United Carriers: el eje de scroll que gira y el velocímetro por scroll](2026-08-23-cosecha-review-united-carriers-eje-de-scroll-y-velocimetro.md) — `Db9L8EDhf5H` · @oproductdesigner
- **Fuente:** https://www.instagram.com/p/Db9L8EDhf5H/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada para lo que declaro SIRVE YA: el velocimetro y el giro de eje son CSS + JS puro, sin credencial, sin gasto y sin cliente. Lo unico que falta y NO se puede resolver desde este material es medir el peso real de unitedcarriers.com (LCP, KB de JS gzipped) para confirmar o desmentir la afirmacion del caption de que carga muy liviano — eso exige abrir y medir el sitio, y hoy solo tengo el juicio escrito de un tercero. Ese dato es el que decide si la ficha del 11-ago tenia razon al descartarlo por presupuesto de performance.

```text
Carril web-factory. Objetivo unico de la sesion: meter en el banco de motion los dos patrones que sacamos del reel https://www.instagram.com/p/Db9L8EDhf5H/ (@oproductdesigner reseñando unitedcarriers.com), dejarlos con demo que se pueda MIRAR, y corregir la ficha de intake que ya teniamos de ese mismo sitio.

Contexto que no tenes que volver a investigar:
- El sitio ya estaba en el banco. Lee PRIMERO hermes-content/references/video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md. Esa ficha analizo el MISMO sitio desde otro reel el 11-ago, lo dejo en FUTURO, y dejo abierta esta verificacion textual: "A VERIFICAR: que unitedcarriers.com siga online y sea el sitio real en produccion (no un mockup de portafolio armado para el reel)". Tambien afirma "no se nombra herramienta ni framework".
- El reel nuevo aporta datos que aquella ficha no tenia. En el footer, leido en pantalla: "© 2026 UNITED CARRIERS APAC PTY LTD · CRAFTED BY BEAMPLUS ... POWERED BY STRIPE"; HEAD OFFICE 2A International Square, Tullamarine VIC 3043, Australia; EMAIL contact@unitedcarriers.com; HOTLINE 1300 000 082; OPERATING ACROSS Australia / New Zealand / Hong Kong / China; SECURE PAYMENTS con pasarela PCI-DSS. La agencia SI esta nombrada (BEAMPLUS); el framework sigue sin nombrarse.
- El caption (portugues) afirma que el sitio carga muy liviano y usa muy poco video, y que tapar escenas elaboradas con videos ya renderizados "funciona, si, pero pesa" y sale caro en infra y experiencia. Eso es JUICIO DE UN TERCERO, no una medicion nuestra. No lo escribas como hecho.

HACE ESTO, en este orden:

1. Corregi (no dupliques, no crees archivo nuevo con fecha de hoy) hermes-content/references/video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md: reemplaza el bloque "A VERIFICAR" por lo que este reel efectivamente muestra (sitio navegado en vivo, con datos de empresa, direccion fisica, hotline y pasarela de pagos — consistente con produccion), corregi la linea "no se nombra herramienta ni framework" para reflejar que la AGENCIA si esta nombrada (CRAFTED BY BEAMPLUS) aunque el framework no, y dejá escrito como pendiente explicito que NADIE midio todavia el peso real del sitio. Cita el reel Db9L8EDhf5H como fuente de la correccion. El veredicto FUTURO del sitio completo se mantiene: no lo cambies.

2. Agrega dos patrones a web-factory/docs/MOTION_PATTERN_BANK_2026.md, siguiendo EXACTAMENTE el formato de los P1-P22 que ya estan ahi (el banco va por P22; ojo que P18 BleedWordmark ya cubre la palabra gigante sangrada, no lo repitas):
   - **P23 — Eje que gira (V->H->V) con costura fisica.** El scroll cambia de eje vertical a horizontal y vuelve, y la transicion entre secciones es la continuacion del MISMO objeto portador, nunca un fundido. En el sitio de referencia: un contenedor pasa a camion, la carretera dobla 90 grados y el eje vuelve a vertical; la atmosfera del globo se blanquea y ES el fondo blanco de la seccion siguiente; la franja de carretera desemboca en la cubierta de un barco; las nubes pasan a ser el suelo del avion. Regla dura que tiene que quedar escrita: el portador se dibuja POR ENCIMA de la capa de texto en al menos una seccion — eso es lo que hace que se lea como un unico espacio 3D y no como fondo decorativo. Implementalo con GSAP ScrollTrigger (skill gsap-scrolltrigger) y respeta las reglas duras de la seccion 1 del banco, incluido prefers-reduced-motion.
   - **P24 — Lectura derivada de velocidad de scroll.** Un contador NN KM/H en una esquina, derivado de la VELOCIDAD del scroll (no de la posicion), suavizado y formateado a dos digitos, que cae a 00 cuando el usuario se detiene. Es el detalle mas barato y mas impresionante del sitio entero: cero 3D, cero WebGL, cero assets. Dejalo generico (unidad configurable), no atado a logistica.

3. Crea hermes-content/references/ui-patterns/scroll-velocity-readout/ con una demo autocontenida (mismo formato que las carpetas hermanas: chat-widget/, checkout-card/, floating-cart/, etc.) que muestre P24 vivo y P23 al menos en su version minima de un giro de eje.

4. Anota en web-factory/docs/DESIGN_LEARNED_2026.md el truco tipografico de titular en dos tonos: primera linea en gris, resto en casi-negro (WE MOVE FREIGHT gris / WE OWN THE OUTCOME negro). Una linea, con su porque.

REGLAS DE LA CASA que aplican aca:
- Verificar es MIRAR. Abri la demo con Playwright + Chromium headless y LEE la captura. Un 200 y un grep no son verificacion.
- Un tema = un archivo sin fecha. No crees un doc nuevo al lado de la ficha del 11-ago: corregila.
- No fabriques. Lo que el reel no dice, no lo escribas. En particular: NO afirmes con que framework esta hecho el sitio (no se dice en ningun lado) y NO afirmes que carga liviano como si lo hubieramos medido.
- Metodo correcto desde el primer intento: carga las skills impeccable, motion-doctrine, seam-craft y gsap-scrolltrigger ANTES de escribir codigo.
- Rama propia, commits conventional, gates (tsc --noEmit si aplica, tests, code-reviewer) antes de mergear.

NO HAGAS en esta sesion: no arranques una landing 3D completa estilo United Carriers. Ese frente sigue cerrado por presupuesto de performance y de precio, tal como lo dejo la ficha del 11-ago. Si te tienta, anotalo como pendiente y segui.

LISTO = (a) MOTION_PATTERN_BANK_2026.md contiene las secciones `### P23` y `### P24` con codigo ejecutable y su nota de prefers-reduced-motion; (b) hermes-content/references/ui-patterns/scroll-velocity-readout/ existe y una captura de Playwright en tres posiciones de scroll distintas muestra TRES valores de KM/H distintos, con 00 en la captura sin movimiento, y el cambio de eje visible entre dos de ellas; (c) 2026-08-11-web-3d-scrollytelling-united-carriers.md ya no contiene la cadena "A VERIFICAR" ni la afirmacion "no se nombra herramienta ni framework" sin matizar, y si contiene "BEAMPLUS" y el pendiente explicito de medir el peso del sitio; (d) grep de marcadores de conflicto `<<<<<<<` en los archivos tocados devuelve cero.
```

## P5 · Crear el Design System de Onia en claude.ai/design con DesignSync (sin Figma, sin gasto)

- **Sale de:** [Claude Design: cargar la marca una vez y que todas las piezas salgan alineadas](2026-08-23-cosecha-claude-design-sistema-de-diseno-de-marca.md) — `DbZHuAuIDhh` · @vison.studios
- **Fuente:** https://www.instagram.com/p/DbZHuAuIDhh/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada bloqueante, y menos de lo que el post sugiere. No hay ningun .fig en el repo (find -iname '*.fig' = 0 resultados) y no hace falta: el formulario de Claude Design declara los insumos 'all optional' y acepta codigo local, repo de GitHub, o directamente fuentes/logos/assets por drag. Los tres insumos ya existen: hermes-content/brand/tokens.css (9 colores + 2 familias), onia-logo-horizontal.svg + onia-logomark.svg, y hermes-content/brand/fonts/. Sin gasto, sin credencial nueva, sin permiso. Unica decision pendiente (no bloqueante): si el sistema se genera con la marca actual o si primero se resuelve la pareja tipografica — hoy display y body son ambas sans, y el post demuestra que el contraste serif/sans es lo que da el aire.

```text
OBJETIVO UNICO DE LA SESION: dejar publicado el Design System de Onia en claude.ai/design, generado desde los archivos de marca que YA existen en el repo, para que toda pieza futura (landing, propuesta, carrusel, deck) herede la identidad sin re-describirla en cada prompt.

De donde sale esto: analisis del carrusel https://www.instagram.com/p/DbZHuAuIDhh/ (@vison.studios), ficha en hermes-content/references/video-intake/. El post ensena el flujo Figma -> .fig -> Claude Design. NO copies ese paso: el formulario de Claude Design declara sus insumos 'all optional' y acepta codigo local, repo de GitHub o simplemente fuentes/logos/assets. No tenemos ni necesitamos un .fig.

INSUMOS QUE YA EXISTEN (verificados, no los busques de nuevo):
- hermes-content/brand/tokens.css — 9 colores (--onia-green #10C26B, --onia-green-deep #0B8F4F, --onia-green-soft #D6F5E5, --onia-ink #0A0F0D, --onia-ink-2 #1C2622, --onia-surface #F4F5F2, --onia-white, --onia-muted #6B756F, --onia-muted-dark #9FB0A8) + 2 familias (--font-display Space Grotesk, --font-body Inter) + canvas 1080x1350 y radios.
- hermes-content/brand/onia-logo-horizontal.svg y onia-logomark.svg
- hermes-content/brand/fonts/
- hermes-content/brand/ONIA_BRAND_IDENTITY.md

PASOS

1. Lee hermes-content/brand/ONIA_BRAND_IDENTITY.md y tokens.css enteros antes de tocar nada. Carga la skill design-md.

2. DECISION A RESOLVER PRIMERO (y a preguntarle a Sergio si no es obvia desde ONIA_BRAND_IDENTITY.md): hoy --font-display y --font-body son AMBAS sans (Space Grotesk / Inter). El carrusel analizado demuestra que el contraste serif-display / sans-body es lo que da aire y jerarquia. Propone la pareja, mostrala renderizada en un HTML de una pantalla, y espera OK antes de hornearla en el sistema. Si Sergio prefiere quedarse con la pareja sans, se respeta y se sigue — no reabras el tema.

3. Construi el bundle local del sistema de diseno en web-factory/design-system/onia/ con, como minimo: escala tipografica (display/H1/H2/subtitulo/cuerpo/caption), los 9 colores con su rol semantico (no solo el hex: cuando se usa cada uno), escala de espaciado, radios, ambos logos con sus reglas de uso, estados de boton (default/hover/focus/active/disabled) y una tarjeta de superficie. Un archivo HTML de preview por componente, cada uno con el marcador de primera linea <!-- @dsCard group="..." --> para que la Design System pane arme el indice sola.

4. Publica con DesignSync, EN ESTE ORDEN OBLIGATORIO: list_projects -> (si no hay uno de tipo design system) create_project name="Onia Design System" -> get_project para VERIFICAR que type es PROJECT_TYPE_DESIGN_SYSTEM (ese tipo es inmutable al crearse; empujar a un proyecto normal nunca lo convierte en sistema de diseno) -> finalize_plan con localDir en web-factory/design-system/onia y los writes como globs -> write_files usando localPath (no data inline: asi los contenidos no entran al contexto).

5. VERIFICA MIRANDO, no suponiendo (regla del proyecto): abri el proyecto publicado y mira las tarjetas renderizadas. Un write_files con exito NO es verificacion. Si alguna tarjeta sale vacia, rota o sin estilos, arreglala antes de cerrar.

6. PRUEBA REAL DE QUE EL SISTEMA SIRVE: genera UNA pieza nueva heredando el sistema — una seccion de landing de Onia — y compara sus colores y tipografias contra tokens.css. Si no coinciden, el sistema esta mal armado, no la pieza.

PROHIBIDO
- No inventes colores, fuentes ni valores que no esten en tokens.css o ONIA_BRAND_IDENTITY.md. Si falta un valor, preguntá; no lo rellenes con criterio propio.
- No fabriques testimonios, logos de clientes ni cifras en ninguna pieza de ejemplo (cero clientes pagando).
- No escribas 'beta', 'muy pronto', 'en construccion' ni ningun estado de obra en material que pueda ver un cliente.
- No hardcodees hex fuera de tokens.css. tokens.css es la fuente unica.
- No toques archivos fuera de web-factory/design-system/onia/ y hermes-content/brand/ sin avisar.

AL CERRAR: escribi el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md — y no te saltees 'intentos fallidos'.

LISTO = existe un proyecto de tipo PROJECT_TYPE_DESIGN_SYSTEM llamado "Onia Design System" en claude.ai/design, confirmado por DesignSync get_project; sus tarjetas se ven renderizadas correctamente al abrirlo (verificado MIRANDO, con captura, no con un codigo de respuesta); y una pieza nueva generada desde ese sistema usa colores y tipografias que coinciden exactamente con hermes-content/brand/tokens.css.
```

---

# → marketing / motor de contenido

## P6 · Molde B del banco de carruseles: la campaña conceptual (sándwich de 10 láminas)

- **Sale de:** [El marco editorial que convierte 7 fotos sueltas en una campaña](2026-08-23-cosecha-marco-editorial-carrusel-poster-adgod-rhode.md) — `Db2swVmk7eI` · @adgod.ai
- **Fuente:** https://www.instagram.com/p/Db2swVmk7eI/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Tres cosas concretas: (a) decidir que es 'el producto' en nuestra version — Onia no vende un objeto fisico, el equivalente son capturas del producto, y los dashboards se restilan ANTES de sacar capturas (landing v3 aprobada); (b) permiso explicito de gasto si se generan las laminas fotorrealistas en Higgsfield (regla: generacion paga = permiso caso por caso); (c) la palabra-gatillo del comentario y el texto del DM, que hoy no existen escritos. ADVERTENCIA al portar: adgod usa una marca ajena real. Nosotros no podemos — la version legitima es la campana conceptual de la marca Onia misma o de un rubro nombrado en generico, nunca de un negocio identificable que no nos contrato.

```text
Objetivo de esta sesión: agregar un SEGUNDO molde de carrusel al banco, y dejar armados los dos pósters de sus extremos, sin gastar un crédito.

Contexto. El carril video-intake analizó el carrusel https://www.instagram.com/p/Db2swVmk7eI/ de @adgod.ai (10 láminas, leídas todas). Descubrimiento: existe un molde de carrusel que es el OPUESTO del que ya tenemos en `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md`. El nuestro (8 slides: hook→costo→causa→resolución→prueba→CTA) pone copy en todas las láminas y persuade con argumento. El de adgod pone copy SOLO en las dos primeras y la última, deja 7 láminas mudas en el medio, y persuade por demostración de capacidad. No es mejor ni peor: sirve para otro trabajo (mostrar que sabemos hacer algo, no explicar por qué duele un problema). La ficha completa está en `hermes-content/references/video-intake/` con el slug `marco-editorial-carrusel-poster-adgod-rhode`.

QUÉ HACER

1) Escribir la sección "Molde B — campaña conceptual" en `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md`, debajo de la sección 2 (el molde de 8 slides), sin tocar ni contradecir lo que ya está. Debe decir explícitamente cuándo se usa cada molde: Molde A cuando vendemos la solución a un dolor; Molde B cuando mostramos capacidad de ejecución. La estructura del Molde B, exacta:
   - Lámina 1: póster-portada. TODO el copy conceptual + la firma + el disclaimer de IA.
   - Lámina 2: hoja de contactos. Co-branding arriba, grilla 3×2 de lo que viene, CTA blando al pie.
   - Láminas 3-9: siete piezas visuales SIN una sola palabra sobreimpresa. Reparto obligatorio: 2 con persona / 5 de objeto, en 3 escalas distintas (plano medio, pieza entera, macro), y ninguna repite tipo de plano.
   - Lámina 10: póster-cierre con el CTA duro de comentario.
   La regla de una línea que resume el molde: **el texto vive solo en los extremos**.

2) Construir la plantilla del póster (láminas 1 y 10) como HTML autocontenido en `hermes-content/references/ui-patterns/poster-editorial/`, 1440×1920 (3:4), lista para renderizar con HyperFrames. Especificación medida del original, respetala:
   - Corchetes en las 4 esquinas a ~7% del borde; marcas de registro (crosshair de imprenta) a media altura izquierda y derecha.
   - Rejilla de 3 columnas arriba y 3 al pie, con bullets `·` de separador.
   - Dos bloques de metadatos flanqueando el centro, a la altura del sujeto.
   - Titular único gigante (~85% del ancho) y TODO lo demás a cuerpo diminuto (~1,2% de la altura). Salto de escala ~20×, sin tamaños intermedios.
   - El sujeto se SOLAPA sobre el titular, tapándole el centro. Ese solape es el único recurso de profundidad; no lo omitas.
   - Grano de papel dentro de las letras del titular.
   - Paleta del original, como referencia de estructura (los valores finales salen de la identidad Onia ya cerrada, no de acá): papel `#EDE4D7`, tinta `#1A1A18`, y un solo color caliente `#C40E19` usado EXCLUSIVAMENTE en los dos puntos de firma (logo del autor y tarjeta de CTA). La regla portable es esa: el color caliente marca dónde está la venta, y no aparece en ningún otro lado.

3) Adaptar el copy del marco a Onia, respetando dos reglas duras del proyecto:
   - **No fabricar.** adgod usa una marca ajena real (rhode) sin encargo. Nosotros NO. La campaña conceptual es de la marca Onia misma, o de un rubro nombrado en genérico ("módulo dental"). Jamás un negocio identificable que no nos contrató, ni testimonios, logos o cifras de clientes.
   - **La venta nunca exhibe obra.** Nada de "muy pronto", "beta" ni "en construcción" en ninguna lámina.
   El CTA de la lámina 10 va al lead magnet YA decidido: agendar demo en cal.onia.com.bo. Si usás la mecánica comentario→DM (el circuito IG comentario→DM está vivo en producción desde el 18-ago), lo que manda el DM es el link de la demo, NO un PDF ni una guía. Dejá escritas la palabra-gatillo y el texto exacto del DM, que hoy no existen.

NO HAGAS
- No generes imágenes en Higgsfield ni en ningún generador pago: eso requiere permiso explícito de Sergio, caso por caso. Esta sesión entrega el MARCO y el MOLDE; las 7 láminas del medio quedan anotadas como pendiente con su costo estimado.
- No saques capturas de dashboards para las láminas del medio: los dashboards se restilan ANTES de las capturas (decisión de la landing v3 aprobada). Anotalo como dependencia.
- No reescribas el molde de 8 slides que ya está en el banco. Se agrega, no se reemplaza.

LISTO = `CAROUSEL_PATTERN_BANK_2026.md` tiene una sección "Molde B" con la tabla de 10 láminas y el criterio de cuándo usar A vs B; existe `hermes-content/references/ui-patterns/poster-editorial/` con el HTML renderizando las dos variantes (portada y cierre) a 1440×1920, ABIERTAS Y MIRADAS en el navegador (no solo un 200), con los corchetes, los crosshairs, el solape sujeto/titular y el color caliente apareciendo en exactamente dos lugares; y la palabra-gatillo + el texto del DM apuntando a cal.onia.com.bo están escritos en el mismo doc.
```

## P7 · Guion + plan de rodaje: el reel de demo en UNA sola toma para ONIA

- **Sale de:** [Demo en una sola toma: visión por computadora sobre las cámaras que el cliente ya tiene](2026-08-23-cosecha-demo-en-una-toma-vision-sobre-cctv.md) — `DadOo9Mo3AA` · @supra_digitalsolutions
- **Fuente:** https://www.instagram.com/p/DadOo9Mo3AA/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el molde: NADA. Se graba hoy con un celular, el monitor y una cuenta de demo de ONIA Platform. Para el producto: falta todo lo caro — una decisión de Sergio sobre si Onia entra a video-analytics (vertical nuevo, no pack del core), un cliente real que preste su NVR, hardware de inferencia, y una postura legal sobre reidentificación de personas por nombre en Bolivia. Eso es BANCO, no descarte: la idea sirve, el momento no.

```text
Sos la sesión de marketing de ONIA. Objetivo único y verificable: dejar escrito, listo para apretar REC, UN guion de reel de 55-70 s que copie el molde verificado del reel de @supra_digitalsolutions (Instagram DadOo9Mo3AA), adaptado a ONIA Platform. No grabás nada en esta sesión: entregás el guion y el plan de rodaje.

== CONTEXTO QUE NO SE NEGOCIA ==
- Lead magnet decidido el 2026-08-23: AGENDAR UNA DEMO en cal.onia.com.bo. El CTA del reel es ESE. Ni PDF, ni 'escribinos', ni DM automático.
- Regla 'no fabricar' (cero clientes pagando): prohibido inventar testimonios, logos, cifras de ROI, nombres de clientes o capturas de cuentas que no existan. Todo número que aparezca en pantalla sale de una cuenta de demo REAL de ONIA Platform.
- Regla 'la venta nunca exhibe obra': cero 'muy pronto', 'beta', 'en construcción', 'próximamente'. Solo se nombra lo que está VIVO. Antes de nombrar un rubro, verificá su estado en hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md (dental está vivo; el resto, comprobalo, no lo supongas).
- Precios: si el guion nombra un precio, se LEE de onia-platform/lib/subscription-plans.ts (planes) o onia-platform/lib/pricing.ts (add-ons). Recomendación fuerte: no nombrar precio en el reel.

== EL MOLDE A COPIAR (5 bloques, en este orden) ==
1. GANCHO POR PREGUNTA FRECUENTE (0-3 s). Literal del original: 'Muchas personas nos preguntan si nosotros hacemos este tipo de implementaciones'. Cero promesa, cero cifra, cero 'descubrí el secreto'. Abre con la duda del que mira y la responde MOSTRANDO. Adaptalo, no lo copies palabra por palabra.
2. DEMOSTRACIÓN CON EL DEDO (3-30 s). La pantalla YA está corriendo cuando arranca el plano. Se enumeran capacidades señalándolas FÍSICAMENTE con la mano sobre el monitor, una por una, en frases cortas encadenadas con 'incluso también se puede…'. El original encadena 8 mediciones seguidas sin respirar.
3. AMPLITUD DE RUBRO (30-40 s). El original: '…absolutamente todo en cualquier tipo de industria: de servicio, quioscos, almacenes, fábricas, centros logísticos, lo que vos necesites nosotros lo podemos medir.' Convierte un caso en un mercado. Para ONIA: nombrá SOLO rubros vivos, y cerrá la lista capturando demanda futura sin admitir obra ('¿otro rubro? escribinos').
4. EL REMATE QUE VENDE (40-52 s). El original mete la salida por WhatsApp, dicha en primera persona del sistema: 'se puede configurar para que WhatsApp te envíe notificaciones… hey, hoy tuviste un día de productividad mucho más abajo que lo normal.' Es el único momento con una frase citada textual y por eso es el único que se recuerda. ONIA tiene ese canal VIVO (n8n + Chatwoot): usalo. El remate es que el sistema te HABLA, no que tiene pantallas.
5. CIERRE A DEMO (52-65 s). El original: 'haceme el formulario… podemos hablar de hacer una demo totalmente gratis.' El nuestro: agendar en cal.onia.com.bo. Fricción baja, objeto claro, la palabra 'gratis' al FINAL y no al principio.

== EL PLAN DE RODAJE (esto es lo que hace que el molde funcione) ==
- UNA SOLA TOMA. El original mide 64,700 s con 0 cortes (medido con ffmpeg, umbral scene 0.3). No se corta: el ritmo lo dan la mano que entra a señalar y el contenido que cambia en la pantalla. Si el guion necesita un corte, el guion está mal escrito.
- Cámara EN MANO filmando el monitor en DIAGONAL, nunca frontal. El monitor ocupa los dos tercios inferiores; arriba a la izquierda entra ventana/luz/planta para que no sea solo pantalla.
- La MANO es el editor: entra en cuadro cada vez que la voz nombra algo nuevo. Reemplaza al corte, al zoom y al puntero animado.
- PiP del hablante arriba a la derecha: rectángulo vertical de esquinas muy redondeadas, sin borde ni sombra. Puede flotar, no hace falta clavarlo.
- Subtítulos quemados: 3 líneas máximo, caja negra OPACA POR RENGLÓN (no un rectángulo único), texto blanco, sans grotesca pesada, a ~75-80% de la altura. Bloque completo cada ~3 s, sin karaoke palabra por palabra.
- Textura real: que se vean el moiré del monitor, los cables, el teclado. NO limpiar el set. Esa suciedad es lo que hace creíble que el sistema esté corriendo de verdad; limpio parece render.

== ENTREGABLE ==
Un archivo en hermes-content/docs/ (sin fecha en el nombre si es fuente de verdad; con fecha y en historial/ si es la foto de un día), que contenga:
- El guion segundo a segundo, con los 5 bloques y sus tiempos.
- Qué pantalla de ONIA Platform se muestra en cada segundo, nombrada por su RUTA en el repo, y con qué cuenta de demo.
- El caption de Instagram.
- La checklist de lo que hay que tener listo antes de apretar REC.

LISTO = existe el archivo del guion en hermes-content/docs/, con los 5 bloques y sus tiempos sumando entre 55 y 70 s, con el CTA a cal.onia.com.bo escrito literal, con cada pantalla nombrada por su ruta dentro de onia-platform, con cero apariciones de 'muy pronto' / 'beta' / 'próximamente' / 'en construcción', y con cero cifras que no provengan de subscription-plans.ts, de pricing.ts o de una cuenta de demo real.
```

## P8 · Tres reels con el molde 'prompt en vivo' (screen recording + overlay estático)

- **Sale de:** [Escribir el prompt en vivo es el reel entero](2026-08-23-cosecha-prompt-en-vivo-canon-g7x-flash-chatgpt.md) — `DbqmAEYhJsF` · @marian.rojass
- **Fuente:** https://www.instagram.com/p/DbqmAEYhJsF/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada para portar el molde. HyperFrames está instalado y probado, el editor de videos está completo y en main, la plataforma tiene rubros encendidos en producción para grabar, y el destino del CTA ya está decidido (demo en cal.onia.com.bo). El único límite es de contenido, no de herramienta: solo se graba lo que está VIVO en producción — nada detrás de un flag apagado y ningún cartel de 'muy pronto' en cámara.

```text
Objetivo único de la sesión: producir TRES reels verticales de Onia con el molde 'prompt en vivo', extraído de https://www.instagram.com/p/DbqmAEYhJsF/ (@marian.rojass). La ficha completa del análisis está en hermes-content/references/video-intake/ con el slug prompt-en-vivo-canon-g7x-flash-chatgpt — leela ANTES de empezar.

EL MOLDE (cifras medidas con ffprobe sobre el original, no estimadas):
1. Gancho de 4 palabras en overlay fijo, con la forma 'No tengo <lo caro> pero sí <Onia>'. Cuatro líneas, quiebre por sentido, centrado.
2. 40-45% del metraje es UN SOLO PLANO continuo mostrando el trabajo en curso en pantalla. En el original son 9,5 s de tecleo sin un solo corte.
3. La espera se MUESTRA, no se corta.
4. UN solo corte (el original tiene 2, ambos en el mismo instante: 9,47 s y 9,80 s) y ahí entra el reveal a pantalla completa.
5. Cierre: comparación antes/después y termina en el DESPUÉS.
6. Duración total 13-15 s.

ESPEC DEL OVERLAY (medido sobre el original, portalo tal cual):
- Sans geométrica redondeada ExtraBold/Black, caja mixta, SIN contorno, SIN sombra, SIN caja de fondo.
- Cuerpo = 2,7% de la altura del cuadro. Interlínea 1,1 (apretada).
- Color #C042E5 (magenta-violeta) sobre fondo claro. UN SOLO acento, cero degradados, cero segundo color.
- Bloque centrado, entre y=20% e y=30% de la altura.
- CERO animación de entrada: el overlay es estático todo el video. El movimiento lo pone la UI grabada, no el editor. No agregues keyframes, no agregues transiciones.

LOS TRES REELS (grabar pantalla de onia-platform en PRODUCCIÓN, con datos de prueba, nunca datos de un cliente real):
A) 'No tengo recepcionista pero sí Onia' — grabar el editor de conocimiento del chatbot en vivo, escribiendo una respuesta y probándola en el probador.
B) 'No tengo secretaria pero sí Onia' — grabar el alta de una cita en el módulo dental de punta a punta.
C) Tercero a tu criterio, elegido SOLO entre capacidades encendidas y verificadas en producción hoy.

REGLAS DURAS, no negociables:
- Solo se graba lo que está VIVO en producción y verificado ahí. Nada detrás de un flag apagado. Si al ir a grabar algo no funciona, NO lo grabes: cambiá de reel y anotá el pendiente.
- PROHIBIDO que aparezca en cámara 'muy pronto', 'beta', 'en construcción' o cualquier estado de obra. Un solo cartel contamina el producto entero.
- No fabricar: cero testimonios, cero logos de clientes, cero cifras de resultados. No hay clientes pagando.
- Datos en pantalla: inventados y obviamente de prueba. Ningún nombre, teléfono ni NIT real.
- CTA: el objeto que mandamos es AGENDAR UNA DEMO en cal.onia.com.bo (decisión del 2026-08-23). NO un PDF. Va como última línea del caption, no como overlay en el video.
- El original no tiene CTA porque su conversión es el guardado; el nuestro sí lo lleva.

ENTREGABLES:
- 3 MP4 verticales 1080x1920 renderizados con HyperFrames (leé la skill hyperframes ANTES de codear; no reinventes el motor).
- 1 archivo de caption por reel, con el CTA a cal.onia.com.bo.
- La tabla de cortes y el preview 360p de los tres, MOSTRADOS a Sergio ANTES de dar nada por cerrado (regla de oro del carril video: nunca cortar a ciegas).

LISTO = los 3 MP4 existen en disco, ffprobe confirma en cada uno duración entre 13 y 15 s, resolución 1080x1920 y como máximo 2 cortes detectados con umbral scene 0.3; los 3 previews 360p y su tabla de cortes fueron mostrados a Sergio; y ningún fotograma de ningún reel contiene las cadenas 'muy pronto', 'beta', 'próximamente' ni 'en construcción'.
```

---

# → editor de videos / HyperFrames

## P9 · Portar el patron 'overlay dibujado que golpea la UI' a un reel de 7 s de Onia Platform

- **Sale de:** [El látigo sobre la terminal: un overlay dibujado que golpea una captura de pantalla](2026-08-23-cosecha-latigo-dibujado-sobre-captura-de-terminal.md) — `Day9oS2ClDu` · @algorithmicscaracasccct
- **Fuente:** https://www.instagram.com/p/Day9oS2ClDu/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Nada bloqueante: cero gasto, cero credencial, cero permiso. Solo dos insumos nuestros: (a) una captura de pantalla de Onia Platform ya restilada — la memoria de la landing v3 dice explicitamente que los dashboards se restilan ANTES de las capturas, ese es el orden; (b) decidir que accion concreta dramatiza el gesto. ADVERTENCIA DE MARCA: si portamos el molde hay que agregarle el cierre que este post NO tiene (agendar demo en cal.onia.com.bo), y jamas copiar la mecanica del titular — el post afirma una capacidad que su propia pantalla desmiente (todos los Web Search salen Interrupted y Claude termina respondiendo de memoria), que es justo lo que la regla de no fabricar prohibe.

```text
Sos la sesion del carril editor-de-videos. Objetivo unico: producir UN reel vertical de ~7 segundos que porte el patron de motion documentado en la ficha de video-intake `Day9oS2ClDu` (latigo dibujado sobre captura de terminal), aplicado a una pantalla real de Onia Platform.

ANTES DE CODEAR, cargar en este orden: la skill `hyperframes` (entrada), `hyperframes-core` (contrato de composicion), `motion-doctrine` (ley de continuidad y prohibicion de wobble ocioso), `cut-the-curve` (curva del golpe), `oversized-cursor` (el patron hermano: elemento grafico fuera de escala sobre una UI real) y `hyperframes-animation` + `hyperframes-keyframes`. NO reinventar el motor: HyperFrames vive en `.agents/skills/`, revisarlo antes de escribir nada.

EL PATRON A REPRODUCIR (medido con ffprobe sobre el original, no estimado):
- 6.9 s aprox, 30 fps, formato 9:16.
- CERO cortes. Un solo plano continuo. Todo el ritmo lo pone el elemento animado, no el montaje.
- Lienzo negro puro #000000 con letterbox arriba y abajo; la captura de pantalla FLOTA en el centro al ancho del area util, NO se recorta a pantalla completa.
- UN solo titular estatico, presente el 100% del tiempo, en el tercio superior negro: sans humanista peso regular (NO bold), blanco #FFFFFF, caja baja, centrado, 3 lineas maximo, interlineado ~1.25, ancho ~78%. Sin sombra, sin caja de fondo, sin contorno, sin emoji.
- Encima de la captura: un elemento grafico SOBREDIMENSIONADO en trazo de contorno blanco #FFFFFF de 3-4 px, SIN relleno, blend normal. Entra fuera de cuadro, describe un arco en S, 'golpea' cerca del punto de interes de la UI, sale de cuadro. ~3 pasadas en los 7 s.
- SMEAR FRAMES obligatorios en el pico de cada pasada: 3-5 copias del mismo path desfasadas con opacidad decreciente, encendidas SOLO en los fotogramas del pico. Esto es lo que hace que el golpe se sienta rapido sin un solo corte. Implementacion: <svg> con <path> animado por stroke-dasharray + transform keyframeado; las copias son paths hermanos con opacity keyframeada a 0 fuera del pico.
- El elemento NO deforma la UI. La ilusion de impacto es solo trayectoria + smear + SFX sincronizado al frame del restallo.

QUE DRAMATIZAR (elegir UNO y no mezclar): una accion real y VIVA de Onia Platform. Ejemplo valido: la agenda del modulo dental donde una cita se confirma sola. Prohibido dramatizar algo que no este encendido en produccion.

INSUMOS QUE TENES QUE CONSEGUIR VOS ANTES DE RENDERIZAR:
1. La captura de pantalla de Onia Platform. Grabar la pantalla REAL, no un mockup — la mugre autentica (barra del navegador, datos reales de demo) es lo que hace creible el patron. OJO CON EL ORDEN: si la pantalla no esta restilada segun la linea de la landing v3, se restila ANTES de capturar. No capturar una pantalla vieja.
2. El SVG del gesto, en trazo de contorno sin relleno.

REGLAS DE MARCA — NO NEGOCIABLES:
- El original NO tiene CTA. El nuestro SI: cierra mandando a agendar demo en cal.onia.com.bo. Ese es el lead magnet decidido; no es un PDF.
- PROHIBIDO copiar la mecanica del titular del original. Ese post afirma 'hace que Claude funcione mas rapido' mientras su propia pantalla muestra que cancela todas las busquedas. No fabricamos capacidades.
- PROHIBIDO todo estado de obra en pantalla: nada de 'muy pronto', 'beta', 'proximamente', 'en construccion'.
- Cero cifras, cero testimonios, cero logos de clientes: no hay clientes pagando.

GASTO: cero. Todo con HyperFrames local. NO usar Higgsfield ni ElevenLabs sin permiso explicito caso por caso.

REGLA DE ORO DEL CARRIL: la tabla de cortes y el preview 360p se le MUESTRAN a Sergio antes de dar nada por bueno. Nunca cortar ni publicar a ciegas. Construir y publicar son dos permisos distintos.

Al cerrar, escribir el handoff del carril en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md, incluido el campo de intentos fallidos.

LISTO = existe un MP4 renderizado en el arbol de trabajo que ffprobe reporta como 1080x1920, 30 fps, entre 6.0 y 8.0 s; `ffmpeg` con filtro de escena a umbral 0.3 reporta 0 cortes; y abriendo con Read el fotograma del segundo 3 se ve simultaneamente el titular estatico, la captura de Onia Platform y el trazo blanco del overlay con sus smear frames.
```

## P10 · Marco HUD de cuatro esquinas + cierre por elemento portador, como composicion reutilizable de HyperFrames

- **Sale de:** [El marco HUD de cuatro esquinas y el cierre que invierte el wordmark](2026-08-23-cosecha-marco-hud-y-cierre-en-wordmark.md) — `DaAjqtugWF_` · @formd.designs
- **Fuente:** https://www.instagram.com/p/DaAjqtugWF_/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para el COMPONENTE: nada. Se construye y renderiza hoy con metraje de prueba, sin credencial, sin permiso, sin gasto. Para el REEL COMPLETO de ONIA: falta metraje real — alguien filmando a Sergio trabajando (no es credencial ni permiso, es una filmacion). Y falta corregir el formato: este video es 16:9 y en Reels eso es una franja chica con bandas negras; nuestra version tiene que nacer 1080x1920 con el HUD dentro del area segura, no portar el 16:9 tal cual.

```text
Objetivo unico de la sesion: dejar en el repo una composicion de HyperFrames reutilizable que le ponga a CUALQUIER metraje nuestro un marco HUD de cuatro esquinas, una placa de apertura y un cierre por elemento portador, y renderizarla a MP4 para verla.

ANTES DE CODEAR NADA, leer en este orden (regla del proyecto: no reinventar el motor de video):
1. .agents/skills/hyperframes/ (skill de entrada, rutea)
2. .agents/skills/hyperframes-core/ (contrato de composicion, atributos data-*, class="clip", tracks, reproduccion de media que maneja el framework)
3. .agents/skills/motion-doctrine/ (elemento portador, seam gate, prohibicion del wobble ocioso)
4. .agents/skills/hyperframes-cli/ (check, preview, render)
Si alguna de esas rutas no existe, listar .agents/skills/ y usar la que corresponda antes de escribir codigo.

De donde sale esto: analisis del reel https://www.instagram.com/p/DaAjqtugWF_/ de @formd.designs, fichado en hermes-content/references/video-intake/. Medido con ffprobe: 16.739 s, 1276x718, 29.97 fps, 31 cortes. Leer la ficha si hace falta contexto.

QUE HAY QUE CONSTRUIR — tres piezas en UNA composicion parametrizable:

1. HUD DE CUATRO ESQUINAS
   - Cuatro rotulos en mayusculas, grotesca bold, tamano ~1.3% de la altura del cuadro, tracking ~0.05em. Parametrizables por variable: arribaIzq, arribaDer, abajoIzq, abajoDer. Valores por defecto para ONIA: "PRODUCTO" / "ONIA" / "<rubro>" / "2026(c)".
   - Color: blanco puro con mix-blend-mode: difference. Ese es el punto de todo el ejercicio — sobre metraje oscuro se lee blanco, sobre un fondo blanco se lee NEGRO solo, y sobre altas luces quemadas se apaga en vez de pelearse con la imagen. NO hardcodear dos versiones de color.
   - El HUD NO aparece en el primer plano. Entra recien en el primer corte. Dejarlo como parametro (retrasoHud, default 1.4 s).

2. PLACA DE APERTURA
   - Titular a dos lineas, centrado en el eje horizontal, blanco, grotesca pesada, sobre metraje a sangre completa y SIN HUD.
   - Cero animacion de texto: aparece y desaparece. Nada de entrada, salida, rebote ni fade elaborado. Es deliberado y es la mitad del efecto (camara salvaje + tipografia inmovil).
   - Duracion por defecto 1.4 s, parametrizable.

3. CIERRE POR ELEMENTO PORTADOR
   - El wordmark aparece en pantalla, en su posicion y tamano FINALES, mientras detras todavia siguen cambiando planos de metraje.
   - Despues el fondo se blanquea (#F5F4F2) y el wordmark queda quieto, sin moverse un pixel, invirtiendose a negro por el mismo mix-blend-mode: difference.
   - Duracion del cierre por defecto 1.6 s.

FORMATO — esto es una CORRECCION al original, no una copia:
   - Salida primaria 1080x1920 (9:16), con el HUD dentro del area segura de Reels/TikTok (nada de rotulos pegados al borde absoluto: dejar margen para la UI de la app).
   - Salida secundaria 1920x1080 (16:9) desde la MISMA composicion, via variable de formato.
   - El original es 16:9 y en Reels se ve como una franja chica entre bandas negras. No portar ese error.

GRADE Y RITMO (si tocan el metraje de prueba, con ffmpeg o el paso de grade que ya tengamos en editor-videos):
   - Teal & orange disciplinado, DOS temperaturas y nada mas: sombras a turquesa (~#1E9C9E), medios y piel a ambar (~#E08A3C), negros aplastados. Sin tercer color.
   - Cadencia de referencia medida del original: plano 1 = 1.43 s, plano 2 = 1.41 s, luego 0.50/0.16/0.30/0.47, rafaga de TRES cortes de 0.10 s (3 fotogramas), pulso sostenido de media ~0.47 s, frenada de 0.97 s, cierre de 1.59 s. Regla: el plano mas largo es el primero, el segundo mas largo es el ultimo.

LIMITES DEL PROYECTO QUE APLICAN:
   - Regla de oro de video: la tabla de cortes + preview 360p se le MUESTRAN a Sergio ANTES de aplicar ningun corte sobre metraje real. En esta sesion se trabaja con metraje de prueba, asi que no aplica todavia, pero dejarlo escrito en el README del componente.
   - Gasto: cero. Nada de Higgsfield ni ElevenLabs aca. HyperFrames + ffmpeg y listo.
   - No inventar clientes, testimonios ni cifras en el metraje de prueba ni en los textos por defecto.
   - Un carril, un worktree, rama propia, commits conventional, y gates antes de mergear.

DONDE VA: la composicion en la carpeta de composiciones de HyperFrames que corresponda segun hyperframes-core; los dos patrones nuevos anotados en web-factory/docs/MOTION_PATTERN_BANK_2026.md con los nombres "HUD de cuatro esquinas por diferencia" y "cierre por elemento portador".

LISTO = existen dos MP4 renderados desde la MISMA composicion (uno 1080x1920 y uno 1920x1080) donde, mirando las capturas: (a) el HUD se lee blanco sobre el metraje oscuro Y negro sobre la placa final blanca, sin que exista ninguna version de color hardcodeada en el codigo; (b) el HUD esta ausente en el primer plano y presente desde el primer corte; (c) el wordmark aparece sobre metraje y termina quieto en la placa blanca en identica posicion y tamano, verificable comparando dos fotogramas; y (d) MOTION_PATTERN_BANK_2026.md tiene los dos patrones nuevos escritos.
```

## P11 · Plantilla HyperFrames: 3 laminas de paso con hilo continuo y subtitulo palabra-a-palabra

- **Sale de:** [Explicador de servicio en 3 pasos con hilo continuo](2026-08-23-cosecha-explicador-servicio-3-pasos-hilo-continuo.md) — `Dax0R-atz8d` · @metromedia.house
- **Fuente:** https://www.instagram.com/p/Dax0R-atz8d/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Ninguna credencial, permiso ni gasto: HyperFrames ya corre. Faltan DOS decisiones de Sergio. (1) Con que se llenan los tres huecos de prueba: el molde apoya todo su peso en cifras de cliente (400->11.000 seguidores, 12.005 impresiones, 'VPs now DM him', capturas de DM) y Onia tiene CERO clientes pagando — la regla 'no fabricar' prohibe inventarlas, asi que hay que decidir si se llenan con demo del producto en vivo (pantallas reales y verificables) o si el molde se recorta a 4 bloques. (2) Formato: el original es 16:9 (1276x718) y nuestro carril de reels es vertical; decidir si la plantilla nace 9:16, 16:9 o ambas. Nota heredada: el CTA 'Link in Bio' porta directo pero el objeto que mandamos es agendar demo en cal.onia.com.bo, no un PDF.

```text
Objetivo unico de la sesion: dejar en el repo UNA composicion HyperFrames reutilizable que reproduzca el sistema de motion del reel https://www.instagram.com/p/Dax0R-atz8d/ (@metromedia.house), analizado en hermes-content/references/video-intake/. NO es un video de Onia terminado: es la PLANTILLA con contenido de relleno, para que despues cualquier explicador se arme cambiando textos e imagenes.

Antes de codear, cargar en este orden: skill hyperframes (entrada), hyperframes-core (contrato de composicion), hyperframes-animation, motion-doctrine y seam-craft. HyperFrames vive en .agents/skills/ — revisarlo ANTES de escribir nada, no reinventar el motor.

QUE TIENE QUE HACER LA PLANTILLA (los 4 mecanismos, medidos del original):

1) HILO BEZIER CONTINUO ENTRE ESCENAS. Una curva blanca de 2-3px que entra por abajo-izquierda de la lamina azul, sube y termina en la pildora 'Step N'. Se DIBUJA con stroke-dashoffset (en el original se ve la punta suelta a media pantalla antes de que llegue el titulo). Las tres laminas de paso llevan la MISMA curvatura y el MISMO punto de salida, aunque esten separadas por otras escenas: tienen que leer como un solo trazo que atraviesa el video. Es el elemento portador de seam-craft.

2) SUBTITULO PALABRA-POR-PALABRA SOBRE LINEA PRE-MAQUETADA. La linea completa se compone de entrada y cada palabra ocupa su posicion final desde el primer fotograma; lo unico que cambia es la opacidad de cada <span>. Criterio duro: las palabras ya visibles NO se mueven al aparecer las siguientes (nada de append de texto, nada de reflow). Eso es lo que produce los huecos grandes e irregulares que caracterizan el estilo.

3) PALABRA FUTURA PRE-PINTADA EN GRIS. La palabra que todavia no se dijo ya esta visible pero al ~45% de opacidad, y se enciende a blanco al pronunciarse. Tiene que ser un parametro por palabra, porque el original tambien lo usa INTERCALADO a mitad de frase como recurso de jerarquia (apagar el relleno para que salte la palabra que importa), no solo como progresion lineal. Antes de escribirlo: verificar si captions-overlay ya soporta este modo. Si ya existe, usarlo y no duplicar.

4) COLLAGE QUE SE ENSAMBLA. Recortes que entran de a uno (2 -> 4 -> 5), cada uno con sombra suave y 2-5 grados de rotacion, escalonados en Z, terminando de aterrizar despues de que el titulo termine de escribirse.

TOKENS DE ESTILO (hex APROXIMADOS, leidos de pantalla — dejarlos como variables CSS, no hardcodeados): fondo azul ultramar #1436C8 con halo radial #2A4FE0 al centro y vineta en bordes; texto activo #FFFFFF; gris del 'aun no dicho' #B9C6EE; negro de contraste #0A0A0A; lamina papel #F2F2F0 con grilla #D8D8D6. Una grotesca de palo seco, dos pesos conviviendo en la misma linea (Black para la palabra que carga el sentido, Regular para el resto), tracking negativo en titulares. Pildora 'Step N': borde 1px, radio completo, texto chico — es el unico elemento con contorno.

RITMO A RESPETAR (medido con ffprobe sobre el original, NO estimar): 48 cortes en 60,857 s; 65% de los planos por debajo de 1 s; rafaga de apertura de 15 cortes en 7,47 s con un parpadeo de 4 cortes en 0,29 s; DOS mesetas de explicacion sin ningun corte, de 5,22 s y 5,00 s; y una cola de CTA de 3,93 s sin corte. La plantilla tiene que exponer esas tres velocidades como beats nombrados (rafaga / meseta / cola), no como duraciones sueltas.

PROHIBIDO EN ESTA PLANTILLA:
- Archivo de terceros. El original se apoya en The Social Network, The Office, keynotes de Jobs y Benioff, archivo de Bezos y Musk, todo sin licencia declarada. En la plantilla van placeholders neutros o capturas de onia-platform.
- Cifras, testimonios o logos inventados. Onia tiene cero clientes pagando. Los slots de prueba del molde van VACIOS y marcados como <PRUEBA_PENDIENTE>: los llena Sergio, no esta sesion.
- Cualquier texto de estado de obra ('muy pronto', 'beta', 'proximamente') en el contenido de relleno.

FORMATO: 9:16 vertical (1080x1920) como default. Si el layout aguanta 16:9 sin rehacer nada, dejar la variante; si no, no forzarla.

CIERRE DE CARRIL: worktree con ruta explicita, `git branch --show-current` primero, commits conventional, gates antes de mergear, y handoff en .claude/handoff/<rama>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md.

LISTO = `hyperframes check` pasa sin errores sobre la composicion nueva Y `hyperframes render` produce un MP4 de 1080x1920 en el que, MIRANDO el render (no un grep, no un exit code 0): (a) el hilo blanco cruza las tres laminas de paso con la misma curvatura y punto de entrada, (b) al menos una linea de subtitulo muestra una palabra en gris que se enciende a blanco sin que se mueva ninguna palabra vecina, (c) el collage entra de a un recorte por vez, y (d) el plano final del CTA dura mas de 3 s sin corte. Adjuntar 4 capturas del render, una por criterio.
```

## P12 · Plantilla HyperFrames: escalera comparativa RUIM/BOM/EXCELENTE, parametrizada por rubro

- **Sale de:** [Escalera RUIM / BOM / EXCELENTE: un brief, tres niveles](2026-08-23-cosecha-escalera-ruim-bom-excelente.md) — `Db60O6OxWU5` · @tiagolemosx
- **Fuente:** https://www.instagram.com/p/Db60O6OxWU5/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Solo el talking-head: o Sergio graba 16 s de corrido, o se usa a Lucía (ElevenLabs = gasto, requiere permiso explícito caso por caso). Y una decisión chica: la palabra-gatillo del comentario — por la decisión del 2026-08-23 el objeto que mandamos por DM es agendar demo en cal.onia.com.bo, no un PDF, así que 'COMENTA GPT' se porta como 'COMENTA DEMO'. Nada más está bloqueado. Advertencia al portarlo: la regla 'la venta nunca exhibe obra' obliga a que el escalón RUIM sea una pieza genérica de rubro, NUNCA material propio con marca Onia encima.

```text
Construí en HyperFrames una plantilla de video vertical reutilizable llamada `escalera-comparativa`, portada del reel https://www.instagram.com/p/Db60O6OxWU5/ (@tiagolemosx). Antes de codear leé la skill `hyperframes` (entrada), después `hyperframes-core` y `hyperframes-cli`. NO reinventes el motor.

QUÉ ES EL PATRÓN (medido con ffprobe sobre el original, no estimado): 15,810 s · 720x1280 · 30 fps · **0 cortes** al umbral de escena 0,3. Es UNA sola toma continua con cámara fija; todo el ritmo lo hacen overlays que aparecen. Estructura: 4 bloques temáticos de ~3,95 s; dentro de cada bloque entran 3 láminas de izquierda a derecha (~1,3 s cada una) etiquetadas RUIM / BOM / EXCELENTE; los últimos ~3 s son CTA.

LO QUE TENÉS QUE ENTREGAR:

1. Una composición HyperFrames con:
   - Banda gráfica FIJA en el tercio superior: fila de hasta 3 piezas verticales ratio 4:5, separación regular, etiqueta centrada debajo de cada una en mayúsculas, blanco #FFFFFF con sombra suave (usá una grotesca geométrica pesada; la del original no se declara, elegí Poppins o Montserrat SemiBold).
   - Los dos tercios inferiores son una PISTA VACÍA reservada para el talking-head. Dejala declarada como track con su hueco documentado — todavía no tenemos la toma, y no la inventes.
   - Aparición DURA de cada lámina (sin fade, sin slide): así es el original.
   - Pill de CTA al final: border-radius total, blanco sólido, sombra difusa, dos pesos tipográficos dentro. Texto: `COMENTA` / `"DEMO"`. NO uses "GPT" — nuestro lead magnet decidido el 2026-08-23 es agendar demo en cal.onia.com.bo.

2. Parametrización por rubro: un solo JSON de entrada con `{ rubro, bloques: [ { titulo, laminas: [ruim, bom, excelente] } ] }`. Cambiar de dental a comercio o gastronomía debe ser editar ese JSON y volver a renderizar, nada más.

3. Tres láminas de ejemplo del módulo dental, hechas en HTML/CSS (NO con generador pago — no hay permiso de gasto en este prompt), siguiendo esta rúbrica que es el hallazgo del post:
   - RUIM: todo el brief impreso encima, 12-18 elementos de texto, 5+ colores saturados peleando, jerarquía plana, el producto tapado por sus claims.
   - BOM: se borra ~70% del texto; queda título + 2 líneas + CTA; UNA familia tipográfica con título 5-6x el cuerpo; 2-3 colores; producto con aire.
   - EXCELENTE: mismo copy que BOM, pero con UNA idea visual fuerte. El texto no baja más, sube el concepto.
   REGLA DURA: el escalón RUIM debe ser una pieza GENÉRICA de rubro, nunca material con la marca Onia encima. La regla "la venta nunca exhibe obra" prohíbe mostrar trabajo propio etiquetado como malo.

4. Registrá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre "escalera comparativa", anotando el mecanismo: N estados del mismo objeto, aparición secuencial sin transición, sobre plano fijo sin cortes, animación cue-ada por gesto y no por beat.

NO HAGAS: no generes imágenes con Higgsfield ni ElevenLabs (gasto = permiso explícito de Sergio, caso por caso). No grabes ni sintetices el talking-head. No inventes testimonios, logos ni cifras de clientes (cero clientes pagando).

LISTO = existe un MP4 renderizado por HyperFrames a 1080x1920 de ~13 s con los 4 bloques de láminas y el pill `COMENTA "DEMO"`, verificado ABRIENDO el archivo y mirando 3 capturas (t=2 s, t=8 s, t=12 s) — no un exit code 0; más el JSON de rubro y una línea de comando documentada que re-renderiza el mismo video cambiando `rubro: dental` por `rubro: comercio`.
```

## P13 · Plantilla HyperFrames: listicle sobre toma continua

- **Sale de:** [Nueve formatos de anuncio en 9,8 s sin un solo corte](2026-08-23-cosecha-nueve-formatos-anuncio-sin-cortes.md) — `DblhPOux1YP` · @davidaistar
- **Fuente:** https://www.instagram.com/p/DblhPOux1YP/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para la plantilla del reel: NADA, se hace hoy. Para producir los 9 formatos con IA: permiso explicito de gasto de Sergio caso por caso (Higgsfield es pago). Y una decision de Sergio: cuales de los 5 formatos limpios (Claymation, Fake Podcast, Skeleton Story, Hyper Motion, Crochet) sirven para vender software B2B en Bolivia — los otros 4 se apoyan en IP de Pixar/Disney o en el estilo de un creador y no se pueden publicar en material de cliente.

```text
Construí una plantilla de composición HyperFrames reutilizable para el patrón "listicle sobre toma continua", extraído del reel https://www.instagram.com/p/DblhPOux1YP/ (@davidaistar). La ficha completa está en hermes-content/references/video-intake/.

ANTES DE CODEAR: leé la skill `hyperframes` (entrada), después `hyperframes-core` (contrato de composición y atributos data-*) y `editor-videos`. HyperFrames vive en `.agents/skills/` y es el motor por defecto — NO reinventes el motor de video ni uses Remotion (jubilado por decisión de Sergio el 21-ago).

EL PATRÓN, medido con ffprobe/ffmpeg sobre el original (9,866 s · 720x1280 · 30 fps · 292 fotogramas · 0 cortes con umbral scene 0.3):

Es UNA sola toma continua del presentador. No hay un solo corte. Todo el ritmo se produce sustituyendo overlays encima de un plano que nunca corta. La plantilla tiene que reproducir eso: un `<video>` de fondo que corre entero, y overlays que se sustituyen por encima.

Capas, de arriba hacia abajo, todas en posiciones FIJAS:
1. Card de título anclado a ~15% del borde superior. Rectángulo blanco #FFFFFF, esquinas redondeadas, padding generoso, texto negro #000000, grotesca muy pesada, 2 líneas, interlineado apretado, centrado. NO cambia nunca durante los ítems. Es el contrato de retención: "son N, vas a llegar al N".
2. El `<video>` del presentador, toma continua, sin cortes.
3. Rótulo del ítem `N) Nombre`: relleno blanco con contorno negro duro (`-webkit-text-stroke: 3px #000` o equivalente), SIN caja de fondo, centrado, apoyado justo encima del inset. La ausencia de caja es deliberada: lo deja flotar sobre el pecho sin tapar la cara.
4. Inset 9:16 dentro de 9:16, ~35% del ancho del cuadro, centrado horizontalmente, en la mitad inferior. Tiene que aceptar un `<video>` (los ejemplos se REPRODUCEN, no son capturas fijas). Compuesto ENCIMA sin máscara: las manos del presentador pasan por detrás, y eso es lo que hace que se lea como una imagen viva y no como un collage.
5. Dos stickers estáticos en la columna derecha del inset, para el CTA. Presentes durante todos los ítems.

Parámetros que la plantilla debe exponer como variables:
- `titulo` (el card fijo)
- `items[]`: array de `{ rotulo, insetSrc, duracionMs }` — duración POR ÍTEM, no uniforme. En el original los tiempos son desiguales: el ítem cuyo inset necesita más tiempo para leerse (un build por capas) recibe más aire. Default 950 ms.
- `stickers[]`: hasta 2, opcionales
- `cierreMs`: duración del cierre limpio. Default 1300 ms.

DOS REGLAS DE MOVIMIENTO, y son las que hacen que funcione:
- Los overlays NO se animan. Cero entrada, cero salida, cero fade, cero escala en el rótulo, el card y los stickers. Es sustitución dura. El movimiento lo aportan el inset (que es video) y el presentador. No agregues wobble ni "respiración": leé `motion-doctrine`, la prohibición de movimiento ocioso aplica.
- El cierre limpia TODOS los overlays a la vez (card, rótulo, inset, stickers) y deja la cara sola durante `cierreMs`. Es la señal visual de que viene el CTA hablado. No lo omitas: es el remate del patrón.

ENTREGABLES:
1. La composición HTML de la plantilla, en el lugar que indique `hyperframes-core`.
2. Un render de demostración con 3 ítems de prueba (usá clips o placeholders que YA existan en el repo; no generes nada pago — Higgsfield y ElevenLabs requieren permiso explícito de Sergio caso por caso).
3. Registrá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre "listicle sobre toma continua", citando la ficha de video-intake como fuente.

NO HAGAS: no produzcas contenido de cliente con este molde en esta sesión, no generes nada pago, y no uses los nombres de formato "Pixar Character" ni "Disney Character" en ningún ejemplo — son IP ajena y Onia no publica material de cliente que imite marcas de estudios.

LISTO = existe un MP4 renderizado por HyperFrames, de 3 ítems con duraciones distintas entre sí, verificado con ffprobe en 0 cortes (`ffmpeg -i <salida> -vf "select='gt(scene,0.3)'" -f null -` devuelve cero detecciones), en el que el card de título permanece idéntico durante los 3 ítems y desaparece junto con el rótulo, el inset y los stickers durante el cierre limpio final — todo confirmado MIRANDO fotogramas extraídos del render, no por grep ni por que el comando haya salido con código 0.
```

## P14 · Pack de overlays 'recorte vertical ONIA' en HyperFrames

- **Sale de:** [Recorte de podcast que retiene sin cortar](2026-08-23-cosecha-recorte-de-podcast-que-retiene-sin-cortar.md) — `DbJy34KhdyM` · @niidea.tv
- **Fuente:** https://www.instagram.com/p/DbJy34KhdyM/
- **Tipo:** MIXTO · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Para CONSTRUIR el pack, nada: cero gasto, cero credencial, cero permiso, HyperFrames es local y gratis. Para USARLO falta metraje propio de talking-head — ONIA no tiene podcast ni archivo de camara equivalente. Y una decision chica de Sergio: la placa de cierre nuestra pide una demo en cal.onia.com.bo, que es un agendamiento 1:1, no una cita recurrente como la de ellos; el molde se porta, el objeto cambia.

```text
Objetivo unico de la sesion: construir en HyperFrames un pack de overlays de marca ONIA, reutilizable, para recortes verticales de talking-head, copiando el MECANISMO (no el color) de un reel de @niidea.tv analizado el 2026-08-23 (ficha en hermes-content/references/video-intake/, id DbJy34KhdyM).

Antes de codear: leer las skills hyperframes, hyperframes-core y hyperframes-animation. NO reinventar el motor (regla: revisar .agents/skills/ antes de escribir video). Cargar tambien editor-videos y captions-overlay.

Por que este molde importa, medido con ffprobe sobre el original: 65,364 s con 17 cortes detectados, pero 11 de esos 17 caen dentro de 0,7 s al final (la transicion a la placa). El cuerpo real son 58 s con 6 detecciones, probablemente 3 o 4 transiciones. Es casi un plano secuencia y aun asi retiene: la retencion la sostiene el TEXTO, no el montaje. Ese es el punto que copiamos.

Construir CINCO piezas como composiciones HTML independientes y parametrizables (texto por variable, nada hardcodeado):

1. BUG DE MARCA. Dos logos fijos en las esquinas superiores, uno a cada lado. Nunca se mueven, nunca se animan, viven todo el clip. Usar el tile verde de Onia ya decidido y publicado (memoria: onia-logo-tile-verde-decidido).

2. BARRA DE TITULO QUE SE CONSTRUYE. Caja blanca ~95% opaca con texto negro en grotesca pesada condensada, mayusculas, dos lineas centradas, ancho ajustado a la linea mas larga. Se arma en ~0,5 s en este orden: se traza una linea horizontal, aterriza la linea 1, aterriza la linea 2 y la caja crece hacia abajo. Entra a los 0,5 s, sale a los ~5,8 s. Va en una ranura a ~70% de altura. Motivo: un recorte no controla su primer segundo de audio, asi que la promesa va ESCRITA. El copy debe ser tres verbos en imperativo voseo con promesa doble; en el original era 'LOS PANELES SOLARES: GENERA, VENDE AL SISTEMA Y PAGA MENOS'.

3. KARAOKE DE UNA PALABRA. Misma ranura vertical que la barra de titulo (compiten a proposito: mientras el titular esta, el karaoke se OCULTA, no se corre). Una palabra por vez, centrada, reemplazo DURO sin fundido. Relleno naranja/acento con contorno-sombra oscura para leerse sobre cualquier fondo. Regla dura: cuando no hay voz, la ranura queda VACIA, jamas repite la ultima palabra.

4. ZOCALO TEMPORIZADO. Barra chica con degradado y texto blanco, ~4 s, y se dispara MONTADA SOBRE UN CORTE de camara: el corte justifica el grafico. En el original decia 'E$B 21:00 Mie'; el nuestro lleva la marca y el llamado.

5. PLACA DE CIERRE. Entra con un flash-cut estroboscopico de 0,7 s (la unica transicion fuerte de todo el video, reservada para el momento en que se pide la accion), se queda ~7 s en fijo y termina con fundido de salida. Degradado de marca con grano encima. Contenido: logo Onia + 'Agenda tu demo' + cal.onia.com.bo. Es un agendamiento 1:1, NO una cita recurrente: el molde se porta, el objeto cambia (decision 2026-08-23, el lead magnet es la demo).

Ademas del pack, dejar un push-in continuo lentisimo aplicable al plano fijo (scale progresivo, la unica fuente de movimiento durante decenas de segundos). Cero wobble, cero movimiento ocioso.

Prohibiciones: la placa y la barra NO pueden decir 'muy pronto', 'beta', 'proximamente' ni nada de estado de obra (regla: la venta nunca exhibe obra). NO inventar testimonios, logos ni cifras de clientes (regla: no fabricar, cero clientes pagando). Nada de gasto: HyperFrames es local y Apache 2.0, no tocar Higgsfield ni ElevenLabs.

RENDER Y VERIFICACION: renderizar a 1080x1920 sobre un clip de prueba propio; si no hay metraje de talking-head disponible, generar una placa de color con temporizador como base y decirlo explicito, no simularlo con material ajeno. Antes de aplicar cualquier corte sobre metraje real, mostrar a Sergio la tabla de tiempos y un preview a 360p (REGLA DE ORO: nunca cortar a ciegas). Guardar las piezas donde corresponda segun la tabla de CLAUDE.md y NO dejar nada suelto en la raiz. Al cerrar, escribir el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos, incluido 'intentos fallidos'.

LISTO = existe un MP4 de 1080x1920 renderizado con HyperFrames que, abierto y MIRADO (no un grep, no un exit code 0), muestra las cinco piezas funcionando: bugs fijos en ambas esquinas superiores durante todo el clip, barra de titulo de dos lineas que se construye linea por linea y sale a los ~5,8 s, karaoke de una palabra con reemplazo duro y ranura vacia en los silencios, zocalo temporizado disparado sobre un corte, y placa de cierre que entra por flash de 0,7 s y dice cal.onia.com.bo; mas las cinco composiciones HTML parametrizables commiteadas y el patron 'barra de titulo que se construye linea por linea' agregado a web-factory/docs/MOTION_PATTERN_BANK_2026.md.
```

## P15 · Patrón «contador escalado»: overlay reutilizable de 13 s para reels de Onia

- **Sale de:** [Contador escalado en una sola toma](2026-08-23-cosecha-contador-escalado-una-sola-toma.md) — `DcJivjZOOth` · @bastian.xu
- **Fuente:** https://www.instagram.com/p/DcJivjZOOth/
- **Tipo:** MARKETING · **Veredicto:** SIRVE_YA
- **Qué falta para hacerlo hoy:** Técnicamente nada — la herramienta existe y está probada. Faltan dos cosas de contenido y una es bloqueo real: (1) un presentador HUMANO que sostenga 13 s en una sola toma con progresión de energía; Lucía/Higgsfield NO sirve (clips de 5-10 s, sin control de micro-actuación progresiva), esto va con Sergio a cámara o no va; (2) decidir QUÉ cuenta el contador: con cero clientes pagando, la regla «no fabricar» prohíbe mostrar métricas propias o de cliente, así que hay que usar placeholders o una magnitud verificable y neutra (segundos de una tarea, cantidad de pasos, minutos de agenda). Decisión de Sergio antes de grabar.

```text
Objetivo único de esta sesión: dejar construido y documentado el patrón de overlay «contador escalado + stack acumulativo», portado del reel https://www.instagram.com/p/DcJivjZOOth/ (@bastian.xu), para que cualquier reel de Onia lo use sin volver a diseñarlo. No abras ningún otro frente.

DATOS MEDIDOS — usalos, no los re-estimes:
- Original: 13,116 s · 720x1280 · 30 fps · 390 frames · 0 cortes detectados (umbral scene 0.3). Cámara fija, una sola toma.
- Mapa de beats leído del muestreo denso a 4/s:
  0,00-1,50 s  → "24 Views"
  1,50-3,25 s  → "384 Views"  + "+ postura"
  3,25-4,75 s  → "1,685 Views" + "+ postura" / "+ cara"
  4,75-7,25 s  → "84,284 Views" + "+ postura" / "+ cara" / "+ tono"
  7,25-9,75 s  → "335,284 Views" + "+ postura" / "+ cara" / "+ tono" / "+ gestos"
  9,75-13,12 s → "1 View" (colapso; es el beat MÁS LARGO, ~3,4 s)
- La lista es ACUMULATIVA: cada ítem se apila debajo, nada se reemplaza.
- El texto entra por CUT-IN SECO. En un muestreo a 4/s no hay un solo fotograma de transición: sin fade, sin slide, sin escala, sin rebote. CERO motion gráfico. Si animás la entrada, rompiste el patrón.

LAYOUT (medido sobre fotograma 1080x1920):
- Número: blanco #FFFFFF, peso Bold, ~60 px de alto (~3,1% de la altura), centrado horizontalmente, línea base al ~56% de la altura del cuadro.
- Ítems: verde ~#2ECC2E, peso Regular/Medium, ~40 px (~2/3 del número), alineados a la IZQUIERDA con sangría de ~6% del ancho respecto del borde izquierdo del número. Interlineado ~1,2 em.
- Tipografía: neogrotesco (Inter / Helvetica Now Display / SF Pro Display). La del original no se declara.
- REGLA DE COLOCACIÓN: el bloque va sobre la ZONA OSCURA del torso del sujeto, nunca sobre el fondo claro. Por eso NO lleva caja, ni barra, ni sombra dura: el contraste lo da la ropa. Si el take no tiene zona oscura a esa altura, movés el bloque, no le ponés fondo.

QUÉ CONSTRUIR:
1. Composición HyperFrames `contador-escalado.html`, parametrizada por un array de beats `{ t_inicio, t_fin, numero, items[] }`, que renderice el overlay quemado sobre un clip vertical 1080x1920. Usá el timing por atributos `data-*`. LEÉ LAS SKILLS `hyperframes` (entrada), `hyperframes-core` y `hyperframes-cli` ANTES de escribir una línea de HTML — no reinventes el motor.
2. Documentá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre «contador escalado + stack acumulativo», con el mapa de beats de arriba, la regla de colocación sobre zona oscura, y la nota de loop bait: la pose final del sujeto debe ser igual a la del fotograma 0 para que el autoloop de Instagram empalme sin salto.
3. Si el orquestador no la dejó ya, guardá la ficha de origen en `hermes-content/references/video-intake/`.

RESTRICCIÓN DURA DE ONIA — leela antes de elegir los números:
Onia tiene CERO clientes pagando. La regla «no fabricar» prohíbe inventar cifras, testimonios o resultados. El contador NO puede mostrar métricas de Onia ni de un cliente. Dejá `{{NUMERO}}` como placeholder en la plantilla, o usá una magnitud verificable y neutra (segundos que tarda una tarea, cantidad de pasos, minutos de agenda). Si dudás, dejá placeholders y preguntá a Sergio — no elijas vos.
REGLA DE ORO DE VIDEO: mostrá a Sergio la tabla de beats + un preview 360p ANTES de quemar nada definitivo.
No agregues "muy pronto", "beta" ni estado de obra en ninguna superficie que vaya a ver un cliente.

LISTO = `contador-escalado.html` renderiza con la CLI de HyperFrames un MP4 de 1080x1920 y ~13,1 s; los fotogramas extraídos con ffmpeg en t = 1,0 / 2,5 / 4,0 / 6,0 / 9,0 / 11,0 s muestran SEIS estados distintos del overlay (número + su stack de ítems acumulado, 0/1/2/3/4/0 ítems respectivamente), el último beat dura >= 3 s, y `web-factory/docs/MOTION_PATTERN_BANK_2026.md` contiene la entrada «contador escalado + stack acumulativo» con el mapa de beats y la regla de colocación sobre zona oscura.
```

---
