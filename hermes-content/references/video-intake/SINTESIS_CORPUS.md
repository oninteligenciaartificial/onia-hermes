# Síntesis del corpus de video-intake

Análisis **transversal** de las 36 fichas del intake (tandas 2026-08-09, 08-11 y 08-12), más
`INDEX.md`, `PENDIENTES.md`, `PROMPTS_POR_SESION.md` y `BANDEJA.md`. No repite ficha por ficha:
busca lo que sólo aparece mirando el corpus entero. Cada afirmación cita la ficha que la sostiene.

**Cobertura real de esta lectura:** 36 fichas leídas completas (100%), más los 4 archivos de
control. **No** se leyeron las transcripciones de `transcripciones/` ni los MP4 — o sea, esta
síntesis hereda lo que las fichas afirman y no re-verifica el material de origen.

---

## 0 · El conteo

### Piezas y veredictos

36 fichas cubren **40 piezas**: 34 fichas 1:1, más
[`carruseles-menores`](2026-08-11-carruseles-menores.md) (4 carruseles en un archivo) y
[`ad-spec-seedance`](2026-08-12-ad-spec-seedance-tres-insumos.md) (2 videos en un archivo).

| Veredicto | Piezas | % |
|---|---:|---:|
| `SIRVE YA` | 11 | 27,5% |
| `MEJORA LO ACTUAL` | 9 | 22,5% |
| `FUTURO` | 4 | 10% |
| `HUMO` | 16 | 40% |
| **Total con veredicto** | **40** | **100%** |

Los 16 `HUMO` incluyen un `HUMO PARCIAL` ([AI Loops](2026-08-09-ai-loops-code-review.md)).
`INDEX.md` reporta "9 de 20 humo" para la tanda del 11-ago; contando el corpus completo la
proporción sube a **40%**, y si se suman los `FUTURO` (que hoy no abren tarea), **el 50% del
corpus no generó una sola tarea**.

Además hay **5 piezas ingresadas y sin veredicto** en [`BANDEJA.md`](BANDEJA.md)
(`DbsrTQQoC1w`, `Dbb34dLEvl0`, `DblcFzIt9UL`, `DbovTXCR1YV`, `DborvP0xEeE`) → **45 piezas
ingresadas en total**, 40 procesadas, 5 en cola.

### Por tanda

| Tanda | Fichas | Piezas | SIRVE | MEJORA | FUTURO | HUMO |
|---|---:|---:|---:|---:|---:|---:|
| 2026-08-09 | 6 | 6 | 3 | 1 | 1 | 1 |
| 2026-08-11 | 23 | 26 | 6 | 6 | 3 | 11 |
| 2026-08-12 | 7 | 8 | 2 | 2 | 0 | 4 |

La tasa de humo **sube** con las tandas (17% → 42% → 50%). No es que Sergio mande peor material:
es que el corpus ya cubrió los temas y lo nuevo empieza a repetirse (ver §4).

### Por frente destino (sólo las 20 piezas con tarea: `SIRVE` + `MEJORA`)

| Frente | Piezas | Fichas |
|---|---:|---|
| Marketing / INFLUENCERS IA / video | 6 | [soul2](2026-08-09-higgsfield-soul2-seedance25.md) · [seedance escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md) · [ad-spec ×2](2026-08-12-ad-spec-seedance-tres-insumos.md) · [32 plantillas](2026-08-11-hyperframes-32-plantillas-microanimacion.md) · [Layers](2026-08-12-higgsfield-layers-edicion-por-capas.md) |
| web-factory / portafolio | 5 | [antes/después](2026-08-09-web-antes-despues-find-real-estate.md) · [42 skills](2026-08-11-mapa-42-skills-diseno-claude.md) · [portafolio emails](2026-08-11-portafolio-emails-preventa-curso.md) · [20 señales](2026-08-12-20-senales-web-vibecodeada.md) · [5 sitios gratis](2026-08-11-carruseles-menores.md) |
| onia-plattform / agentes / panel | 3 | [LIVE OPS](2026-08-09-live-ops-dashboard-maria-wendt.md) · [PostHog](2026-08-11-posthog-agentes-producto.md) · [7 agentes](2026-08-11-ejercito-7-agentes-ventas.md) |
| Comercio (carrito / pagos) | 2 | [carrito flotante](2026-08-11-carrito-flotante-react-ecommerce.md) · [checkout animado](2026-08-11-checkout-tarjeta-animada-3d.md) |
| Herramientas internas (`pendiente`) | 2 | [5 herramientas](2026-08-11-cinco-herramientas-contenido-claude.md) (Apify) · [Handy](2026-08-11-handy-dictado-voz-alternativa-wispr-flow.md) |
| Infra / seguridad | 1 | [10 errores](2026-08-09-10-errores-seguridad-apps-ia.md) |
| chatbot | 1 | [dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md) |

Los 4 `FUTURO` reparten: [visión computacional](2026-08-09-supra-vision-ganado-vision-computacional.md)
→ capacidad de plataforma · [dropzone](2026-08-11-dropzone-progreso-clip-path.md) → importación ·
[web 3D](2026-08-11-web-3d-scrollytelling-united-carriers.md) → techo de web-factory ·
[10 frameworks](2026-08-11-carruseles-menores.md) → AARRR para el panel.

### Por formato de video

| Formato | Piezas | SIRVE+MEJORA | Rendimiento |
|---|---:|---:|---:|
| Anuncio/demo de plataforma | 9 | 6 | 67% |
| Talking-head con locución | 12 | 6 | 50% |
| Clip mudo de UI / portafolio | 11 | 5 | 45% |
| Carrusel de láminas | 8 | 3 | 38% |

El 67% del formato "anuncio de plataforma" engaña: **5 de sus 6 útiles son de Higgsfield o de
HyperFrames**, o sea de herramientas que ya pagamos o ya tenemos instaladas
([soul2](2026-08-09-higgsfield-soul2-seedance25.md),
[ad-spec ×2](2026-08-12-ad-spec-seedance-tres-insumos.md),
[Layers](2026-08-12-higgsfield-layers-edicion-por-capas.md),
[32 plantillas](2026-08-11-hyperframes-32-plantillas-microanimacion.md)). Los anuncios de
plataformas que **no** usamos salieron todos humo ([Raylight](2026-08-11-raylight-app-plantillas-motion-graphics.md),
[PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md),
[Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md),
[Claude+CapCut](2026-08-12-carrusel-claude-capcut-editar-video.md)).

---

## 1 · El hallazgo transversal: 40 videos, cero capacidades nuevas

Ninguna de las 40 piezas aportó una **capacidad técnica** que no tuviéramos. Los 11 `SIRVE YA`
se descomponen así, y ninguna categoría es "tecnología nueva":

| Qué aportó realmente | Piezas |
|---|---|
| Una **estructura o formato** copiable (cero costo) | [antes/después](2026-08-09-web-antes-despues-find-real-estate.md) · [prompt por escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md) · [soul2](2026-08-09-higgsfield-soul2-seedance25.md) · [ad-spec](2026-08-12-ad-spec-seedance-tres-insumos.md) |
| Un **checklist que nos acusa** (el valor es nuestro agujero, no su contenido) | [10 errores](2026-08-09-10-errores-seguridad-apps-ia.md) · [dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md) |
| **Confirmación de que el stack propio alcanza** | [5 herramientas](2026-08-11-cinco-herramientas-contenido-claude.md) |
| Un **recurso externo gratis a verificar** | [Handy](2026-08-11-handy-dictado-voz-alternativa-wispr-flow.md) · [42 skills](2026-08-11-mapa-42-skills-diseno-claude.md) · [5 sitios](2026-08-11-carruseles-menores.md) |

Y `PROMPTS_POR_SESION.md` lo dice sin querer en su encabezado: *"Ninguno abre un frente nuevo."*
**40 videos → 0 frentes nuevos, 0 capacidades nuevas, 0 tecnologías adoptadas.**

Esto tiene una lectura buena y una mala, y la mala es la que importa:

- **Buena:** el stack de ONIA está por delante de lo que el nicho vende como avanzado (§2).
- **Mala:** si mirar 40 videos del estado del arte no descubre nada que nos falte, **el cuello de
  botella no es información, es ejecución**. Y el propio corpus lo prueba: el mismo archivo que
  reparte el trabajo tiene una sección titulada **"Lo construido y todavía apagado"** con cuatro
  prompts (B1–B4 en `PROMPTS_POR_SESION.md`) para cosas que existen y nadie usa —
  `packages/blocks` sin construir aunque el catálogo de learned models ya lo pidió, el modelo
  `find-realestate-editorial` "con confianza ALTA y sin estrenar", el intake automático de video
  con código verde y sin cablear, y 6 patrones de UI que **nadie vio moverse todavía salvo uno**.

El corpus no es una fuente de ideas. Es un espejo: cada video que dice "mirá esta herramienta
nueva" devuelve "ya la tenés, apagada".

---

## 2 · Patrones que se repiten

### 2.1 · El CTA palabra-clave → DM: 20 de 40 (50%)

Es el patrón más repetido del corpus, con diferencia. La mitad exacta de las piezas cierra
pidiendo comentar una palabra para recibir algo por privado:
`seguridad` ([10 errores](2026-08-09-10-errores-seguridad-apps-ia.md)) ·
`loop` ([AI Loops](2026-08-09-ai-loops-code-review.md)) ·
`Workflow` ([soul2](2026-08-09-higgsfield-soul2-seedance25.md)) ·
`Code` ([botón carga](2026-08-11-boton-carga-archivos-react-framer.md),
[carrito](2026-08-11-carrito-flotante-react-ecommerce.md), chat HTML en
[carruseles menores](2026-08-11-carruseles-menores.md)) ·
`LEY` ([dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md)) ·
`ARMY` ([7 agentes](2026-08-11-ejercito-7-agentes-ventas.md)) ·
`DISEÑO` ([42 skills](2026-08-11-mapa-42-skills-diseno-claude.md)) ·
`WEBSITES` y `Sidebar16` ([carruseles menores](2026-08-11-carruseles-menores.md)) ·
`AGENT` ([seedance escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md)) ·
`IA` ([PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md)) ·
`CASTIMEDIA` ([roundup](2026-08-11-roundup-herramientas-diseno-cebo-comentario.md)) ·
`WEBSITE` ([20 señales](2026-08-12-20-senales-web-vibecodeada.md)) ·
`Guide` ([8 skills](2026-08-12-8-skills-2026-curaduria-youtube.md)) ·
`ZEUS` ([avatares](2026-08-12-avatares-ia-prompt-json-zeus.md)) ·
`CAPCUT` ([CapCut](2026-08-12-carrusel-claude-capcut-editar-video.md)) ·
más [Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md) y
[granjas de bots](2026-08-11-granjas-bots-spotify-politica-fraude.md).

Ya está catalogado como hallazgo transversal desde el 9-ago (`INDEX.md`) y como tarea manual
(V-7 en `PENDIENTES.md`, A2 en `PROMPTS_POR_SESION.md`). **Es ruido a partir de acá** (§4).

Lo único que el corpus agregó después: dos matices de guion, ambos chicos —
[8 skills](2026-08-12-8-skills-2026-curaduria-youtube.md) muestra que la lámina final conviene
que **enumere qué contiene** el recurso antes de pedir el comentario, y
[botón carga](2026-08-11-boton-carga-archivos-react-framer.md) prueba el caso degenerado: pedir
comentario **sin recurso real detrás** (el video nunca muestra el código que promete).

### 2.2 · Cifras de terceros que no sobreviven

**Ocho fichas** tuvieron que marcar cifras como "a verificar" o directamente desmentirlas:

| Cifra | Ficha | Qué pasó |
|---|---|---|
| "50 referencias" de Seedance | [soul2](2026-08-09-higgsfield-soul2-seedance25.md) | marcada sin fuente → **confirmada** el 12-ago por el anuncio oficial ([ad-spec](2026-08-12-ad-spec-seedance-tres-insumos.md)) |
| "Seedance 2.5" / "30 s por toma" / `33 DAYS UNLIMITED` | [ad-spec](2026-08-12-ad-spec-seedance-tres-insumos.md) | **las tres falsas para nuestra cuenta**: hay `seedance_2_0`, tope 15 s, `unlim.available = false` |
| "$1M en 4 meses" | [swipe FB](2026-08-11-swipe-anuncios-facebook-cheat-code.md) | sin fuente, sin cuenta, sin captura |
| Cursos "$8.000" vs "999–30.000" en pantalla | [PostHog](2026-08-11-posthog-agentes-producto.md) | el propio video se contradice |
| Multa "1,5 M USD" / pantalla "2-4%" vs audio "4%" | [dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md) | inconsistencia interna del video |
| Video "con aspecto de $10.000" | [Raylight](2026-08-11-raylight-app-plantillas-motion-graphics.md) | retórica de venta |
| "Ahorrate miles de euros", "12 avatares en 2 minutos" | [avatares](2026-08-12-avatares-ia-prompt-json-zeus.md) | nunca lo muestra |
| Precio de PrimeBoard | [PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md) | **no menciona ninguno** |

Regla que el corpus valida por acumulación: **la verificación propia gana sobre el video y
también sobre el anuncio del fabricante.** El caso `33 DAYS UNLIMITED` es el más duro: era una
promesa del propio Higgsfield y una consulta gratis al MCP la tumbó
([ad-spec](2026-08-12-ad-spec-seedance-tres-insumos.md)).

### 2.3 · Los temas que manda Sergio, por volumen

| Tema | Piezas | Rendimiento |
|---|---:|---|
| Video/imagen IA generativa (Higgsfield, Seedance, avatares) | 8 | el mejor: 5 útiles, y de ahí sale una receta completa |
| Micro-interacción de UI (React/CSS) | 8 | 2 patrones portados, 5 humo |
| Herramientas/skills para Claude Code | 7 | 2 útiles; el resto duplica lo instalado |
| Calidad / seguridad / SEO técnico | 3 | **el de mayor densidad de tarea real** |
| Agentes y venta | 3 | 1 checklist útil, 1 plataforma nueva descartada |
| Growth gris o fraude | 2 | 100% descartado, con razón legal escrita |
| Glosarios y listas genéricas | 3 | 0 tareas |

### 2.4 · Tácticas de producción que se repiten (y que sirven como molde)

- **Sin cara, sin voz, sólo pantalla**: 11 de 40 piezas. Es el formato más barato y el que ONIA
  puede producir hoy sin gastar un crédito
  ([antes/después](2026-08-09-web-antes-despues-find-real-estate.md),
  [portafolio emails](2026-08-11-portafolio-emails-preventa-curso.md)) — y ya está encolado
  cuatro veces (V-1, A1, A6 y el bloque `web-factory` de `PROMPTS_POR_SESION.md`).
- **Pantalla partida "resultado arriba / receta abajo"**:
  [seedance escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md) — muestra autoridad
  sin revelar nada crítico.
- **Enumeración a 1 ítem por segundo con overlay sincronizado**:
  [10 errores](2026-08-09-10-errores-seguridad-apps-ia.md),
  [20 señales](2026-08-12-20-senales-web-vibecodeada.md),
  [15 términos](2026-08-12-quince-terminos-startup-go-build.md). La técnica ya existe en casa
  (`editor-videos` + sync-plan), así que el corpus aporta el **guion**, no el motor.
- **Chip numerado "0X / 06 — ETIQUETA" por lámina**:
  [CapCut](2026-08-12-carrusel-claude-capcut-editar-video.md) — lo único rescatable de una ficha
  `HUMO`: el envase, no el contenido.

---

## 3 · Lo que el nicho vende como novedad y nosotros YA tenemos

Es el segundo eje más repetido del corpus: **11 de 40 piezas (27,5%)** presentan como
descubrimiento algo que está instalado en este repo.

| Lo que venden | Lo que ya tenemos | Ficha |
|---|---|---|
| "5 herramientas para hacer contenido con Claude" | **3 de las 5** — y dos las construimos nosotros: HyperFrames instalado y probado, y "Claude Video Vision" es literalmente este intake | [5 herramientas](2026-08-11-cinco-herramientas-contenido-claude.md) |
| "Claude mató a Canva" (Open Carrusel) | pipeline propio brief→HTML/CSS→PNG on-brand→publicación, con 4 brand kits | [Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md) |
| Plantillas de motion graphics pagas (Raylight) | HyperFrames + skills `motion-graphics`, `talking-head-recut`, `embedded-captions` | [Raylight](2026-08-11-raylight-app-plantillas-motion-graphics.md) |
| "Ya no necesitás editor: Claude + CapCut" | `editor-videos` cubre **las 6 capacidades una por una** (`cut-plan`, `karaoke-captions`, `sfx`, `overlay-visuals`, `zoom-punch`, `transitions`) **y además** tiene el gate de preview que ellos no mencionan | [CapCut](2026-08-12-carrusel-claude-capcut-editar-video.md) |
| Overlay sincronizado palabra→elemento | `editor-videos` (sync-plan) sobre HyperFrames | [15 términos](2026-08-12-quince-terminos-startup-go-build.md) |
| "Higgsfield Layers" | `upscale_image`, `remove_background`, `reframe`, `outpaint_image` **ya están en el MCP conectado**: 2 de las 3 demos son operaciones disponibles | [Layers](2026-08-12-higgsfield-layers-edicion-por-capas.md) |
| "32 plantillas gratis" | es **nuestro propio motor** (HyperFrames), usado por debajo de su capacidad | [32 plantillas](2026-08-11-hyperframes-32-plantillas-microanimacion.md) |
| Avatares IA por prompt JSON | Soul + texto, **el único método validado** para sostener la misma cara; Souls de Lucía/Mara/Sergio ya creados. El método del video es un retroceso | [avatares](2026-08-12-avatares-ia-prompt-json-zeus.md) |
| `/code-review` como "secreto" del AI loop | comando nativo de Claude Code + subagente `code-reviewer` + gates | [AI Loops](2026-08-09-ai-loops-code-review.md) |
| Interfaz de chat hecha a mano | Chatwoot corriendo en el VPS | [carruseles menores](2026-08-11-carruseles-menores.md) |
| Calendario + cross-posting "autopilot" | commodity desde hace años (Buffer/Later/Metricool); lo único distinto que muestra es farming de cuentas, que viola ToS | [PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md) |

**El argumento comercial que sale de acá está verificado y es reusable:** lo que el nicho vende
como stack avanzado, ONIA ya lo tiene o lo construyó
([5 herramientas](2026-08-11-cinco-herramientas-contenido-claude.md)).

**El contrapeso honesto**, y hay que decirlo en la misma frase: tenerlo instalado no es tenerlo
funcionando. `PROMPTS_POR_SESION.md` §"Lo construido y todavía apagado" documenta que
`packages/blocks` no existe, que hay un learned model de confianza ALTA sin estrenar, que el
intake automático no está cableado y que **de los 6 patrones de `ui-patterns/` sólo uno fue visto
moverse**. Presumir de stack mientras B1–B4 siguen abiertos es exactamente el humo que el corpus
le critica a los demás.

---

## 4 · Los 3 hallazgos de mayor retorno, en orden

### 1º · El portafolio silencioso — es lo único que toca la caja hoy

**Sostenido por 4 fichas convergentes:**
[antes/después FIND](2026-08-09-web-antes-despues-find-real-estate.md) (formato base),
[portafolio de emails](2026-08-11-portafolio-emails-preventa-curso.md) (variante: varias webs en
un reel + cierre con oferta), [20 señales](2026-08-12-20-senales-web-vibecodeada.md) (la misma
lista sirve de **auditoría gratis al prospecto**, sin regalar el arreglo) y el prompt A6
(los 6 patrones de `ui-patterns/` **son contenido en sí mismos**).

**Por qué primero, con el número:** el precio está en Landing 790 / Web Pro 1.500 Bs *porque no
hay portafolio publicado*; la línea premium (2.000 / 4.500) exige 3-5 casos mostrables. Es la
única palanca del corpus que mueve el precio, y cuesta **cero créditos, cero plataformas, cero
tokens bloqueados**: las webs ya existen, es grabar pantalla y montar. Está encolado cuatro veces
(V-1, A1, `web-factory`, A6) y sigue sin producirse — que es la prueba más clara del §1.

### 2º · La receta ad-spec de 3 insumos — prueba para un prospecto que todavía no pagó

**Sostenido por 3 fichas encadenadas** que sólo funcionan juntas:
[soul2](2026-08-09-higgsfield-soul2-seedance25.md) dio la consigna (*"no es un prompt, es
arquitectura"*: lock de vestuario, raccord de luz, timestamps) sin mostrar la estructura;
[seedance escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md) mostró la estructura
entera y copiable (`Scene N — <nombre> (Xs–Ys)` + encuadre + cámara + foco + luz, desde **una
sola foto**); [ad-spec](2026-08-12-ad-spec-seedance-tres-insumos.md) cerró la pata que faltaba
(**el escenario como insumo fijo**) y quedó escrita como receta en
`docs/HIGGSFIELD_AD_SPEC_RECETA_20260812.md`.

**Por qué es la segunda:** convierte a un prospecto en material antes de que compre — *"spec ad
de 20 s con 3 fotos del producto de un prospecto real"*. Es prueba, no promesa, y usa una
plataforma que **ya pagamos**. Y ya viene con la verificación hecha: `seedance_2_0`, 15 s por
toma, 2.862 créditos, sin ventana ilimitada. Riesgo escrito: el producto va con **foto real** —
generarlo con IA es inventar lo que se está vendiendo.

### 3º · El checklist de 17 ítems como gate de entrega **y** como argumento de venta

De [20 señales](2026-08-12-20-senales-web-vibecodeada.md). El contenido no es novedad (SEO
técnico de hace diez años) pero **nos acusa con nombre y apellido**: `onia-platform` y
`dentalgest-landing` no tienen `robots.ts`, `sitemap.ts`, `not-found.tsx`, `metadataBase` ni
canonical. Nuestro gate actual (`tsc --noEmit` + e2e + code-reviewer) **verifica que compile, no
que sea indexable**.

**Por qué el tercero y no más abajo:** es doble retorno con una sola tarea — cierra un defecto
real de entrega **y** se convierte en auditoría gratuita al prospecto. Y tiene un riesgo de
bumerán explícito: usar la lista para vender mientras nuestras propias landings la fallan.
Tres de los 20 ítems son opinión y no se copian ("Vite + React" no es una falla — el síntoma real
es SPA sin SSR; `robots.txt` contra IA es decisión de negocio; `llms.txt` está a verificar).

**Menciones que quedaron cuartas** y por qué no entraron: la
[minimización de datos del chatbot](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md) (gratis
y correcta, pero es higiene defensiva, no ingreso — y su argumento legal es chileno, hay que
rehacerlo con fuente boliviana); los
[3 agujeros de seguridad](2026-08-09-10-errores-seguridad-apps-ia.md) (bloquean vender, pero
según la memoria del proyecto ya se cerraron y verificaron en prod el 11-ago — **`PENDIENTES.md`
sigue diciendo "listo para abrir": el tablero está desincronizado, verificar antes de reabrir
V-2**).

---

## 5 · Ruido: qué conviene dejar de analizar (con el número)

**El 50% del corpus (20 de 40) no generó tarea.** Cuatro categorías concentran ese desperdicio y
las cuatro son predecibles desde el primer vistazo:

| Categoría de ruido | Piezas | Rendimiento | Regla de filtro propuesta |
|---|---:|---|---|
| **CTA comentario→DM como "hallazgo"** | 20 (50%) | catalogado desde el 9-ago; **11 fichas posteriores lo re-anotan** | Una línea: `CTA = palabra clave`. Nunca más una sección. Sigue gateado por S6 |
| **Clip mudo de UI ≤7 s con "Comment Code"** | 8 | 5 humo, 2 patrones portados, 1 verificación | **Sólo entra si el código se LEE en pantalla.** [dropzone](2026-08-11-dropzone-progreso-clip-path.md) sí (`@property` + `clip-path` legibles); [botón carga](2026-08-11-boton-carga-archivos-react-framer.md) no (ni una línea real) |
| **Anuncio de plataforma que reemplaza algo instalado** | 5 | **100% humo** ([Raylight](2026-08-11-raylight-app-plantillas-motion-graphics.md), [PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md), [Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md), [CapCut](2026-08-12-carrusel-claude-capcut-editar-video.md), chat HTML) | `HUMO` por defecto, ficha de 5 líneas. La excepción es cuando la plataforma **ya la pagamos** (Higgsfield): ahí sí vale |
| **Glosarios y listas genéricas sin definición** | 3 ([15 términos](2026-08-12-quince-terminos-startup-go-build.md), [8 skills](2026-08-12-8-skills-2026-curaduria-youtube.md), 10 frameworks) | 0 tareas | `HUMO` por defecto. Además apuntan a la audiencia equivocada (§6) |

Dos precisiones para no tirar el bebé con el agua:

- **Que salga humo es sano.** Lo dice bien la ficha del
  [ESP32](2026-08-11-esp32-costo-de-reunion.md): *"si nada saliera HUMO, querría decir que
  estamos forzando los veredictos para que todo parezca útil"*. El problema no es el 40% de humo,
  es **gastar el mismo esfuerzo de análisis en el humo predecible que en lo útil**.
- **Ficha corta ≠ sin ficha.** Los dos casos de growth fraudulento
  ([granjas de bots](2026-08-11-granjas-bots-spotify-politica-fraude.md),
  [PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md)) merecen quedar escritos
  aunque sean humo: sirven de respuesta lista cuando **un cliente lo pida**, que es el riesgo real
  que ambas fichas identifican.

---

## 6 · Los huecos: lo que Sergio claramente busca y ningún video cubrió

El corpus está sesgado a **producción** (cómo hacer contenido, cómo animar UI, cómo generar
video) y no toca **venta ni cobro en Bolivia**. Siete huecos, ordenados por lo que bloquean:

1. **Cómo conseguir el primer cliente pagando, en Bolivia, B2B.** Cero piezas de 40. El corpus
   entero le habla a un creador o a una startup gringa. Dos fichas lo dicen explícitamente como
   riesgo: [8 skills](2026-08-12-8-skills-2026-curaduria-youtube.md) (*"audiencia equivocada:
   aspirante a freelancer vs dueño de negocio formal boliviano"*) y
   [15 términos](2026-08-12-quince-terminos-startup-go-build.md) (*"no compra por beachhead
   market"*). **Es el hueco que más cuesta.**
2. **Fiscal boliviano / SIAT / facturación electrónica.** Cero piezas. El único contenido legal
   del corpus es ley **chilena** y hubo que desactivarlo explícitamente
   ([dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md): *"no cites la ley
   chilena 21.719 a un cliente boliviano"*). El intake no aporta nada a una ruta crítica con
   fecha.
3. **Cobro real.** Dos videos de checkout ([animado](2026-08-11-checkout-tarjeta-animada-3d.md),
   [flip 3D](2026-08-11-checkout-tarjeta-flip-3d-portfolio.md)) y **ninguno responde la pregunta
   que bloquea la tarea**: si el modelo Facilitador boliviano (QR Simple / BNB / BCP) captura la
   tarjeta in-page o redirige al banco. El propio prompt de `Estructura de pagos` admite que la
   verificación *"puede matar la tarea entera"*. Hay estética de checkout, cero sustancia de cobro.
4. **Cómo se automatiza el comentario→DM.** 20 de 40 videos **usan** el mecanismo y **ninguno**
   explica qué permisos de la Graph API hace falta ni cómo se solicitan. Es el bloqueo S6 y el
   corpus lo esquiva sistemáticamente.
5. **Precio, empaquetado y retención de un SaaS B2B.** Cero piezas sobre pricing, onboarding de
   cliente pagando o churn — teniendo el problema de precio documentado (790/1.500 vs 2.000/4.500)
   en tres fichas distintas.
6. **Cómo medir con cero ventas.** [LIVE OPS](2026-08-09-live-ops-dashboard-maria-wendt.md) enseña
   qué tiles poner, pero con números ajenos; [PostHog](2026-08-11-posthog-agentes-producto.md)
   exige dar de alta una plataforma nueva y *"conseguir usuarios reales"*. Por eso V-4 quedó
   **condicionado**: *"hoy no hay ventas que dividir"*. Nadie muestra el paso anterior.
7. **On-premise / Onia Box.** Sólo lo roza la corrección de
   [visión computacional](2026-08-09-supra-vision-ganado-vision-computacional.md), y de refilón.

**Dato relevante para tapar el hueco #1:** de las 5 piezas sin veredicto en `BANDEJA.md`, al
menos tres apuntan justo ahí — `Dbb34dLEvl0` (8 industrias → agentes IA, que es literalmente el
pitch de ONIA), `DblcFzIt9UL` (5 formatos de anuncio estático para Meta) y `DborvP0xEeE` (caso de
éxito Climatic: problema social + producto). **La cola sin procesar puede ser más valiosa que la
próxima tanda.** Procesar esas 5 antes de ingresar más.

---

## 7 · Contradicciones del corpus y cómo se resuelven

| # | La contradicción | Cómo se resuelve |
|---|---|---|
| 1 | **Plantillas de video:** [32 plantillas](2026-08-11-hyperframes-32-plantillas-microanimacion.md) = `MEJORA` (adoptar catálogo) pero [Raylight](2026-08-11-raylight-app-plantillas-motion-graphics.md) y [CapCut](2026-08-12-carrusel-claude-capcut-editar-video.md) = `HUMO` por lo mismo | El eje no es el tema, es el **motor**. Si duplica el motor → `HUMO`. Si es catálogo o guion **para** el motor propio → `MEJORA`. Las 32 son para HyperFrames, que ya es nuestro; Raylight lo reemplaza. Licencia a revisar antes de usar cualquiera en material comercial |
| 2 | **Seedance:** "50 referencias" sin fuente (9-ago) → confirmada por el fabricante (12-ago) → pero "Seedance 2.5", "30 s" y `33 DAYS UNLIMITED` resultan falsos para nuestra cuenta | **La consulta propia gana sobre el video Y sobre el anuncio oficial.** Ya resuelto dentro de [ad-spec](2026-08-12-ad-spec-seedance-tres-insumos.md): la receta se reescribió a `seedance_2_0` / 15 s. Regla: verificar en la cuenta antes de planificar producción |
| 3 | **Comentario→DM:** `INDEX.md` lo llama *"la pieza más vendible de toda la tanda"*, pero [8 skills](2026-08-12-8-skills-2026-curaduria-youtube.md), [avatares](2026-08-12-avatares-ia-prompt-json-zeus.md) y [20 señales](2026-08-12-20-senales-web-vibecodeada.md) dicen "no copiar el cebo" | Separar **mecanismo** de **cebo**. El mecanismo es válido y arranca manual (A2); el cebo sin recurso real es prohibido — [botón carga](2026-08-11-boton-carga-archivos-react-framer.md) es el ejemplo de qué no hacer. Sólo se pide la palabra clave si el recurso **ya existe escrito** |
| 4 | **Visión computacional:** archivada como `FUTURO / Ganadero OS, último de la cola` y corregida 2 días después a **capacidad transversal** tras el señalamiento de Sergio | Resuelto dentro de la propia ficha ([corrección 2026-08-11](2026-08-09-supra-vision-ganado-vision-computacional.md)). **La lección transversal es mayor que el caso:** el error fue de encuadre — preguntar *"¿qué capacidad enciende?"* en vez de *"¿de qué rubro es?"*. Aplica a todo el intake |
| 5 | **Checkout:** [animado](2026-08-11-checkout-tarjeta-animada-3d.md) = `MEJORA` y [flip 3D](2026-08-11-checkout-tarjeta-flip-3d-portfolio.md) = `HUMO`, mostrando **el mismo patrón** (tarjeta que gira al CVV) | La diferencia no es el patrón: es que uno muestra los tres paneles de código y el otro no explica nada. **Un mismo patrón es `MEJORA` u `HUMO` según si se ve cómo está hecho.** Los dos quedan gateados por la misma verificación de §6.3 |
| 6 | **Skills:** [42 skills](2026-08-11-mapa-42-skills-diseno-claude.md) propone "más capas = mejor diseño" y la **misma ficha** advierte *"más skills no es mejor diseño: es más contexto compitiendo"* | Ya resuelto en el prompt: instalar **sólo las 5 de la capa visual ausente**, rehacer **una** landing real, comparar lado a lado y **escribir la decisión** (se quedan o se desinstalan). Las otras 13, después |
| 7 | **Formato de portafolio:** pieza única antes/después ([FIND](2026-08-09-web-antes-despues-find-real-estate.md)) vs lote de 3 proyectos en un reel ([emails](2026-08-11-portafolio-emails-preventa-curso.md)) | No compiten, se ordenan: pieza única por web **hasta tener 3 casos**, después el reel de lote cerrando con oferta. Ya está escrito así en el bloque `web-factory` |
| 8 | **Estado del tablero:** `PENDIENTES.md` marca V-2 (seguridad) como *"listo para abrir"*, pero la memoria del proyecto da los 3 bloqueantes por cerrados y verificados en prod el 11-ago | **Contradicción de proceso, no de contenido.** Verificar en producción antes de reabrir V-2 y actualizar `PENDIENTES.md`. Es el mismo síntoma del §1: el trabajo avanza en un lado y el tablero no se entera |

---

## 8 · Dos observaciones de método que el corpus dejó sin escribir

**a) La calidad del análisis no depende del pipeline caro.** Cuatro fichas del 11-ago se
resolvieron por el camino degradado (audio + muestra de fotogramas) porque se agotó la cuota
diaria de Gemini — y **el hallazgo más valioso de esa tanda salió justo de ahí**:
[seedance escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md) se leyó con **2 de 6
fotogramas**. Lo mismo con los 6 carruseles: `yt-dlp` no podía bajarlos, se agregó `ig-carousel.mjs`
y `INDEX.md` reconoce que *"traían lo mejor de la tanda"*. Conclusión operativa: no posponer un
análisis por falta de cuota, y no confiar en que el pipeline caro sea el que encuentra lo bueno.

**b) Cuando hay texto en pantalla, el texto manda sobre el audio.** Aparece como nota al pie en
**seis** fichas y nunca como regla: `2-4%` en pantalla vs `4%` en audio
([dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md)); "Cloud"/"OpenCursor" por
Claude/Open Carrusel ([Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md));
`TAMSAMSOM` y `Go Bill. Cheers.` ([15 términos](2026-08-12-quince-terminos-startup-go-build.md));
"vaycodeado"/"versel.app" ([20 señales](2026-08-12-20-senales-web-vibecodeada.md): *"la fuente
confiable acá es el texto en pantalla, no el audio"*); "cloud"/"Hyperframe"
([5 herramientas](2026-08-11-cinco-herramientas-contenido-claude.md)); y Whisper alucinando sobre
música sin locución ([portafolio emails](2026-08-11-portafolio-emails-preventa-curso.md)).
Merece subir a regla del intake en `INDEX.md`, no repetirse como nota en cada ficha.

---

## Resumen ejecutable

1. **Producir las 3 piezas de portafolio.** Encolado 4 veces, cero producido, cero costo, mueve
   el precio. Nada más de este corpus importa hasta que esto exista.
2. **Procesar las 5 piezas de `BANDEJA.md` antes de ingresar links nuevos** — tres apuntan al
   hueco de venta B2B, que es el que ningún video cubrió.
3. **Aplicar los 4 filtros del §5 al intake**: el CTA comentario→DM baja a una línea; el clip
   mudo de UI sólo entra si se lee el código; el anuncio de plataforma que reemplaza algo
   instalado es `HUMO` de 5 líneas; los glosarios no se analizan.
4. **Sincronizar el tablero** (V-2 posiblemente ya cerrado) y cerrar B1–B4: el corpus demostró
   que el problema no es qué falta saber, sino qué está construido y apagado.
