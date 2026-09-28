# Referentes de contenido: Enrique Rocha, Erik Taveras y Santiago Muñoz

> **Investigación del 2026-09-25** · sesión CONTENIDO (guiones y estructura) · solo lectura: no se
> inició sesión en ninguna red, no se pagó nada. **Foto de un día, no fuente de verdad**: las cifras
> de terceros envejecen y se vuelven a medir antes de usarlas.
>
> Pedido de Sergio Urcullo: *"entremos a sus perfiles y veamos cómo dirigen todo: sus diseños, cómo
> llevan a su comunidad, qué enseñan"*. Audiencia prioritaria que fijó Sergio Urcullo el 2026-09-21
> (tal como la trae el pedido; no está escrita en un doc de `main`): jóvenes y aficionados a la IA
> que quieren **aprender a construir** o **aprender a vender** soluciones.

## ⚠️ Límite de esta investigación (leer primero)

1. **No se vio ningún perfil renderizado.** La red de la sesión bloquea con un 403 del proxy (en la
   conexión CONNECT) a Playwright/Chromium, `curl` y WebFetch hacia `instagram.com`, `youtube.com`
   (y sus miniaturas en `i.ytimg.com` / `img.youtube.com`), `tiktok.com`, `threads.com`,
   `skool.com`, `cal.com`, `tododeia.com`, `eriktaveras.com` (con `comunidad.` y `link.`),
   `hainrixz.github.io`, `puntua.net`, `web.archive.org`, `r.jina.ai` y los servicios de captura
   (`s0.wp.com/mshots`, `image.thum.io`, `api.microlink.io`). Re-comprobado hoy con `curl` para
   TikTok, Instagram, YouTube, Threads, Skool, cal.com, tododeia.com y eriktaveras.com.
2. **Consecuencia:** no hay capturas de reels, grillas de Instagram ni miniaturas de YouTube. Lo
   único visual que se miró son **las portadas y capturas que ellos mismos publican en GitHub**
   (portadas de herramientas, UI de producto). Sirven para leer su gramática visual; **no
   reemplazan** mirar sus reels.
3. **Fuentes y cómo se marcan en todo el doc:**
   - **[V]** visto directamente en GitHub (perfiles, READMEs, imágenes de sus repos).
   - **[S]** fragmento del buscador. Dato de tercero, muchas veces sin fecha; nada está auditado.
   - **[O]** análisis previo de ONIA, con su fecha (fichas de `video-intake`, guiones del 17-sep).
   - **[D]** fecha deducida del ID del post (TikTok, Instagram, LinkedIn; método en §7).
   - **[NV]** no verificable con lo disponible.
4. **Cifras de audiencia:** siempre con fecha y fuente. Donde no hubo número, dice [NV].
5. **Para mirarlos de verdad** hay que habilitar esos dominios en la configuración del entorno: menú
   del entorno cloud en la barra de título de la sesión → Edit → Network access (subir el nivel de
   acceso o agregar los dominios). Lo decide Sergio Urcullo.

---

## Resumen

1. **Enrique Rocha** (@soyenriquerocha · *tododeia*, Tijuana). Modelo "abrir primero": cada reel
   lleva a una **guía pública gratis** (268 en su bóveda, sin registro [S]) o a un **repo MIT con
   diseño propio** (`whatsapp-agentkit`, 510★ [V]). Cobra por **dos libros PDF** (29 USD [S]) y por
   **llamadas 1 a 1 en tres niveles**. No tiene membresía paga. Trabaja solo.
2. **Erik Taveras** (@eriktaveras · AutoDev; dominicano, vive en Carolina del Norte). Ingeniero que
   **le vende a empresas**: SaaS de WhatsApp (TalosFlow) y consultoría productizada (paquete de
   ~USD 1.997). Su comunidad es **gratis, en plataforma propia**, con XP e insignias, y **"cada reel
   trae su guía"**. En YouTube hace largos en **formato experimento**.
3. **Santiago Muñoz** (@sanmunoz.ia · Horizontes IA; CDMX, estudiante del Tec). Es el que **vende la
   comunidad**: Skool a **USD 57-64/mes**, 600-768 miembros, **dos directos por semana**, garantía
   **1 a 1** y su propio chatbot open source (**Forja**) con un "Modo Agencia" para **revender
   bots**. Le habla justo al público de Sergio Urcullo: gente no técnica que quiere construir y
   vender IA.
4. **Lo que comparten:** CTA de una palabra ("comentá X") → DM → un recurso **real** (repo, guía,
   plantilla). **Automatizan su propia producción de contenido y publican esa automatización como
   contenido.** Casi no usan LinkedIn.
5. **Para Sergio Urcullo:** tomar lo barato que sirve a la Etapa 1 (5 clientes de clínica): una guía
   con URL propia por pieza, la respuesta pública al comentario (hoy falta), el 1 a 1 con "para qué
   NO es" (Enrique) y con paso de diagnóstico (Erik), un directo cada dos semanas, un repo al mes de
   lo que ONIA ya construyó y LinkedIn reciclado. **Evitar** la comunidad paga, la reventa y las
   cifras de ingreso: serían una línea de negocio nueva, y eso solo lo decide Sergio Urcullo.

---

## 1. Enrique Rocha — @soyenriquerocha / *tododeia*

### 1.1 Identidad

- **[V]** GitHub `Hainrixz`, nombre de perfil "(@soyenriquerocha)". Bio: *"✴️ te enseño IA para que
  no te deje atrás ✴️ detrás de @tododeia · @metara.ai ✴️ tijuanense construyendo el futuro"*. Web
  tododeia.com; IG y YouTube @soyenriquerocha.
- **[V]** README de `open-carrusel`: *"Founder: Enrique Rocha (@soyenriquerocha). Tijuanense,
  content creator… Also behind @tododeia and @metara.ai"*.
- **Homónimos descartados:** el actor Enrique Rocha (1940-2021), @soy.enriquerocha (cripto, 1,5K),
  @enrique_rocha_oficial, Enrique Jacob Rocha (político, con un Substack sobre IA) y el Enrique
  Rocha de "Travesías Media" en LinkedIn.

### 1.2 Plataformas y audiencia

| Plataforma | Handle / URL | Audiencia (fecha · fuente) |
|---|---|---|
| Instagram | @soyenriquerocha (+ @tododeia, @metara.ai) | [NV]: IG bloqueado y el buscador no indexa el número. Indicio: el carrusel "Stop AI slop" juntó **3,1k likes en un día** [O, 17-sep] |
| TikTok | @soyenriquerocha | [NV]; activo desde 2021 [D] |
| YouTube | @soyenriquerocha | [NV] |
| Facebook | página "Soy Enrique Rocha" (reels replicados) | [NV] |
| Threads | @soyenriquerocha (reels replicados con caption) | [NV] |
| GitHub | `Hainrixz`: **841 seguidores, 31 repos** | [V, 25-sep-2026] |
| Web | tododeia.com: bóveda de 268 guías, tienda, collab | [S] |
| Eventos | luma.com/soyenriquerocha | [S] |
| 1 a 1 | cal.com/soyenriquerocha | [S] |
| LinkedIn / X | no encontrados (los perfiles de X hallados son homónimos) | [NV] |
| Marcas / prensa | vía **Creators Crate** (agencia de influencers de Monterrey) | [S] |

Repos con más tracción [V, 25-sep]: `whatsapp-agentkit` 510★ / 159 forks · `the-architect` 507★ ·
`open-carrusel` 467★ · `cyber-neo` 272★ · `editor-pro-max` 252★ · `claude-webkit` 251★ ·
`maia-skill` 144★.

### 1.3 Qué enseña y a quién

- **Temas [S]:** Claude, Claude Code y Codex; skills, plugins y MCP; repos open source; diseño "sin
  AI slop"; crear contenido con IA ("Stack IA Creador", "5 skills para crear contenido"); apps sin
  programar (`construyeconia`); ahorrar tokens; marketing con Claude (Claude Ads, Meta Ads CLI); y
  **armar una agencia de IA** ("3 servicios para armar tu agencia de IA": marketing, leads con un
  agente de WhatsApp y el "ecosistema completo", que según él es el que más paga).
- **Profundidad:** principiante a intermedio. Cada guía resuelve **un problema, paso a paso**, con
  el comando o el prompt para copiar.
- **Le habla a:** creadores, principiantes, emprendedores y agencias chicas, en español de México.
  Tono de urgencia amable: *"que no te deje atrás"*.

### 1.4 Formatos por plataforma

- **Reels (IG, FB, Threads, TikTok):** gancho de novedad + emoji. Títulos reales [S]: *"Claude ahora
  nunca va olvidar algo"*, *"Claude ahora se vuelve tu equipo completo"*, *"La habilidad que cambia
  tu Claude 😬"*, *"Claude + TradingView ahora ve el mercado 🤫"*, *"Un agente que protege tus app
  con Claude 😮‍💨"*, *"Claude Fable 5 + Codex para construir 😬 como hacerlo y la guía completa paso
  a paso 👇"*. Duración: [NV]. En su stack declara **ManyChat** para automatizar DMs [S]: palabra
  clave → DM.
- **Carruseles:** "Stop AI slop", 10 repos (`instagram.com/p/DdXM8-Nmxey`, **16-sep-2026 [D]**).
  Estructura [O]: portada-declaración, GitHub grande en portada, repos agrupados por tarea **con el
  nombre exacto** y cierre con criterio. ONIA ya copió esa estructura en su carrusel "10 repos"
  (`hermes-content/docs/cola/PARA-PUBLICAR-APPLE-REPOS.md:10-13`); el inventario de esos repos contra
  lo instalado está en `web-factory/DESIGN_STACK.md:35`.
- **Una guía web por pieza:** `tododeia.com/community/<slug>`. Ejemplo: *"Ahorra tokens en Claude
  Code · los 3 trucos del video y el kit completo…"*. El reel promete y **la guía entrega** la
  sintaxis real, el kit y una rutina diaria [S].
- **Repos como contenido [V]:** onboarding de un solo comando (`claude` → `/start`), README
  bilingüe, portada con dirección de arte propia y firma "Todo de IA · @soyenriquerocha".
- **Libros [S]:** *Claude de Cero a Cien* y *Codex de Cero a Cien*, PDF de más de 500 páginas, 25
  capítulos, **ediciones fechadas** ("Mayo 2026", "Junio 2026").
- **Directos [S]:** calendario en Luma con talleres, masterclasses y AMAs; registro gratis con
  recordatorios automáticos; *"sesiones íntimas con cupo limitado"*.
- **Antes de la IA [D]:** una serie diaria "Día N" en TikTok sobre organización personal (día 39 el
  9-feb-2024, día 40 el 10-feb, día 44 el 14-feb). El hábito de publicar a diario en público ya
  estaba.

### 1.5 Diseño e identidad visual (lo que se miró en GitHub)

[V] Cada herramienta tiene su propia dirección de arte, pero la gramática se repite:

- `claude-webkit`: tarjeta tipo **ticket** naranja saturado (≈#F5520C), **serif didona pesada** en
  negro y crema ("Describe your business. Claude builds the site."), etiquetas **mono en mayúsculas
  espaciadas** ("21 SKILLS · 6 PHASES · 0 LINES YOU WRITE"), un estallido marrón y una caja de
  terminal con el comando real. Firma "TODODEIA ©2026".
- `whatsapp-agentkit`: casi negro con grilla sutil, acento **verde lima**, grotesca crema grande,
  **terminal + mockup de chat real** ("¿tienen mesa para 4 el viernes 9pm?"), la leyenda "30
  MINUTOS DESPUÉS", el sello **"HECHO EN LATAM"** y la firma "Todo de IA · @soyenriquerocha".
- `editor-pro-max`: fondo hueso, grotesca geométrica negra, **acento naranja en una sola palabra**
  ("Edita videos con **IA.**"), botones píldora y el eyebrow "por @soyenriquerocha".
- `claude-anatomy`: marrón-negro cálido, **terracota ≈#E1693F**, grotesca grande de tracking
  cerrado, chips píldora ("DIEZ FORMAS · UNA CORRECTA") y el motivo de asterisco/sol de su bio.

**Patrón común:** un solo acento saturado, tipo grande y apretado, etiquetas mono en mayúsculas,
**el comando o la conversación real en pantalla** y su firma. Es explícitamente anti-slop: el README
de `claude-webkit` promete un diseño *"that doesn't look AI-generated"*.
[NV]: grilla de IG, set de grabación, subtítulos y miniaturas de YouTube.

### 1.6 Cadencia

- **31 repos públicos** actualizados entre el 27-feb y el 19-sep de 2026: **≈1 por semana** [V].
- **268 guías** en la bóveda [S]. Si cada una sale de un reel, sugiere publicación casi diaria [NV].
- Libros con edición mensual fechada [S]; serie diaria en 2024 [D].

### 1.7 Comunidad

- **"Comunidad" = una bóveda pública:** 268 guías *"que puedes leer sin cuenta, sin registro y sin
  pagar"*, más una página de repos y otra de eventos [S]. **No hay membresía paga.**
- **Onboarding:** no hay registro. Para el principiante total están "Comienza a Construir" (stack
  gratis, *"una demo funcional vale más que mil propuestas"*) y el starter `construyeconia` [S/V].
- **Aportes de miembros [V]:** skills firmadas "por la comunidad" (`abogado-del-diablo`,
  `aprende-skill`) y el pedido *"etiquetá a @soyenriquerocha cuando publiques un carrusel hecho con
  esto"*.
- **Rituales, retos, gamificación y moderación:** [NV] (no hay espacio de conversación visible más
  allá de los eventos).
- Se presenta como *"todo hecho por una sola persona desde México"* [S].

### 1.8 Embudo y llamadas 1 a 1

1. Reel con gancho de novedad → "comentá X" (vía ManyChat).
2. Por DM llega el link a la guía gratis en tododeia.com.
3. La guía vende los **libros (29 USD / 599 MXN)**, las **llamadas** y los **eventos**.
4. En paralelo, los **repos** generan estrellas, forks y reputación; las **marcas** entran por
   Creators Crate.

**Escalera 1 a 1 en cal.com [S].** Cada nivel dice **para qué NO es**, así el que agenda se
autocalifica:

| Sesión | Duración | Precio | Para qué NO es |
|---|---|---|---|
| EXPRESS | 20 min | 299 MXN | "varios problemas, estrategias o implementaciones" |
| QUICK CALL | 45 min | 1.499 MXN (el texto de cal.com dice USD 49) | "una estrategia completa o rediseñar procesos" |
| CONSULTORÍA PROFESIONAL | 90 min | 5.499 MXN (el texto de cal.com dice USD 200) | es para dueños y directores que implementan |

Los dos juegos de precios no coinciden (MXN en /about, USD en cal.com); lo más probable es que uno
sea más viejo [NV].

### 1.9 Piezas de ejemplo

1. **Carrusel "Stop AI slop", 10 repos** (instagram.com/p/DdXM8-Nmxey, 16-sep-2026). *Enseña:* diez
   repos para que lo hecho con Claude no se vea genérico. *Funciona porque* es una lista que se
   guarda, trae nombres exactos que se pueden buscar, ataca un dolor ("se nota que es IA") y juntó
   3,1k likes en un día [O].
2. **Repo `whatsapp-agentkit`** (github.com/Hainrixz/whatsapp-agentkit). *Enseña:* convertir 20
   minutos de conversación con Claude Code en un agente de WhatsApp desplegado. *Funciona por*
   resultado + tiempo + "sin escribir una línea de código": **el repo es la demo**.
3. **Guía "Ahorra tokens en Claude Code"** (tododeia.com/community/ahorra-tokens-claude-code).
   *Enseña:* los tres trucos del video con su sintaxis real y una rutina. El reel promete y la guía
   cumple; al no pedir registro suma confianza y posicionamiento en buscadores.
4. **Libro *Claude de Cero a Cien*** (tododeia.com/tienda/claude-de-cero-a-cien). Cobra a la
   audiencia **sin membresía**; la edición fechada muestra que se mantiene al día.
5. **cal.com/soyenriquerocha:** la escalera 1 a 1 con "para qué no es".

### 1.10 Lo distintivo

**Todo abierto y con diseño.** Regala lo mejor (repos y guías) y cobra por **profundidad** (libros)
y por **acceso** (llamadas), nunca por entrar a una comunidad. El diseño de sus herramientas es de
estudio, no de plantilla.

---

## 2. Erik Taveras — @eriktaveras / AutoDev

### 2.1 Identidad

- **[V]** README de GitHub `eriktaveras` (actualizado el **15-sep-2026**): *"I build software,
  automate businesses and ship open-source tools, and I document it in Spanish for LATAM"*.
- [S] Fundador de **Taveras Solutions LLC** (consultoría de automatización e IA para pymes de
  EE. UU. y LATAM); vive en High Point, Carolina del Norte; es dominicano. Nombre completo: Erik
  Manuel Taveras Tavarez (desarrollador en App Store).
- Homónimo descartado: Leody Taveras (beisbolista).

### 2.2 Plataformas y audiencia

| Plataforma | Handle / URL | Audiencia (fecha · fuente) |
|---|---|---|
| Instagram | @eriktaveras ("Web Apps & AI Workflows") | **135,8K** [V: su README, 15-sep-2026] · 136K [O: 17-sep] · 131K [S, sin fecha] |
| TikTok | @erik.py ("Erik Taveras - TalosFlow.io") | **86,8K seguidores · 737,9K likes** [V: README, 15-sep] |
| YouTube | @ErikTaverasT | **18,5K** [V: README, 15-sep · O: 17-sep] |
| Comunidad | comunidad.eriktaveras.com / autodev.eriktaveras.com | **566+ miembros** [S, sin fecha] |
| LinkedIn | in/eriktaveras ("Backend Developer \| AI Automation") | [NV]: actividad no verificada |
| Threads / Facebook | @eriktaveras / "Erik Taveras - Automatización con IA" | [NV] |
| Web | eriktaveras.com ("TaverasOS"), taverassolutions.com, lab.eriktaveras.com (su homelab en 3D) | [S] |
| Agenda | beacons.ai/eriktaveras ("Agendar Consultoría Técnica"), cal.com/eriktaveras | [S] |
| Cursos | Udemy (instructor): ≥6 cursos de n8n, WhatsApp y agentes | [S] |
| Podcast (invitado) | *Los Verdaderos Códigos* #100, 23-jun-2025 | [S] |

### 2.3 Qué enseña y a quién

- **Temas:** n8n, WhatsApp Business API (Evolution, Chatwoot), agentes de IA, Claude y Claude Code,
  Django, Shopify API, **IA local** (Ollama, Mac mini, GPU Tesla P40 de USD 200), **homelab** y
  autoalojamiento, hardware (ESP32, Raspberry Pi) y **costos reales** ("OpenClaw te puede costar USD
  50-100 un fin de semana; con Ollama, cero").
- **Profundidad:** intermedio a técnico. Su lema: *"real builds, no fluff"*.
- **Le habla a:** desarrolladores y emprendedores de LATAM, y a través de ellos le vende a **dueños
  de pymes**. **Nicho casi idéntico al de ONIA [O]**; hasta tiene un short de "Hermes orquestando
  Codex y Claude Code".

### 2.4 Formatos por plataforma

- **YouTube largo, formato "experimento en vivo" [O, 17-sep]:** Prueba 1/2/3 numeradas, monitoreo en
  tiempo real, revisión del resultado, cierre "¿vale la pena?", 11-12 capítulos y **números
  concretos en el título**. Ejemplo [S]: *"El poder de 24GB de VRAM por menos de $200: Tesla P40 en
  2026"*.
- **Directos en YouTube atados a un hito [S]:** *"IA en LOCAL con Ollama + OpenClaw + Sorteo
  ESPECIAL 20k - ¿Explotará mi servidor?"* (16-feb-2026): tensión, pregunta de riesgo y festejo con
  la comunidad.
- **Construir en público su propio producto [S]:** *"Construí mi propio SaaS de WhatsApp que
  gestiona clientes solo"* (feb-2026, sobre TalosFlow).
- **TikTok/Reels:** número + herramienta + link + "unite a la comunidad". Por ejemplo *"Ahorra
  30-40% de Tokens en Claude Code…"* (17-mar-2026 [D]), *"diferencias entre Claude Chat, Cowork y
  Code"* (10-mar-2026 [D]) y *"cuánto cuesta ejecutar OpenClaw… con costo cero"* (17-feb-2026 [D]).
  Duración: [NV].
- **Micro-productos por palabra clave [S]:** *"comentá 'quiero el dashboard'"* → prompt + guía del
  panel físico de Instagram (ESP32) por **USD 19**, "con el pinout y las 9 trampas que encontré".
- **Carruseles:** [NV].

### 2.5 Diseño e identidad visual (lo que se miró en GitHub)

- **Producto [V]:** ModelNap es una UI oscura verde-grafito con **acento verde menta/esmeralda**
  (≈#34D399, el mismo color del badge de email de su README), detalles en monoespaciada y firma
  "Taveras Solutions" en el pie. Sobrio, de ingeniero.
- **Objetos físicos como prueba [V]:** un panel LCD de Raspberry Pi que muestra **"$124.78 hoy · 418
  msgs · 38.49M tokens"** con la mascota pixel de Claude en coral, y un panel ESP32 con sus
  estadísticas de Instagram. **La prueba es un objeto que se ve en cámara.**
- **Web del laboratorio [S]:** lab.eriktaveras.com convierte su rack real en un juego 3D (6 nodos,
  datos en vivo y consumo en watts).
- [NV]: miniaturas, subtítulos y set de grabación.

### 2.6 Cadencia

- TikTok, muestra indexada [D]: 17-feb, 25-feb, 10-mar, 17-mar y 5-jun de 2026 → al menos semanal
  en lo indexado.
- YouTube: menos frecuente (largos + directos) [NV].
- GitHub: pocas publicaciones al año (ModelNap, ESP32, dashboard); el README se actualiza con sus
  métricas [V].

### 2.7 Comunidad (AutoDev)

- **Gratis**, con registro por email "sin tarjeta", en **plataforma propia** (Django; empezó en
  Heroku) [S].
- **Propuesta [S]:** *"preguntá lo que te trabó, enseñá lo que te funcionó y llevate la guía de
  cada reel"*. **"Cada reel trae su guía, archivos y prompts."**
- **Onboarding [S]:** sección de **Presentaciones** para contar quién sos y qué estás construyendo;
  los miembros responden.
- **Gamificación [S]:** XP por participar e insignias desbloqueables.
- **Contenido [S]:** cursos en video (de lo básico a proyectos avanzados), descargables (plantillas,
  workflows de n8n, scripts, prompts) y un foro.
- **Moderación y rituales fijos:** [NV]. Hay directos con sorteos por hito [S].

### 2.8 Embudo y llamadas 1 a 1

1. Reel o video → guía del reel en AutoDev (**captura el email**).
2. → **Udemy** (cursos pagos baratos) · **micro-guías de USD 19** · productos: **TalosFlow desde
   USD 49/mes** (cerrado, con alta personal de cada cliente) y **DjangoBlaze USD 99** de pago único.
3. → **consultoría productizada** en cal.com [S]:

| Paso | Qué es | Precio |
|---|---|---|
| Discovery 15 min | "diagnóstico honesto; si no te puedo ayudar, te derivo"; califica el alcance | [NV]; se descuenta si después contratás |
| Diagnóstico 90 min | audita el stack, detecta procesos automatizables y entrega un **plan escrito** (arquitectura, herramientas, horas, **ROI**) + **14 días de seguimiento por email** | [NV] |
| Paquete estándar (agente IA / "OpenClaw Standard") | kickoff de 60 min, 5-7 servicios open source integrados, VPS propio, entrega en 7-10 días | **USD 997 de seña + USD 1.000 al entregar** |
| Proyecto a medida | — | **USD 3.000** (50/50) |

TalosFlow lo usan "150+ equipos comerciales en LATAM" [S] (dato de él, no auditado).

### 2.9 Piezas de ejemplo

1. **"El poder de 24GB de VRAM por menos de $200: Tesla P40 en 2026"**
   (youtube.com/watch?v=M6lZSmgMKxk). Prueba real de hardware barato para IA local. *Funciona por*
   precio y número en el título, un experimento con resultado medido y "¿vale la pena?".
2. **Directo "IA en LOCAL… Sorteo ESPECIAL 20k - ¿Explotará mi servidor?"**
   (youtube.com/watch?v=IVLUDojtoYU, 16-feb-2026). Hito + riesgo + comunidad.
3. **Guía "Monta tu primer Home Lab (desde una PC de $100)"** (comunidad.eriktaveras.com). *"No
   necesitás un servidor de $2.000"*: baja la barrera de entrada y pide el email.
4. **Taveras Lab** (lab.eriktaveras.com). Su homelab real en 3D con datos en vivo: prueba que se
   verifica sola y que se comparte.
5. **TikTok "Ahorra 30-40% de tokens en Claude Code"**
   (tiktok.com/@erik.py/video/7618288974464814350). Número + herramienta + CTA a la comunidad.

### 2.10 Lo distintivo

**Credibilidad de ingeniero que le vende a empresas.** Su contenido técnico atrae a quienes
construyen, y su oferta productizada (discovery → diagnóstico escrito → paquete con precio) se la
vende a dueños de negocio. **Es el más parecido a lo que ONIA necesita en la Etapa 1.** Su prueba
siempre es algo medible o un objeto físico.

---

## 3. Santiago Muñoz — @sanmunoz.ia / Horizontes IA

### 3.1 Identidad (hay muchos homónimos)

- [S] Santiago Muñoz Ibarra, de Ciudad de México. Estudia **Administración Financiera en el Tec de
  Monterrey** (campus Estado de México) y ganó en **2024** el concurso de video de la **AMIB** sobre
  fondos de inversión (mención en 2023). Fundó la agencia **InnovandoHorizontes** y la comunidad
  **Horizontes IA**.
- [V] GitHub **`santmun`** (68 repos, 119 seguidores): el repo `forja` dice "© Horizontes IA · por
  Horizontes IA" y enlaza horizontesia.com.
- **Vínculo con lo que ONIA ya estudió de él:**
  - El reel `DdE7wYbxjPK` (GPT-6 Astra + MCP de DaVinci) salió el **9-sep-2026 [D]**, el mismo día
    en que `santmun` publicó el repo `mega-editor-davinci` [V].
  - El tutorial "de 28 min" que fundó la skill `editor-videos` coincide con *"Despedí a mi editor y
    contraté a Claude Code"* (14-jul-2026, con links a Skool y horizontesia [S]), el mismo día de su
    repo `video-vox` [V].
  - El otro reel que ONIA analizó, `DcE8336Ixby` (15-ago-2026 [D]), está firmado **@sanmunoz.ia** en
    su ficha (`hermes-content/references/video-intake/2026-08-28-pesos-algoritmo-x-codigo-publico.md:3`).
  - **Atribución: alta probabilidad, no vista con los ojos.** El handle dentro del reel no se pudo
    ver (IG bloqueado), y ningún archivo del repo dice que @sanmunoz.ia sea Santiago Muñoz. Si hace
    falta certeza, la da Sergio Urcullo, que eligió la referencia.
- **Homónimos descartados:** GitHub `SantiMunoz` (España), el futbolista Santiago Muñoz,
  @_santimunoz9, Santiago García Muñoz (productor de video), la artista Beatriz Santiago Muñoz y
  Santiago Muñoz Machado (RAE). **Tampoco son suyos:** el curso de Udemy "Máster Claude Code 2026"
  (es de *render2web*) y, probablemente, "Automatízalo" de iahorizontesacademy.com (aparece ligado a
  Jorge Marfil) [S].

### 3.2 Plataformas y audiencia

| Plataforma | Handle / URL | Audiencia (fecha · fuente) |
|---|---|---|
| Instagram | @sanmunoz.ia (nombre "santimunoz.ia") | **170K · 259 posts** [S, indexado sin fecha, ~2026]. Bio: *"🚀 Todo sobre Agentes IA y Claude Code +500 Casos de Éxito Empieza Aqui ⬇️"* |
| TikTok | @sanmunoz.ia | **198K · 1,4M likes** [S]. Antes, cuenta "InnovandoHorizontes" (80-120K según su LinkedIn [S]) |
| YouTube | @SantiMunozIA ("Me gusta la IA"); el README de Forja enlaza también youtube.com/@horizontesia | [NV] |
| Comunidad paga | skool.com/horizontes-ia-9992 · perfil @santiago-munoz-7991 | **768 miembros, USD 57/mes** (Skool) · **600+ o 650, USD 64/mes** (web) [S]. Perfil activo desde el 25-may-2024, **1,8k aportes**, 2,4k seguidores [S] |
| Web | horizontesia.com · apps.horizontesia.com ("El Stack de Santi") · horizontesia.com/menu-digital-claude-code · /blog | [S] |
| Herramienta | forjabots.com (Forja / Forja+) · horizontesiabot.com | [S] + [V] |
| Hub de links | sanmunozia.com ("7 módulos, 40+ lecciones, 60 sistemas listos, comunidad privada") · linktr.ee/santimunozia · sanmunoz.uwu.ai | [S] |
| Agencia | innovandohorizontes.com (web, SEO, chatbots; **desde 1.800 MXN/mes**; planes de menos de USD 50/mes) | [S] |
| LinkedIn | santiago-munoz-ibarra (posts ocasionales; "Generación de leads con IA", 28-nov-2024 [D]) | [S] |
| X | @sanmunoz.ia (aparece como prueba en su reel del 15-ago-2026) | [O]; audiencia [NV] |
| GitHub | `santmun`: 68 repos; destacan `forja` 113★ / 51 forks y `crear-agente` 74★ | [V, 25-sep] |

### 3.3 Qué enseña y a quién

- **Temas:** Claude Code, agentes de IA, n8n y Make, **chatbots de WhatsApp, IG y FB**, agentes de
  voz (inmobiliaria), edición de video con IA (Remotion, DaVinci por MCP), automatizar Meta Ads,
  automatizar su propio contenido (carruseles, historias, color, intros) y **cómo venderle eso a
  negocios**: "Modo Agencia", cotizador y propuesta incluidos, y su repo `docs-entrega-skill` para
  entregarle documentación al cliente.
- **Profundidad:** amigable para principiantes. *"La mejor comunidad para personas que no son
  técnicas"*; *"si no programás, empezás copiando sistemas que ya funcionan; si ya sos técnico,
  subís a agentes que escalan"* [S]. En YouTube publica **cursos completos de 6-7 h gratis**.
- **Le habla a:** profesionales no técnicos y jóvenes de LATAM que quieren **construir y vender
  sistemas de IA**. **Es exactamente el público prioritario de Sergio Urcullo** y, a la vez, un
  competidor del add-on chatbot (§6).

### 3.4 Formatos por plataforma

- **Reel vertical partido [O, análisis del 17-sep, reel de 92,8 s]:** cabeza hablando **abajo
  (~45%)** y zona de apoyo **arriba (~55%)** que cambia cada 1-3 s (screencast, chat del agente,
  logos, fotos de sus capacitaciones); **~25-30 cortes en 92 s** (estimación de Gemini, no
  medición), jump cuts, zoom digital al botón que importa, **subtítulos blancos gruesos de 2-5
  palabras con la palabra clave en AMARILLO**, mini-etiquetas **CIAN** en mayúsculas, "ecuaciones de
  logos" (ChatGPT + DaVinci = 💰) y **CTA final con el fondo desenfocado** y la palabra clave entre
  comillas en amarillo ("Comentá 'Astra'"). Detalle en
  `hermes-content/references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`
  y en `ONIA_METODO_SANTIAGO_EDICION_20260925.md` (esta carpeta).
- **TikTok, "Comentá PALABRA" y preguntas [S/D]:** *"Comenta 'RECIBO' y te lo mando"*
  (15-dic-2024), *"Comenta LINK y te la paso"* (6-ene-2025), *"Comenta qué Agente IA te gustaría"*
  (3-feb-2025), *"¿Cuál es su IA favorita?"*, *"Larga vida a Notion 😎, plantilla en mi perfil"*.
- **YouTube largo:** tutoriales paso a paso con **"PLANTILLA INCLUIDA"**; historia personal +
  método (*"Despedí a mi editor y contraté a Claude Code"*, 14-jul-2026); **casos de miembros**
  (*"De Consultor a Experto en IA: La Transformación de Rodolfo"*, 16-jul-2025); **"lo hice para
  alguien"** (*"Hice su Sitio en Menos de 30 Minutos Usando IA"*, 23-jul-2025); cursos maratón
  (*"Claude Code 2026: Curso Completo (7 Horas) Sin Programar"*, grabado en sep-2026; atribución
  probable [S]).
- **Shorts animados estilo Vox** (repo `video-vox` [V]): 30-45 s, papel crema (#F4ECD6), tinta
  (#20180F), acento naranja (#FF5A1F), tipografía **Anton**, transiciones de desplazamiento sin
  fundidos, whoosh y pop.
- **Carruseles** (repo `carousel-horizontes-ia` [V]): estilo **acuarela dibujada a mano, generado
  entero por IA** (Nano Banana Pro), con fondos beige/crema y tipografía manuscrita escrita por el
  modelo.
- **Directos:** dos por semana **dentro de Skool** (§3.7).

### 3.5 Diseño e identidad visual

- **Portada de `crear-agente` [V]:** azul noche, título blanco en sans geométrica, subtítulo **cian**
  y un **robot tierno brillante generado por IA** sobre una nube con íconos. Es la estética "glow de
  IA" clásica para principiantes: **la opuesta a la de Enrique**.
- **Tokens [V]:** su plantilla de edición vertical (`editor-tiktok`) usa por defecto **naranja
  #FF7A00 sobre negro**, con variante lima/cian, y las fuentes **Space Grotesk, Inter y JetBrains
  Mono**. De ahí viene el "naranja estilo Santiago" que ONIA tiene como acento por defecto en
  `.claude/skills/editor-videos/scripts/make-mockup.mjs:77`. Su `docs-entrega` usa **cian #00E5FF**,
  el mismo de las mini-etiquetas del reel.
- **El reel de agosto que ONIA ya analizó [O]** (`instagram.com/p/DcE8336Ixby`, 15-ago-2026 [D],
  74,6 s, 5 cortes medidos con umbral de escena 0,3, que no cuenta los jump cuts dentro del mismo
  encuadre; ficha
  `hermes-content/references/video-intake/2026-08-28-pesos-algoritmo-x-codigo-publico.md:3-6`,
  `:38`). Alterna tres registros:
  - cabeza en una **habitación cálida con micrófono rojo** y **tarjetas de UI oscuras flotando** al
    lado de la cara;
  - pantalla completa con un **grafo de nodos naranja sobre negro** y **karaoke palabra por palabra
    en blanco**, con la palabra clave en **naranja ≈#FF6B2C**;
  - un split con la tabla arriba y la cara abajo.

  La transición es una lámina blanca con manchas azul y naranja. **El naranja es el único color
  saturado y solo toca los datos.** Como prueba muestra un tweet propio de @sanmunoz.ia en X.
- [NV]: grilla de IG y miniaturas de YouTube.

### 3.6 Cadencia

- TikTok, muestra indexada [D]: 9 videos entre el 15-dic-2024 y el 3-feb-2025 (≥1-2 por semana solo
  en lo que indexó el buscador).
- Skool: **1,8k aportes** desde el 25-may-2024 → **≈2 por día** si el dato es reciente [S]. Un
  miembro: *"Santi es una máquina que saca videos constantemente"* [S].
- GitHub: ~30 repos actualizados entre el 11-abr y el 24-sep de 2026 → **≈1,3 por semana** [V].
- **Directos: 2 por semana** (jueves 21:00 y domingos) [S].

### 3.7 Comunidad (Horizontes IA, en Skool)

- **Paga:** **USD 57/mes** (Skool) o **USD 64/mes** (web). *"Todo en un solo plan, sin upsells"*,
  cancelable [S].
- **Contenido [S]:** **7 módulos** "desde tu primera línea de código hasta entregar proyectos reales
  a clientes"; **4.800+ posts con filtros**; un **asistente de IA** que guía; **ruta personalizada de
  90 días**; **directorio de miembros**.
- **Rituales [S]:** **jueves 21:00, directo de dudas**; **domingos, masterclass** de un tema nuevo.
- **Garantía [S]:** *"si en 30 días tu primer bot no está funcionando, Santi trabaja contigo 1 a 1
  hasta que funcione"*.
- **Herramienta incluida [V/S]:** **Forja+** (sobre el Forja open source): **14 rubros con panel
  propio** (barbería, restaurante, inmobiliaria, **clínica**, spa, gimnasio, hotelería…), comandos
  recurrentes (`/mantenimiento`, `/afinar`, `/campaña`, `/clonar`, `/precios`) y **Modo Agencia**
  para revender bots **"con tu marca a USD 2.000-3.000 cada uno"**: *"un solo cliente paga tu año"*.
- **Prueba social:** videos de casos de miembros; bio "+500 casos de éxito" (**no auditado**).
- **Gamificación y moderación:** la nativa de Skool (niveles y ranking); lo específico, [NV]. En las
  reseñas se dice que "todos ayudan" [S].

### 3.8 Embudo y llamadas 1 a 1

1. Reel o TikTok con "Comentá PALABRA" → DM con plantilla, guía o repo.
2. → Tutorial largo en YouTube con links a Skool y horizontesia.
3. → **Horizontes IA (USD 57-64/mes)** con garantía 1 a 1 → Forja+ → Modo Agencia (el miembro
   revende).
4. En paralelo, la agencia InnovandoHorizontes le vende a empresas.

El **1 a 1 no se vende suelto**: es la **garantía** que baja el riesgo de pagar la comunidad.

### 3.9 Piezas de ejemplo

1. **Reel `DdE7wYbxjPK`** (instagram.com/p/DdE7wYbxjPK/, 9-sep-2026). *"Reemplacé a mi editor con
   GPT-6 Astra + MCP de DaVinci"*, con "Comentá 'Astra'". *Funciona por* la prueba visual continua
   en la mitad de arriba, la cabeza fija abajo y el CTA de una palabra. Ese mismo día publicó el
   repo.
2. **"Despedí a mi editor y contraté a Claude Code"** (youtube.com/watch?v=QRhX4zU1jso,
   14-jul-2026). Historia + método paso a paso. Es, con alta probabilidad, el tutorial que **originó
   la skill `editor-videos` de ONIA**.
3. **"De Consultor a Experto en IA: La Transformación de Rodolfo"**
   (youtube.com/watch?v=cxkJPLiKoy4, 16-jul-2025). El caso de un miembro convertido en contenido.
4. **"Hice su Sitio en Menos de 30 Minutos Usando IA"** (youtube.com/watch?v=mVzvBewfAuo,
   23-jul-2025). Demostración con una persona real y con reloj.
5. **Repo Forja** (github.com/santmun/forja). Regala el producto base (MIT; se instala diciéndole a
   Claude Code "ármame un chatbot con Forja") y **cobra el acompañamiento, los rubros y la reventa**.

### 3.10 Lo distintivo

**Es el perfil más parecido al de Sergio Urcullo** (joven, estudiante, fundador) y el que **más
productizó a la comunidad**: membresía + herramienta propia + garantía 1 a 1 + reventa. Además
automatiza toda su producción de contenido y **publica esas automatizaciones como repos**.

---

## 4. Comparación lado a lado

| | Enrique Rocha | Erik Taveras | Santiago Muñoz |
|---|---|---|---|
| Audiencia principal | [NV] (IG) | IG 135,8K · TT 86,8K · YT 18,5K [V, 15-sep] | IG 170K · TT 198K [S] |
| A quién le habla | creadores y principiantes | devs y emprendedores → pymes | no técnicos que quieren construir y vender |
| Qué regala | 268 guías + repos con diseño | la guía de cada reel + comunidad + plantillas | plantillas por comentario + cursos de 7 h + Forja |
| Qué cobra | 2 libros (USD 29) + 3 niveles de llamada | Udemy, USD 19, SaaS desde USD 49/mes, consultoría USD 1.997-3.000 | Skool USD 57-64/mes (+ agencia) |
| Comunidad | bóveda web pública + eventos en Luma | foro propio gratis con XP e insignias | Skool pago, 2 directos por semana, garantía 1 a 1 |
| Formato estrella | carrusel y reel "Claude ahora…" | largo "experimento" + directo | reel partido + tutorial largo |
| Diseño | editorial, un acento, anti-slop | sobrio de ingeniero + objetos físicos | "glow de IA", naranja/cian/amarillo |
| LinkedIn | no encontrado | perfil B2B | posts ocasionales |
| Horas que le exige su modelo | altas (repo semanal) | medias-altas | **muy altas** (2 directos/semana + garantía 1 a 1 + cursos de 7 h) |

---

## 5. Síntesis para Sergio Urcullo: ADOPTAR, ADAPTAR y EVITAR

### 5.0 Punto de partida

**Lo que ONIA ya tiene** (no hay que volver a inventarlo):

- **Onia Community en WhatsApp:** canal Announcements (solo publica Sergio Urcullo) + grupo General
  (`hermes-content/docs/comunidad/ESTADO_COMUNIDAD.md:13-17`), con 1 drop por día a hora fija, 19:00
  sugerido (`hermes-content/docs/ONIA_COMUNIDAD_CONTENIDO.md:20-22`).
- **Llamadas en cal.com:** `/15min`, beneficio exclusivo de la comunidad
  (`ONIA_COMUNIDAD_CONTENIDO.md:39`), y el evento público **`/20min` «Llamada 1 a 1»** (20 minutos,
  Google Meet). ⚠️ Corrección al informe de base, que hablaba de `/30min`: el 18-sep se midió que
  `/30min` devolvía **404** y se corrigieron 7 enlaces en 5 páginas
  (`hermes-content/docs/handoff/web-creator.md:72-79`). Hoy no se pudo re-mirar (cal.com bloqueado).
- **Circuito comentario → DM en n8n** que entrega desde el 28-ago; le falta la **respuesta pública**
  al comentario (`POST /{comment_id}/replies`; `hermes-content/docs/ONIA_CIRCUITO_COMENTARIO_DM.md:14`,
  `:31`, `:250`).
- **Pipeline `editor-videos`** (el método de Santiago; estado en `ONIA_METODO_SANTIAGO_EDICION_20260925.md`).
- **Carrusel editorial** con la estructura de Enrique (`cola/PARA-PUBLICAR-APPLE-REPOS.md`).
- **Guías con URL propia** en la web personal: `/stack` y `/homelab`
  (`hermes-content/docs/cola/ARRANQUE-MOTOR-SEMANAL.md:12`, `:47`), y **tres largos en formato
  experimento** tomados de Erik, E1-E3 (`hermes-content/docs/cola/GUIONES-RODAJE-17-20-SEP.md:304-329`).
- **Instagram de Sergio Urcullo:** 427 seguidores y 45 posts al 31-ago
  (`ONIA_COMUNIDAD_CONTENIDO.md:9`).

**La advertencia de etapa.** La etapa vigente es la **Etapa 1 (hoy → 5 clientes)** y **no se abre
una línea de negocio nueva** (`hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §7). Los tres
referentes **monetizan a su audiencia de forma directa**; a ONIA la marca personal le sirve de forma
**indirecta** (credibilidad, reclutamiento, alianzas, algún lead de pyme). **El que más se parece a
lo que ONIA necesita es Erik**; **el que más se parece a Sergio Urcullo como persona es Santiago**.

Las horas marcadas abajo son estimaciones de esta investigación, no mediciones.

### 5.1 ADOPTAR (barato, sirve ya)

1. **Cerrar el circuito "comentá X" con la respuesta pública** ("Te lo mandé por DM"). Los tres usan
   una palabra clave, y ManyChat (Enrique) lo hace solo. En ONIA **es el único nodo que falta**
   (`POST /{comment_id}/replies`, ya diagnosticado). Una palabra, en mayúsculas, específica de la
   pieza ("STACK", no "INFO"), y entrega en menos de 1 minuto. *Costo: bajo.*
2. **Una pieza = una guía con URL propia** (el "cada reel trae su guía" de Erik y la bóveda de
   Enrique). El DM no manda un texto largo sino **un link estable**, que después se encuentra en
   buscadores y se reusa en LinkedIn. Ya existe para `/stack` y `/homelab`; falta que sea la regla
   de cada pieza. *Costo: 30-45 min por pieza (puede hacerlo Samuel).*
3. **1 a 1 con "para qué NO es" en cada nivel** (Enrique) **y con paso de diagnóstico** (Erik):
   - `/15min` sigue como "pregunta puntual", beneficio de la comunidad; su descripción dice para
     qué no es.
   - El evento público (hoy `/20min`) se reorienta a **"Diagnóstico para tu clínica"**: al terminar,
     **nota escrita de una página** (qué automatizar, qué módulo de Onia aplica). Es la versión
     honesta del "plan escrito + ROI" de Erik. **No se cobra: es la herramienta de venta de la
     Etapa 1.** Los precios se leen de `subscription-plans.ts` / `pricing.ts`, nunca se inventan.
4. **Números en el título y "¿vale la pena?" en los largos** (Erik). Ya están guionados (E1-E3).
   *Caro en horas:* un largo por mes, no más.
5. **La prueba como objeto en cámara** (el panel físico de Erik, su rack en 3D). Sergio Urcullo ya
   tiene la "PC vieja de $0" (el E2) y el aviso de las 3:01 en el teléfono: **mostrar el objeto
   real** (servidor, teléfono recibiendo la alerta, panel de uso real) en lugar de un gráfico.
6. **La grilla del reel partido** (Santiago): cabeza fija abajo, **prueba rotando arriba** cada 1-3
   s, subtítulos de 2-5 palabras con **una sola palabra resaltada** y cierre con fondo desenfocado +
   palabra clave. La ficha del 17-sep ya lo anotó como "lo NUEVO". Se adopta **la grilla, no los
   colores**: el resalte va en el **verde ONIA restringido**, no en el amarillo de Santiago.

### 5.2 ADAPTAR (la idea sirve, la forma no)

1. **La bóveda pública de Enrique → la doctrina que ONIA ya escribió:** *"la web te explica CÓMO SE
   HACE; la comunidad te ayuda a hacer EL TUYO"* (`hermes-content/docs/ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md`,
   en la rama `codex/marca-comunidad-plan`, sin integrar a `main`). La guía va pública (buscadores);
   la comunidad recibe **primero**, con **los archivos listos**, **lo que salió mal** y **el
   diagnóstico**. Enrique no tiene esa segunda capa: ahí Sergio Urcullo puede ser mejor que él sin
   gastar horas.
2. **La gamificación de Erik → sin construir plataforma.** En el grupo General: una **plantilla de
   presentación** (nombre, qué construís, qué querés vender), un hilo semanal **"mostrá lo que
   armaste"** (viernes) y **una mención al mes en Announcements** para el mejor aporte. Cero
   desarrollo. Una plataforma propia con XP es muy cara en horas y no hace falta con este tamaño.
3. **Los rituales de Santiago (2 directos por semana) → un directo cada dos semanas**, 45 minutos,
   **"construimos en vivo"** (en la comunidad o por IG Live). La grabación se vuelve el largo de
   YouTube o tres reels. Si se festeja un hito (el "sorteo 20k" de Erik), que sea con un directo, no
   con plata. *~1,5 h cada 2 semanas.*
4. **Los casos de miembros de Santiago → sin inventar nada.** ONIA tiene **cero clientes pagando**:
   prohibido testimoniar resultados. La versión honesta es **"lo armé para alguien real"** (su *"Hice
   su sitio en 30 minutos"*): con **consentimiento**, construir en cámara algo para una **clínica
   real de Santa Cruz**. **Es contenido y prospección a la vez** (sirve a la Etapa 1). Sin datos de
   pacientes, sin cifras de resultado y sin decir en la pieza que el producto "está en obra".
5. **"Aprender a vender"** (Modo Agencia de Santiago; "3 servicios para armar tu agencia" de
   Enrique) → **documentar en público cómo Sergio Urcullo consigue sus primeros 5 clientes**: cómo
   califica, qué pregunta, qué objeción escuchó. Es lo que su audiencia quiere, **no es inventado** y
   lo obliga a sostener la disciplina de ventas. Sin cifras de ingreso ni promesas de "vendé bots a
   $2.000".
6. **La dirección de arte de Enrique → dentro del pack editorial ya aprobado**
   (`community-editorial`, commit `e9b80e22`): **un solo acento**, tipo grande y apretado,
   **etiqueta mono en mayúsculas**, **el comando o la pantalla real** dentro de la pieza y **firma
   constante** ("@sergiourcullo · Onia"). Su "HECHO EN LATAM" funciona como sello: **"Hecho en
   Bolivia"** es una firma que nadie más tiene.
7. **Los repos como regalo (Enrique y Santiago) → uno por mes, solo de lo que ONIA ya construyó.**
   Por ejemplo, el circuito comentario → DM de n8n sin datos, o un script de `editor-videos`. MIT,
   instalación de un comando por Claude Code y portada con diseño. **Nunca** código del producto
   (`onia-platform`) ni datos de clientes. Publicar un repo nuevo lo decide Sergio Urcullo (regla
   "Cuándo separar un repo" de `CLAUDE.md`). *3-4 h por repo.*

### 5.3 EVITAR (y por qué)

1. **Comunidad paga tipo Skool a USD 57-64** (Santiago). Es **una línea de negocio nueva**
   (educación), va contra la Etapa 1, es muy cara en horas (directos, garantía 1 a 1, soporte) y
   con menos de 1K seguidores no tiene masa. **Solo la decide Sergio Urcullo.** Mientras tanto, la
   comunidad sigue gratis y al servicio de la empresa.
2. **Reventa / "Modo Agencia"** (Forja+). Es un canal de vendedores terceros: `CLAUDE.md` prohíbe
   material para vendedores mientras no exista esa persona. Además choca con el precio del add-on
   chatbot de ONIA.
3. **Cifras de ingreso y "+500 casos de éxito".** ONIA no fabrica prueba social.
4. **Cursos de 6-7 h, plataforma propia con XP, laboratorio 3D y un repo por semana.** Un creador
   con un colaborador no los sostiene junto con la empresa.
5. **Consultoría paga para aficionados** (los tres niveles de Enrique). La consultoría es una de las
   líneas congeladas. El 1 a 1 de Sergio Urcullo **vende Onia**, no se vende a sí mismo.
6. **Estética "glow de IA" y carruseles generados enteros por IA** (Santiago). Choca con las reglas
   **"Publicidad que no parezca hecha por IA"** y **"producto visible o no sale"**.
7. **Ganchos de "X acaba de destruir a Y".** Todo el nicho los usa y se gastaron. El gancho de ONIA
   que funciona es **identidad + humor + herramienta real** (medido el 31-ago: los dos videos de
   humor e identidad hicieron 5.407 y 4.020 vistas; el resto de lo medido quedó entre 916 y 2.299;
   `ONIA_COMUNIDAD_CONTENIDO.md:9-12`).

### 5.4 Cadencia propuesta: una persona + Samuel (horas por semana, estimadas)

| Canal | Qué | Quién | Horas/sem |
|---|---|---|---|
| IG + TikTok (la misma pieza) | 4 reels (1 bloque de grabación semanal) | Sergio Urcullo graba; el pipeline y Samuel editan | ~2 h Sergio Urcullo + ~4 h Samuel |
| IG | 1 carrusel (generador editorial) | Samuel arma, Sergio Urcullo aprueba | ~1,5 h |
| Web | 1 guía por pieza (sale del drop) | Samuel | ~2 h |
| Comunidad | drop diario (ya existe) + respuestas | Sergio Urcullo | ~2,5 h |
| Directo | 1 cada 2 semanas, 45 min | Sergio Urcullo | ~0,75 h en promedio |
| YouTube | 1 largo por mes, formato experimento | ambos | ~2,5 h en promedio |
| LinkedIn | 1 post reciclado | Samuel | ~0,5 h |
| 1 a 1 | máximo 3 por semana + nota escrita | Sergio Urcullo | ~1,5 h |
| GitHub | 1 repo por mes | Sergio Urcullo | ~1 h en promedio |

Total: **~10-11 h/sem de Sergio Urcullo** y **~8 h/sem de Samuel**. Si hay que recortar, el orden
es: primero el repo mensual, después el largo de YouTube y después el directo. **Nunca** se recorta
responderle a una clínica.

> **Choque con un plan que ya existe.** En la rama `codex/marca-comunidad-plan` (sin integrar),
> `hermes-content/docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md` (fuentes consultadas el 22-sep) ya
> toma un mecanismo de cada referente — Erik: autoridad por sistemas operados; Enrique: cada short
> lleva a una guía pública; Santiago: demo completa y acompañamiento — y fija **11 piezas por día
> (6 originales de Sergio Urcullo por día)**. La evidencia de los referentes **no pide ese volumen**:
> Erik publica ~semanal en la muestra; Santiago hace ≥1-2 por semana indexadas en TikTok y su
> volumen real vive en la comunidad y los repos; Enrique fue casi diario, pero cada pieza sale del
> mismo sistema (guía + repo). Seis originales por día es muy caro en horas para una persona que
> además tiene que conseguir 5 clientes. Este doc no cambia ese plan: lo plantea para que el
> orquestador lo reconcilie con Sergio Urcullo. La tabla de arriba es un **piso sostenible**, no un
> techo.

### 5.5 LinkedIn

Ninguno de los tres apuesta por LinkedIn: **es un carril libre**, y los clientes de ONIA (dueños y
directores de clínica) y los aliados leen más ahí que los aficionados.

- **Titular** claro, al estilo de la línea B2B de Erik: qué construye y para quién (el sistema de
  gestión para clínicas, no "IA" en abstracto).
- **1 post por semana, reciclado:** el carrusel de la semana como PDF (formato documento de
  LinkedIn) + un texto corto en primera persona sobre qué aprendió construyendo la empresa. Sin
  producción nueva.
- **Cero autobombo** (regla de marca): el post enseña algo concreto.

### 5.6 Llamadas 1 a 1: qué copiar de cada uno

| Del referente | Qué se toma |
|---|---|
| Enrique | cada nivel dice **para qué NO es** → menos llamadas perdidas |
| Erik | **discovery corto → diagnóstico con nota escrita** → propuesta con precio de lista |
| Santiago | el 1 a 1 como **garantía que baja el riesgo** → en ONIA: "si en la prueba de 14 días no lo dejás andando, te acompaño" (solo si Sergio Urcullo lo decide y se puede sostener) |

---

## 6. Pendientes fuera de este objetivo (anotados, no hechos)

1. **Ficha de competencia de Forja para el carril chatbot — no se escribió.** Merece un archivo en
   `hermes-content/research/competencia/` (no confundir con `FORGES_SCZ.md`, que es otro
   competidor, de Santa Cruz). Lo que ya se sabe:
   - Forja es un chatbot **gratis y open source (MIT)** de Santiago Muñoz / Horizontes IA para
     WhatsApp, IG y Telegram (github.com/santmun/forja, 113★ / 51 forks [V]; forjabots.com). Se
     instala diciéndole a Claude Code "ármame un chatbot con Forja".
   - **Forja+**, dentro de la comunidad paga (USD 57-64/mes), trae **14 rubros con panel propio,
     "clínica" entre ellos**, y **Modo Agencia** para revenderlo con marca propia a **USD
     2.000-3.000** por bot; 600-768 miembros aprendiendo a hacerlo [V/S].
   - El carril chatbot ya la había encontrado: `hermes-content/docs/ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md:161-173`
     la clasifica como **competidor del motor** (BOT-ONIA), no como conectora, pero **no la vincula
     con Santiago Muñoz** y habla de "11 bots por rubro", contra los 14 rubros que se ven hoy. La
     ficha tiene que reconciliar ese número y fecharlo.
   - Dueño: carril chatbot (skill `onia-chatbot`).
2. **Red del entorno:** para mirar reels, grillas y miniaturas de verdad hay que permitir los
   dominios del bloque de límites. Decisión de Sergio Urcullo.
3. **Atribución de `abogado-del-diablo`, sin cerrar.** El informe de base afirma que la skill que usa
   ONIA es el repo MIT de Enrique (`Hainrixz/abogado-del-diablo`, "Built by the tododeia
   community"). Lo que se ve en el checkout no lo confirma: la versión que ONIA reparte como lead
   magnet (`hermes-content/lead-magnets/skills-negocios/abogado-del-diablo/SKILL.md`) es otro texto
   —"seis preguntas" y un bloque `⚙️ COMPLETAR ANTES DE USAR`, contra los "ocho ángulos" y los modos
   `--proyecto` / `--demolicion` del README de Enrique— y no lleva atribución; la skill instalada en
   claude.ai tiene casi la misma descripción que el archivo de ONIA. Comparten nombre y concepto.
   Sergio Urcullo sabe de dónde salió; si deriva del repo de Enrique, la licencia MIT pide conservar
   su aviso de copyright.

---

## 7. Fechas deducidas (cómo se calcularon)

- **TikTok:** `id >> 32` = segundos Unix. Santiago: 7448663474701503750 → 15-dic-2024;
  7456804327231884550 → 6-ene-2025; 7467215006346628358 → 3-feb-2025. Erik: 7607946015160814861 →
  17-feb-2026; 7610915583953030413 → 25-feb-2026; 7615675165858483470 → 10-mar-2026;
  7618288974464814350 → 17-mar-2026; 7647912106259385614 → 5-jun-2026; 7537492396255350029 →
  12-ago-2025. Enrique: 7333441156920921349 (Día 39) → 9-feb-2024; 7333782748525513989 (Día 40) →
  10-feb-2024; 7335304239423491334 (Día 44) → 14-feb-2024.
- **Instagram:** shortcode → media id; `(id >> 23) + 1314220021721` = milisegundos. `DdE7wYbxjPK` →
  9-sep-2026; `DdXM8-Nmxey` → 16-sep-2026; `DcE8336Ixby` → 15-ago-2026.
- **LinkedIn:** `activity >> 22` = milisegundos. 7267997735985786881 → 28-nov-2024.

---

## 8. Fuentes

### Internas (checkout de `onia-hermes`; lo de ramas sin integrar se cita como texto)

- `hermes-content/references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`
- `hermes-content/references/video-intake/2026-08-28-pesos-algoritmo-x-codigo-publico.md` (reel `DcE8336Ixby`, @sanmunoz.ia)
- `.claude/skills/editor-videos/SKILL.md` (auditoría contra el stack de Santiago, 18-sep) · `.claude/skills/editor-videos/scripts/make-mockup.mjs`
- `hermes-content/docs/cola/GUIONES-RODAJE-17-20-SEP.md` (formato experimento de Erik; commit `772120db`)
- `web-factory/DESIGN_STACK.md` (cruce con "Stop AI slop"; commits `0871cf00`, `470ee8c2`)
- `hermes-content/docs/cola/PARA-PUBLICAR-APPLE-REPOS.md` (3,1k likes en un día)
- `hermes-content/docs/ONIA_COMUNIDAD_CONTENIDO.md` · `hermes-content/docs/comunidad/ESTADO_COMUNIDAD.md`
- `hermes-content/docs/ONIA_CIRCUITO_COMENTARIO_DM.md` · `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md`
- `hermes-content/docs/handoff/web-creator.md` (evento público `/20min`, medido el 18-sep)
- `hermes-content/docs/cola/ARRANQUE-MOTOR-SEMANAL.md` (`/stack`, `/homelab`)
- `hermes-content/docs/ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md` (Forja como competidor del motor)
- `hermes-content/lead-magnets/skills-negocios/abogado-del-diablo/SKILL.md`
- Rama `codex/marca-comunidad-plan` (sin integrar): `hermes-content/docs/ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md` · `hermes-content/docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md`
- Rama `claude/ecommerce-dropshipping-planning-ac056d` (sin integrar): `hermes-content/docs/handoff/claude-git-status-935f47.md` (reel de @eriktaveras "no es terminar el SaaS, es llegar antes")

### Enrique Rocha

- https://github.com/Hainrixz · https://github.com/Hainrixz?tab=repositories
- https://github.com/Hainrixz/open-carrusel · https://github.com/Hainrixz/whatsapp-agentkit · https://github.com/Hainrixz/claude-webkit · https://github.com/Hainrixz/editor-pro-max · https://github.com/Hainrixz/the-architect · https://github.com/Hainrixz/maia-skill · https://github.com/Hainrixz/claude-anatomy · https://github.com/Hainrixz/abogado-del-diablo · https://github.com/Hainrixz/construyeconia · https://github.com/Hainrixz/tododeia-animaciones · https://github.com/Hainrixz/claude-banana
- https://www.tododeia.com/ · https://www.tododeia.com/about · https://www.tododeia.com/collab · https://www.tododeia.com/contact · https://www.tododeia.com/community · https://www.tododeia.com/community/eventos · https://www.tododeia.com/community/repos
- https://www.tododeia.com/community/ahorra-tokens-claude-code · https://www.tododeia.com/community/3-servicios-agencia-ia · https://www.tododeia.com/community/stack-ai-contenido · https://www.tododeia.com/community/cinco-skills-contenido · https://www.tododeia.com/community/comienza-a-construir · https://www.tododeia.com/community/abogado-del-diablo · https://www.tododeia.com/community/claude-cowork-code · https://www.tododeia.com/community/find-skills · https://www.tododeia.com/community/videos-a-skills · https://www.tododeia.com/community/meta-ads-cli-oficial
- https://www.tododeia.com/tienda/claude-de-cero-a-cien · https://www.tododeia.com/tienda/codex-de-cero-a-cien
- https://cal.com/soyenriquerocha · https://cal.com/soyenriquerocha/express · https://cal.com/soyenriquerocha/quick-call · https://cal.com/soyenriquerocha/consultoria-profesional
- https://luma.com/soyenriquerocha
- https://www.instagram.com/soyenriquerocha/ · https://www.instagram.com/p/DdXM8-Nmxey/
- https://www.tiktok.com/@soyenriquerocha/video/7333441156920921349 · https://www.tiktok.com/@soyenriquerocha/video/7333782748525513989 · https://www.tiktok.com/@soyenriquerocha/video/7335304239423491334
- https://www.youtube.com/@soyenriquerocha
- https://www.facebook.com/soyenriquerocha/
- https://www.threads.com/@soyenriquerocha/post/Daj7hMmiMDt · https://www.threads.com/@soyenriquerocha/post/DXOOKarAAKR · https://www.threads.com/@soyenriquerocha/post/DXD8iTOiSoe · https://www.threads.com/@soyenriquerocha/post/DWip_FjCFGF · https://www.threads.com/@tendencia_sana/post/DWr3-MtDexT
- https://www.creatorscrate.cc/ · https://puntua.net/empresa/opiniones-sobre-tododeia-com-de-enrique-rocha/ (solo fragmento)

### Erik Taveras

- https://github.com/eriktaveras · https://github.com/eriktaveras/eriktaveras (README; commits del 15-sep-2026) · https://github.com/eriktaveras/modelnap · https://github.com/eriktaveras/claude-dashboard · https://github.com/eriktaveras/esp32-data-panel
- https://eriktaveras.com/ · https://eriktaveras.com/contact · https://taverassolutions.com/ · https://lab.eriktaveras.com/
- https://comunidad.eriktaveras.com/ · https://comunidad.eriktaveras.com/resources/guia-monta-tu-primer-home-lab-desde-una-pc-de-100/ · https://comunidad.eriktaveras.com/resources/guia-de-home-lab/ · https://comunidad.eriktaveras.com/resources/el-alfabeto-del-software-moderno-que-significan-realmente-ddd-tdd-mvc-cqrs-y-cicd/
- https://autodev.eriktaveras.com/ · https://autodev.eriktaveras.com/accounts/signup/ · https://autodev.eriktaveras.com/resources/como-conectar-el-mcp-nativo-de-n8n-a-claude-cursor-o-claude-code/ · https://autodev.eriktaveras.com/resources/guia-variantes-las-8-versiones-alternativas-de-openclaw/ · https://autodev-c5f03e2384e3.herokuapp.com/
- https://beacons.ai/eriktaveras · https://cal.com/eriktaveras
- https://www.instagram.com/eriktaveras/ · https://www.threads.com/@eriktaveras · https://m.facebook.com/p/Erik-Taveras-Automatizaci%C3%B3n-con-IA-61576836699315/ · https://www.linkedin.com/in/eriktaveras/
- https://www.tiktok.com/@erik.py · https://www.tiktok.com/@erik.py/video/7618288974464814350 · https://www.tiktok.com/@erik.py/video/7615675165858483470 · https://www.tiktok.com/@erik.py/video/7607946015160814861 · https://www.tiktok.com/@erik.py/video/7537492396255350029 · https://www.tiktok.com/@erik.py/video/7610915583953030413 · https://www.tiktok.com/@erik.py/video/7647912106259385614
- https://www.youtube.com/@ErikTaverasT · https://www.youtube.com/channel/UCeo1MU4H-KuPpmUaWiyICIA/videos · https://www.youtube.com/watch?v=M6lZSmgMKxk · https://www.youtube.com/watch?v=IVLUDojtoYU · https://www.youtube.com/watch?v=ecg6gbZXXu8 · https://www.youtube.com/watch?v=UKTvIaIXqi4
- https://www.udemy.com/user/erik-taveras-youtube/ · https://www.udemy.com/course/eriktaveras-n8n-intermedio/ · https://www.udemy.com/course/creacion-de-agentes-ia-para-whatsapp-con-n8n/ · https://www.udemy.com/course/n8n-desde-cero-a-chatbot-con-ia/
- https://podcasts.apple.com/do/podcast/100-automatizaci%C3%B3n-de-negocios-con-ia-con-erik-taveras/id1675416271?i=1000714212120 · https://creators.spotify.com/pod/profile/losverdaderoscodigos/episodes/100---Automatizacin-de-Negocios-con-IA-Con-Erik-Taveras-e34katr
- https://thusie.com/erik-built-whatsapp-ai-saas-talos-flow.html · https://uspto.report/TM/99653414 · https://apps.apple.com/us/developer/erik-manuel-taveras-tavarez/id1849032480 · https://containers.day/en/speakers/erik-taveras-8ea82a4f-b4db-4167-a9d0-75a2e368edd0/

### Santiago Muñoz

- https://www.instagram.com/sanmunoz.ia/ · https://www.instagram.com/p/DdE7wYbxjPK/ · https://www.instagram.com/p/DcE8336Ixby/
- https://www.tiktok.com/@sanmunoz.ia · https://www.tiktok.com/@sanmunoz.ia/video/7448663474701503750 · https://www.tiktok.com/@sanmunoz.ia/video/7456804327231884550 · https://www.tiktok.com/@sanmunoz.ia/video/7467215006346628358 · https://www.tiktok.com/@sanmunoz.ia/video/7459787904194301189 · https://www.tiktok.com/@sanmunoz.ia/video/7450901707732618501
- https://www.youtube.com/@SantiMunozIA · https://www.youtube.com/channel/UCKH3AEVu7sIU61cjnB0XxdQ · https://www.youtube.com/watch?v=QRhX4zU1jso · https://www.youtube.com/watch?v=RSomDkV2Aj0 · https://www.youtube.com/watch?v=cxkJPLiKoy4 · https://www.youtube.com/watch?v=mVzvBewfAuo · https://www.youtube.com/watch?v=w_pyNNAnoAc
- https://www.skool.com/horizontes-ia-9992/about · https://www.skool.com/@santiago-munoz-7991
- https://www.horizontesia.com/ · https://www.horizontesia.com/menu-digital-claude-code · https://www.horizontesia.com/blog/chatbot-whatsapp-ia-negocio · https://apps.horizontesia.com/
- https://forjabots.com/en/ · https://forjabots.com/en/docs/ · https://forjabots.com/en/cli · https://www.horizontesiabot.com/
- https://github.com/santmun · https://github.com/santmun?tab=repositories · https://github.com/santmun/forja · https://github.com/santmun/crear-agente · https://github.com/santmun/video-vox · https://github.com/santmun/editor-tiktok · https://github.com/santmun/mega-editor-davinci · https://github.com/santmun/docs-entrega-skill · https://github.com/santmun/carousel-horizontes-ia · https://github.com/santmun/historias-ig-skill
- https://www.sanmunozia.com/ · https://sanmunoz.uwu.ai/ · https://linktr.ee/santimunozia
- https://www.innovandohorizontes.com/ · https://www.innovandohorizontes.com/servicios · https://www.innovandohorizontes.com/soluciones
- https://www.linkedin.com/in/santiago-munoz-ibarra/ · https://www.linkedin.com/in/santiago-mu%C3%B1oz-ibarra-5354a7244/ · https://es.linkedin.com/posts/santiago-munoz-ibarra_generaci%C3%B3n-de-leads-con-ia-activity-7267997735985786881-D7XG
- https://conecta.tec.mx/es/noticias/estado-de-mexico/educacion/finanzas-para-todos-alumno-tec-gana-concurso-de-video-sobre
- https://www.upliora.es/comparativas/mejores-comunidades-skool-ia-espana-2026
- Descartados u homónimos: https://github.com/SantiMunoz · https://www.udemy.com/course/master-claude-code-agentes-ia/ (render2web) · https://iahorizontesacademy.com/ (asociado a Jorge Marfil)
